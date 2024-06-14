import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ormconfig from './db/config/ormconfig';
import { MinioModule } from '@app/minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from '@app/auth/middleware/auth.middleware';
import { EventModule } from './event/event.module';
import { WebSocketModule } from '@app/websocket/websocket.module';
import { TeamModule } from '@app/team/team.module';
import { GradeModule } from './grade/grade.module';
import { CategoriesModule } from './categories/categories.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [ormconfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
      inject: [ConfigService],
    }),
    TeamModule,
    MinioModule,
    AuthModule,
    UserModule,
    EventModule,
    WebSocketModule,
    CategoriesModule,
    GradeModule,
    RolesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes({
      path:'*',
      method:RequestMethod.ALL
    })
  }
}
