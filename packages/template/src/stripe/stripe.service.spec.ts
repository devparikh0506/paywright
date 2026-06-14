import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { StripeService } from './stripe.service';

const connectionError = () =>
  new Stripe.errors.StripeConnectionError({
    type: 'api_error' as never,
    message: 'socket hang up',
  });

const cardError = () =>
  new Stripe.errors.StripeCardError({
    type: 'card_error' as never,
    message: 'Your card was declined',
  });

describe('StripeService resilience policy', () => {
  let service: StripeService;
  let stripeCreate: jest.Mock;

  beforeEach(() => {
    const config = {
      getOrThrow: (key: string) =>
        ({
          'stripe.secretKey': 'sk_test_dummy',
          'stripe.webhookSecret': 'whsec_dummy',
        })[key],
    } as unknown as ConfigService;

    service = new StripeService(config);

    // Reach into the SDK instance and replace the network call with a mock —
    // the policy wrapping is what's under test, not Stripe itself
    stripeCreate = jest.fn();
    (service as never as { stripe: Stripe }).stripe.customers.create =
      stripeCreate;
  });

  it('retries transient failures and succeeds', async () => {
    // Arrange: fail twice with a connection error, then succeed
    stripeCreate
      .mockRejectedValueOnce(connectionError())
      .mockRejectedValueOnce(connectionError())
      .mockResolvedValueOnce({ id: 'cus_123' });

    // Act
    const result = await service.createCustomer({ email: 'a@b.co' });

    // Assert
    expect(result).toEqual({ id: 'cus_123' });
    expect(stripeCreate).toHaveBeenCalledTimes(3);
  });

  it('does not retry non-transient errors (card declined)', async () => {
    stripeCreate.mockRejectedValue(cardError());

    await expect(service.createCustomer({ email: 'a@b.co' })).rejects.toThrow(
      'Your card was declined',
    );
    expect(stripeCreate).toHaveBeenCalledTimes(1);
  });

  it('opens the circuit after consecutive failures and fails fast', async () => {
    stripeCreate.mockRejectedValue(connectionError());

    // Two full retry cycles = 8 consecutive failures → breaker (threshold 5) opens
    await expect(service.createCustomer({ email: 'a@b.co' })).rejects.toThrow();
    await expect(service.createCustomer({ email: 'a@b.co' })).rejects.toThrow();

    // Circuit is now open: next call fails instantly without touching Stripe
    stripeCreate.mockClear();
    await expect(service.createCustomer({ email: 'a@b.co' })).rejects.toThrow(
      ServiceUnavailableException,
    );
    expect(stripeCreate).not.toHaveBeenCalled();
  });
});
