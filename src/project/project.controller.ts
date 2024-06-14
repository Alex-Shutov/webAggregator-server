import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Put, Query, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ProjectEntity } from './entities/project.entity';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProjectStatusGuard } from '@app/project/guards/projectStatus.guard';
import { ProjectResponse } from '@app/project/interfaces/project.interface';
import { AdminGuard } from '@user/guards/admin.guard';
import { FindProjectsByPageDto } from '@app/project/dto/findProjectsByPage.dto';
import { UpdateProjStatusDto } from '@app/project/dto/updateProjStatus.dto';
import { FindProjectsByEventAndTeamDto } from '@app/project/dto/findProjectsByEventAndTeam.dto';

@ApiTags('projects')
@Controller('')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('project/create/:eventId')
  async create(@Body() createProjectDto: CreateProjectDto,@Param('eventId') eventId:string): Promise<ProjectResponse> {
    // this.projectService.updateProjectRating('')
    const proj = await this.projectService.create(createProjectDto,eventId);
    return this.projectService.createResponse(proj)
  }

  @Get('projects/:eventId')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiQuery({ name: 'page', required: false, type: Number})
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['descending', 'ascending', 'alph'], })
  @ApiQuery({ name: 'categoriesIds', required: false, type: [String] })
  findAllByEvent(@Param('eventId') eventId:string, @Query() {page,limit,sortOrder,categoriesIds}:FindProjectsByPageDto): Promise<any> {
    if(page && limit){
      return this.projectService.findByPage(page,limit,eventId,categoriesIds,sortOrder)
    }
    return this.projectService.findAllByEvent(eventId);
  }

  @Get('project/:id')
  async findOne(@Param('id') id: string): Promise<ProjectResponse> {

    const proj = await this.projectService.findOne(id);
    return this.projectService.createResponse(proj)

  }
  @Get('projects/')
  async findAll(): Promise<ProjectEntity[]> {

    return this.projectService.findAll()

  }
  @ApiBody({ type: UpdateProjectDto })
  @Patch('project/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const proj =  await this.projectService.update(id, updateProjectDto);
    return this.projectService.createResponse(proj)
  }

  @Delete('project/:id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.projectService.remove(id);

  }

  @Patch('project/changeStatus/:id')
  @UseGuards(ProjectStatusGuard)
  async updateProject(@Param('id') id: string, @Body() updateProjectDto: UpdateProjStatusDto) {
    const proj = await this.projectService.updateProjectStatus(id, updateProjectDto);
    return this.projectService.createResponse(proj)
  }

  @Get('projectByEventTeam')
  async getByEventAndTeam(@Query() findProjectQuery: FindProjectsByEventAndTeamDto): Promise<ProjectResponse> {
    // this.projectService.updateProjectRating('')
    const proj = await this.projectService.findByTeam(findProjectQuery);
    return this.projectService.createResponse(proj)
  }


  // @Patch('/adminChangeStatus/:id')
  // @UseGuards(AdminGuard)
  // async updateStatus(
  //   @Param('id') id:string,
  //   @Body() updateProjectDto:UpdateProjStatusDto,
  // ):Promise<ProjectResponse>{
  //   const project = await this.projectService.updateStatus(id,updateProjectDto)
  //   return this.projectService.createResponse(project)
  // }

}