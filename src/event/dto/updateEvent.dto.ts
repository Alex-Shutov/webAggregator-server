import { IEventStatus } from '@app/event/constants/event.constants';

export class UpdateEventDto{
  name:string
  status:IEventStatus
  finishDate:Date
}