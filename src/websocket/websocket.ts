import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ProjectRatingDto } from '@app/websocket/dto/projectRating.dto';
import {Server,Socket} from 'socket.io'
import { OnModuleInit } from '@nestjs/common';
import { ProjectService } from '@app/project/project.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProjectWebSocket implements OnModuleInit{

  @WebSocketServer()
  server:Server

  constructor(private readonly projectService: ProjectService) {}
  onModuleInit() {
      this.server.on('connection',(socket)=>{
        console.log(socket.id);
      })
  }


  @SubscribeMessage('socket.rateProject')
  async rateProject(
    @ConnectedSocket() client: Socket,
    @MessageBody() { projectId }:ProjectRatingDto){
    try {
      const rating = await this.projectService.updateRating(projectId);
      this.server.emit('projectRated', rating);
    } catch (error) {
      client.emit('error', error.message);
    }
  }


}