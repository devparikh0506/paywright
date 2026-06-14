import { Controller, Get, Header } from '@nestjs/common';

import { SkipApiKey } from '../common/decorators/skip-api-key.decorator';
import { MetricsService } from './metrics.service';

/**
 * No API key guard — Prometheus scrapers don't send custom headers.
 * Restrict access at the network level in production.
 */
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @SkipApiKey()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  metrics(): Promise<string> {
    return this.metricsService.metrics();
  }
}
