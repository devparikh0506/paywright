import Stripe from 'stripe';

export class UpsertInvoiceCommand {
  constructor(public readonly invoice: Stripe.Invoice) {}
}
