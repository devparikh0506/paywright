import {
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BrokenCircuitError,
  ConsecutiveBreaker,
  ExponentialBackoff,
  IPolicy,
  TaskCancelledError,
  TimeoutStrategy,
  circuitBreaker,
  handleWhen,
  retry,
  timeout,
  wrap,
} from 'cockatiel';
import Stripe from 'stripe';

const STRIPE_CALL_TIMEOUT_MS = 10_000;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 100;
const BREAKER_CONSECUTIVE_FAILURES = 5;
const BREAKER_HALF_OPEN_AFTER_MS = 10_000;

/**
 * Only infrastructure failures are worth retrying or tripping the
 * breaker: connection drops, Stripe 5xx, rate limits, and our own
 * timeouts. Card declines and validation errors (4xx) are final —
 * retrying them is wasted latency and load.
 */
const isTransientError = (error: Error): boolean =>
  error instanceof Stripe.errors.StripeConnectionError ||
  error instanceof Stripe.errors.StripeAPIError ||
  error instanceof Stripe.errors.StripeRateLimitError ||
  error instanceof TaskCancelledError;

/**
 * Single chokepoint for every Stripe SDK call. Controllers, handlers
 * and processors never touch the SDK directly — they get retry,
 * circuit breaking and timeouts for free by going through here.
 */
@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly policy: IPolicy;
  private readonly webhookSecret: string;

  constructor(config: ConfigService) {
    this.webhookSecret = config.getOrThrow<string>('stripe.webhookSecret');
    this.stripe = new Stripe(config.getOrThrow<string>('stripe.secretKey'), {
      // The SDK pins the Stripe API version bundled with this package
      // version, so the lockfile is the pin. maxNetworkRetries stays 0:
      // cockatiel owns retries — two retry layers would multiply.
      maxNetworkRetries: 0,
      timeout: STRIPE_CALL_TIMEOUT_MS,
    });

    // Inside-out: each attempt gets its own timeout, each attempt's
    // failure counts toward the breaker, retry decides if another
    // attempt happens at all.
    const timeoutPolicy = timeout(STRIPE_CALL_TIMEOUT_MS, TimeoutStrategy.Aggressive);
    const breakerPolicy = circuitBreaker(handleWhen(isTransientError), {
      halfOpenAfter: BREAKER_HALF_OPEN_AFTER_MS,
      breaker: new ConsecutiveBreaker(BREAKER_CONSECUTIVE_FAILURES),
    });
    const retryPolicy = retry(handleWhen(isTransientError), {
      maxAttempts: MAX_RETRY_ATTEMPTS,
      backoff: new ExponentialBackoff({ initialDelay: RETRY_BASE_DELAY_MS }),
    });
    this.policy = wrap(retryPolicy, breakerPolicy, timeoutPolicy);

    breakerPolicy.onBreak(() =>
      this.logger.error('Stripe circuit breaker OPEN — failing fast'),
    );
    breakerPolicy.onReset(() => this.logger.log('Stripe circuit breaker closed'));
  }

  // --- Customers ---

  createCustomer(
    params: Stripe.CustomerCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Customer> {
    return this.execute('customers.create', () =>
      this.stripe.customers.create(params, options),
    );
  }

  updateCustomer(
    id: string,
    params: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    return this.execute('customers.update', () =>
      this.stripe.customers.update(id, params),
    );
  }

  deleteCustomer(id: string): Promise<Stripe.DeletedCustomer> {
    return this.execute('customers.del', () => this.stripe.customers.del(id));
  }

  retrieveCustomer(id: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return this.execute('customers.retrieve', () =>
      this.stripe.customers.retrieve(id),
    );
  }

  // --- Products / Prices (Plans) ---

  createProduct(
    params: Stripe.ProductCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Product> {
    return this.execute('products.create', () =>
      this.stripe.products.create(params, options),
    );
  }

  createPrice(
    params: Stripe.PriceCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Price> {
    return this.execute('prices.create', () =>
      this.stripe.prices.create(params, options),
    );
  }

  archivePrice(id: string): Promise<Stripe.Price> {
    return this.execute('prices.archive', () =>
      this.stripe.prices.update(id, { active: false }),
    );
  }

  // --- Payments ---

  createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.PaymentIntent> {
    return this.execute('paymentIntents.create', () =>
      this.stripe.paymentIntents.create(params, options),
    );
  }

  confirmPaymentIntent(
    id: string,
    params?: Stripe.PaymentIntentConfirmParams,
  ): Promise<Stripe.PaymentIntent> {
    return this.execute('paymentIntents.confirm', () =>
      this.stripe.paymentIntents.confirm(id, params),
    );
  }

  cancelPaymentIntent(id: string): Promise<Stripe.PaymentIntent> {
    return this.execute('paymentIntents.cancel', () =>
      this.stripe.paymentIntents.cancel(id),
    );
  }

  createRefund(
    params: Stripe.RefundCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Refund> {
    return this.execute('refunds.create', () =>
      this.stripe.refunds.create(params, options),
    );
  }

  // --- Subscriptions ---

  createSubscription(
    params: Stripe.SubscriptionCreateParams,
    options?: Stripe.RequestOptions,
  ): Promise<Stripe.Subscription> {
    return this.execute('subscriptions.create', () =>
      this.stripe.subscriptions.create(params, options),
    );
  }

  updateSubscription(
    id: string,
    params: Stripe.SubscriptionUpdateParams,
  ): Promise<Stripe.Subscription> {
    return this.execute('subscriptions.update', () =>
      this.stripe.subscriptions.update(id, params),
    );
  }

  cancelSubscription(id: string): Promise<Stripe.Subscription> {
    return this.execute('subscriptions.cancel', () =>
      this.stripe.subscriptions.cancel(id),
    );
  }

  // --- Invoices ---

  retrieveInvoice(id: string): Promise<Stripe.Invoice> {
    return this.execute('invoices.retrieve', () =>
      this.stripe.invoices.retrieve(id),
    );
  }

  listInvoices(
    params: Stripe.InvoiceListParams,
  ): Promise<Stripe.ApiList<Stripe.Invoice>> {
    return this.execute('invoices.list', () => this.stripe.invoices.list(params));
  }

  // --- Webhooks ---

  /**
   * Local HMAC verification — no network call, so no resilience policy.
   * Throws if the signature doesn't match the raw payload bytes.
   */
  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }

  /**
   * Every SDK call funnels through here: applies the resilience policy
   * and translates infrastructure failures into HTTP-meaningful
   * exceptions. Stripe's own errors (card declined, invalid params)
   * pass through untouched for handlers to interpret.
   */
  private async execute<T>(operation: string, call: () => Promise<T>): Promise<T> {
    try {
      return await this.policy.execute(call);
    } catch (error) {
      if (error instanceof BrokenCircuitError) {
        throw new ServiceUnavailableException(
          'Payment provider temporarily unavailable',
        );
      }
      if (error instanceof TaskCancelledError) {
        throw new GatewayTimeoutException('Payment provider timed out');
      }
      this.logger.error(`Stripe ${operation} failed: ${(error as Error).message}`);
      throw error;
    }
  }
}
