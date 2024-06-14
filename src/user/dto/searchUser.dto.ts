import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchUserDto{
  @IsOptional()
  @ApiProperty()
  query:string
}