import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Local customer id (UUID)' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: 4900, description: 'Amount in smallest currency unit (cents)' })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'usd' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiPropertyOptional({
    description:
      'Pass the same key on retries to guarantee the charge is created at most once',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
