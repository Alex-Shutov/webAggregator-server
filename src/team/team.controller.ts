import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Put, Req, UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { TeamEntity } from './entities/team.entity';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@user/decorators/user.decorator';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto): Promise<TeamEntity> {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  findAll(): Promise<TeamEntity[]> {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TeamEntity> {
    return this.teamService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<TeamEntity> {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.teamService.remove(id);
  }

  @Patch('role')
  updateTeamRole(@User('id') userId:string, @Body() updateTeamRoleDto: UpdateTeamDto) {
    return this.teamService.update(userId, updateTeamRoleDto);
  }

  @Post()
  @UseGuards(TeamLeaderGuard)
  createTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

}