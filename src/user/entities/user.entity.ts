import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {hash} from 'bcrypt'
import { LEVEL_LIST, PROGRAM_LIST, ROLES_LIST } from '../constanst/user.constants';
import { ProjectRolesEntity } from '../../project/entities/projectRoles.entity';
import { ProjectEntity } from '../../project/entities/project.entity';
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
    enum: ROLES_LIST,
    default: ROLES_LIST.STUDENT,
  })
  role:ROLES_LIST

  @Column({
    type: 'enum',
    enum: PROGRAM_LIST,
    default: PROGRAM_LIST['09.03.01'],
  })
  program: PROGRAM_LIST;

  @Column({
    type: 'enum',
    enum: LEVEL_LIST,
    default: LEVEL_LIST.SECOND,
  })
  level: LEVEL_LIST;

  @Column({ nullable: true })
  contacts: string;

  @OneToMany(() => ProjectRolesEntity, (userProjectRole) => userProjectRole)
  @JoinTable()
  projectRoles: ProjectRolesEntity[];

  @ManyToMany(()=>ProjectEntity,(project)=>project.id)
  @JoinTable({name:'PortfolioTable'})
  projectIds:ProjectEntity[]



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

