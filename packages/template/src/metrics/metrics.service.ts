import { Injectable } from '@nestjs/common';
import { Counter, Registry } from 'prom-client';

import { WebhookEventStatus } from '../webhooks/entities/webhook-event.entity';

/**
 * Three business counters on a private registry — no default Node.js
 * metrics until someone needs them.
 */
@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  private readonly paymentsSucceeded = new Counter({
    name: 'payments_succeeded_total',
    help: 'Payments confirmed succeeded via Stripe webhooks',
    registers: [this.registry],
  });

  private readonly paymentsFailed = new Counter({
    name: 'payments_failed_total',
    help: 'Payment failures reported via Stripe webhooks',
    registers: [this.registry],
  });

  private readonly webhookEventsProcessed = new Counter({
    name: 'webhook_events_processed_total',
    help: 'Stripe webhook events handled by the background processor',
    labelNames: ['status'] as const,
    registers: [this.registry],
  });

  recordPaymentSucceeded(): void {
    this.paymentsSucceeded.inc();
  }

  recordPaymentFailed(): void {
    this.paymentsFailed.inc();
  }

  recordWebhookEvent(status: WebhookEventStatus): void {
    this.webhookEventsProcessed.inc({ status });
  }

  /** Prometheus text exposition format */
  metrics(): Promise<string> {
    return this.registry.metrics();
  }

  get contentType(): string {
    return this.registry.contentType;
  }
}
