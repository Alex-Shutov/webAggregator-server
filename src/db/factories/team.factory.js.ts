import { TeamEntity } from '../../team/entities/team.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export default setSeederFactory(TeamEntity, () => {
  const team = new TeamEntity();

  team.name = faker.company.name();

  return team;
});