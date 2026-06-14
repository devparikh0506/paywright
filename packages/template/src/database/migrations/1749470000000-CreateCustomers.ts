import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomers1749470000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE customers (
        id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stripe_customer_id VARCHAR NOT NULL UNIQUE,
        email              VARCHAR NOT NULL,
        name               VARCHAR,
        phone              VARCHAR,
        created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE customers`);
  }
}
