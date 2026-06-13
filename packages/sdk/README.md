# @dev_parikh/paykit

Typed TypeScript/JavaScript client for the **paykit** payment service — a standalone, Stripe-backed payment microservice. Generated from the service's OpenAPI spec with [OpenAPI Generator](https://openapi-generator.tech/) (`typescript-axios`), so every endpoint and request body is fully typed.

> The SDK is a thin, typed wrapper over the service's REST API. It contains **no Stripe logic** — it calls **your** deployed paykit service, which owns Stripe, the database, and webhooks. One published SDK works against any deployment; you supply the URL and key at runtime.

## Installation

```bash
npm install @dev_parikh/paykit
```

`axios` is installed automatically as a dependency.

## Quick start

```ts
import { Configuration, CustomersApi } from '@dev_parikh/paykit';

const config = new Configuration({
  basePath: process.env.PAYKIT_URL, // your deployment, e.g. https://payments.acme.internal
  baseOptions: {
    // The service authenticates every request with the x-api-key header.
    headers: { 'x-api-key': process.env.PAYKIT_API_KEY },
  },
});

const customers = new CustomersApi(config);

const { data: customer } = await customers.customersCreate({
  createCustomerDto: { email: 'jane@acme.com', name: 'Jane Doe' },
});
```

### Authentication — read this

The `x-api-key` header **must** be set via `baseOptions.headers` as shown above. Do **not** rely on the `apiKey` field of `Configuration` — the current OpenAPI spec doesn't mark operations as secured, so that field is ignored and no key is sent. Setting the header in `baseOptions` applies it to every request and always works. (See [Known limitations](#known-limitations).)

## Configuration

| Option | Type | Description |
|--------|------|-------------|
| `basePath` | `string` | Base URL of your paykit deployment (no trailing slash) |
| `baseOptions.headers` | `object` | Per-request axios options; set `x-api-key` here |

A single instance can be shared across all API classes:

```ts
import {
  Configuration,
  CustomersApi, PlansApi, PaymentsApi, SubscriptionsApi, InvoicesApi,
} from '@dev_parikh/paykit';

const config = new Configuration({
  basePath: process.env.PAYKIT_URL,
  baseOptions: { headers: { 'x-api-key': process.env.PAYKIT_API_KEY } },
});

const customers     = new CustomersApi(config);
const plans         = new PlansApi(config);
const payments      = new PaymentsApi(config);
const subscriptions = new SubscriptionsApi(config);
const invoices      = new InvoicesApi(config);
```

> Each method takes a **single request-parameter object** (path params + body together) and returns an axios response — read the body from `.data`.

## Usage by resource

### Customers

```ts
await customers.customersCreate({
  createCustomerDto: { email: 'jane@acme.com', name: 'Jane', phone: '+15551234567' },
});

await customers.customersList();                                  // list all
await customers.customersGet({ id });
await customers.customersUpdate({ id, updateCustomerDto: { name: 'Jane D.' } });
await customers.customersRemove({ id });
```

### Plans

```ts
await plans.plansCreate({
  createPlanDto: { name: 'Pro', amount: 2000, currency: 'usd', interval: 'month' },
});

await plans.plansList();
await plans.plansGet({ id });
await plans.plansArchive({ id });   // prices are immutable in Stripe — archive, don't delete
```

> Amounts are in the smallest currency unit — `2000` = $20.00.

### Payments

```ts
const { data: intent } = await payments.paymentsCreate({
  createPaymentDto: {
    customerId,
    amount: 4999,
    currency: 'usd',
    idempotencyKey: 'order-1234', // optional, prevents double-charges on retry
  },
});

await payments.paymentsList();
await payments.paymentsGet({ id });
await payments.paymentsRefund({ id }); // refund a succeeded payment
await payments.paymentsCancel({ id }); // cancel an uncaptured payment
```

### Subscriptions

```ts
await subscriptions.subscriptionsCreate({
  createSubscriptionDto: { customerId, planId, trialPeriodDays: 14 },
});

await subscriptions.subscriptionsList();
await subscriptions.subscriptionsGet({ id });
await subscriptions.subscriptionsCancel({ id }); // cancels immediately
```

### Invoices

```ts
await invoices.invoicesList();
await invoices.invoicesGet({ id });
```

## Error handling

Non-2xx responses reject with an `AxiosError`. Inspect `response.status` and `response.data`:

```ts
import { AxiosError } from 'axios';

try {
  await customers.customersGet({ id: 'does-not-exist' });
} catch (err) {
  if (err instanceof AxiosError) {
    console.error('paykit error', err.response?.status, err.response?.data);
    // 401 → bad/missing x-api-key   404 → not found   429 → rate limited
  }
  throw err;
}
```

## Full API reference

Complete, auto-generated reference for every method and model:

| Resource | Reference |
|---|---|
| Customers | [CustomersApi](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/CustomersApi.md) |
| Plans | [PlansApi](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/PlansApi.md) |
| Payments | [PaymentsApi](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/PaymentsApi.md) |
| Subscriptions | [SubscriptionsApi](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/SubscriptionsApi.md) |
| Invoices | [InvoicesApi](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/InvoicesApi.md) |

Request models: [CreateCustomerDto](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/CreateCustomerDto.md) · [CreatePaymentDto](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/CreatePaymentDto.md) · [CreatePlanDto](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/CreatePlanDto.md) · [CreateSubscriptionDto](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/CreateSubscriptionDto.md) · [UpdateCustomerDto](https://github.com/devparikh0506/stripe-payment-nestjs/blob/main/packages/sdk/docs/UpdateCustomerDto.md)

The `docs/` folder is regenerated from the OpenAPI spec on every build, so it always matches the live API.

## Known limitations

These stem from missing annotations in the service's OpenAPI spec and will be resolved as the service adds them:

- **Auth isn't auto-attached** — set `x-api-key` via `baseOptions.headers` (see above). Operations don't yet declare a security requirement.
- **Responses are untyped** — `response.data` is currently `void`/untyped because endpoints don't declare `@ApiResponse` types. Requests are fully typed; cast the response if you need a shape today.
- **List endpoints take no typed query params** — pagination/filter params aren't in the spec yet; pass them via `baseOptions.params` if needed.

## Regenerating

This package is generated — do not hand-edit the `*.ts` files. After the service API changes:

```bash
cd packages/template && npm run openapi:generate && cd ../..
openapi-generator-cli generate
```

`README.md` and `package.json` are preserved across regeneration via `.openapi-generator-ignore`.

## License

MIT © Dev Parikh
