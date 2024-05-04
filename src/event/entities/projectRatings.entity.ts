import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('project_ratings')
export class ProjectRatingEntity {
  @PrimaryGeneratedColumn('uuid')

  @ManyToMany(()=>UserEntity,(user)=>user.id)
  userId: string;

}