import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ProjectRolesEntity } from '../../project/entities/projectRoles.entity';


@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(()=>ProjectEntity,(project)=>project.id)
  projectId:string

  @ManyToMany(() => UserEntity, (user) => user.id)
  @JoinTable()
  membersIds: string[];

  @OneToMany(()=>ProjectRolesEntity,(projectRole)=>projectRole.id)
  @JoinColumn()
  projectRolesIds:string[]



}