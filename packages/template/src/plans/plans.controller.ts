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

import { ArchivePlanCommand } from './commands/archive-plan.command';
import { CreatePlanCommand } from './commands/create-plan.command';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from './entities/plan.entity';
import { GetPlanQuery } from './queries/get-plan.query';
import { ListPlansQuery } from './queries/list-plans.query';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a plan (Stripe product + price)' })
  create(@Body() dto: CreatePlanDto): Promise<Plan> {
    return this.commandBus.execute(new CreatePlanCommand(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List plans' })
  list(@Query('activeOnly') activeOnly?: string): Promise<Plan[]> {
    return this.queryBus.execute(new ListPlansQuery(activeOnly === 'true'));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan' })
  get(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.queryBus.execute(new GetPlanQuery(id));
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a plan (prices are immutable in Stripe)' })
  archive(@Param('id', ParseUUIDPipe) id: string): Promise<Plan> {
    return this.commandBus.execute(new ArchivePlanCommand(id));
  }
}
