import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Plan } from '../entities/plan.entity';
import { ArchivePlanCommand } from './archive-plan.command';

@CommandHandler(ArchivePlanCommand)
export class ArchivePlanHandler implements ICommandHandler<ArchivePlanCommand> {
  constructor(
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: ArchivePlanCommand): Promise<Plan> {
    const plan = await this.plans.findOneBy({ id: command.id });
    if (!plan) throw new NotFoundException(`Plan ${command.id} not found`);

    try {
      await this.stripe.archivePrice(plan.stripePriceId);
    } catch (error) {
      if (
        error instanceof Stripe.errors.StripeInvalidRequestError &&
        error.code === 'resource_missing'
      ) {
        // Price was deleted on Stripe's side — the local row is stale
        throw new NotFoundException(
          `Stripe price ${plan.stripePriceId} no longer exists`,
        );
      }
      throw error;
    }

    return this.plans.save({ ...plan, active: false });
  }
}
