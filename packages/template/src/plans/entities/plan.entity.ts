import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PlanInterval = 'month' | 'year';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'stripe_product_id' })
  stripeProductId: string;

  @Column({ name: 'stripe_price_id', unique: true })
  stripePriceId: string;

  @Column()
  name: string;

  /** Smallest currency unit (cents) — never floating point */
  @Column({ type: 'integer' })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'varchar' })
  interval: PlanInterval;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
