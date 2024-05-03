import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ProjectRatingDto } from '@app/websocket/dto/projectRating.dto';
import {Server,Socket} from 'socket.io'
import { OnModuleInit } from '@nestjs/common';
import { ProjectService } from '@app/project/project.service';
import { User } from '@user/decorators/user.decorator';
import { GradeService } from '@app/grade/grade.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProjectWebSocket implements OnModuleInit{

  @WebSocketServer()
  server:Server

  constructor(private readonly gradeService: GradeService) {}
  onModuleInit() {
      this.server.on('connection',(socket)=>{
        console.log(socket.id);
      })
  }


  @SubscribeMessage('socket.rateProject')
  async rateProject(
    @User('id') userId:string,
    @ConnectedSocket() client: Socket,
    @MessageBody() { projectId }:ProjectRatingDto){
    try {
      const gradeProject = await this.gradeService.rateProject(projectId,userId);
      this.server.emit('projectRated', gradeProject);
    } catch (error) {
      client.emit('error', error.message);
    }
  }


}