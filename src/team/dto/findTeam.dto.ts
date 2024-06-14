import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class FindTeamDto{
  @IsUUID()
  eventId:string

  @IsBoolean()
  @IsOptional()
  withUser?: boolean;
}