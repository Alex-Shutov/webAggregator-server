import { ProjectEntity } from '../../project/entities/project.entity';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { TeamEntity } from '../../team/entities/team.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { LEVEL_LIST, PROGRAM_LIST, ROLES_LIST } from '../../user/constanst/user.constants';
import { ProjectRolesEntity } from '../../roles/entities/projectRoles.entity';
import { PROJECT_STATUSES } from '../../project/constants/project.constants';

export default setSeederFactory(ProjectEntity, () => {
  const project = new ProjectEntity();
  const category = new CategoryEntity()
  // const team = createTeam(project.id)
  const fakeCategories = getCategories(project.id,category)
  project.name = faker.company.catchPhrase();
  project.description = faker.lorem.paragraph();
  project.howToPlay = faker.lorem.paragraph();
  project.gitLink = faker.internet.url();
  project.rating = faker.datatype.number({ min: 1, max: 5 });
  project.categoriesId = fakeCategories
  project.status = PROJECT_STATUSES.CHECK
  // project.team = team
  return project;
});

const getCategories = (projId:string,parent:CategoryEntity) => {
  const childCategories:CategoryEntity[] = []
  const randomNumberByFaker = faker.lorem.words({min:1,max:6}).split(' ')
  randomNumberByFaker.forEach(()=>{
    const newCategory = new CategoryEntity()
    newCategory.name = faker.lorem.word()
    newCategory.parentId = parent.id
    newCategory.parent = parent
    parent.children = []
    parent.children.push(newCategory)
    childCategories.push(newCategory)
  })
  return childCategories
}

const createTeam = (projectId:string) => {
  const team = new TeamEntity();
  team.name = faker.company.name();
  team.projectId = projectId
  const users = createFakeUsers(team)
  // team.membersIds = users.map(el=>el.id)
  // team.projectRolesIds = users.flatMap(el=>el.projectRoles.map(y=>y.id))
  return team;
}

const createFakeUsers = (team:TeamEntity) => {
  const users:UserEntity[] = []
  const randomNumberByFaker = faker.lorem.words({min:1,max:6}).split(' ')
  randomNumberByFaker.forEach(()=>{
    const user = new UserEntity()
    user.name = faker.person.firstName()
    user.surname = faker.person.lastName()
    user.patronymic = faker.person.middleName()
    user.email = faker.internet.email()
    user.password = '12345'
    user.group = "РИ-400000"
    user.role = ROLES_LIST.STUDENT
    user.contacts = faker.phone.number()
    user.level = LEVEL_LIST.SECOND
    user.program = PROGRAM_LIST['09.03.01']
    // user.projectRoles = createFakeProjectRolesByUsers([user],team)
    users.push(user)
  })
  return users

}

const createFakeProjectRolesByUsers = (users:UserEntity[],team) => {
  const projRoles:ProjectRolesEntity[] = []
  users.forEach((user)=>{
    const userProjectRole = new ProjectRolesEntity();
    userProjectRole.user = user
    userProjectRole.team = team
    userProjectRole.role = faker.string.fromCharacters(['developer', 'designer', 'manager']) ;

    return userProjectRole;
  })
  return projRoles
}


