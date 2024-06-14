import { Transform } from "class-transformer";
import { toBoolean } from '@app/common/helpers/cast.helper.js';

export class isCurrentEventDto{
  @Transform(({ value }) => toBoolean(value))
  isCurrent:boolean = false
}