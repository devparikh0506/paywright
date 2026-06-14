export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiKey: process.env.API_KEY,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  database: { url: process.env.DATABASE_URL },
  redis: { url: process.env.REDIS_URL },
  logLevel: process.env.LOG_LEVEL ?? 'info',
});
