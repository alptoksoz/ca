import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsObject,
  MinLength,
  MaxLength,
  Matches,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Nostaljik Kahve Evi' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  businessName: string;

  @ApiProperty({ example: 'nostaljik-kahve' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({ example: 'info@nostaljiikkahve.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+905551234567' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Bağdat Caddesi No: 123' })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Kat: 2 Daire: 5' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'Istanbul' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'Kadıköy' })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({ example: '34710' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'TR' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 40.9923307 })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ example: 29.0259588 })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({ example: 'Sıcak ve samimi atmosferde özel kahve deneyimi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.jpg' })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @ApiPropertyOptional({
    example: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '21:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    },
  })
  @IsObject()
  @IsOptional()
  businessHours?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Europe/Istanbul' })
  @IsString()
  @IsOptional()
  timezone?: string;
}
