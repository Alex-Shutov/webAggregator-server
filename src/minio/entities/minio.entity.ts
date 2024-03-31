import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'minio' })
export class MinioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
