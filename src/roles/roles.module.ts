import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRolesEntity } from '@app/roles/entities/projectRoles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRolesEntity])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
