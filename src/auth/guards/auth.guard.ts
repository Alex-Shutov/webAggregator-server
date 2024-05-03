import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserReqeustMiddleware } from '@auth/interfaces/UserReqeustMiddleware';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest<UserReqeustMiddleware>()
      if(request.user){
        return true
      }
      throw new HttpException('Не авторизован', HttpStatus.UNAUTHORIZED)
    }

}