import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { GetCustomerQuery } from './get-customer.query';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customers.findOneBy({ id: query.id });
    if (!customer) throw new NotFoundException(`Customer ${query.id} not found`);
    return customer;
  }
}
