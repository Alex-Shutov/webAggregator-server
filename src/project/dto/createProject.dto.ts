import { PROJECT_STATUSES } from '@app/project/constants/project.constants';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
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
  @IsOptional()
  status:PROJECT_STATUSES = PROJECT_STATUSES.DRAFT
  @ApiProperty()
  teamId:string


}
