import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { TeamEntity } from '../../team/entities/team.entity';

@Entity('project_roles')
export class ProjectRolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  role: string;

  @OneToMany(() => UserEntity, (user) => user)
  user: UserEntity[];

}