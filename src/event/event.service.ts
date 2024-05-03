import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from '@app/event/dto/createEvent.dto';
import { UpdateEventDto } from '@app/event/dto/updateEvent.dto';
import { IEventStatus } from '@app/event/constants/event.constants';

@Injectable()
export class EventService{
  constructor(@InjectRepository(EventEntity) private readonly eventRepository:Repository<EventEntity>) {}
  

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

}