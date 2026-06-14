import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWebhookEventsAndInvoices1749520000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE webhook_events (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stripe_event_id VARCHAR NOT NULL UNIQUE,
        type            VARCHAR NOT NULL,
        status          VARCHAR NOT NULL DEFAULT 'received',
        error           VARCHAR,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE invoices (
        id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        stripe_invoice_id      VARCHAR NOT NULL UNIQUE,
        customer_id            UUID REFERENCES customers(id),
        stripe_customer_id     VARCHAR,
        stripe_subscription_id VARCHAR,
        amount_due             INTEGER NOT NULL,
        amount_paid            INTEGER NOT NULL,
        currency               VARCHAR(3) NOT NULL,
        status                 VARCHAR NOT NULL,
        hosted_invoice_url     VARCHAR,
        created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX idx_invoices_customer_id ON invoices(customer_id)`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE invoices`);
    await queryRunner.query(`DROP TABLE webhook_events`);
  }
}
