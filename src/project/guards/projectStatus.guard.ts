import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UserService } from '@user/user.service';
import { ROLES_LIST } from '@user/constanst/user.constants';
import { ProjectService } from '@app/project/project.service';

@Injectable()
export class ProjectStatusGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private projectsService: ProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const projectId = request.params.id;
    const user = await this.userService.findByToken(request.headers.authorization);

    // Проверяем, что пользователь имеет роль администратора
    const userRole = await this.userService.getUserRole(user.id);
    if (userRole.role === ROLES_LIST.ADMIN) {
      return true;
    }

    // Для других ролей, кроме администратора, проверяем, что они не пытаются изменить статус проекта
    const project = await this.projectsService.findOne(projectId);
    if (request.body.status !== project.status) {
      throw new HttpException('Only administrators can change the project status',HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}