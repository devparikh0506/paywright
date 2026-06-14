import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plan } from '../entities/plan.entity';
import { GetPlanQuery } from './get-plan.query';

@QueryHandler(GetPlanQuery)
export class GetPlanHandler implements IQueryHandler<GetPlanQuery> {
  constructor(
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
  ) {}

  async execute(query: GetPlanQuery): Promise<Plan> {
    const plan = await this.plans.findOneBy({ id: query.id });
    if (!plan) throw new NotFoundException(`Plan ${query.id} not found`);
    return plan;
  }
}
