import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { NestFactory } from '@nestjs/core';

/**
 * Harmless placeholders that satisfy the Joi schema in env.validation.ts.
 * Generating the spec is a pure metadata operation — it must never require
 * real secrets or a live database. These are set BEFORE AppModule is imported
 * because ConfigModule.forRoot runs validation at import time.
 */
const PLACEHOLDER_ENV: Readonly<Record<string, string>> = {
  NODE_ENV: 'development',
  PORT: '3000',
  API_KEY: 'placeholder-api-key-0000',
  STRIPE_SECRET_KEY: 'sk_test_placeholder',
  STRIPE_WEBHOOK_SECRET: 'whsec_placeholder',
  DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
  REDIS_URL: 'redis://localhost:6379',
};

for (const [key, value] of Object.entries(PLACEHOLDER_ENV)) {
  process.env[key] ??= value;
}

async function generate(): Promise<void> {
  // Dynamic imports AFTER env is set: a static `import { AppModule }` would
  // evaluate the @Module decorator (and run Joi validation) before the
  // placeholders above are applied.
  const { AppModule } = await import('./app.module');
  const { createOpenApiDocument, API_GLOBAL_PREFIX, API_PREFIX_EXCLUDE } =
    await import('./swagger');

  // preview: true builds the route graph for introspection without
  // instantiating any provider — so TypeORM/BullMQ never try to connect.
  const app = await NestFactory.create(AppModule, {
    preview: true,
    logger: false,
  });
  app.setGlobalPrefix(API_GLOBAL_PREFIX, { exclude: API_PREFIX_EXCLUDE });

  const document = createOpenApiDocument(app);
  const outPath = join(process.cwd(), 'openapi.json');
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);

  await app.close();
  process.stdout.write(`OpenAPI spec written to ${outPath}\n`);
}

void generate();
