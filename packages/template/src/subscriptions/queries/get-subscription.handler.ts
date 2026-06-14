import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from '../entities/subscription.entity';
import { GetSubscriptionQuery } from './get-subscription.query';

@QueryHandler(GetSubscriptionQuery)
export class GetSubscriptionHandler
  implements IQueryHandler<GetSubscriptionQuery>
{
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptions: Repository<Subscription>,
  ) {}

  async execute(query: GetSubscriptionQuery): Promise<Subscription> {
    const subscription = await this.subscriptions.findOneBy({ id: query.id });
    if (!subscription) {
      throw new NotFoundException(`Subscription ${query.id} not found`);
    }
    return subscription;
  }
}
