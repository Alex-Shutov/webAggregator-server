import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {hash} from 'bcrypt'
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

