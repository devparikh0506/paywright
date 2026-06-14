import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import {
  API_GLOBAL_PREFIX,
  API_PREFIX_EXCLUDE,
  createOpenApiDocument,
} from './swagger';

async function bootstrap(): Promise<void> {
  // rawBody: true keeps the unparsed request body available on req.rawBody —
  // Stripe webhook signature verification needs the exact bytes, not parsed JSON
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(API_GLOBAL_PREFIX, { exclude: API_PREFIX_EXCLUDE });
  app.enableShutdownHooks();

  SwaggerModule.setup('api/docs', app, createOpenApiDocument(app));

  const config = app.get(ConfigService);
  await app.listen(config.getOrThrow<number>('port'));
}

void bootstrap();
