import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Customer } from '../entities/customer.entity';
import { DeleteCustomerCommand } from './delete-customer.command';

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler
  implements ICommandHandler<DeleteCustomerCommand>
{
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    private readonly stripe: StripeService,
  ) {}

  async execute(command: DeleteCustomerCommand): Promise<void> {
    const customer = await this.customers.findOneBy({ id: command.id });
    if (!customer) throw new NotFoundException(`Customer ${command.id} not found`);

    await this.stripe.deleteCustomer(customer.stripeCustomerId);
    await this.customers.delete({ id: command.id });
  }
}
