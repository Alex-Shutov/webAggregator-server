import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '@user/entities/user.entity';
import { ProjectRolesEntity } from '@app/project/entities/projectRoles.entity';


@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(()=>ProjectEntity,(project)=>project.id)
  project:ProjectEntity

  @ManyToMany(() => UserEntity, (user) => user)
  @JoinTable()
  members: UserEntity[];

  @OneToMany(()=>ProjectRolesEntity,(projectRole)=>projectRole.id)
  @JoinColumn()
  projectRole:string



}