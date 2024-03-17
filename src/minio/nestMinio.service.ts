import { Inject, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { getFileExtension } from '@app/utils/getFileExtension';
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';
import { REQUEST } from '@nestjs/core';
import { Transform } from 'stream';

@Injectable()
export class NestMinioService {
  private readonly minioClient: Minio.Client;
  private bucketName: string
  constructor(@Inject(REQUEST) private request: Request,private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY')
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME') ?? 'my-bucket'
  }

  private async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName)
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1')
    }
  }
  async uploadFile(file: Express.Multer.File) {
    await this.createBucketIfNotExists()
    const fileName = `${Date.now()}-${file.originalname}`
    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size
    )
    return fileName
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl('GET', this.bucketName, fileName)
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName)
  }

  async downloadFile(fileName: string, bucketName: string) {
    // Получите файл из bucket
    const stream = await this.minioClient.getObject(bucketName, fileName);

    return stream;
  }

  getContentType(fileName: string): string {
    const ext = getFileExtension(fileName).toLowerCase();
    switch (ext) {
      case '.gz':
        return 'gzip';
      case '.js':
        return 'plain/text';
      case '.html':
        return 'text/html';
      default:
        return 'application/octet-stream';
    }
  }

  async findAndModifyHTML(htmlFilePath: string,fileName:string): Promise<string> {

    const serverAddress = `${this.request.url}`;
    try {
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

      // Найдем индекс вызова createUnityInstance
      const createUnityIndex = htmlContent.indexOf('createUnityInstance(');

      // Вставим нужный код перед вызовом createUnityInstance
      const modifiedHtmlContent =
        htmlContent.slice(0, createUnityIndex) +
        `const dataUrlResponse = '${serverAddress}/${fileName}.data'
        const frameworkUrlResponse = '${serverAddress}/${fileName}.framework.js'
        const codeUrlResponse = '${serverAddress}/${fileName}.wasm'

        if (!dataUrlResponse.ok || !frameworkUrlResponse.ok || !codeUrlResponse.ok) {
            throw new Error('Failed to load Unity files');
        }

        const dataUrl = URL.createObjectURL(await dataUrlResponse.blob());
        const frameworkUrl = URL.createObjectURL(await frameworkUrlResponse.blob());
        const codeUrl = URL.createObjectURL(await codeUrlResponse.blob());` +
        htmlContent.slice(createUnityIndex).replace(/dataUrl: '[^']+'/g, 'dataUrl')
          .replace(/frameworkUrl: '[^']+'/g, 'frameworkUrl')
          .replace(/codeUrl: '[^']+'/g, 'codeUrl');

      // Сохраним измененный HTML файл
      const modifiedHtmlFilePath = path.join(
        path.dirname(htmlFilePath),
        'index.html',
      );
      fs.writeFileSync(modifiedHtmlFilePath, modifiedHtmlContent);

      return modifiedHtmlFilePath;
    } catch (error) {
      throw new Error(`Error modifying HTML file: ${error.message}`);
    }
  }

  async extractZip(file: Express.Multer.File,dirUuid:string): Promise<{
    extractionFilename: string;
    extractionPath: string
  }> {

    const tempDir = path.join(__dirname, '..', 'temp');
    const extractionPath = path.join(tempDir, dirUuid);
    let foundFileName = ''
    // Создаем временную директорию, если она не существует
    if (!fs.existsSync(tempDir)) {
      await fs.promises.mkdir(tempDir);
    }

    // Создаем директорию с уникальным идентификатором
    await fs.promises.mkdir(extractionPath, { recursive: true });

    // Записываем файл во временную директорию
    const tempFilePath = path.join(tempDir, `${dirUuid}.zip`);
    await fs.promises.writeFile(tempFilePath, file.buffer);

    // Разархивируем файл
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(tempFilePath)
        .pipe(unzipper.Parse())
        .pipe(new Transform({
          objectMode: true,
          transform: (entry, _, cb) => {
            const fileName = path.basename(entry.path);
            const destPath = path.join(extractionPath, fileName);
            if (!fileName.includes('/')) { // Пропускаем файлы во вложенных директориях
              const type = entry.type; // 'Directory' or 'File'

              if (type === 'File') {
                if (fileName.endsWith('.data')) {
                  foundFileName = fileName;
                }}
                entry.autodrain(); // Пропускаем с
              entry.pipe(fs.createWriteStream(destPath))
                .on('finish', cb)
                .on('error', reject);
            } else {
              entry.autodrain(); // Пропускаем содержимое директорий
              cb();
            }
          }
        }))
        .on('finish', () => {
          resolve();
        })
        .on('error', (err) => {
          reject(err);
        });
    });


    // Удаляем временный zip-файл
    fs.unlinkSync(tempFilePath);

    // Возвращаем путь к директории с разархивированными файлами
    return { extractionPath, extractionFilename:foundFileName };

  }

  async uploadFilesToMinio(extractionPath: string,bucketName:string) {
    // Загрузка файлов в MinIO
    await this.minioClient.makeBucket(bucketName);
    const files = await fs.promises.readdir(extractionPath);
    return await Promise.all(files.map(async file => {
      const filePath = path.join(extractionPath, file);
      const fileStream = fs.createReadStream(filePath);
      await this.minioClient.putObject(bucketName, `/${file}`, fileStream);
      return `${bucketName}/${file}`;
    }))
  }
}
