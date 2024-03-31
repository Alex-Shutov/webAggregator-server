import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserResponse } from '@app/user/interfaces/user.interfaces';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: UrfuLoginDto):Promise<UserResponse> {
    const user = await this.userService.create(createUserDto);
    return this.userService.createResponse(user)
  }

  @Get('?all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard)
  async findCurrent(@User() user:UserEntity):Promise<UserResponse>{
    return this.userService.createResponse(user);

  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
