import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EventEntity } from '../../event/entities/event.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ProjectEntity } from '../../project/entities/project.entity';

@Entity('grades')
export class GradeEntity {
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @ManyToOne(()=>EventEntity, (event)=>event.id)
  event:string

  @ManyToOne(()=>UserEntity,(user)=>user.id)
  user:string

  @Column({default:15})
  fires:number

  @ManyToOne(()=>ProjectEntity, (project)=>project.id)
  project:string


}
