import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Put, UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ProjectEntity } from './entities/project.entity';
import { ApiTags } from '@nestjs/swagger';
import { ProjectStatusGuard } from '@app/project/guards/projectStatus.guard';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectEntity> {
    this.projectService.updateProjectRating()
    return this.projectService.create(createProjectDto);

  }

  @Get()
  findAll(): Promise<ProjectEntity[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.projectService.remove(id);
  }

  @Patch(':id')
  @UseGuards(ProjectStatusGuard)
  updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.updateProjectStatus(id, updateProjectDto);
  }
}
}