import { UserEntity } from '@app/user/entities/user.entity';

export interface UserResponse{
  user:Omit<UserEntity,'hashPass'|"setParsedData"|"password"|"role"|"ratedEvents"> & {token:string}

}