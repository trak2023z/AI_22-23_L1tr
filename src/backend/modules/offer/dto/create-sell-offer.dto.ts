import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { Exists } from '../../../decorators/exists.decorator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateSellOfferDto {
  @Exists('stock', 'stockId')
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({type: Number, description: 'Stock ID'})
  stockId!: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({type: Number, description: 'Selling price'})
  unitSellPriceCents!: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({type: Number, description: 'Quantity'})
  quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({type: Number, description: 'Status'})
  status!: number;
}
