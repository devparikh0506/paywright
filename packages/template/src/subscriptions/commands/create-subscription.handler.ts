import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { Customer } from '../../customers/entities/customer.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { StripeService } from '../../stripe/stripe.service';
import {
  Subscription,
  SubscriptionStatus,
} from '../entities/subscription.entity';
import { CreateSubscriptionCommand } from './create-subscription.command';

export class CreateSubscriptionResult {
  @ApiProperty({ type: Subscription })
  subscription: Subscription;

  /**
   * Confirm the first invoice's payment on the frontend with this —
   * null when a trial defers the first charge. Never persisted.
   */
  @ApiProperty({ type: String, nullable: true })
  clientSecret: string | null;
}

const unixToDate = (seconds: number | null | undefined): Date | null =>
  seconds ? new Date(seconds * 1000) : null;

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionHandler
  implements ICommandHandler<CreateSubscriptionCommand>
{
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptions: Repository<Subscription>,
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
    private readonly stripe: StripeService,
  ) {}

  async execute(
    command: CreateSubscriptionCommand,
  ): Promise<CreateSubscriptionResult> {
    const { customerId, planId, trialPeriodDays, idempotencyKey } = command.dto;

    const customer = await this.customers.findOneBy({ id: customerId });
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    const plan = await this.plans.findOneBy({ id: planId });
    if (!plan) throw new NotFoundException(`Plan ${planId} not found`);
    if (!plan.active) {
      throw new ConflictException(`Plan ${planId} is archived`);
    }

    let stripeSub: Stripe.Subscription;
    try {
      stripeSub = await this.stripe.createSubscription(
        {
          customer: customer.stripeCustomerId,
          items: [{ price: plan.stripePriceId }],
          // Create the subscription + first invoice without charging; the
          // frontend confirms the payment with the returned client secret
          payment_behavior: 'default_incomplete',
          trial_period_days: trialPeriodDays,
          // Basil: the client secret lives on the invoice's confirmation
          // secret and only exists in the response when expanded
          expand: ['latest_invoice.confirmation_secret'],
        },
        idempotencyKey ? { idempotencyKey } : undefined,
      );
    } catch (error) {
      if (
        error instanceof Stripe.errors.StripeInvalidRequestError &&
        error.code === 'resource_missing'
      ) {
        // A local row references a Stripe object deleted on Stripe's side
        throw new ConflictException(
          `Stripe rejected the reference '${error.param}': ${error.message}`,
        );
      }
      throw error;
    }

    // Idempotency-key retry: Stripe returned an existing subscription
    const existing = await this.subscriptions.findOneBy({
      stripeSubscriptionId: stripeSub.id,
    });
    if (existing) {
      return {
        subscription: existing,
        clientSecret: extractClientSecret(stripeSub),
      };
    }

    // Basil: billing period fields moved from the subscription to its items
    const item = stripeSub.items.data[0];

    const subscription = await this.subscriptions.save(
      this.subscriptions.create({
        stripeSubscriptionId: stripeSub.id,
        customerId,
        planId,
        status: stripeSub.status as SubscriptionStatus,
        currentPeriodStart: unixToDate(item?.current_period_start),
        currentPeriodEnd: unixToDate(item?.current_period_end),
        trialEnd: unixToDate(stripeSub.trial_end),
      }),
    );

    return { subscription, clientSecret: extractClientSecret(stripeSub) };
  }
}

function extractClientSecret(sub: Stripe.Subscription): string | null {
  const invoice = sub.latest_invoice;
  if (!invoice || typeof invoice === 'string') return null;
  return invoice.confirmation_secret?.client_secret ?? null;
}
