import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from '@app/project/entities/project.entity';
import { ProjectService } from '@app/project/project.service';
import { PROJECT_STATUSES } from '@app/project/constants/project.constants';
import { TeamEntity } from '@app/team/entities/team.entity';
import { EventEntity } from '@app/event/entities/event.entity';

export class UpdateProjectDto extends ProjectEntity{
  @ApiProperty()
  event:EventEntity
  @ApiProperty()
  team:TeamEntity
  @ApiProperty()
  name:string
  @ApiProperty()
  description:string
  @ApiProperty()
  howToPlay:string
  @ApiProperty()
  gitLink:string
  @ApiProperty()
  rating:number
  @ApiProperty()
  status:PROJECT_STATUSES

}