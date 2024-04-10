import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from '@app/event/dto/createEvent.dto';
import { UpdateEventDto } from '@app/event/dto/updateEvent.dto';

@Injectable()
export class EventService{
  constructor(@InjectRepository(EventEntity) private readonly eventRepository:Repository<EventEntity>) {}
  

  async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const project = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(project);
  }

  async findAll(): Promise<EventEntity[]> {
    return this.eventRepository.find();
  }

  async findOne(id: string): Promise<EventEntity> {
    return this.eventRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const project = await this.eventRepository.findOneBy({ id });
    this.eventRepository.merge(project, updateEventDto);
    return this.eventRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}