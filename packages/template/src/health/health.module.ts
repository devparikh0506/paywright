import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { STRIPE_WEBHOOKS_QUEUE } from '../webhooks/webhooks.constants';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    // Same queue name as WebhooksModule — Nest reuses the registration,
    // this just makes the Queue injectable here for the Redis ping
    BullModule.registerQueue({ name: STRIPE_WEBHOOKS_QUEUE }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
