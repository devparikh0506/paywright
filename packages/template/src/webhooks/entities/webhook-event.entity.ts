import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WebhookEventStatus = 'received' | 'processed' | 'failed';

/**
 * Every Stripe event lands here exactly once — the unique constraint on
 * stripe_event_id is what makes webhook processing idempotent.
 */
@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'stripe_event_id', unique: true })
  stripeEventId: string;

  @Column()
  type: string;

  @Column({ type: 'varchar', default: 'received' })
  status: WebhookEventStatus;

  @Column({ type: 'varchar', nullable: true })
  error: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
