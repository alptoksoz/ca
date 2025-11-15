import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto, UpdateBrandingDto, NearbyTenantsDto } from './dto';
import { Public, CurrentUser, Roles } from '@/common/decorators';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // ============================================
  // PUBLIC ENDPOINTS (for customers)
  // ============================================

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all coffee shops' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'List of coffee shops' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    return this.tenantsService.findAll({
      skip,
      take: limitNum,
    });
  }

  @Public()
  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby coffee shops' })
  @ApiResponse({ status: 200, description: 'List of nearby coffee shops' })
  async findNearby(@Query() nearbyDto: NearbyTenantsDto) {
    return this.tenantsService.findNearby(nearbyDto);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get coffee shop details by slug' })
  @ApiResponse({ status: 200, description: 'Coffee shop details' })
  @ApiResponse({ status: 404, description: 'Coffee shop not found' })
  async findOne(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @Public()
  @Get(':slug/open')
  @ApiOperation({ summary: 'Check if coffee shop is open now' })
  @ApiResponse({ status: 200, description: 'Open status' })
  async checkOpen(@Param('slug') slug: string) {
    const isOpen = await this.tenantsService.isOpenNow(slug);
    return { isOpen };
  }
}

// ============================================
// ADMIN ENDPOINTS (for coffee shop owners/staff)
// ============================================

@ApiTags('admin/tenants')
@ApiBearerAuth()
@Controller('admin/tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsAdminController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new coffee shop (onboarding)' })
  @ApiResponse({ status: 201, description: 'Coffee shop created successfully' })
  @ApiResponse({ status: 409, description: 'Slug or email already exists' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coffee shop by ID (with full details)' })
  @ApiResponse({ status: 200, description: 'Coffee shop details' })
  @ApiResponse({ status: 404, description: 'Coffee shop not found' })
  async findById(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Update coffee shop information' })
  @ApiResponse({ status: 200, description: 'Coffee shop updated successfully' })
  @ApiResponse({ status: 404, description: 'Coffee shop not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser() user: any,
  ) {
    // TODO: Check if user is owner/staff of this tenant
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Patch(':id/branding')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Update coffee shop branding' })
  @ApiResponse({ status: 200, description: 'Branding updated successfully' })
  async updateBranding(
    @Param('id') id: string,
    @Body() updateBrandingDto: UpdateBrandingDto,
    @CurrentUser() user: any,
  ) {
    // TODO: Check if user is owner/staff of this tenant
    return this.tenantsService.updateBranding(id, updateBrandingDto);
  }

  @Get(':id/statistics')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Get coffee shop statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // TODO: Check if user has access to this tenant
    return this.tenantsService.getStatistics(id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Delete coffee shop (soft delete)' })
  @ApiResponse({ status: 200, description: 'Coffee shop deleted successfully' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    // TODO: Check if user is owner of this tenant
    return this.tenantsService.remove(id);
  }
}
