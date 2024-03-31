import { IsEmail, IsNotEmpty } from 'class-validator';

export class UrfuLoginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email:string
  @IsNotEmpty()
  readonly password:string
}