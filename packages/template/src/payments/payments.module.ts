import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from '../customers/entities/customer.entity';
import { StripeModule } from '../stripe/stripe.module';
import { CancelPaymentHandler } from './commands/cancel-payment.handler';
import { CreatePaymentHandler } from './commands/create-payment.handler';
import { RefundPaymentHandler } from './commands/refund-payment.handler';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { GetPaymentHandler } from './queries/get-payment.handler';
import { ListPaymentsHandler } from './queries/list-payments.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Payment, Customer]),
    StripeModule,
  ],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentHandler,
    CancelPaymentHandler,
    RefundPaymentHandler,
    GetPaymentHandler,
    ListPaymentsHandler,
  ],
})
export class PaymentsModule {}
