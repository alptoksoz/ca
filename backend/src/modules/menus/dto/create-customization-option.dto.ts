import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomizationOptionDto {
  @ApiProperty({ example: 'Badem Sütü' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 5.00 })
  @IsNumber()
  @IsOptional()
  priceModifier?: number;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
