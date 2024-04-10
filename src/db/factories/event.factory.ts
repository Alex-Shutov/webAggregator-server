import { EventEntity } from '../../event/entities/event.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export default setSeederFactory(EventEntity, () => {
  const event = new EventEntity();

  event.name = faker.lorem.sentence();

  return event;
});