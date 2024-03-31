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
export class MinioService {
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
    console.log(fileName,ext);
    switch (ext) {
      case 'gz':
        return 'gzip';
      case 'png':
        return 'image/png'
      case 'js':
        return 'text/javascript';
      case 'html':
        return 'text/html';
      case 'wasm':
        return 'application/wasm';
      default:
        return 'plain/text';
    }
  }

  createMinioUrls(fileNames:string[],bucketName:string){
    const minioUrl:string = `${process.env.MINIO_PROTOCOL??'http://'}${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}`
    const responseUrls = {
      bridgeUrl:`${minioUrl}/${fileNames.find(el=>el.includes('instant-games-bridge'))}`,
      iconUrl:`${minioUrl}/${fileNames.find(el=>el.includes('.png'))}`,
      htmlUrl : `${minioUrl}/${fileNames.find(el=>el.includes('.html'))}`,
      dataUrl: `${minioUrl}/${fileNames.find(el=>el.includes('.data'))}`,
      loaderUrl:`${minioUrl}/${fileNames.find(el=>el.includes('.loader'))}`,
      frameworkUrl:`${minioUrl}/${fileNames.find(el=>el.includes('.framework'))}`,
      wasmUrl:`${minioUrl}/${fileNames.find(el=>el.includes('.wasm'))}`,
      assetsUrl:`${minioUrl}/${fileNames.find(el=>el.includes('StreamingAssets'))}`,
    }
    return responseUrls
  }

  async findAndModifyHTML(htmlFilePath: string, minioUrls: {
    dataUrl: string;
    frameworkUrl: string;
    wasmUrl: string;
    loaderUrl: string;
    assetsUrl: string
    iconUrl:string,
    bridgeUrl:string
  }, bucketName: string): Promise<string> {


    try {
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
      // htmlContent.replace(/unityLoader.src = '[^']+'/g,`unityLoader.src = '${serverAddress}/NestMinio/download/${fileName}.loader.js`)

      // Найдем индекс вызова createUnityInstance
      const createUnityIndex = htmlContent.indexOf('createUnityInstance(');
      const srcLoaderIndex = htmlContent.indexOf('unityLoader.src')
      const headClosingIndex = htmlContent.indexOf('</head>');
      const styleCode = !minioUrls.bridgeUrl.includes('.js') ? `
        <style>
            body {
                width: 100vw !important;
                height: 100vh !important;
                padding: 0px !important;
                margin: 0px !important;
            }
            #unity-canvas {
                width: 100% !important;
                height: 100% !important;
            }
        </style>
    ` : '';
      const srcUrl = srcLoaderIndex === -1 ? `${minioUrls.loaderUrl}` : `'${minioUrls.loaderUrl}'`
      // Вставим нужный код перед вызовом createUnityInstance
      const modifiedHtmlContent =

        htmlContent.slice(0,headClosingIndex) + styleCode + htmlContent.slice(headClosingIndex, createUnityIndex).replace('./instant-games-bridge.js',`${minioUrls.bridgeUrl}`)
          .replace(/["'].*?loader\.js.*?["']/g,srcUrl) +
        `const dataUrlResponse = '${minioUrls.dataUrl}';
        const frameworkUrlResponse = '${minioUrls.frameworkUrl}';
        const codeUrlResponse = '${minioUrls.wasmUrl}';
        const streamingUrlResponse = '${minioUrls.assetsUrl}';

 

        const dataUrl = dataUrlResponse;
        const frameworkUrl = frameworkUrlResponse;
        const streamingAssetsUrl = streamingUrlResponse;
        const codeUrl = codeUrlResponse;\n` +
        'var unityInstance = '
        +
        htmlContent.slice(createUnityIndex).replace(/dataUrl: ['"]([^'"]+)['"]/g, 'dataUrl')
          .replace(/frameworkUrl: ['"]([^'"]+)['"]/g, 'frameworkUrl')
          .replace(/streamingAssetsUrl: '['"]([^'"]+)['"]/g, 'streamingAssetsUrl')
          .replace(/codeUrl: ['"]([^'"]+)['"]/g, 'codeUrl');

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

  async extractZip(file: Express.Multer.File,dirUuid:string): Promise<{ extractionPath: string; fileNames: string[] }> {

    const tempDir = path.join(__dirname, '..', 'temp');
    const extractionPath = path.join(tempDir, dirUuid);
    const nameFilesArray:string[] = []
    // Создаем временную директорию, если она не существует
    if (!fs.existsSync(tempDir)) {
      await fs.promises.mkdir(tempDir);
    }

    // Создаем директорию с уникальным идентификатором
    await fs.promises.mkdir(extractionPath, { recursive: true });

    // Записываем файл во временную директорию
    const tempFilePath = path.join(tempDir, `${dirUuid}.zip`);
    await fs.promises.writeFile(tempFilePath, file.buffer);
    const regex = /\s+/g;
    console.log(dirUuid);
    // Разархивируем файл
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(tempFilePath)
        .pipe(unzipper.Parse())
        .pipe(new Transform({
          objectMode: true,
          transform: (entry, encoding, cb) => {

            entry.path = entry.path.replace(regex, '')
            const fileName = path.basename(entry.path);
            const isStreamingAssets = entry.path.startsWith('StreamingAssets/');
            const streamingAssetsPath = path.join(extractionPath, 'StreamingAssets');
            const type = entry.type; // 'Directory' or 'File'
            if (entry.type === 'Directory') {
              entry.autodrain();
              cb()
            }
            if (type === 'File' ) { // Пропускаем файлы во вложенных директориях
                nameFilesArray.push( isStreamingAssets ? 'StreamingAssets/' : fileName)
              const destPath = isStreamingAssets
                ? path.join(streamingAssetsPath, path.relative('StreamingAssets/', entry.path))
                : path.join(extractionPath, fileName);

              // Создаем директорию StreamingAssets, если она не существует
              if (isStreamingAssets && !fs.existsSync(streamingAssetsPath)) {
                fs.mkdirSync(streamingAssetsPath, { recursive: true });
              }

              entry.pipe(fs.createWriteStream(destPath))
                .on('finish', cb)
                .on('error', reject);

            }
            entry.autodrain();
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
    return { extractionPath, fileNames:nameFilesArray };

  }
  async deleteTempDirectory(dirUuid:string){
    const tempFolderPath = path.join(__dirname, '..', 'temp', dirUuid);
    await fs.promises.rmdir(tempFolderPath, { recursive: true });
    console.log('Temporary folder deleted successfully.');
  }

  async uploadFilesToMinio(extractionPath: string,bucketName:string) {
    // Загрузка файлов в MinIO
    try {
      await this.minioClient.makeBucket(bucketName);
      this.minioClient.setBucketPolicy(
        bucketName,
        JSON.stringify(this.getPolicy(bucketName)),
        function (err) {
          if (err) throw err;

          console.log('Bucket policy set');
        },
      );


      const uploadFileRecursively = async (currentPath: string, basePath: string) => {
        const files = await fs.promises.readdir(currentPath);
        const uploadPromises = files.map(async (file) => {
          const filePath = path.join(currentPath, file);
          const relativeFilePath = path.relative(basePath, filePath);
          const stat = await fs.promises.stat(filePath);

          if (stat.isDirectory()) {
            await uploadFileRecursively(filePath, basePath);
          } else {
            const fileStream = fs.createReadStream(filePath);

            await this.minioClient.putObject(bucketName, `/${relativeFilePath}`, fileStream,{'Content-Type':`${this.getContentType(relativeFilePath)}`});
            return `${bucketName}/${relativeFilePath}`;
          }
        });

        return Promise.all(uploadPromises);
      };
      return uploadFileRecursively(extractionPath, extractionPath);
    }
    catch (e){
      console.log('Ошибка в minio:' + e);
    }

  }

  private getCorrectMimeType(){

  }

  private getPolicy(bucketName:string){
    return  {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:ListBucketMultipartUploads',
            's3:GetBucketLocation',
            's3:ListBucket',
          ],
          Resource: [`arn:aws:s3:::${bucketName}`], // Change this according to your bucket name
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            // 's3:PutObject',
            's3:AbortMultipartUpload',
            // 's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          // "Condition": {
          //   "StringEquals": {
          //     "s3:ExistingObjectTag/Content-Type": ["application/javascript", "text/html"]
          //   }
          // },
          Resource: [`arn:aws:s3:::${bucketName}/*`], // Change this according to your bucket name
        },
      ],
    };

  }
}
