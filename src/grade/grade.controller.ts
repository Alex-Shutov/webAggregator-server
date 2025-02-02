import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { User } from '@user/decorators/user.decorator';

@Controller('rate')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {
  }

  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(id);
  }

  @Get('?')

  findByQuery(@Query('eventId') eventId: string, @Query('projectId') projId: string, @User('id') userId: string) {
    return this.gradeService.findAllByQuery(eventId,userId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    // const grade = this.gradeService.update(id, updateGradeDto);
    // return this.gradeService.createResponse(grade)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeService.remove(+id);
  }

  @Post('/project/:projectId?')
  async rateProject(@Param('projectId') projectId: string,
                    @Query('eventId') eventId:string,
                    @User('id') userId: string,
  ) {
    const grade = await this.gradeService.rateProject(projectId, userId,eventId);
    return this.gradeService.createResponse(grade.grade);
  }
}
