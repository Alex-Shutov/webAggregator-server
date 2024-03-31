import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '@app/auth/auth.service';
import { UserResponse } from '@app/user/interfaces/user.interfaces';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>,
    @Inject(forwardRef(()=>AuthService))
    private readonly authService:AuthService) {

  }

  async create(registerUserDto: UrfuLoginDto):Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOneBy({
      email:registerUserDto.email
    })
    if(userByEmail){
      throw new HttpException('Пользователь с данной почтой уже зарегистрирован',HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new UserEntity()
    Object.assign(newUser,registerUserDto)
    return this.userRepository.save(newUser)
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({
      id:id
    })
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({
      email:email
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  createResponse(user:UserEntity):UserResponse{
  return {
    user:{
      id:user.id,
      email:user.email,
      name:user.name,
      surname:user.surname,
      group:user.group,
      token:this.authService.generateJwt(user)
    }
  }

  }
}
