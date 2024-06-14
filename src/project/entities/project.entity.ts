import {
  Column,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamEntity } from '../../team/entities/team.entity';
import { PROJECT_STATUSES } from '../constants/project.constants';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { EventEntity } from '../../event/entities/event.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:true})
  name: string;

  @Column({nullable:true})
  description: string;

  @Column({nullable:true})
  howToPlay: string;

  @Column({nullable:true})
  gitLink: string;


  @Column({nullable:true})
  rating: number;


  @ManyToOne(() => EventEntity, (event) => event.id)
  @JoinColumn({ name: 'eventId' })
  event: EventEntity;

  @Column({ nullable: true })
  eventId: string;

  @OneToOne(() => TeamEntity, (team) => team.id)
  @JoinColumn({name:'teamId'})
  team: TeamEntity;

  @Column({ nullable: true })
  teamId:string

  @Column(
    {
      type: 'enum',
      enum: PROJECT_STATUSES,
      default:PROJECT_STATUSES.DRAFT
    }
  )
  status:PROJECT_STATUSES


  @ManyToMany(() => CategoryEntity, (category) => category.id,{cascade:true})
  @JoinTable({
    name:'projects_categories_categories',
    joinColumn: {
      name: "projectId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "categoriesId",
      referencedColumnName: "id"
    }
  })
  categoriesId: CategoryEntity[];



}





