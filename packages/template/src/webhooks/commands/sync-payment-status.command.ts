import Stripe from 'stripe';

export class SyncPaymentStatusCommand {
  constructor(public readonly paymentIntent: Stripe.PaymentIntent) {}
}
