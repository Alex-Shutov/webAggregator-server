import {
  Controller,
  Delete,
  Get, Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NestMinioService } from '@app/minio/nestMinio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { uuid } from 'uuidv4';

@ApiTags('NestMinio')
@Controller('NestMinio')
export class NestMinioController {
  constructor(private readonly minioService: NestMinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Zip archive containing project files',
    type: 'object',
    schema: {
      type:'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    }
  })
  async uploadProject(@UploadedFile() file: Express.Multer.File) {
    try {
      const bucketName = uuid()

      const { extractionPath,extractionFilename } = await this.minioService.extractZip(file,bucketName);

      await this.minioService.findAndModifyHTML(`${extractionPath}/index.html`,extractionFilename);
      const uploadedFiles = await this.minioService.uploadFilesToMinio(extractionPath,bucketName);

      return { success: true, uploadedFiles };
    } catch (error) {
      console.error('Ошибка при загрузке проекта:', error);
      throw error;
    }
  }

  @Get('download/:fileName')
  @ApiOperation({ summary: 'Скачать файл из Minio' })
  @ApiResponse({ status: 200, description: 'Файл успешно скачан' })
  async downloadFile(@Param('fileName') fileName: string, @Res() res:Response) {
    const bucketName = 'my-bucket'; // Имя bucket в Minio
    const fileStream = await this.minioService.downloadFile(fileName, bucketName);
    const contentType = this.minioService.getContentType(fileName);
    res.set({
      'Content-Type': `${contentType}`,
    });
    return fileStream.pipe(res);
  }

  @Get('downloadChunks/:fileName')
  async downloadFileInChunks(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    const bucketName = 'my-bucket';
    const fileStream = await this.minioService.downloadFile(fileName, bucketName);
    // Установка заголовка для скачивания файла чанками
    const contentType = this.minioService.getContentType(fileName);
    res.set({
      'Content-Type': `${contentType}`,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    return fileStream.pipe(res);
  }

  @Get('download/url/:fileName')
  @Header("Content-Type", "application/javascript")
  async getBookCover(
    @Param('fileName') fileName: string,
    ) {
    const fileUrl = await this.minioService.getFileUrl(fileName)

    return fileUrl
  }

  @Delete('covers/:fileName')
  async deleteBookCover(@Param('fileName') fileName: string) {
    await this.minioService.deleteFile(fileName)
    return fileName
  }
}
