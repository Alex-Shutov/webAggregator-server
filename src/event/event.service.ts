import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from '@app/event/dto/createEvent.dto';
import { UpdateEventDto } from '@app/event/dto/updateEvent.dto';
import { IEventStatus } from '@app/event/constants/event.constants';
import { UserEntity } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';

@Injectable()
export class EventService{
  constructor(@InjectRepository(EventEntity) private readonly eventRepository:Repository<EventEntity>,
              private readonly userService:UserService) {}
  

  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async changeStatus(eventId:string,updateEventDto:Partial<UpdateEventDto>):Promise<EventEntity>{
    if(updateEventDto.status===IEventStatus.OPENED){
      const prevEvent = await this.closePreviousEvent()
    }
    return await this.update(eventId,updateEventDto)
  }

  async closePreviousEvent(){
    const event = await this.findOne({status:IEventStatus.OPENED})
    event.status = IEventStatus.CLOSED
    return await this.eventRepository.save(event)
  }



  async findAll(params?:FindOptionsWhere<EventEntity>,relations:string[]=[]): Promise<EventEntity[]> {
    return this.eventRepository.find({where:params,relations});
  }

  async findOne(params:FindOptionsWhere<EventEntity>,relations:string[]=[]): Promise<EventEntity> {
    return this.eventRepository.findOne({where:params,relations });
  }

  async findById(id:string){
    return this.eventRepository.findOneBy({
      id
    })
  }

  async findCurrent(){
    return await this.eventRepository.findOneBy({status:IEventStatus.OPENED})
  }

  async update(
    id: string,
    updateEventDto: Partial<UpdateEventDto>,
  ): Promise<EventEntity> {
    const event = await this.eventRepository.findOneBy({ id });
    this.eventRepository.merge(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
  async save(event:EventEntity): Promise<void> {
    await this.eventRepository.save(event);
  }

  createResponse(event:EventEntity){
    return {
      event
    }
  }

  async getAvailableEvents(userId: string) {
    const user = await this.userService.findOne({id:userId},['projectIds', 'projectIds.event']);

    if (!user) {
      throw new Error('User not found');
    }
    if(!user.projectIds.length){
      return [await this.findCurrent()]
    }
    const userEvents = user.projectIds
      .map(project => project.event)
      .filter((event, index, self) => event && self.findIndex(e => e.id === event.id) === index)
      .sort((a, b) => new Date(a.finishDate).getTime() - new Date(b.finishDate).getTime())
      .slice(0, 4);


    return userEvents.map(event => ({
      id: event.id,
      name: event.name,
      status: event.status,
      finishDate: event.finishDate,
    }));
  }
}