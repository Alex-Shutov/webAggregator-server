import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortOrder } from '@app/project/dto/findProjectsByPage.dto';

export class FindProjectsByEventAndTeamDto {
 @IsString()
 eventId:string
 @IsString ()
 teamId:string
}