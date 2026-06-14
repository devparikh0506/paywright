import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Subscription,
  SubscriptionStatus,
} from '../../subscriptions/entities/subscription.entity';
import { SyncSubscriptionCommand } from './sync-subscription.command';

const unixToDate = (seconds: number | null | undefined): Date | null =>
  seconds ? new Date(seconds * 1000) : null;

@CommandHandler(SyncSubscriptionCommand)
export class SyncSubscriptionHandler
  implements ICommandHandler<SyncSubscriptionCommand>
{
  private readonly logger = new Logger(SyncSubscriptionHandler.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptions: Repository<Subscription>,
  ) {}

  async execute(command: SyncSubscriptionCommand): Promise<void> {
    const stripeSub = command.subscription;

    const subscription = await this.subscriptions.findOneBy({
      stripeSubscriptionId: stripeSub.id,
    });
    if (!subscription) {
      this.logger.warn(`No local subscription for ${stripeSub.id} — skipped`);
      return;
    }

    // Basil: billing period lives on the subscription item
    const item = stripeSub.items.data[0];

    await this.subscriptions.save({
      ...subscription,
      status: stripeSub.status as SubscriptionStatus,
      currentPeriodStart: unixToDate(item?.current_period_start),
      currentPeriodEnd: unixToDate(item?.current_period_end),
      trialEnd: unixToDate(stripeSub.trial_end),
    });
    this.logger.log(`Subscription ${subscription.id} → ${stripeSub.status}`);
  }
}
