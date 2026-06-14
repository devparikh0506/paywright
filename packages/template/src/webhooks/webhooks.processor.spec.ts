import { CommandBus } from '@nestjs/cqrs';
import { Job } from 'bullmq';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { MetricsService } from '../metrics/metrics.service';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhooksProcessor } from './webhooks.processor';

const job = (type: string): Job<Stripe.Event> =>
  ({
    data: { id: 'evt_123', type, data: { object: {} } },
    attemptsMade: 0,
  }) as never;

describe('WebhooksProcessor', () => {
  let processor: WebhooksProcessor;
  let execute: jest.Mock;
  let update: jest.Mock;

  beforeEach(() => {
    execute = jest.fn().mockResolvedValue(undefined);
    update = jest.fn().mockResolvedValue(undefined);

    processor = new WebhooksProcessor(
      { execute } as unknown as CommandBus,
      { update } as unknown as Repository<WebhookEvent>,
      new MetricsService(),
    );
  });

  it('marks the event processed after a successful dispatch', async () => {
    await processor.process(job('payment_intent.succeeded'));

    expect(execute).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(
      { stripeEventId: 'evt_123' },
      { status: 'processed', error: null },
    );
  });

  it('rethrows a handler failure so BullMQ retries, and records it', async () => {
    execute.mockRejectedValue(new Error('db unavailable'));

    // The rethrow IS the retry mechanism — swallowing the error here
    // would mark the job complete and silently lose the state update
    await expect(
      processor.process(job('payment_intent.succeeded')),
    ).rejects.toThrow('db unavailable');

    expect(update).toHaveBeenCalledWith(
      { stripeEventId: 'evt_123' },
      { status: 'failed', error: 'db unavailable' },
    );
  });

  it('acknowledges unhandled event types without dispatching', async () => {
    await processor.process(job('account.updated'));

    expect(execute).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(
      { stripeEventId: 'evt_123' },
      { status: 'processed', error: null },
    );
  });
});
