export class ListSubscriptionsQuery {
  constructor(
    public readonly customerId?: string,
    public readonly page: number = 1,
    public readonly limit: number = 20,
  ) {}
}
