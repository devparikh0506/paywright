import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { StripeService } from '../../stripe/stripe.service';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { RefundPaymentCommand } from './refund-payment.command';
import { RefundPaymentHandler } from './refund-payment.handler';

const payment = (status: PaymentStatus): Payment =>
  ({
    id: 'pay_local_1',
    stripePaymentIntentId: 'pi_123',
    status,
  }) as Payment;

describe('RefundPaymentHandler', () => {
  let handler: RefundPaymentHandler;
  let findOneBy: jest.Mock;
  let save: jest.Mock;
  let createRefund: jest.Mock;

  beforeEach(() => {
    findOneBy = jest.fn();
    save = jest.fn().mockImplementation((p: Payment) => Promise.resolve(p));
    createRefund = jest.fn().mockResolvedValue({ id: 're_123' });

    handler = new RefundPaymentHandler(
      { findOneBy, save } as unknown as Repository<Payment>,
      { createRefund } as unknown as StripeService,
    );
  });

  it('refunds a succeeded payment and marks it refunded', async () => {
    findOneBy.mockResolvedValue(payment('succeeded'));

    const result = await handler.execute(new RefundPaymentCommand('pay_local_1'));

    expect(createRefund).toHaveBeenCalledWith({ payment_intent: 'pi_123' });
    expect(result.status).toBe('refunded');
  });

  it.each<PaymentStatus>([
    'requires_payment_method',
    'processing',
    'canceled',
    'refunded',
  ])('rejects refunding a %s payment with 409', async (status) => {
    findOneBy.mockResolvedValue(payment(status));

    await expect(
      handler.execute(new RefundPaymentCommand('pay_local_1')),
    ).rejects.toThrow(ConflictException);
    expect(createRefund).not.toHaveBeenCalled();
  });

  it('404s on an unknown payment', async () => {
    findOneBy.mockResolvedValue(null);

    await expect(
      handler.execute(new RefundPaymentCommand('missing')),
    ).rejects.toThrow(NotFoundException);
  });
});
