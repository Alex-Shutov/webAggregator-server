import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { UserEntity } from '@user/entities/user.entity';
import { EventEntity } from '@app/event/entities/event.entity';
import { User } from '@user/decorators/user.decorator';
import { REQUEST } from '@nestjs/core';
import { request } from 'express';
import { UserReqeustMiddleware } from '@auth/interfaces/UserReqeustMiddleware';
import { AuthService } from '@auth/auth.service';
import { EventService } from '@app/event/event.service';
import { UserResponse } from '@user/interfaces/user.interfaces';
import { ProjectResponse } from '@app/project/interfaces/project.interface';
import { UserService } from '@user/user.service';
import { MinioService } from '@minio/minio.service';
import { PROJECT_STATUSES } from '@app/project/constants/project.constants';
import { SortOrder } from '@app/project/dto/findProjectsByPage.dto';
import { UpdateProjStatusDto } from '@app/project/dto/updateProjStatus.dto';
import { FindProjectsByEventAndTeamDto } from '@app/project/dto/findProjectsByEventAndTeam.dto';
import { TeamService } from '@app/team/team.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly eventService: EventService,
    private readonly teamService:TeamService,
    @Inject(REQUEST) private readonly request: UserReqeustMiddleware,
    @Inject(MinioService)
    private readonly minioService:MinioService
  ) {
  }

  async create(createProjectDto: CreateProjectDto,eventId?:string): Promise<ProjectEntity> {
    if (createProjectDto.teamId) {
      const existingProject = await this.projectRepository.findOne({ where:{teamId:createProjectDto.teamId},relations:['team','event'] });
      if (existingProject) {
        return existingProject;
      }
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      status: createProjectDto.status || PROJECT_STATUSES.DRAFT,
    });

    if (eventId) {
      const event = await this.eventService.findOne( {id:eventId});
      if (event) {
        project.event = event;
      }
    }
    const proj = this.projectRepository.save(project)
    await this.teamService.addProjectId(createProjectDto.teamId,project)
    return proj;
  }

  // async updateRating(projectId: string): Promise<number> {
  //   if (!this.request?.user?.id) {
  //     throw new HttpException('Cant find user id in request. Are u logge In?', HttpStatus.UNAUTHORIZED)
  //   }
  //   const userId = this.request.user.id
  //   const project = await this.projectRepository.findOne({ where: { id: projectId }, relations: ['events'] });
  //   const event = await this.eventService.findOne({
  //     id: project.eventID
  //   }, ['projects']);
  //
  //   const existingRating = await this.eventService.findOne({
  //     ratedUsersIds: userId, id: event.id
  //   })
  //   if (existingRating) {
  //     throw new Error('You have already rated a project in this event.');
  //   }
  //
  //
  //   event.ratedUsersIds = [...event.ratedUsersIds, userId]
  //   await this.eventService.save(event)
  //   project.rating += 5;
  //   const savedProj = await this.projectRepository.save(project)
  //   return savedProj.rating;
  // }

  async findAllByEvent(eventId:string): Promise<ProjectEntity[]> {
    return this.projectRepository.find({where:{event:{id:eventId}},relations:{event:true,team:true}});
  }
  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find({relations:['event,team']});
  }

  async findByPage(page: number, limit: number, eventId:string,categoriesIds?: string[],sortOrder?: SortOrder): Promise<{projects:ProjectEntity[],totalCount:number,page:number}> {
    const skip = (page - 1) * limit;
    const query = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.categoriesId', 'categories')
      .leftJoinAndSelect('categories.parent', 'parent');

      // .leftJoinAndSelect('categories.parentId', 'parentId');
    if (eventId) {
      query.where('project.event = :eventId', { eventId });
    }
    if (categoriesIds && categoriesIds.length > 0) {
      query.andWhere('categories.id IN (:...categoriesIds)', { categoriesIds });
    }

    if (sortOrder === SortOrder.DescendingRating) {
      query.orderBy('project.rating', 'DESC');
    } else if (sortOrder === SortOrder.AscendingRating) {
      query.orderBy('project.rating', 'ASC');
    } else if (sortOrder === SortOrder.Alphabetical) {
      query.orderBy('project.name', 'ASC');
    }

    const totalCount = await query.getCount();

    const projects = await query.skip(skip).take(limit).getMany();

    return { projects, totalCount, page };
  }

  async findOne(id: string): Promise<ProjectEntity> {
    return this.projectRepository.findOne({where:{ id},relations:['team','team.members','team.members.user','team.members.user.projectRoles','event','categoriesId'] });
  }

  async updateProjectRating(projectId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    project.rating += 5;
    return this.projectRepository.save(project);
  }

  async updateProjectStatus(projectId: string, updateProjectDto: UpdateProjStatusDto): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    this.projectRepository.merge(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto,eventId?:string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({where:{id:id},relations:['team','event','categoriesId']});

    if (eventId) {
      const event = await this.eventService.findOne({id:eventId});
      if (event) {
        project.event = event;
      }
    }

    await this.projectRepository.update(id, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.minioService.deleteBucket(id)
    await this.projectRepository.delete(id);
  }

  async checkProjectRole(userId: string, role: string) {
    return this.projectRepository.find({
      where: { team: { members:  {user:{id:userId}}  }},
      relations: {team:true}
    })
  }

  // async updateStatus( id:string, updateProjectDto:UpdateProjStatusDto){
  //   const project = await this.projectRepository.findOne({where:{id }})
  //   this.projectRepository.merge(project, updateProjectDto);
  //   return this.projectRepository.save(project)
  // }

  async save(project:ProjectEntity){
    return this.projectRepository.save(project)
  }

  createResponse(project: ProjectEntity): ProjectResponse {
    return {
      project: project
    }
  }

  async findByTeam(findProjectQuery: FindProjectsByEventAndTeamDto) {
    const {eventId,teamId} = findProjectQuery
    const existingProject = await this.projectRepository.findOne({ where:{teamId:teamId, eventId:eventId},relations:['team','event'] });
    if (existingProject) {
      return existingProject;
    }
  }
}