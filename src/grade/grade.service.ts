import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '@app/event/entities/event.entity';
import { Repository } from 'typeorm';
import { IEventStatus } from '@app/event/constants/event.constants';
import { ProjectEntity } from '@app/project/entities/project.entity';
import { GradeEntity } from '@app/grade/entities/grade.entity';
import { ProjectResponse } from '@app/project/interfaces/project.interface';
import { GradeResponse } from '@app/grade/interfaces/grade.interface';

@Injectable()
export class GradeService {

  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
  ) {
  }

  create(createGradeDto: CreateGradeDto) {
    return 'This action adds a new grade';
  }

  findAll() {
    return `This action returns all grade`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  update(id: number, updateGradeDto: UpdateGradeDto) {
    return `This action updates a #${id} grade`;
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }

  async rateProject(projectId: string, userId: string) {

    function patchGrade(oldGrade: GradeEntity) {
      if (oldGrade.fires > 0) {
        oldGrade.fires -= 5
        return oldGrade
      } else throw new HttpException('Вы не можете оценить проект, так как кол-во ваших огоньков равно 0 :(', HttpStatus.CONFLICT)
    }

    function createNewGrade() {
      const grade = new GradeEntity()
      grade.eventId = currentEvent.id
      grade.fires -= 5
      grade.userId = userId
      grade.projectId = projectId
      return grade
    }

    const currentEvent = await this.eventRepository.findOneBy({
      status: IEventStatus.OPEN_VOTE.toString() || IEventStatus.OPENED.toString()
    })
    if (currentEvent.status === IEventStatus.OPEN_VOTE.toString()) {
      const project = await this.projectRepository.findOneBy({ id: projectId })
      const grade = await this.gradeRepository.findOneBy({ userId: userId, eventId: currentEvent.id })
      const gradeToSave = grade ? patchGrade(grade) : createNewGrade()
      project.rating += 5
      await this.gradeRepository.save(gradeToSave)
      await this.projectRepository.save(project)
      return {grade,project}
    }
  }

  createResponse(grade: GradeEntity): GradeResponse {
    return {
      grade: grade
    }
  }
}

