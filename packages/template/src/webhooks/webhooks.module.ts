import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from '../customers/entities/customer.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { MetricsModule } from '../metrics/metrics.module';
import { Payment } from '../payments/entities/payment.entity';
import { StripeModule } from '../stripe/stripe.module';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SyncPaymentStatusHandler } from './commands/sync-payment-status.handler';
import { SyncSubscriptionHandler } from './commands/sync-subscription.handler';
import { UpsertInvoiceHandler } from './commands/upsert-invoice.handler';
import { WebhookEvent } from './entities/webhook-event.entity';
import { STRIPE_WEBHOOKS_QUEUE } from './webhooks.constants';
import { WebhooksController } from './webhooks.controller';
import { WebhooksProcessor } from './webhooks.processor';

const RETRY_ATTEMPTS = 5;
const RETRY_BASE_DELAY_MS = 1_000;

@Module({
  imports: [
    CqrsModule,
    StripeModule,
    MetricsModule,
    TypeOrmModule.forFeature([
      WebhookEvent,
      Payment,
      Subscription,
      Invoice,
      Customer,
    ]),
    BullModule.registerQueue({
      name: STRIPE_WEBHOOKS_QUEUE,
      defaultJobOptions: {
        attempts: RETRY_ATTEMPTS,
        backoff: { type: 'exponential', delay: RETRY_BASE_DELAY_MS },
        removeOnComplete: true,
        removeOnFail: false, // exhausted jobs stay inspectable in Redis
      },
    }),
  ],
  controllers: [WebhooksController],
  providers: [
    WebhooksProcessor,
    SyncPaymentStatusHandler,
    SyncSubscriptionHandler,
    UpsertInvoiceHandler,
  ],
})
export class WebhooksModule {}
