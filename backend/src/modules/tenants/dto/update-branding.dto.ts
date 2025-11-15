import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrandingDto {
  @ApiPropertyOptional({ example: '#6F4E37', description: 'Primary brand color (hex)' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Primary color must be a valid hex color' })
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#A0826D', description: 'Secondary brand color (hex)' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Secondary color must be a valid hex color' })
  secondaryColor?: string;

  @ApiPropertyOptional({ example: '#E6BE8A', description: 'Accent color (hex)' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Accent color must be a valid hex color' })
  accentColor?: string;

  @ApiPropertyOptional({ example: '#FFFFFF', description: 'Background color (hex)' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Background color must be a valid hex color' })
  backgroundColor?: string;

  @ApiPropertyOptional({ example: '#333333', description: 'Text color (hex)' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i, { message: 'Text color must be a valid hex color' })
  textColor?: string;

  @ApiPropertyOptional({ example: 'Poppins', description: 'Font family name' })
  @IsString()
  @IsOptional()
  fontFamily?: string;

  @ApiPropertyOptional({ example: 'Playfair Display', description: 'Heading font family' })
  @IsString()
  @IsOptional()
  headingFont?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/icon.png' })
  @IsString()
  @IsOptional()
  iconUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/splash.png' })
  @IsString()
  @IsOptional()
  splashScreenUrl?: string;

  @ApiPropertyOptional({ description: 'Custom CSS for advanced branding' })
  @IsString()
  @IsOptional()
  customCss?: string;
}
