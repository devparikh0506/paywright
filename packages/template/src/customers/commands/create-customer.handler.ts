import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerCommand } from './create-customer.command';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand>
{
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<Customer> {
    const { email, name, phone } = command.dto;

    const stripeCustomer = await this.stripe.createCustomer({
      email,
      name: name ?? undefined,
      phone: phone ?? undefined,
    });

    return this.customers.save(
      this.customers.create({
        stripeCustomerId: stripeCustomer.id,
        email,
        name: name ?? null,
        phone: phone ?? null,
      }),
    );
  }
}
