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

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly eventService: EventService,
    @Inject(REQUEST) private readonly request: UserReqeustMiddleware,
    @Inject(MinioService)
    private readonly minioService:MinioService
  ) {
  }

  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const project = this.projectRepository.create(createProjectDto);

    return this.projectRepository.save(project);
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

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<ProjectEntity> {
    return this.projectRepository.findOneBy({ id });
  }

  async updateProjectRating(projectId: string): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    project.rating += 5;
    return this.projectRepository.save(project);
  }

  async updateProjectStatus(projectId: string, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    Object.assign(project, updateProjectDto)
    return this.projectRepository.save(project);
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneBy({ id });
    this.projectRepository.merge(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }

  async checkProjectRole(userId: string, role: string) {
    return this.projectRepository.find({
      where: { teams: { members: { id: userId } }, userRoles: { role: role } },
      relations: ['teams']
    })
  }

  async updateStatus( id:string, status:string){
    const project = await this.projectRepository.findOne({where:{id }})
    project.status = status
    return this.projectRepository.save(project)
  }

  createResponse(project: ProjectEntity): ProjectResponse {
    return {
      project: project
    }
  }
}