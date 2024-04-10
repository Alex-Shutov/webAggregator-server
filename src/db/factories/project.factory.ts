import { ProjectEntity } from '../../project/entities/project.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';

export default setSeederFactory(ProjectEntity, () => {
  const project = new ProjectEntity();

  project.name = faker.company.catchPhrase();
  project.description = faker.lorem.paragraph();
  project.howToPlay = faker.lorem.paragraph();
  project.gitLink = faker.internet.url();
  project.screenshots = [faker.image.url(), faker.image.url()];
  project.rating = faker.datatype.number({ min: 1, max: 5 });

  return project;
});