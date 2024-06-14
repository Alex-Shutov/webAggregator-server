import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile, UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MinioService } from '@app/minio/minio.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { uuid } from 'uuidv4';
import { ConfigService } from '@nestjs/config';

@ApiTags('minio')
@Controller('minio')
export class MinioController {

  private readonly  bucketName:string
  constructor(private readonly minioService: MinioService,private readonly configService: ConfigService) {
    this.bucketName = uuid()
  }

  @Post('uploadFiles/:projectId')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'zip', maxCount:1 },
    { name: 'images', maxCount: 5 },
    { name: 'mainImage', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'All files that go to public store',
    type: 'object',
    schema: {
      type:'object',
      properties: {
        zip: {
          type: 'string',
            format: 'binary'
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
        },
        mainImage: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
        },
        video: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  async uploadAllFilesToMinio(
    @UploadedFiles() files: {zip:Express.Multer.File,images:Express.Multer.File[],mainImage:Express.Multer.File[],video:Express.Multer.File },
    @Param('projectId') projectId:string
  ) {
    const imageUrls = await this.minioService.uploadImages(files.images,projectId)
    const bundleUrls = await this.minioService.uploadZipProject(files.zip[0],projectId)
    const mainImageUrl = await this.minioService.uploadImages(files.mainImage,projectId,'main_')
    const videoUrl = await this.minioService.uploadVideo(files.video,projectId)
    return {
      images:imageUrls,
      bundle:bundleUrls,
      mainImage:mainImageUrl,
      video:videoUrl
    }
  }

  // @Post('uploadProject/:projectId')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'Zip archive containing project files',
  //   type: 'object',
  //   schema: {
  //     type:'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   }
  // })
  // async uploadProject(@UploadedFile() file: Express.Multer.File, @Param(':projectId') projectId:string) {
  //   try {
  //    const ulrs = await this.minioService.uploadZipProject(file,projectId)
  //     return {success:true,urls:ulrs}
  //   } catch (error) {
  //     console.error('Ошибка при загрузке проекта:', error);
  //     throw error;
  //   }
  // }

  @Get('download/:fileName')
  @ApiOperation({ summary: 'Скачать файл из Minio' })
  @ApiResponse({ status: 200, description: 'Файл успешно скачан' })
  async downloadFile(@Param('fileName') fileName: string, @Res() res:Response) {
    const bucketName = this.bucketName; // Имя bucket в Minio
    const fileStream = await this.minioService.downloadFile(fileName, bucketName);
    const contentType = this.minioService.getContentType(fileName);
    res.set({
      'Content-Type': `${contentType}`,
    });
    return fileStream.pipe(res);
  }

  @Get('downloadLink/:bucketId/:fileName')
  async downloadFileInChunks(
    @Param('bucketId') bucketId:string,
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const bucketName = bucketId.trim()
    const fileStream = await this.minioService.downloadFile(fileName, bucketName);
    // Установка заголовка для скачивания файла чанками
    const contentType = this.minioService.getContentType(fileName);
    res.set({
      'Content-Type': `${contentType}`,
    });
    return fileStream.pipe(res);
  }

  // @Get('download/url/:fileName')
  // @Header("Content-Type", "application/javascript")
  // async getBookCover(
  //   @Param('fileName') fileName: string,
  //   ) {
  //   const fileUrl = await this.minioService.getFileUrl(fileName)
  //
  //   return fileUrl
  // }

}
