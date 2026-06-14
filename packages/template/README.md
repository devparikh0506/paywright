# Stripe Payment Service

A standalone Stripe payment microservice — NestJS, TypeORM, PostgreSQL,
BullMQ. Owns the full Stripe integration so your application doesn't have to:
your app calls this service's REST API and stores only the returned IDs.

## Getting started

### 1. Configure environment

```bash
cp .env.example .env    # skip if the scaffolder already created .env
```

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` from the [dashboard](https://dashboard.stripe.com/test/apikeys)) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...` — see webhook setup below) |
| `API_KEY` | Key your apps send as `x-api-key`; min 16 chars (`openssl rand -hex 32`) |
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis connection string |
| `PORT` | HTTP port (default 3000) |
| `POSTGRES_HOST_PORT` | Host port for the Docker Postgres (set e.g. 5433 if 5432 is taken) |

The service refuses to start if a required variable is missing or malformed.

### 2. Start infrastructure and run

```bash
docker compose up -d postgres redis    # + pgadmin on :5050
npm install
npm run migration:run                  # creates all tables
npm run start:dev
```

Verify: `curl http://localhost:3000/health` → `{"status":"ok",...}` with
database and Redis both `up`. Swagger UI: http://localhost:3000/api/docs

To run the service itself in Docker too: `docker compose up` (multi-stage
build, production image).

### 3. Webhook setup

Stripe needs to reach this service to sync payment/subscription state.

**Local development** — use the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

Copy the printed `whsec_...` into `.env` as `STRIPE_WEBHOOK_SECRET` and
restart. Keep `stripe listen` running while you develop.

**Production** — add an endpoint in the Stripe dashboard
(Developers → Webhooks) pointing at `https://your-host/webhooks/stripe`,
subscribe to `payment_intent.*`, `customer.subscription.*`, and `invoice.*`
events, and use that endpoint's signing secret.

## Core flows

### One-time payment

```bash
# 1. Create a customer (once per user)
curl -X POST http://localhost:3000/api/v1/customers \
  -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"email":"user@example.com","name":"Jane Doe"}'

# 2. Create a payment intent
curl -X POST http://localhost:3000/api/v1/payments \
  -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"customerId":"<uuid>","amount":4900,"currency":"usd"}'
```

The response contains a `clientSecret`. Your frontend confirms the payment
with Stripe.js (`stripe.confirmPayment`) — card data never touches your
servers. When Stripe finishes, a webhook updates the local payment to
`succeeded` automatically.

Pass an `idempotencyKey` in the create body when retrying a timed-out
request — the same key always returns the same payment, never a double
charge.

### Subscription

```bash
# 1. Create a plan (Stripe product + price)
curl -X POST http://localhost:3000/api/v1/plans \
  -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"name":"Pro Monthly","amount":1900,"currency":"usd","interval":"month"}'

# 2. Subscribe a customer (optional trialPeriodDays)
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"customerId":"<uuid>","planId":"<uuid>","trialPeriodDays":14}'
```

The first invoice's `clientSecret` comes back for frontend confirmation
(`null` when a trial defers the charge). Renewals, payment failures, and
cancellations arrive as webhooks and sync the local subscription status —
poll `GET /api/v1/subscriptions/:id` or check on login to gate access in
your app (`active` and `trialing` both mean entitled).

### Testing payments without a frontend

```bash
stripe payment_intents confirm <pi_...> \
  --payment-method pm_card_visa \
  --return-url "https://example.com/done"
```

Test cards: `pm_card_visa` (succeeds), `pm_card_chargeDeclined` (declines).

## Architecture notes

- **CQRS** — controllers are thin; every operation is a command or query
  handled in its module (`commands/`, `queries/` per domain).
- **Webhooks** — signature-verified on the raw body, deduplicated via an
  `ON CONFLICT DO NOTHING` insert into `webhook_events`, enqueued to BullMQ,
  processed in the background with 5 retries (exponential backoff).
  Exhausted jobs remain in Redis; the `webhook_events` row keeps the last
  error.
- **Resilience** — every Stripe call goes through a circuit breaker
  (opens after 5 consecutive transient failures, half-opens after 10s),
  retry with backoff (3 attempts), and a 10s timeout. Card declines and
  validation errors are never retried.
- **Money** — all amounts are integers in the smallest currency unit
  (cents). Never floats.
- **Migrations only** — `synchronize` is off; schema changes ship as
  TypeORM migrations (`npm run migration:generate`).

## Operations

| Endpoint | Purpose |
|---|---|
| `GET /health` | DB + Redis readiness (503 if either is down) |
| `GET /metrics` | Prometheus counters — restrict at the network level in production |
| `GET /api/docs` | Swagger UI |

```bash
npm test                 # unit tests
npm run build            # production build
npm run migration:run    # apply pending migrations
```

## Generating a client SDK

The full API is described by an OpenAPI spec — served live at `/api/docs` and
exportable to a file **without booting the app** (no Postgres or Redis needed,
so it runs in CI):

```bash
npm run openapi:generate     # writes openapi.json
```

Feed that spec to [OpenAPI Generator](https://openapi-generator.tech/)
(requires Java 11+) to produce a typed client in any language:

```bash
# TypeScript (axios) — the generator behind this repo's @paywright/sdk SDK
openapi-generator-cli generate -i openapi.json -g typescript-axios -o ./client

# Python, Go, Java, ... — just swap the -g generator
openapi-generator-cli generate -i openapi.json -g python -o ./client-python
```

Protected endpoints declare the `x-api-key` security scheme, so generated
clients attach the key from their own configuration automatically.
