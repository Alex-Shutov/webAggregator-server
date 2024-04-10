import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ProjectEntity } from '../../project/entities/project.entity';

export default class ProjectSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const projectRepository = factoryManager.get(ProjectEntity);
    await projectRepository.saveMany(10);
  }
}