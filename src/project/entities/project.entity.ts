import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamEntity } from '../../team/entities/team.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ProjectRolesEntity } from './projectRoles.entity';
import { EventEntity } from '../../event/entities/event.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  howToPlay: string;

  @Column()
  gitLink: string;

  @Column('simple-array')
  screenshots: string[];

  @Column()
  rating: number;

  @ManyToOne(()=>EventEntity,(event)=>event.projects)
  event:EventEntity

  @ManyToOne(() => TeamEntity, (team) => team.projects)
  team: TeamEntity;

  @ManyToMany(() => UserEntity, (user) => user.projects)
  @JoinTable()
  members: UserEntity[];



  @OneToMany(() => ProjectRolesEntity, (userProjectRole) => userProjectRole.project)
  userRoles: ProjectRolesEntity[];
}