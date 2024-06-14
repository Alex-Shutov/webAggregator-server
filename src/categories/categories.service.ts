import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from '@app/event/entities/event.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@app/categories/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoriesRepository:Repository<CategoryEntity>) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
