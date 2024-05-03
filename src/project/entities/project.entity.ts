import {
  Column,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamEntity } from '../../team/entities/team.entity';
import { ProjectRolesEntity } from './projectRoles.entity';
import { PROJECT_STATUSES } from '@app/project/constants/project.constants';
import { CategoryEntity } from '@app/categories/entities/category.entity';
import { EventEntity } from '@app/event/entities/event.entity';

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


  @Column()
  rating: number;

  @OneToOne(()=>EventEntity,(event)=>event.id)
  eventId:EventEntity

  @OneToOne(() => TeamEntity, (team) => team.id)
  @JoinColumn()
  team: TeamEntity;

  @Column(
    {
      type: 'enum',
      enum: PROJECT_STATUSES,
      default:PROJECT_STATUSES.DRAFT
    }
  )
  status:string


  @ManyToMany(() => CategoryEntity, (category) => category.id)
  categoriesId: CategoryEntity[];


}





