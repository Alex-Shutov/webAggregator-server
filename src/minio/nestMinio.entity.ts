import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nestMinios' })
export class NestMinioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
