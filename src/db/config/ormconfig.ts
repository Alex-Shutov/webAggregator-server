import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as process from 'process';
import { SeederOptions } from 'typeorm-extension';

dotenvConfig({ path: !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}` });

export const dataSourceOptions:DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: +`${process.env.DATABASE_PORT || 5433}`,
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [path.resolve(__dirname, '..', '..') + '/**/*.entity{.ts,.js}'],
  migrations: [
    path.resolve(__dirname, '..', '..') + '/db/migrations/*{.ts,.js}',
  ],
  synchronize: false,
  
  // cli: {
  //   migrationsDir: path.resolve(__dirname, '..') + '/migrations',
  // },
  factories: [path.resolve(__dirname, '..', '..') + '/db/factories/*{.ts,.js}'],
  seeds:[path.resolve(__dirname, '..', '..') + '/db/seeds/*{.ts,.js}']
};


export default registerAs('typeorm', () => dataSourceOptions);
export const connectionSource = new DataSource(dataSourceOptions);
