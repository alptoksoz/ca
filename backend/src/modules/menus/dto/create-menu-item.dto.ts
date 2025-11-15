import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  IsArray,
  Min,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Flat White' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'flat-white' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'Mikroköpüklü sütle hazırlanan özel kahve' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 45.00 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ example: 'category-uuid-here' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/flat-white.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 150 })
  @IsInt()
  @IsOptional()
  calories?: number;

  @ApiPropertyOptional({ example: 5.5 })
  @IsNumber()
  @IsOptional()
  protein?: number;

  @ApiPropertyOptional({ example: 12.0 })
  @IsNumber()
  @IsOptional()
  carbs?: number;

  @ApiPropertyOptional({ example: 8.0 })
  @IsNumber()
  @IsOptional()
  fat?: number;

  @ApiPropertyOptional({ example: 80 })
  @IsInt()
  @IsOptional()
  caffeine?: number;

  @ApiPropertyOptional({ example: ['vegan', 'gluten-free'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: ['milk', 'nuts'] })
  @IsArray()
  @IsOptional()
  allergens?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @IsOptional()
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
