import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('project_roles')
export class ProjectRolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @ManyToOne(() => UserEntity, (user) => user.projectRoles)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.userRoles)
  project: ProjectEntity;
}