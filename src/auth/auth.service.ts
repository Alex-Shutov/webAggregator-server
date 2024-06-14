import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';
import { UserEntity } from '@app/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user/user.service';
import {sign,verify} from 'jsonwebtoken'
import {compare} from "bcrypt"
import puppeteer from 'puppeteer';
import { LEVEL_LIST } from '@user/constanst/user.constants';



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
    const browser = await puppeteer.launch({headless:true,defaultViewport:null, args: [
        '--incognito', '--remote-debugging-port=9222'
      ]});
    const page = await browser.newPage();

    try {
      // 1. Открываем страницу авторизации
      await page.goto('https://sso.urfu.ru/adfs/OAuth2/authorize?resource=https%3A%2F%2Fistudent.urfu.ru&type=web_server&client_id=https%3A%2F%2Fistudent.urfu.ru&redirect_uri=https%3A%2F%2Fistudent.urfu.ru%2Fstudent%2Flogin%3Fauth&response_type=code&scope=');

      // 2. Вводим логин и пароль
      await page.type('#userNameInput', loginuserDto.email);
      await page.type('#passwordInput', loginuserDto.password);
      // 3. Отправляем форму
      await Promise.all([

        page.click('#submitButton'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),

      ]);
      // 4. Проверяем, успешно ли прошла авторизация

      const errorElement = await page.$('#errorText');
      if (errorElement) {
        const errorMessage = await page.evaluate(el => el.textContent, errorElement);
        throw new HttpException(`Ошибка авторизации: ${errorMessage}`, HttpStatus.UNAUTHORIZED);
      }
      await page.goto('https://istudent.urfu.ru/student/index')

      // 5. Получаем данные пользователя из личного кабинета
      const userFIO = (await page.$eval('.main-data h4', el => el.textContent)).replace(/[\n\t]+/g, '').split(' ');
      const [userSurname,userName, userPatronymic] = [...userFIO]
      const userGroup = await page.$eval('.student-data-info p:nth-of-type(2) strong', el => el.nextSibling.textContent.trim());
      const userLevel = Number(userGroup.split('-')[1][0])

      const userByEmail = await this.userService.findByEmail(loginuserDto.email)
      if(userByEmail){
        return this.userService.createResponse(userByEmail)
      }

      // 6. Создаем нового пользователя
      const userDto = { ...loginuserDto, surname:userSurname, name: userName, patronymic:userPatronymic, group: userGroup, level: userLevel };
      const user = await this.userService.create(userDto);

      return this.userService.createResponse(user);
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } finally {
      await browser.close();
    }
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
