import { Module } from '@nestjs/common';
import { NestMinioController } from '@app/minio/nestMinio.controller';
import { NestMinioService } from '@app/minio/nestMinio.service';

@Module({
  imports: [],
  controllers: [NestMinioController],
  providers: [NestMinioService],
})
export class NestMinioModule {}
