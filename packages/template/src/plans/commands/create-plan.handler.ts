import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Plan } from '../entities/plan.entity';
import { CreatePlanCommand } from './create-plan.command';

@CommandHandler(CreatePlanCommand)
export class CreatePlanHandler implements ICommandHandler<CreatePlanCommand> {
  constructor(
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: CreatePlanCommand): Promise<Plan> {
    const { name, amount, currency, interval } = command.dto;

    const product = await this.stripe.createProduct({ name });
    const price = await this.stripe.createPrice({
      product: product.id,
      unit_amount: amount,
      currency,
      recurring: { interval },
    });

    return this.plans.save(
      this.plans.create({
        stripeProductId: product.id,
        stripePriceId: price.id,
        name,
        amount,
        currency,
        interval,
        active: true,
      }),
    );
  }
}
