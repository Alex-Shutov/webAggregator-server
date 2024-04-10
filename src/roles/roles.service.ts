import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRolesEntity } from '@app/project/entities/projectRoles.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '@app/roles/dto/createRole.dto';
import { UpdateRoleDto } from '@app/roles/dto/updateRole.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(ProjectRolesEntity)
    private readonly userProjectRoleRepository: Repository<ProjectRolesEntity>,
  ) {}

  async create(
    createUserProjectRoleDto: CreateRoleDto,
  ): Promise<ProjectRolesEntity> {
    const userProjectRole = this.userProjectRoleRepository.create(
      createUserProjectRoleDto,
    );
    return this.userProjectRoleRepository.save(userProjectRole);
  }

  async findAll(): Promise<ProjectRolesEntity[]> {
    return this.userProjectRoleRepository.find();
  }

  async findOne(id: string): Promise<ProjectRolesEntity> {
    return this.userProjectRoleRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateUserProjectRoleDto: UpdateRoleDto,
  ): Promise<ProjectRolesEntity> {
    const userProjectRole = await this.userProjectRoleRepository.findOneBy({
      id,
    });
    this.userProjectRoleRepository.merge(userProjectRole, updateUserProjectRoleDto);
    return this.userProjectRoleRepository.save(userProjectRole);
  }

  async remove(id: string): Promise<void> {
    await this.userProjectRoleRepository.delete(id);
  }

  async checkProjectRole(userId: string,  role: string): Promise<boolean> {
    const projectRole = await this.userProjectRoleRepository.findBy({
        user:userId,
    });
    //TODO
    return !!projectRole;
  }
}
