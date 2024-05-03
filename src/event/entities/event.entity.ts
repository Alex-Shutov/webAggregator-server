import { AfterUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { IEventStatus } from '@app/event/constants/event.constants';
import { UserEntity } from '@user/entities/user.entity';

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


}