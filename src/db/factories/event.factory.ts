import { EventEntity } from '../../event/entities/event.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { IEventStatus } from '../../event/constants/event.constants';

export default setSeederFactory(EventEntity, () => {
  const event = new EventEntity();

  event.name = faker.lorem.sentence();
  event.status = IEventStatus.CLOSED
  event.finishDate = faker.date.between({ from: '2024-04-31T00:00:00.000Z', to: '2024-05-31T00:00:00.000Z' })
  return event;
});