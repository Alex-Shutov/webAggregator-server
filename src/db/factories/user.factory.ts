import { UserEntity } from '../../user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { LEVEL_LIST, PROGRAM_LIST, ROLES_LIST } from '../../user/constanst/user.constants';

export default setSeederFactory(UserEntity, (faker) => {
  const user = new UserEntity();

  user.name = faker.person.firstName()
  user.surname = faker.person.lastName()
  user.email = faker.internet.email()
  user.password = '12345'
  user.group = "РИ-400000"
  user.role = ROLES_LIST.STUDENT
  user.contacts = faker.phone.number()
  user.level = LEVEL_LIST.SECOND
  user.program = PROGRAM_LIST['09.03.01']
  return user;
});