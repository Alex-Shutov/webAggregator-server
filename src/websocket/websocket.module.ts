import { Module } from '@nestjs/common';
import { ProjectWebSocket } from '@app/websocket/websocket';

@Module({
  providers:[ProjectWebSocket]
})
export class WebSocketModule {
}
