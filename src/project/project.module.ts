import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectEntity } from './entities/project.entity';
import { EventModule } from '@app/event/event.module';
import { UserModule } from '@user/user.module';
import { MinioModule } from '@minio/minio.module';
import { TeamModule } from '@app/team/team.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), EventModule,forwardRef(()=>TeamModule), forwardRef(()=>UserModule),MinioModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}