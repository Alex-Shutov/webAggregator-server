import {
  Column,
  Entity, JoinColumn, ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { TeamMemberEntity } from '@app/team/entities/teamMember.entity';
import { EventEntity } from '@app/event/entities/event.entity';


@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;


  @ManyToOne(() => EventEntity, event => event.id)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @OneToOne(() => ProjectEntity)
  @JoinColumn({ name: 'projectId' })
  project: ProjectEntity;

  @Column({nullable:true})
  projectId:string

  // @ManyToMany(() => UserEntity, (user) => user.id)
  // @JoinTable()
  // membersIds: string[];
  //
  // @OneToOne(()=>EventEntity,(event)=>event.id)
  // @JoinColumn()
  // event:EventEntity

  @OneToMany(() => TeamMemberEntity, (teamMember) => teamMember.team)
  members: TeamMemberEntity[];





}