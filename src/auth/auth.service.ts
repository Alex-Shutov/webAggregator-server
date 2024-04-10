import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/user.service';
import {sign,verify} from 'jsonwebtoken'
import {compare} from "bcrypt"



@Injectable()
export class AuthService {
  constructor(private readonly configService:ConfigService,
              @Inject(forwardRef(()=>UserService))
              private readonly userService:UserService
  ) {
  }
  async signUp(signUpDto:UrfuLoginDto){
    const user = await this.userService.create(signUpDto);
    return this.userService.createResponse(user)
  }
  async loginUrfu(loginuserDto:UrfuLoginDto){
    const user = await this.userService.findByEmail(loginuserDto.email)
    if (!user){
      throw new HttpException('По данной почте не удалось найти аккаунт УрФУ', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const isPassCorrect  = await compare(loginuserDto.password,user.password)

    if (!isPassCorrect){
      throw new HttpException('Указан неверный пароль', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    delete user.password
    return user
  }

  async verifyToken(token:string):Promise<UserEntity>{
    try {
      return verify(token,this.configService.get('JWT_KEY'))
    }
    catch (e){
      throw new HttpException('Не удалось декодировать токен', HttpStatus.BAD_REQUEST)
    }
  }

  generateJwt(user:UserEntity){
    return sign({
      id:user.id,
      email:user.email,
      surname:user.surname,
      name:user.name
    },this.configService.get('JWT_KEY'))
  }
}
