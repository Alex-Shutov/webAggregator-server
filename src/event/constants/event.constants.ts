export interface IEvent{
  id:string
  name:string
  status:IEventStatus
  finishDate?:Date
}

export enum IEventStatus {
  'OPENED',
  'CLOSED',
  'OPEN_VOTE',
  'CLOSE_VOTE'
}