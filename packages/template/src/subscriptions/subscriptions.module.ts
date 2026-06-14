import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from '../customers/entities/customer.entity';
import { Plan } from '../plans/entities/plan.entity';
import { StripeModule } from '../stripe/stripe.module';
import { CancelSubscriptionHandler } from './commands/cancel-subscription.handler';
import { CreateSubscriptionHandler } from './commands/create-subscription.handler';
import { Subscription } from './entities/subscription.entity';
import { GetSubscriptionHandler } from './queries/get-subscription.handler';
import { ListSubscriptionsHandler } from './queries/list-subscriptions.handler';
import { SubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Subscription, Customer, Plan]),
    StripeModule,
  ],
  controllers: [SubscriptionsController],
  providers: [
    CreateSubscriptionHandler,
    CancelSubscriptionHandler,
    GetSubscriptionHandler,
    ListSubscriptionsHandler,
  ],
})
export class SubscriptionsModule {}
