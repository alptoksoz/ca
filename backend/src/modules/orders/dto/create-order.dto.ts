import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemCustomizationDto {
  @ApiProperty({ example: 'Size' })
  @IsString()
  group: string;

  @ApiProperty({ example: 'Large' })
  @IsString()
  option: string;

  @ApiProperty({ example: 5.00 })
  @IsNumber()
  price: number;
}

export class CreateOrderItemDto {
  @ApiProperty({ example: 'menu-item-uuid' })
  @IsString()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemCustomizationDto)
  @IsOptional()
  customizations?: OrderItemCustomizationDto[];

  @ApiPropertyOptional({ example: 'No sugar please' })
  @IsString()
  @IsOptional()
  specialInstructions?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'tenant-uuid' })
  @IsString()
  tenantId: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({
    example: 'PICKUP',
    enum: ['PICKUP', 'DINE_IN', 'DELIVERY']
  })
  @IsEnum(['PICKUP', 'DINE_IN', 'DELIVERY'])
  @IsOptional()
  orderType?: string;

  @ApiPropertyOptional({ example: '2025-11-15T15:00:00Z' })
  @IsString()
  @IsOptional()
  scheduledFor?: string;

  @ApiPropertyOptional({ example: 'Please call when ready' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @IsOptional()
  loyaltyPointsToUse?: number;

  @ApiPropertyOptional({ example: 'PROMO123' })
  @IsString()
  @IsOptional()
  promotionCode?: string;
}
