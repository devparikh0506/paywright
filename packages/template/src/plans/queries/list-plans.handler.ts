import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plan } from '../entities/plan.entity';
import { ListPlansQuery } from './list-plans.query';

@QueryHandler(ListPlansQuery)
export class ListPlansHandler implements IQueryHandler<ListPlansQuery> {
  constructor(
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
  ) {}

  execute(query: ListPlansQuery): Promise<Plan[]> {
    return this.plans.find({
      where: query.activeOnly ? { active: true } : {},
      order: { createdAt: 'DESC' },
    });
  }
}
