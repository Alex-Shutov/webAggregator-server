import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {hash} from 'bcrypt'
import { faker } from '@faker-js/faker';
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


  @BeforeInsert()
  async hashPass(){
    //TODO add hash bcrypt
    this.password = await hash(this.password,10)
  }
  @BeforeInsert()
  async setParsedData(){
    this.name = faker.person.firstName()
    this.surname = faker.person.lastName()
  }
}

