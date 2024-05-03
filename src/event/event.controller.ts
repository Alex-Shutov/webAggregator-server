import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { EventEntity } from './entities/event.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<EventEntity> {
    return await this.eventService.create(createEventDto);
  }

  @Get()
  async findAll(): Promise<EventEntity[]> {
    return await this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventEntity> {
    return await this.eventService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    return await this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.eventService.remove(id);
  }

  @Put('change/:id')
  async changeStatus(
    @Param('id') eventId:string,
    @Body() updateEventDto:Partial<UpdateEventDto>
  ){
    const event = await this.eventService.changeStatus(eventId,updateEventDto)
    return this.eventService.createResponse(event)
  }
}