import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice } from './entities/invoice.entity';
import { InvoicesController } from './invoices.controller';
import { GetInvoiceHandler } from './queries/get-invoice.handler';
import { ListInvoicesHandler } from './queries/list-invoices.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoicesController],
  providers: [GetInvoiceHandler, ListInvoicesHandler],
})
export class InvoicesModule {}
