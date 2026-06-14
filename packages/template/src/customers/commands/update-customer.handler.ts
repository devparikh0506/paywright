import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Customer } from '../entities/customer.entity';
import { UpdateCustomerCommand } from './update-customer.command';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler
  implements ICommandHandler<UpdateCustomerCommand>
{
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<Customer> {
    const { id, dto } = command;

    const customer = await this.customers.findOneBy({ id });
    if (!customer) throw new NotFoundException(`Customer ${id} not found`);

    await this.stripe.updateCustomer(customer.stripeCustomerId, {
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
    });

    return this.customers.save({ ...customer, ...dto });
  }
}
