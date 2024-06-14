import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { EventEntity } from './entities/event.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { isCurrentEventDto } from '@app/event/dto/isCurrentEvent.dto';
import { User } from '@user/decorators/user.decorator';
import { getAvailableEventsDto } from '@app/event/dto/getAvailableEvents.dto';

@ApiTags('events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<EventEntity> {
    return await this.eventService.create(createEventDto);
  }

  @Get('')
  @ApiQuery({ name: 'isCurrent', required:false})
  async findAll(@Query() currentEventDto:isCurrentEventDto): Promise<EventEntity[]|EventEntity> {
    console.log(currentEventDto,123);
    if(currentEventDto?.isCurrent)
      return await this.eventService.findCurrent()
    return await this.eventService.findAll();
  }
  @Get('/available')
  @ApiQuery({ name: 'userId', required:false})
  async findAvailableEvents(@Query() availableEventsDto:getAvailableEventsDto, @User('id') userId:string){

    return await this.eventService.getAvailableEvents(availableEventsDto?.userId ?? userId)
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