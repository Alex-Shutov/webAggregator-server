import { UserEntity } from '@app/user/entities/user.entity';

export interface UserReqeustMiddleware extends Request{
  user:UserEntity
}