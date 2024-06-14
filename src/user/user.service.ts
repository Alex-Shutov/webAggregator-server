import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AuthService } from '@app/auth/auth.service';
import { UserResponse } from '@app/user/interfaces/user.interfaces';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';
import { EventEntity } from '@app/event/entities/event.entity';
import { TeamService } from '@app/team/team.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>,
    @Inject(forwardRef(()=>AuthService))
    private readonly authService:AuthService,
    private readonly teamService:TeamService
  ) {

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

   findOne(params:FindOptionsWhere<EventEntity>,relations:string[]=[]): Promise<UserEntity> {
    return  this.userRepository.findOne({where:params,relations });
  }

  findByEmail(email:string){
    return this.userRepository.findOneBy({
      email:email
    })
  }

  async findByToken(token: string): Promise<UserEntity | null> {
    try {
      // Verify the token
      const decoded = await this.authService.verifyToken(token);

      // Find the user by the decoded user ID
      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      return user;
    } catch (err) {
      // Handle any errors that occur during token verification
      throw new HttpException('Не удалось найти пользователя с данным id', HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where:{
        id:id,
      },relations:['projectRoles','projectIds']
    })
    this.userRepository.merge(user,updateUserDto)
    return this.userRepository.save(user)
  }

  getUserRole(id: string) {
    return this.userRepository.findOneBy({
      id:id
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  createResponse(user:UserEntity):UserResponse{
  return {
    user:{
      patronymic:user?.patronymic,
      projectIds:user?.projectIds,
      id:user.id,
      email:user.email,
      name:user.name,
      surname:user.surname,
      group:user.group,
      token:this.authService.generateJwt(user),
      program:user.program,
      projectRoles:user.projectRoles,
      level:user.level,
      contacts:user.contacts,
    }
  }

  }

  async searchUsers(query: string, currentUserId: string) {
    const subQuery = await this.teamService.createSubQueryForUserSearch()

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.projectRoles', 'projectRole')
      .where('LOWER(user.surname) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(user.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(user.patronymic) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(user.email) LIKE LOWER(:query)', { query: `%${query}%` })
      .andWhere('user.id != :currentUserId', { currentUserId })
      .andWhere('user.role = :role', { role: 'STUDENT' })
      .andWhere(`user.id NOT IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .getMany();
  }

}
