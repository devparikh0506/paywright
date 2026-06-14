import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CancelPaymentCommand } from './commands/cancel-payment.command';
import { CreatePaymentCommand } from './commands/create-payment.command';
import { CreatePaymentResult } from './commands/create-payment.handler';
import { RefundPaymentCommand } from './commands/refund-payment.command';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { GetPaymentQuery } from './queries/get-payment.query';
import { PaymentList } from './queries/list-payments.handler';
import { ListPaymentsQuery } from './queries/list-payments.query';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a payment intent' })
  create(@Body() dto: CreatePaymentDto): Promise<CreatePaymentResult> {
    return this.commandBus.execute(new CreatePaymentCommand(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List payments, optionally by customer' })
  list(
    @Query('customerId') customerId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<PaymentList> {
    return this.queryBus.execute(
      new ListPaymentsQuery(customerId, +page, +limit),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return this.queryBus.execute(new GetPaymentQuery(id));
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an uncaptured payment' })
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return this.commandBus.execute(new CancelPaymentCommand(id));
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund a succeeded payment' })
  refund(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return this.commandBus.execute(new RefundPaymentCommand(id));
  }
}
