import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import { Customer } from '../../customers/entities/customer.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { UpsertInvoiceCommand } from './upsert-invoice.command';

@CommandHandler(UpsertInvoiceCommand)
export class UpsertInvoiceHandler
  implements ICommandHandler<UpsertInvoiceCommand>
{
  private readonly logger = new Logger(UpsertInvoiceHandler.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoices: Repository<Invoice>,
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
  ) {}

  async execute(command: UpsertInvoiceCommand): Promise<void> {
    const stripeInvoice = command.invoice;
    if (!stripeInvoice.id) return;

    const stripeCustomerId = asId(stripeInvoice.customer);
    const localCustomer = stripeCustomerId
      ? await this.customers.findOneBy({ stripeCustomerId })
      : null;

    const fields = {
      customerId: localCustomer?.id ?? null,
      stripeCustomerId,
      // Basil: the subscription reference moved under invoice.parent
      stripeSubscriptionId: asId(
        stripeInvoice.parent?.subscription_details?.subscription,
      ),
      amountDue: stripeInvoice.amount_due,
      amountPaid: stripeInvoice.amount_paid,
      currency: stripeInvoice.currency,
      status: stripeInvoice.status ?? 'draft',
      hostedInvoiceUrl: stripeInvoice.hosted_invoice_url ?? null,
    };

    const existing = await this.invoices.findOneBy({
      stripeInvoiceId: stripeInvoice.id,
    });

    await this.invoices.save(
      existing
        ? { ...existing, ...fields }
        : this.invoices.create({ stripeInvoiceId: stripeInvoice.id, ...fields }),
    );
    this.logger.log(`Invoice ${stripeInvoice.id} → ${fields.status}`);
  }
}

/** Expandable Stripe fields are either an id string or a full object */
function asId(
  value: string | { id: string } | null | undefined,
): string | null {
  if (!value) return null;
  return typeof value === 'string' ? value : value.id;
}
