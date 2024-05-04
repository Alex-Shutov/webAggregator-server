import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { CategoryEntity } from '../../categories/entities/category.entity';

export default setSeederFactory(CategoryEntity, () => {
  const category = new CategoryEntity();

  category.name = faker.lorem.sentence();
  category.children=[]
  category.children = getCategories(category)
  return category;
});

const getCategories = (parent:CategoryEntity) => {
  const childCategories:CategoryEntity[] = []
  const randomNumberByFaker = faker.lorem.words({min:1,max:6}).split(' ')
  randomNumberByFaker.forEach(()=>{
    const newCategory = new CategoryEntity()
    newCategory.name = faker.lorem.word()
    newCategory.parentId = parent.id
    newCategory.parent = parent
    parent.children.push(newCategory)
    childCategories.push(newCategory)
  })
  return childCategories
}