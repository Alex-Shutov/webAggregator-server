import { forwardRef, Module } from '@nestjs/common';
import { ProjectWebSocket } from '@app/websocket/websocket';
import { ProjectModule } from '@app/project/project.module';
import { GradeModule } from '@app/grade/grade.module';

@Module({
  imports:[forwardRef(()=>GradeModule)],
  providers:[ProjectWebSocket]
})
export class WebSocketModule {
}
