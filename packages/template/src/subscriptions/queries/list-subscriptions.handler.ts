import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Repository } from 'typeorm';

import { Subscription } from '../entities/subscription.entity';
import { ListSubscriptionsQuery } from './list-subscriptions.query';

export class SubscriptionList {
  @ApiProperty({ type: [Subscription] })
  data: Subscription[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

@QueryHandler(ListSubscriptionsQuery)
export class ListSubscriptionsHandler
  implements IQueryHandler<ListSubscriptionsQuery>
{
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptions: Repository<Subscription>,
  ) {}

  async execute(query: ListSubscriptionsQuery): Promise<SubscriptionList> {
    const { customerId, page, limit } = query;
    const [data, total] = await this.subscriptions.findAndCount({
      where: customerId ? { customerId } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }
}
