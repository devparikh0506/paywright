import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Repository } from 'typeorm';

import { Payment } from '../entities/payment.entity';
import { ListPaymentsQuery } from './list-payments.query';

export class PaymentList {
  @ApiProperty({ type: [Payment] })
  data: Payment[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

@QueryHandler(ListPaymentsQuery)
export class ListPaymentsHandler implements IQueryHandler<ListPaymentsQuery> {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
  ) {}

  async execute(query: ListPaymentsQuery): Promise<PaymentList> {
    const { customerId, page, limit } = query;
    const [data, total] = await this.payments.findAndCount({
      where: customerId ? { customerId } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }
}
