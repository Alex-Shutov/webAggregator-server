import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamEntity } from './entities/team.entity';
import { CreateTeamDto } from './dto/createTeam.dto';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { FindTeamDto } from '@app/team/dto/findTeam.dto';
import { TeamMemberEntity } from '@app/team/entities/teamMember.entity';
import { ProjectEntity } from '@app/project/entities/project.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<any> {
    const { name, memberIds, eventId } = createTeamDto;

    // Создаем команду
    const team = this.teamRepository.create({ name, event: { id: eventId } });
    const savedTeam = await this.teamRepository.save(team);

    // Получаем существующих членов команды
    const existingMembers = await this.teamMemberRepository.find({
      where: { teamId: savedTeam.id },
    });

    const existingMemberIds = new Set(existingMembers.map(member => member.userId));

    // Создаем записи в TeamMember для каждого memberId
    const teamMembers = memberIds
      .filter(member => !existingMemberIds.has(member[0])) // Исключаем уже существующих членов
      .map(member => {
        return this.teamMemberRepository.create({
          teamId: savedTeam.id,
          userId: member[0],
          projectRole: member[1],
        });
      });

    await this.teamMemberRepository.save(teamMembers);

    return await this.createResponse(savedTeam);
  }


  async findAll(query: FindTeamDto, userId: string): Promise<TeamEntity[] | any> {
    const { eventId, withUser } = query;

    if (!eventId) {
      return this.teamRepository.find({ relations: ['members','project'] });
    }

    let queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'teamMember')
      .leftJoinAndSelect('team.project', 'project')
      .where('team.eventId = :eventId', { eventId });

    if (withUser) {
      // Фильтруем команды, которые содержат текущего пользователя

      const teamIdsContainingUser = await this.teamRepository
        .createQueryBuilder('team')
        .select('team.id')
        .leftJoin('team.members', 'teamMember')
        .leftJoin('team.project','project')
        .where('team.eventId = :eventId', { eventId })
        .andWhere('teamMember.userId = :userId', { userId })
        .getMany();

      const teamIds = teamIdsContainingUser.map(team => team.id);
      if(!teamIds.length){

      }
      // Убедимся, что основной запрос загружает всех членов этих команд
      queryBuilder = queryBuilder.andWhere('team.id IN (:...teamIds)', { teamIds: teamIds });


      const teams = await queryBuilder.getMany();

      if (teams.length === 0) {
        throw new HttpException('No such Entity', HttpStatus.NOT_FOUND);
      }

      return this.createResponse(teams[0]);
    }

    return queryBuilder.getMany();
  }


  async findOne(id: string): Promise<TeamEntity> {
    return this.teamRepository.findOneBy({ id });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({ where: { id }, relations: ['members'] });

    if (!team) {
      throw new Error('Team not found');
    }

    // Обновляем основную информацию о команде
    this.teamRepository.merge(team, updateTeamDto);

    // Получаем существующих членов
    const existingMembers = await this.teamMemberRepository.find({ where: { teamId: team.id } });
    const existingMemberIds = new Set(existingMembers.map(member => member.userId));

    // Фильтруем новых членов
    const newMembers = updateTeamDto.memberIds
      .filter(memberId => !existingMemberIds.has(memberId[0])) // Исключаем уже существующих членов
      .map(memberId => {
        return this.teamMemberRepository.create({
          teamId: team.id,
          userId: memberId[0],
          projectRole: memberId[1],
        });
      });

    // Сохраняем новых членов
    if (newMembers.length > 0) {
      await this.teamMemberRepository.save(newMembers);
    }

    return this.teamRepository.save(team);
  }


  async remove(id: string): Promise<void> {
    await this.teamRepository.delete(id);
  }

  // async addMember(teamId: string, userId: string): Promise<TeamEntity> {
  //   const team = await this.teamRepository.findOneBy({ id: teamId });
  //   if (!team.membersIds.includes(userId)) {
  //     team.membersIds.push(userId);
  //   }
  //   return this.teamRepository.save(team);
  // }

  async removeMember(id: string, userId: string) {
    const team = await this.teamRepository.findOneBy({ id: id });
    team.members = team.members.filter(member => member.user.id !== userId);
    return this.teamRepository.save(team);
  }

  async addProjectId(teamId:string,project:ProjectEntity){
    console.log(project,'proj');
    console.log(teamId,'id');
    if(!teamId) return
    const team = await this.teamRepository.findOne({where:{id:teamId},relations:['project']})
    if(!team.project)
      team.project = project
    await this.teamRepository.save(team)
  }

  async createSubQueryForUserSearch(){
    const subQuery = this.teamMemberRepository
      .createQueryBuilder('teamMember')
      .select('teamMember.userId')
      .distinct(true);
    return subQuery
  }

  async createResponse(team:TeamEntity){
    const membersInTeam = await this.teamMemberRepository.find({where:{teamId:team.id},relations:['user','user.projectRoles']})
    const {event} = await this.teamRepository.findOne({where:{id:team?.id},relations:['event']})
    return {
      name:team?.name,
      id:team?.id,
      members:membersInTeam.map(el=>el.user),
      event:event,
      projectId:team?.projectId,
    }
  }
}