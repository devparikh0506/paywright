import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { CancelPaymentCommand } from './cancel-payment.command';

/** Stripe only allows cancellation before the charge is captured */
const CANCELABLE_STATUSES: PaymentStatus[] = [
  'requires_payment_method',
  'requires_confirmation',
  'requires_action',
  'processing',
];

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentHandler
  implements ICommandHandler<CancelPaymentCommand>
{
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: CancelPaymentCommand): Promise<Payment> {
    const payment = await this.payments.findOneBy({ id: command.id });
    if (!payment) {
      throw new NotFoundException(`Payment ${command.id} not found`);
    }

    if (!CANCELABLE_STATUSES.includes(payment.status)) {
      throw new ConflictException(
        `Payment in status '${payment.status}' cannot be canceled — refund it instead`,
      );
    }

    const intent = await this.stripe.cancelPaymentIntent(
      payment.stripePaymentIntentId,
    );

    return this.payments.save({
      ...payment,
      status: intent.status as PaymentStatus,
    });
  }
}
