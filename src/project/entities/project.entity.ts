import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamEntity } from '../../team/entities/team.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ProjectRolesEntity } from './projectRoles.entity';
import { EventEntity } from '../../event/entities/event.entity';
import { ROLES_LIST } from '@user/constanst/user.constants';
import { PROJECT_STATUSES } from '@app/project/constants/project.constants';

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

  @ManyToOne(() => TeamEntity, (team) => team.project)
  teams: TeamEntity[];

  @Column(
    {
      type: 'enum',
      enum: PROJECT_STATUSES,
      default:PROJECT_STATUSES.DRAFT
    }
  )
  status:string





  @OneToMany(() => ProjectRolesEntity, (userProjectRole) => userProjectRole.project)
  userRoles: ProjectRolesEntity[];
}