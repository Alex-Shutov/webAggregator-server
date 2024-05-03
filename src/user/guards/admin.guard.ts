import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserReqeustMiddleware } from '@auth/interfaces/UserReqeustMiddleware';
import { ROLES_LIST } from '@user/constanst/user.constants';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<UserReqeustMiddleware>()
    if(request.user.role === ROLES_LIST.ADMIN){
      return true
    }
    throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED)
  }

}