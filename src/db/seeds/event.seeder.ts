import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { EventEntity } from '../../event/entities/event.entity';

export default class EventSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const eventRepository = factoryManager.get(EventEntity);
    await eventRepository.saveMany(5);
  }
}