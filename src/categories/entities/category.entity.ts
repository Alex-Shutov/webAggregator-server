import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  parentId: string | null;

  @ManyToOne(() => CategoryEntity, (category) => category.children, { onDelete: 'CASCADE' })
  parent: CategoryEntity | null;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];

}