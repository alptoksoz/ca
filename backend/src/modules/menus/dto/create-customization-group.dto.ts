import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  MinLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomizationGroupDto {
  @ApiProperty({ example: 'Süt Türü' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'single_select', enum: ['single_select', 'multi_select'] })
  @IsString()
  @IsIn(['single_select', 'multi_select'])
  type: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  minSelections?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsInt()
  @IsOptional()
  maxSelections?: number;
}
