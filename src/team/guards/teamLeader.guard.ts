import { Reflector } from '@nestjs/core';
import { TeamService } from '@app/team/team.service';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserReqeustMiddleware } from '@auth/interfaces/UserReqeustMiddleware';
import { ProjectService } from '@app/project/project.service';

@Injectable()
export class TeamLeaderGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private teamsService: TeamService,
    private projectService: ProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserReqeustMiddleware>();
    const userId = request.user.id

    const projectRole = await this.projectService.checkProjectRole(userId, 'Team Leader');
    if (!projectRole) {
      throw new HttpException('Only users with the "Team Leader" role can create a team.',HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return true;
  }
}