import { CreatePlanDto } from '../dto/create-plan.dto';

export class CreatePlanCommand {
  constructor(public readonly dto: CreatePlanDto) {}
}
