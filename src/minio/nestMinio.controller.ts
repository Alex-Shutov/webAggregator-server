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
import { ConfigService } from '@nestjs/config';

@ApiTags('NestMinio')
@Controller('NestMinio')
export class NestMinioController {

  private readonly  bucketName:string
  constructor(private readonly minioService: NestMinioService,private readonly configService: ConfigService) {
    this.bucketName = uuid()
  }

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
      const bucketName = this.bucketName.trim()

      const { extractionPath, fileNames } = await this.minioService.extractZip(file,bucketName);
      const responseUrls = this.minioService.createMinioUrls(fileNames,bucketName)
      await this.minioService.findAndModifyHTML(`${extractionPath}/index.html`,responseUrls,bucketName);
      await this.minioService.uploadFilesToMinio(extractionPath,bucketName);
      await this.minioService.deleteTempDirectory(bucketName)
      console.log(`Бакет ${bucketName} создан в minio`);
      return { success: true, responseUrls };
    } catch (error) {
      console.error('Ошибка при загрузке проекта:', error);
      throw error;
    }
  }

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
