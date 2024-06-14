import { AfterUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { IEventStatus } from '../constants/event.constants';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', nullable:true})
  finishDate:Date

  @Column({
    type: 'enum',
    enum: IEventStatus,
    default: IEventStatus.CLOSED,
  })
  status: IEventStatus;

  @OneToMany(()=>ProjectEntity,(project)=>project.id)
  projects:ProjectEntity[]

}