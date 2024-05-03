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
import { ProjectResponse } from '@app/project/interfaces/project.interface';
import { AdminGuard } from '@user/guards/admin.guard';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectResponse> {
    // this.projectService.updateProjectRating('')
    const proj = await this.projectService.create(createProjectDto);
    return this.projectService.createResponse(proj)
  }

  @Get()
  findAll(): Promise<ProjectEntity[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectResponse> {
    const proj = await this.projectService.findOne(id);
    return this.projectService.createResponse(proj)

  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const proj =  await this.projectService.update(id, updateProjectDto);
    return this.projectService.createResponse(proj)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.projectService.remove(id);

  }

  @Patch(':id')
  @UseGuards(ProjectStatusGuard)
  async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    const proj = await this.projectService.updateProjectStatus(id, updateProjectDto);
    return this.projectService.createResponse(proj)
  }


  @Patch('/updateStatus/:id')
  @UseGuards(AdminGuard)
  async updateStatus(
    @Param('id') id:string,
    @Body() {status}: {status:string},
  ):Promise<ProjectResponse>{
    const project = await this.projectService.updateStatus(id,status)
    return this.projectService.createResponse(project)
  }

}