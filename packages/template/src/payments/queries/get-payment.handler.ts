import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from '../entities/payment.entity';
import { GetPaymentQuery } from './get-payment.query';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
  ) {}

  async execute(query: GetPaymentQuery): Promise<Payment> {
    const payment = await this.payments.findOneBy({ id: query.id });
    if (!payment) throw new NotFoundException(`Payment ${query.id} not found`);
    return payment;
  }
}
