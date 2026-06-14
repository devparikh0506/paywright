import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlans1749480000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE plans (
        id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stripe_product_id VARCHAR NOT NULL,
        stripe_price_id   VARCHAR NOT NULL UNIQUE,
        name              VARCHAR NOT NULL,
        amount            INTEGER NOT NULL,
        currency          VARCHAR(3) NOT NULL,
        interval          VARCHAR NOT NULL,
        active            BOOLEAN NOT NULL DEFAULT true,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE plans`);
  }
}
