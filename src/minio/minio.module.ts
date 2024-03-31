import { Module } from '@nestjs/common';
import { MinioController } from '@app/minio/minio.controller';
import { MinioService } from '@app/minio/minio.service';

@Module({
  imports: [],
  controllers: [MinioController],
  providers: [MinioService],
})
export class MinioModule {}
