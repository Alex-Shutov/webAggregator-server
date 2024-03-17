import { Controller, Get } from '@nestjs/common';
import { TagService } from '@tag/tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagsService: TagService) {}
  @Get()
  async get(): Promise<any> {
    return this.tagsService.findAll();
  }
}
