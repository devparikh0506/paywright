import Stripe from 'stripe';

export class SyncSubscriptionCommand {
  constructor(public readonly subscription: Stripe.Subscription) {}
}
