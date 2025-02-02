import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TeamEntity } from './entities/team.entity';
import { ProjectModule } from '@app/project/project.module';
import { TeamMemberEntity } from '@app/team/entities/teamMember.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity,TeamMemberEntity]),ProjectModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}