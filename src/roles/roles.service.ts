import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRolesEntity } from '@app/roles/entities/projectRoles.entity';

@Injectable()

export class RolesService {
  constructor(@InjectRepository(ProjectRolesEntity)  private readonly projectRolesRepository:Repository<ProjectRolesEntity>) {
  }

  async create(createRoleDto: CreateRoleDto) {
    await this.projectRolesRepository.save(createRoleDto)
  }

  async findAll() {
    return await this.projectRolesRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: string) {
    this.projectRolesRepository.delete(id)
  }
}
