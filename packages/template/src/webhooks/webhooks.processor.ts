import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { MetricsService } from '../metrics/metrics.service';
import { SyncPaymentStatusCommand } from './commands/sync-payment-status.command';
import { SyncSubscriptionCommand } from './commands/sync-subscription.command';
import { UpsertInvoiceCommand } from './commands/upsert-invoice.command';
import { WebhookEvent } from './entities/webhook-event.entity';
import { STRIPE_WEBHOOKS_QUEUE } from './webhooks.constants';

@Processor(STRIPE_WEBHOOKS_QUEUE)
export class WebhooksProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhooksProcessor.name);

  constructor(
    private readonly commandBus: CommandBus,
    @InjectRepository(WebhookEvent)
    private readonly events: Repository<WebhookEvent>,
    private readonly metrics: MetricsService,
  ) {
    super();
  }

  async process(job: Job<Stripe.Event>): Promise<void> {
    const event = job.data;

    try {
      // Awaited on purpose: a throwing handler must fail the job so
      // BullMQ retries — fire-and-forget would silently lose updates
      await this.dispatch(event);
      await this.events.update(
        { stripeEventId: event.id },
        { status: 'processed', error: null },
      );
      this.metrics.recordWebhookEvent('processed');
      if (event.type === 'payment_intent.succeeded') {
        this.metrics.recordPaymentSucceeded();
      }
      if (event.type === 'payment_intent.payment_failed') {
        this.metrics.recordPaymentFailed();
      }
    } catch (error) {
      const message = (error as Error).message;
      this.metrics.recordWebhookEvent('failed');
      await this.events.update(
        { stripeEventId: event.id },
        { status: 'failed', error: message },
      );
      this.logger.error(
        `Event ${event.id} (${event.type}) attempt ${job.attemptsMade + 1} failed: ${message}`,
      );
      throw error; // rethrow so BullMQ schedules the retry
    }
  }

  private dispatch(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        return this.commandBus.execute(
          new SyncPaymentStatusCommand(event.data.object),
        );

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        return this.commandBus.execute(
          new SyncSubscriptionCommand(event.data.object),
        );

      case 'invoice.paid':
      case 'invoice.payment_failed':
      case 'invoice.finalized':
        return this.commandBus.execute(
          new UpsertInvoiceCommand(event.data.object),
        );

      default:
        // Stripe sends every event type the endpoint is subscribed to —
        // unhandled ones are recorded in webhook_events and acknowledged
        this.logger.log(`No handler for ${event.type} — acknowledged`);
        return Promise.resolve();
    }
  }
}
