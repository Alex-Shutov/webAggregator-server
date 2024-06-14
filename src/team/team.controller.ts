import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Put, Query, Req, UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { TeamEntity } from './entities/team.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@user/decorators/user.decorator';
import { TeamLeaderGuard } from '@app/team/guards/teamLeader.guard';
import { FindTeamDto } from '@app/team/dto/findTeam.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(TeamLeaderGuard)
  create(@Body() createTeamDto: CreateTeamDto): Promise<TeamEntity> {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiQuery({ name: 'withUser', required: false, type: Boolean })
  @ApiQuery({name:'eventId',required:false,type:String})
  findAll(
    @Query() query: FindTeamDto,
    @User('id') userId: string
  ): Promise<TeamEntity[]|TeamEntity> {
    return this.teamService.findAll(query, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TeamEntity> {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TeamLeaderGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<any> {
    const team =  await this.teamService.update(id, updateTeamDto);
    return await this.teamService.createResponse(team)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.teamService.remove(id);
  }

  @Patch('role')
  updateTeamRole(@User('id') userId:string, @Body() updateTeamRoleDto: UpdateTeamDto) {
    return this.teamService.update(userId, updateTeamRoleDto);
  }


}