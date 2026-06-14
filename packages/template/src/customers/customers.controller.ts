import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateCustomerCommand } from './commands/create-customer.command';
import { DeleteCustomerCommand } from './commands/delete-customer.command';
import { UpdateCustomerCommand } from './commands/update-customer.command';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { GetCustomerQuery } from './queries/get-customer.query';
import { CustomerList } from './queries/list-customers.handler';
import { ListCustomersQuery } from './queries/list-customers.query';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.commandBus.execute(new CreateCustomerCommand(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List customers' })
  list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<CustomerList> {
    return this.queryBus.execute(new ListCustomersQuery(+page, +limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Customer> {
    return this.queryBus.execute(new GetCustomerQuery(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.commandBus.execute(new UpdateCustomerCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.commandBus.execute(new DeleteCustomerCommand(id));
  }
}
