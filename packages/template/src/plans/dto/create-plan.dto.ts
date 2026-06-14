import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsString, Length, Min } from 'class-validator';

import { PlanInterval } from '../entities/plan.entity';

export class CreatePlanDto {
  @ApiProperty({ example: 'Pro Monthly' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1900, description: 'Amount in smallest currency unit (cents)' })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'usd' })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty({ example: 'month', enum: ['month', 'year'] })
  @IsIn(['month', 'year'])
  interval: PlanInterval;
}
