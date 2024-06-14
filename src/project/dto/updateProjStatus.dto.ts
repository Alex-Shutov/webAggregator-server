import { ApiProperty } from '@nestjs/swagger';
import { PROJECT_STATUSES } from '@app/project/constants/project.constants';
import { IsOptional } from 'class-validator';

export class UpdateProjStatusDto {
  @IsOptional()
  @ApiProperty()
  name:string
  @IsOptional()
  @ApiProperty()
  description: string;
  @IsOptional()
  @ApiProperty()
  howToPlay: string;
  @IsOptional()
  @ApiProperty()
  gitLink: string;
  @ApiProperty()
  status:PROJECT_STATUSES
}