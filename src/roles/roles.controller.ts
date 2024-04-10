import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRoleDto } from '@app/roles/dto/createRole.dto';
import { RolesService } from '@app/roles/roles.service';
import { ProjectRolesEntity } from '@app/project/entities/projectRoles.entity';
import { UpdateRoleDto } from '@app/roles/dto/updateRole.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly userProjectRoleService: RolesService) {}

  @Post()
  create(
    @Body() createUserProjectRoleDto: CreateRoleDto,
  ): Promise<ProjectRolesEntity> {
    return this.userProjectRoleService.create(createUserProjectRoleDto);
  }

  @Get()
  findAll(): Promise<ProjectRolesEntity[]> {
    return this.userProjectRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ProjectRolesEntity> {
    return this.userProjectRoleService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserProjectRoleDto: UpdateRoleDto,
  ): Promise<ProjectRolesEntity> {
    return this.userProjectRoleService.update(id, updateUserProjectRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userProjectRoleService.remove(id);
  }
}
