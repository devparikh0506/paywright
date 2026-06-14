import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Read-only local cache of Stripe invoices, populated exclusively by
 * webhooks. Never written by API endpoints — Stripe owns invoicing.
 */
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'stripe_invoice_id', unique: true })
  stripeInvoiceId: string;

  @Index()
  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId: string | null;

  @Column({ name: 'stripe_customer_id', type: 'varchar', nullable: true })
  stripeCustomerId: string | null;

  @Column({ name: 'stripe_subscription_id', type: 'varchar', nullable: true })
  stripeSubscriptionId: string | null;

  @Column({ name: 'amount_due', type: 'integer' })
  amountDue: number;

  @Column({ name: 'amount_paid', type: 'integer' })
  amountPaid: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ name: 'hosted_invoice_url', type: 'varchar', nullable: true })
  hostedInvoiceUrl: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
