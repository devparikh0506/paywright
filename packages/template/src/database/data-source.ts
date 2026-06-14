import 'dotenv/config';
import { DataSource } from 'typeorm';

/**
 * Used by the TypeORM CLI only (migration:generate / migration:run).
 * The app itself configures TypeORM via DatabaseModule.
 */
export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
