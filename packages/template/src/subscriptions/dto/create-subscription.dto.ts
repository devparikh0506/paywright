import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Local customer id (UUID)' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Local plan id (UUID)' })
  @IsUUID()
  planId: string;

  @ApiPropertyOptional({
    example: 14,
    description: 'Free trial length in days — Stripe schedules the first charge',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  trialPeriodDays?: number;

  @ApiPropertyOptional({
    description:
      'Pass the same key on retries to guarantee the subscription is created at most once',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
