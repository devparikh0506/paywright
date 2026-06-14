import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

export class CreateSubscriptionCommand {
  constructor(public readonly dto: CreateSubscriptionDto) {}
}
