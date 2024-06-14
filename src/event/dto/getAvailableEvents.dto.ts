import { Transform } from 'class-transformer';
import { toBoolean } from '@app/common/helpers/cast.helper.js';
import { Optional } from '@nestjs/common';
import  { IsOptional } from 'class-validator';

export class getAvailableEventsDto{
  @IsOptional()
  userId:string
}