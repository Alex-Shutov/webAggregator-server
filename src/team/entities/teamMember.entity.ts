import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeamEntity } from './team.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('teams_members_ids_users')
export class TeamMemberEntity {

  @PrimaryColumn()
  teamId: string;

  @PrimaryColumn()
  userId: string;

  @Column({ nullable: true })
  projectRole: string;


  @ManyToOne(() => TeamEntity, team => team.members)
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;


}
