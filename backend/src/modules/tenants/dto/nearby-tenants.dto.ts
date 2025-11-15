import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NearbyTenantsDto {
  @ApiProperty({ example: 40.9923307, description: 'User latitude' })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 29.0259588, description: 'User longitude' })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ example: 5, description: 'Search radius in kilometers', default: 5 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0.1)
  @Max(50)
  radius?: number;

  @ApiPropertyOptional({ example: 20, description: 'Maximum results to return', default: 20 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number;
}
