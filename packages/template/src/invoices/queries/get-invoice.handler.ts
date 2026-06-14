import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from '../entities/invoice.entity';
import { GetInvoiceQuery } from './get-invoice.query';

@QueryHandler(GetInvoiceQuery)
export class GetInvoiceHandler implements IQueryHandler<GetInvoiceQuery> {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoices: Repository<Invoice>,
  ) {}

  async execute(query: GetInvoiceQuery): Promise<Invoice> {
    const invoice = await this.invoices.findOneBy({ id: query.id });
    if (!invoice) throw new NotFoundException(`Invoice ${query.id} not found`);
    return invoice;
  }
}
