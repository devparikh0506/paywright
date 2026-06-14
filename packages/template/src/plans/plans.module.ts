import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StripeModule } from '../stripe/stripe.module';
import { ArchivePlanHandler } from './commands/archive-plan.handler';
import { CreatePlanHandler } from './commands/create-plan.handler';
import { Plan } from './entities/plan.entity';
import { PlansController } from './plans.controller';
import { GetPlanHandler } from './queries/get-plan.handler';
import { ListPlansHandler } from './queries/list-plans.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Plan]), StripeModule],
  controllers: [PlansController],
  providers: [
    CreatePlanHandler,
    ArchivePlanHandler,
    GetPlanHandler,
    ListPlansHandler,
  ],
})
export class PlansModule {}
