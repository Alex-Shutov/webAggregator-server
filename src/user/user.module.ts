import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entities/user.entity';
import { AuthModule } from '@app/auth/auth.module';
import { AdminGuard } from '@user/guards/admin.guard';
import { TeamModule } from '@app/team/team.module';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]), forwardRef(()=>AuthModule),forwardRef(()=>TeamModule)],
  controllers: [UserController],
  providers: [UserService,AdminGuard],
  exports:[UserService]
})
export class UserModule {}
