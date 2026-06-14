import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Invoice } from './entities/invoice.entity';
import { GetInvoiceQuery } from './queries/get-invoice.query';
import { InvoiceList } from './queries/list-invoices.handler';
import { ListInvoicesQuery } from './queries/list-invoices.query';

/** Read-only — invoices are written exclusively by the webhook processor */
@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'List invoices, optionally by customer' })
  list(
    @Query('customerId') customerId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<InvoiceList> {
    return this.queryBus.execute(new ListInvoicesQuery(customerId, +page, +limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Invoice> {
    return this.queryBus.execute(new GetInvoiceQuery(id));
  }
}
