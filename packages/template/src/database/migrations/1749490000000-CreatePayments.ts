import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayments1749490000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE payments (
        id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stripe_payment_intent_id VARCHAR NOT NULL UNIQUE,
        customer_id              UUID NOT NULL REFERENCES customers(id),
        amount                   INTEGER NOT NULL,
        currency                 VARCHAR(3) NOT NULL,
        status                   VARCHAR NOT NULL,
        created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX idx_payments_customer_id ON payments(customer_id)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE payments`);
  }
}
