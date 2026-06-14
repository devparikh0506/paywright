import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Payment } from '../entities/payment.entity';
import { RefundPaymentCommand } from './refund-payment.command';

@CommandHandler(RefundPaymentCommand)
export class RefundPaymentHandler
  implements ICommandHandler<RefundPaymentCommand>
{
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: RefundPaymentCommand): Promise<Payment> {
    const payment = await this.payments.findOneBy({ id: command.id });
    if (!payment) {
      throw new NotFoundException(`Payment ${command.id} not found`);
    }

    if (payment.status !== 'succeeded') {
      throw new ConflictException(
        `Only succeeded payments can be refunded (status: '${payment.status}')`,
      );
    }

    await this.stripe.createRefund({
      payment_intent: payment.stripePaymentIntentId,
    });

    return this.payments.save({ ...payment, status: 'refunded' });
  }
}
