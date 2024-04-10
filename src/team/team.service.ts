import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<TeamEntity> {
    const team = this.teamRepository.create(createTeamDto);
    return this.teamRepository.save(team);
  }

  async findAll(): Promise<TeamEntity[]> {
    return this.teamRepository.find();
  }

  async findOne(id: string): Promise<TeamEntity> {
    return this.teamRepository.findOneBy({ id });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<TeamEntity> {
    const team = await this.teamRepository.findOneBy({ id });
    this.teamRepository.merge(team, updateTeamDto);
    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    await this.teamRepository.delete(id);
  }

  getUserId(authorization: any) {

  }
}