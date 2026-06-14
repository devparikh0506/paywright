# create-paywright-app

Scaffold a production-ready **Stripe payment microservice** in one command:

```bash
npx create-paywright-app my-payment-service
```

The generated service is a standalone NestJS application that owns your
entire Stripe integration — customers, plans, one-time payments,
subscriptions, invoices, and webhook processing. Your applications (any
language, any stack) talk to it over a REST API and store only the returned
IDs.

## What you get

- **NestJS 11 + TypeScript** with CQRS — thin controllers, command/query
  handlers per domain
- **PostgreSQL via TypeORM** — migration-based schema, no auto-sync
- **Idempotent webhook pipeline** — Stripe events are signature-verified on
  the raw body, deduplicated with a race-free `ON CONFLICT` insert, queued
  to **BullMQ (Redis)**, and processed in the background with exponential
  retries
- **Resilient Stripe client** — circuit breaker, retry with backoff, and
  timeouts (cockatiel) around every Stripe call; card declines are never
  retried, infrastructure failures are
- **Safe payments** — amounts as integer cents, Stripe idempotency keys on
  writes, card data never touches the service (frontend confirms with a
  one-time `clientSecret`)
- **Security** — timing-safe API-key guard, Helmet, rate limiting, env
  validation at boot (refuses to start misconfigured)
- **Operations** — `/health` (DB + Redis readiness), Prometheus `/metrics`,
  structured Pino logs, Swagger UI at `/api/docs`
- **Docker Compose** dev environment — app + Postgres + Redis + pgAdmin

## Usage

```bash
npx create-paywright-app my-payment-service
cd my-payment-service
# edit .env — set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, API_KEY
docker compose up -d postgres redis
npm run migration:run
npm run start:dev
```

Health check: `curl http://localhost:3000/health` — API docs at
http://localhost:3000/api/docs

### CLI options

```
npx create-paywright-app [project-name] [options]

  -y, --yes        accept all defaults, no prompts (for CI)
  --skip-install   scaffold without running npm install
```

## API surface

All routes under `/api/v1`, guarded by an `x-api-key` header:

| Domain | Endpoints |
|---|---|
| Customers | create, get, list, update, delete |
| Plans | create (Stripe product + price), get, list, archive |
| Payments | create intent, get, list, cancel, refund |
| Subscriptions | create (with optional trial), get, list, cancel |
| Invoices | get, list (read-only, synced from Stripe webhooks) |

Infrastructure routes (no API key): `GET /health`, `GET /metrics`,
`POST /webhooks/stripe` (Stripe signature-verified).

## How a payment flows

```
Your backend   →  POST /api/v1/payments         →  service  →  Stripe
Your backend   ←  { clientSecret }              ←  service
Your frontend  →  stripe.confirmPayment(clientSecret)  →  Stripe
Stripe         →  POST /webhooks/stripe (signed)       →  service
                  verified → deduplicated → queued → status synced
```

Subscription renewals, payment failures, and cancellations arrive the same
way — as webhooks that keep the local mirror in sync automatically.

The scaffolded project ships with a full README covering environment
variables, webhook setup with the Stripe CLI, payment and subscription
walkthroughs, and test cards.

## License

MIT © Dev Parikh
