import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Request } from 'express';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { SkipApiKey } from '../common/decorators/skip-api-key.decorator';
import { StripeService } from '../stripe/stripe.service';
import { WebhookEvent } from './entities/webhook-event.entity';
import { STRIPE_WEBHOOKS_QUEUE } from './webhooks.constants';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly stripe: StripeService,
    @InjectRepository(WebhookEvent)
    private readonly events: Repository<WebhookEvent>,
    @InjectQueue(STRIPE_WEBHOOKS_QUEUE)
    private readonly queue: Queue,
  ) {}

  /**
   * Verify → dedup → enqueue → 200. No business logic here: Stripe
   * retries anything that doesn't get a 2xx within ~10s, so the heavy
   * work happens in the background processor.
   */
  @Post('stripe')
  @SkipApiKey()
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    if (!signature || !request.rawBody) {
      throw new BadRequestException('Missing stripe-signature or raw body');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.constructWebhookEvent(request.rawBody, signature);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    // ON CONFLICT DO NOTHING: concurrent deliveries of the same event
    // race here and exactly one INSERT wins — no SELECT-then-INSERT gap
    const result = await this.events
      .createQueryBuilder()
      .insert()
      .values({ stripeEventId: event.id, type: event.type })
      .orIgnore()
      .execute();

    const isDuplicate = result.identifiers.length === 0;
    if (isDuplicate) {
      this.logger.log(`Duplicate event ${event.id} (${event.type}) — skipped`);
      return { received: true };
    }

    await this.queue.add(event.type, event, {
      jobId: event.id, // queue-level dedup as a second layer
    });

    return { received: true };
  }
}
