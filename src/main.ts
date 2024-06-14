import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';

!process.env.IS_TS_NODE && require('module-alias/register');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: false,
  }));
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
  };
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('Minio API')
    .setDescription('API для загрузки и выгрузки файлов в Minio')
    .setVersion('1.0')
    .addTag('NestMinio')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
}

bootstrap();
