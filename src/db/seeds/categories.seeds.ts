import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';

export default class CategoriesSeeds implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const categoryRepository = factoryManager.get(CategoryEntity);
    await categoryRepository.saveMany(10);
  }
}