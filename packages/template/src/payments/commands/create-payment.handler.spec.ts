import { Repository } from 'typeorm';

import { Customer } from '../../customers/entities/customer.entity';
import { StripeService } from '../../stripe/stripe.service';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentCommand } from './create-payment.command';
import { CreatePaymentHandler } from './create-payment.handler';

describe('CreatePaymentHandler idempotency', () => {
  let handler: CreatePaymentHandler;
  let paymentsFindOneBy: jest.Mock;
  let paymentsSave: jest.Mock;
  let createPaymentIntent: jest.Mock;

  const dto = {
    customerId: 'cust_local_1',
    amount: 4900,
    currency: 'usd',
    idempotencyKey: 'retry-key-1',
  };

  beforeEach(() => {
    paymentsFindOneBy = jest.fn();
    paymentsSave = jest.fn().mockImplementation((p) => Promise.resolve(p));
    createPaymentIntent = jest.fn().mockResolvedValue({
      id: 'pi_123',
      status: 'requires_payment_method',
      client_secret: 'pi_123_secret',
    });

    handler = new CreatePaymentHandler(
      {
        findOneBy: paymentsFindOneBy,
        save: paymentsSave,
        create: (p: Partial<Payment>) => p,
      } as unknown as Repository<Payment>,
      {
        findOneBy: jest
          .fn()
          .mockResolvedValue({ id: 'cust_local_1', stripeCustomerId: 'cus_1' }),
      } as unknown as Repository<Customer>,
      { createPaymentIntent } as unknown as StripeService,
    );
  });

  it('passes the idempotency key through to Stripe', async () => {
    paymentsFindOneBy.mockResolvedValue(null);

    await handler.execute(new CreatePaymentCommand(dto));

    expect(createPaymentIntent).toHaveBeenCalledWith(expect.anything(), {
      idempotencyKey: 'retry-key-1',
    });
  });

  it('returns the existing row on a retried key instead of inserting twice', async () => {
    const existing = { id: 'pay_local_1', stripePaymentIntentId: 'pi_123' };
    paymentsFindOneBy.mockResolvedValue(existing as Payment);

    const result = await handler.execute(new CreatePaymentCommand(dto));

    expect(result.payment).toBe(existing);
    expect(result.clientSecret).toBe('pi_123_secret');
    expect(paymentsSave).not.toHaveBeenCalled();
  });
});
