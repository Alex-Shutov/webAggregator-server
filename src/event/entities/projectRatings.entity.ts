import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '@user/entities/user.entity';
import { EventEntity } from '@app/event/entities/event.entity';

@Entity('project_ratings')
export class ProjectRatingEntity {
  @PrimaryGeneratedColumn('uuid')

  @ManyToMany(()=>UserEntity,(user)=>user.id)
  userId: string;

}