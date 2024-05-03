import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TeamEntity } from '@app/team/entities/team.entity';

@Entity('project_roles')
export class ProjectRolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @ManyToOne(() => UserEntity, (user) => user.projectRoles)
  user: UserEntity;

  @ManyToOne(() => TeamEntity, (team) => team.id)
  team: TeamEntity;
}