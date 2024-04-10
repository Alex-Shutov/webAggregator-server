import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {hash} from 'bcrypt'
import { LEVEL_LIST, PROGRAM_LIST } from '../constanst/user.constants';
import { ProjectEntity } from '../../project/entities/project.entity';
import { ProjectRolesEntity } from '../../project/entities/projectRoles.entity';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column()
  email:string

  @Column()
  name:string

  @Column()
  surname:string

  @Column({select:false})
  password:string

  @Column()
  group:string

  @Column({
    type: 'enum',
    enum: PROGRAM_LIST,
    default: PROGRAM_LIST[0],
  })
  program: typeof PROGRAM_LIST[number];

  @Column({
    type: 'enum',
    enum: LEVEL_LIST,
    default: LEVEL_LIST[0],
  })
  level: typeof LEVEL_LIST[number];

  @Column({ nullable: true })
  contacts: string;

  @OneToMany(() => ProjectRolesEntity, (userProjectRole) => userProjectRole.user)
  @JoinTable()
  projectRoles: ProjectRolesEntity[];

  @ManyToMany(() => ProjectEntity, (project) => project.members)
  @JoinTable()
  projects: ProjectEntity[];Í
  @BeforeInsert()
  async hashPass(){
    //TODO add hash bcrypt
    this.password = await hash(this.password,10)
  }
  @BeforeInsert()
  async setParsedData(){
    // this.name = faker.person.firstName()
    // this.surname = faker.person.lastName()
    // this.group = "РИ-400000"
  }
}

