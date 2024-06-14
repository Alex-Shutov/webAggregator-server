import { IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto{
  @IsString()
  name:string

  @IsString()
  @IsOptional()
  projectId:string

  // @IsString({ each: true })
  @IsOptional()
  memberIds:[string[]]
}