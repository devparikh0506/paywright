import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptions1749510000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE subscriptions (
        id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stripe_subscription_id VARCHAR NOT NULL UNIQUE,
        customer_id            UUID NOT NULL REFERENCES customers(id),
        plan_id                UUID NOT NULL REFERENCES plans(id),
        status                 VARCHAR NOT NULL,
        current_period_start   TIMESTAMPTZ,
        current_period_end     TIMESTAMPTZ,
        trial_end              TIMESTAMPTZ,
        created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE subscriptions`);
  }
}
