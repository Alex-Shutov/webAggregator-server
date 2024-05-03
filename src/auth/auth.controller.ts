import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService) {
  }
  @Post('signUp')
  @UsePipes(new ValidationPipe())
  async signUp(@Body('credentials') signUpDto:UrfuLoginDto){
    return this.authService.signUp(signUpDto)
  }
  @Post('signIn')
  async signIn(){

  }
  @Post('logout')
  async logout(){

  }
  async rememberPass(){

  }
  @Post('loginUrfu')
  @UsePipes(new ValidationPipe())
  async signUpForUrfu(@Body('credentials') loginUserDto:UrfuLoginDto){
    return await this.authService.signUp(loginUserDto)
  }
}
