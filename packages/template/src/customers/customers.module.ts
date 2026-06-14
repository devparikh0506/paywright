import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StripeModule } from '../stripe/stripe.module';
import { CreateCustomerHandler } from './commands/create-customer.handler';
import { DeleteCustomerHandler } from './commands/delete-customer.handler';
import { UpdateCustomerHandler } from './commands/update-customer.handler';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { GetCustomerHandler } from './queries/get-customer.handler';
import { ListCustomersHandler } from './queries/list-customers.handler';

const CommandHandlers = [
  CreateCustomerHandler,
  UpdateCustomerHandler,
  DeleteCustomerHandler,
];
const QueryHandlers = [GetCustomerHandler, ListCustomersHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Customer]), StripeModule],
  controllers: [CustomersController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class CustomersModule {}
