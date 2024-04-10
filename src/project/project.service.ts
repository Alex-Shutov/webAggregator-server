import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<ProjectEntity> {
    return this.projectRepository.findOneBy({ id });
  }
  async updateProjectRating(projectId: string, newRating: number): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    project.rating = newRating;
    return this.projectRepository.save(project);
  }
  async updateProjectStatus(projectId: string, updateProjectDto: UpdateProjectDto): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    Object.assign(project,updateProjectDto)
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
}