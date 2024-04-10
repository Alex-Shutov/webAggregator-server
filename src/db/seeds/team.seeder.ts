import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { TeamEntity } from '../../team/entities/team.entity';

export default class TeamSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const teamRepository = factoryManager.get(TeamEntity);
    await teamRepository.saveMany(5);
  }
}