import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import {
  Subscription,
  SubscriptionStatus,
} from '../entities/subscription.entity';
import { CancelSubscriptionCommand } from './cancel-subscription.command';

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionHandler
  implements ICommandHandler<CancelSubscriptionCommand>
{
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptions: Repository<Subscription>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: CancelSubscriptionCommand): Promise<Subscription> {
    const subscription = await this.subscriptions.findOneBy({
      id: command.id,
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription ${command.id} not found`);
    }

    if (subscription.status === 'canceled') {
      throw new ConflictException('Subscription is already canceled');
    }

    const stripeSub = await this.stripe.cancelSubscription(
      subscription.stripeSubscriptionId,
    );

    return this.subscriptions.save({
      ...subscription,
      status: stripeSub.status as SubscriptionStatus,
    });
  }
}
