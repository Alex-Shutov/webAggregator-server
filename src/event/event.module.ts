import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '@app/event/entities/event.entity';
import { UserModule } from '@user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]),forwardRef(()=>UserModule)],
  providers: [EventService],
  controllers: [EventController],
  exports:[EventService]
})
export class EventModule {}
