import { UserEntity } from '../../user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { uuid } from 'uuidv4';

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();

  user.id= uuid()
  user.name = faker.person.firstName()
  user.surname = faker.person.lastName()
  user.email = faker.internet.email()
  user.password = '12345'

  return user;
});