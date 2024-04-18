import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { EVENT_STATUS } from '@app/event/constants/event.constants';
import { UserEntity } from '@user/entities/user.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(()=>UserEntity,(user)=>user.id,{ cascade: true })
  ratedUsersIds:string[]

  @OneToMany(()=>ProjectEntity,(project)=>project.event)
  projects:ProjectEntity[];

  @Column({
    type: 'enum',
    enum: EVENT_STATUS,
    default: EVENT_STATUS[0],
  })
  status: typeof EVENT_STATUS[number];
}