import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Repository } from 'typeorm';

import { Customer } from '../../customers/entities/customer.entity';
import { StripeService } from '../../stripe/stripe.service';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { CreatePaymentCommand } from './create-payment.command';

export class CreatePaymentResult {
  @ApiProperty({ type: Payment })
  payment: Payment;

  /** One-time credential for the frontend to confirm the payment — never persisted */
  @ApiProperty({ type: String, nullable: true })
  clientSecret: string | null;
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<CreatePaymentResult> {
    const { customerId, amount, currency, idempotencyKey } = command.dto;

    const customer = await this.customers.findOneBy({ id: customerId });
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const intent = await this.stripe.createPaymentIntent(
      {
        amount,
        currency,
        customer: customer.stripeCustomerId,
        automatic_payment_methods: { enabled: true },
      },
      idempotencyKey ? { idempotencyKey } : undefined,
    );

    // An idempotency-key retry returns the SAME intent from Stripe — return
    // the existing row instead of violating the unique constraint
    const existing = await this.payments.findOneBy({
      stripePaymentIntentId: intent.id,
    });
    if (existing) {
      return { payment: existing, clientSecret: intent.client_secret };
    }

    const payment = await this.payments.save(
      this.payments.create({
        stripePaymentIntentId: intent.id,
        customerId,
        amount,
        currency,
        status: intent.status as PaymentStatus,
      }),
    );

    return { payment, clientSecret: intent.client_secret };
  }
}
