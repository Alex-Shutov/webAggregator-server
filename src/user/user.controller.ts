import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserResponse } from '@app/user/interfaces/user.interfaces';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/entities/user.entity';
import { AuthGuard } from '@app/auth/guards/auth.guard';
import { UrfuLoginDto } from '@app/auth/dto/urfuLogin.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchUserDto } from '@user/dto/searchUser.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: UrfuLoginDto):Promise<UserResponse> {
    const user = await this.userService.create(createUserDto);
    return this.userService.createResponse(user)
  }
  @Get('me')
  async getMe(@User() user:UserEntity){
    if(!user?.id)
      return null
    const userEntity = await this.userService.findOne({id:user.id},['projectRoles'])
    return this.userService.createResponse(userEntity)
  }

  @Get('?all')
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get('search')
  async searchUsers(@Query() { query }: SearchUserDto, @User('id') userId:string): Promise<UserEntity[]> {
    return this.userService.searchUsers(query,userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findCurrent(@User() user:UserEntity):Promise<UserResponse>{
    return this.userService.createResponse(user);

  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne({id:id},['projectRoles']);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    const user =  await this.userService.update(id, updateUserDto);
    return this.userService.createResponse(user)


  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}
