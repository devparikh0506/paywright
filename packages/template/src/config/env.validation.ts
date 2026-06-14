import Joi from 'joi';

/**
 * Validated at boot by ConfigModule — the app refuses to start if any
 * required variable is missing or malformed. Fail at deploy time, not
 * at 3am when the first webhook arrives.
 */
export const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  API_KEY: Joi.string().min(16).required(),
  STRIPE_SECRET_KEY: Joi.string()
    .pattern(/^sk_(test|live)_/)
    .required(),
  STRIPE_WEBHOOK_SECRET: Joi.string()
    .pattern(/^whsec_/)
    .required(),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required(),
  REDIS_URL: Joi.string().uri({ scheme: 'redis' }).required(),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
    .default('info'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
