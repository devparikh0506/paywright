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

const API_KEY_SCHEME = 'x-api-key';

// Full spec paths that ApiKeyGuard skips (they live outside the api/v1 prefix).
// These stay unsecured in the spec so generated SDKs don't send a key to them.
const PUBLIC_PATHS = ['/health', '/metrics', '/webhooks/stripe'];

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head'] as const;

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Stripe Payment Service')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: API_KEY_SCHEME, in: 'header' }, API_KEY_SCHEME)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // Drives generated SDK method names. Default is `CustomersController_create`
    // → `customersControllerCreate()`. Stripping the suffix yields the cleaner
    // `Customers_create` → `customersCreate()`, while staying globally unique.
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  });

  return applyApiKeyRequirement(document);
}

/**
 * Marks every protected operation as requiring the x-api-key scheme, so
 * generated clients attach the key from their own config instead of the
 * caller wiring the header by hand. Without this the SDK silently sends no
 * key. Public routes (health/metrics/webhooks) are left open in the spec.
 */
function applyApiKeyRequirement(document: OpenAPIObject): OpenAPIObject {
  const requirement = [{ [API_KEY_SCHEME]: [] }];

  for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
    if (PUBLIC_PATHS.includes(path) || !pathItem) {
      continue;
    }
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation) {
        operation.security = requirement;
      }
    }
  }

  return document;
}
