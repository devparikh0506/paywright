import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Queue } from 'bullmq';
import type { Redis } from 'ioredis';

import { SkipApiKey } from '../common/decorators/skip-api-key.decorator';
import { STRIPE_WEBHOOKS_QUEUE } from '../webhooks/webhooks.constants';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    @InjectQueue(STRIPE_WEBHOOKS_QUEUE)
    private readonly queue: Queue,
  ) {}

  @Get()
  @SkipApiKey()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redisCheck(),
    ]);
  }

  /** Reuses the BullMQ connection instead of opening another Redis client */
  private async redisCheck(): Promise<HealthIndicatorResult> {
    try {
      // BullMQ types its client minimally; the runtime object is ioredis
      const client = (await this.queue.client) as unknown as Redis;
      await client.ping();
      return { redis: { status: 'up' } };
    } catch (error) {
      return {
        redis: { status: 'down', message: (error as Error).message },
      };
    }
  }
}
