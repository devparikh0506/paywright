import { timingSafeEqual } from 'node:crypto';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { SKIP_API_KEY } from '../decorators/skip-api-key.decorator';

/**
 * Global guard: every route requires a valid `x-api-key` header,
 * except routes decorated with @SkipApiKey() (health, metrics,
 * the Stripe webhook — those authenticate by other means or none).
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_API_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-api-key'];
    const expected = this.config.getOrThrow<string>('apiKey');

    if (typeof provided !== 'string' || !safeCompare(provided, expected)) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}

/**
 * Constant-time string comparison. A plain `===` short-circuits on the
 * first differing character, so response timing leaks how many leading
 * characters of the key were correct — measurable over enough requests.
 * timingSafeEqual requires equal-length buffers (it throws otherwise),
 * so unequal lengths are rejected up front; that early return reveals
 * only the key's length, which is not a secret here.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
