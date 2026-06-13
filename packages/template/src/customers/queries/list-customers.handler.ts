import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { ListCustomersQuery } from './list-customers.query';

export class CustomerList {
  @ApiProperty({ type: [Customer] })
  data: Customer[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<ListCustomersQuery> {
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
  ) {}

  async execute(query: ListCustomersQuery): Promise<CustomerList> {
    const { page, limit } = query;
    const [data, total] = await this.customers.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }
}
