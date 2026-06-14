import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment, PaymentStatus } from '../../payments/entities/payment.entity';
import { SyncPaymentStatusCommand } from './sync-payment-status.command';

@CommandHandler(SyncPaymentStatusCommand)
export class SyncPaymentStatusHandler
  implements ICommandHandler<SyncPaymentStatusCommand>
{
  private readonly logger = new Logger(SyncPaymentStatusHandler.name);

  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
  ) {}

  async execute(command: SyncPaymentStatusCommand): Promise<void> {
    const intent = command.paymentIntent;

    const payment = await this.payments.findOneBy({
      stripePaymentIntentId: intent.id,
    });
    if (!payment) {
      // Payment created outside this service (e.g. Stripe dashboard) —
      // nothing local to sync
      this.logger.warn(`No local payment for intent ${intent.id} — skipped`);
      return;
    }

    // Refunds are tracked locally and synchronously — don't let a late
    // payment_intent event overwrite 'refunded' back to 'succeeded'
    if (payment.status === 'refunded') return;

    await this.payments.save({
      ...payment,
      status: intent.status as PaymentStatus,
    });
    this.logger.log(`Payment ${payment.id} → ${intent.status}`);
  }
}
