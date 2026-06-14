import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CancelSubscriptionCommand } from './commands/cancel-subscription.command';
import { CreateSubscriptionCommand } from './commands/create-subscription.command';
import { CreateSubscriptionResult } from './commands/create-subscription.handler';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { GetSubscriptionQuery } from './queries/get-subscription.query';
import { SubscriptionList } from './queries/list-subscriptions.handler';
import { ListSubscriptionsQuery } from './queries/list-subscriptions.query';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a subscription (first charge confirmed by frontend)' })
  create(@Body() dto: CreateSubscriptionDto): Promise<CreateSubscriptionResult> {
    return this.commandBus.execute(new CreateSubscriptionCommand(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List subscriptions, optionally by customer' })
  list(
    @Query('customerId') customerId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<SubscriptionList> {
    return this.queryBus.execute(
      new ListSubscriptionsQuery(customerId, +page, +limit),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Subscription> {
    return this.queryBus.execute(new GetSubscriptionQuery(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a subscription immediately' })
  cancel(@Param('id', ParseUUIDPipe) id: string): Promise<Subscription> {
    return this.commandBus.execute(new CancelSubscriptionCommand(id));
  }
}
