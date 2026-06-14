import { BadRequestException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';

import { StripeService } from '../stripe/stripe.service';
import { WebhookEvent } from './entities/webhook-event.entity';
import { WebhooksController } from './webhooks.controller';

const stripeEvent = { id: 'evt_123', type: 'payment_intent.succeeded' };

describe('WebhooksController', () => {
  let controller: WebhooksController;
  let insertExecute: jest.Mock;
  let queueAdd: jest.Mock;
  let constructEvent: jest.Mock;

  const request = (raw?: string) =>
    ({ rawBody: raw ? Buffer.from(raw) : undefined }) as never;

  beforeEach(() => {
    constructEvent = jest.fn().mockReturnValue(stripeEvent);
    insertExecute = jest.fn().mockResolvedValue({ identifiers: [{ id: 'x' }] });
    queueAdd = jest.fn();

    const stripe = {
      constructWebhookEvent: constructEvent,
    } as unknown as StripeService;
    const events = {
      createQueryBuilder: () => ({
        insert: () => ({
          values: () => ({ orIgnore: () => ({ execute: insertExecute }) }),
        }),
      }),
    } as unknown as Repository<WebhookEvent>;
    const queue = { add: queueAdd } as unknown as Queue;

    controller = new WebhooksController(stripe, events, queue);
  });

  it('verifies, records, and enqueues a new event', async () => {
    const result = await controller.handleStripeWebhook(request('{}'), 'sig');

    expect(result).toEqual({ received: true });
    expect(queueAdd).toHaveBeenCalledWith(
      stripeEvent.type,
      stripeEvent,
      expect.objectContaining({ jobId: stripeEvent.id }),
    );
  });

  it('skips enqueueing duplicate events but still returns 200', async () => {
    // ON CONFLICT DO NOTHING returns no identifiers for a duplicate
    insertExecute.mockResolvedValue({ identifiers: [] });

    const result = await controller.handleStripeWebhook(request('{}'), 'sig');

    expect(result).toEqual({ received: true });
    expect(queueAdd).not.toHaveBeenCalled();
  });

  it('rejects an invalid signature with 400', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('bad signature');
    });

    await expect(
      controller.handleStripeWebhook(request('{}'), 'forged'),
    ).rejects.toThrow(BadRequestException);
    expect(queueAdd).not.toHaveBeenCalled();
  });

  it('rejects a request without raw body', async () => {
    await expect(
      controller.handleStripeWebhook(request(), 'sig'),
    ).rejects.toThrow(BadRequestException);
  });
});
