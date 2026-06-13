import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

/**
 * The API surface description, shared by two consumers:
 *  - main.ts          → serves the live Swagger UI at /api/docs
 *  - generate-openapi → writes the same spec to openapi.json for SDK codegen
 *
 * Keeping the prefix + document config here means the served docs and the
 * exported spec can never disagree about what the API looks like.
 */
export const API_GLOBAL_PREFIX = 'api/v1';
export const API_PREFIX_EXCLUDE = ['health', 'metrics', 'webhooks/stripe'];

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Stripe Payment Service')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();

  return SwaggerModule.createDocument(app, config, {
    // Drives generated SDK method names. Default is `CustomersController_create`
    // → `customersControllerCreate()`. Stripping the suffix yields the cleaner
    // `Customers_create` → `customersCreate()`, while staying globally unique.
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  });
}
