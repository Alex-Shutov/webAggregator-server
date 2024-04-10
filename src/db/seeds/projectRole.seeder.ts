import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ProjectRolesEntity } from '../../project/entities/projectRoles.entity';

export default class UserProjectRoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userProjectRoleRepository = factoryManager.get(ProjectRolesEntity);
    await userProjectRoleRepository.saveMany(20);
  }
}