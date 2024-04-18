import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '@user/entities/user.entity';


@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(()=>ProjectEntity,(project)=>project)
  project:ProjectEntity

  @ManyToMany(() => UserEntity, (user) => user.projects)
  @JoinTable()
  members: UserEntity[];
}