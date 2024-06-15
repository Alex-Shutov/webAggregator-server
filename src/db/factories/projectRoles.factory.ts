import { ProjectRolesEntity } from '../../roles/entities/projectRoles.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export default setSeederFactory(ProjectRolesEntity, () => {
  const userProjectRole = new ProjectRolesEntity();

  userProjectRole.role = faker.string.fromCharacters(['developer', 'designer', 'manager']) ;

  return userProjectRole;
});