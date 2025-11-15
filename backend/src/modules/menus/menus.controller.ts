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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { MenusService } from './menus.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCustomizationGroupDto,
  CreateCustomizationOptionDto,
} from './dto';
import { Public, CurrentUser, Roles } from '@/common/decorators';
import { JwtAuthGuard, RolesGuard } from '@/common/guards';

// ============================================
// PUBLIC ENDPOINTS (for customers)
// ============================================

@ApiTags('menus')
@Controller('tenants/:tenantSlug/menu')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get full menu for a coffee shop' })
  @ApiResponse({ status: 200, description: 'Full menu with categories and items' })
  async getFullMenu(@Param('tenantSlug') tenantSlug: string) {
    return this.menusService.getFullMenu(tenantSlug);
  }

  @Public()
  @Get('items')
  @ApiOperation({ summary: 'Get all menu items for a coffee shop' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'featured', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAllMenuItems(
    @Param('tenantSlug') tenantSlug: string,
    @Query('categoryId') categoryId?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
  ) {
    // Get tenant first
    const tenant = await this.menusService['prisma'].tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.menusService.findAllMenuItems(tenant.id, {
      categoryId,
      featured: featured === 'true',
      available: true,
      search,
    });
  }

  @Public()
  @Get('items/:slug')
  @ApiOperation({ summary: 'Get menu item by slug' })
  @ApiResponse({ status: 200, description: 'Menu item details' })
  async findMenuItemBySlug(
    @Param('tenantSlug') tenantSlug: string,
    @Param('slug') slug: string,
  ) {
    const tenant = await this.menusService['prisma'].tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.menusService.findMenuItemBySlug(tenant.id, slug);
  }
}

// ============================================
// ADMIN ENDPOINTS (for coffee shop owners/staff)
// ============================================

@ApiTags('admin/menus')
@ApiBearerAuth()
@Controller('admin/tenants/:tenantId/menu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenusAdminController {
  constructor(private readonly menusService: MenusService) {}

  // Categories

  @Post('categories')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create menu category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  createCategory(
    @Param('tenantId') tenantId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.menusService.createCategory(tenantId, createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'includeInactive', required: false })
  findAllCategories(
    @Param('tenantId') tenantId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.menusService.findAllCategories(
      tenantId,
      includeInactive === 'true',
    );
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  findCategoryById(@Param('id') id: string) {
    return this.menusService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update category' })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.menusService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Delete category' })
  deleteCategory(@Param('id') id: string) {
    return this.menusService.deleteCategory(id);
  }

  // Menu Items

  @Post('items')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create menu item' })
  @ApiResponse({ status: 201, description: 'Menu item created' })
  createMenuItem(
    @Param('tenantId') tenantId: string,
    @Body() createMenuItemDto: CreateMenuItemDto,
  ) {
    return this.menusService.createMenuItem(tenantId, createMenuItemDto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get all menu items (admin view)' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'featured', required: false })
  @ApiQuery({ name: 'available', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllMenuItemsAdmin(
    @Param('tenantId') tenantId: string,
    @Query('categoryId') categoryId?: string,
    @Query('featured') featured?: string,
    @Query('available') available?: string,
    @Query('search') search?: string,
  ) {
    return this.menusService.findAllMenuItems(tenantId, {
      categoryId,
      featured: featured ? featured === 'true' : undefined,
      available: available ? available === 'true' : undefined,
      search,
    });
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  findMenuItemById(@Param('id') id: string) {
    return this.menusService.findMenuItemById(id);
  }

  @Patch('items/:id')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update menu item' })
  updateMenuItem(
    @Param('id') id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ) {
    return this.menusService.updateMenuItem(id, updateMenuItemDto);
  }

  @Patch('items/:id/toggle-availability')
  @Roles('ADMIN', 'OWNER', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'Toggle menu item availability' })
  toggleAvailability(@Param('id') id: string) {
    return this.menusService.toggleAvailability(id);
  }

  @Delete('items/:id')
  @Roles('ADMIN', 'OWNER')
  @ApiOperation({ summary: 'Delete menu item' })
  deleteMenuItem(@Param('id') id: string) {
    return this.menusService.deleteMenuItem(id);
  }

  // Customizations

  @Post('customizations')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Create customization group' })
  createCustomizationGroup(
    @Param('tenantId') tenantId: string,
    @Body() createCustomizationGroupDto: CreateCustomizationGroupDto,
  ) {
    return this.menusService.createCustomizationGroup(
      tenantId,
      createCustomizationGroupDto,
    );
  }

  @Get('customizations')
  @ApiOperation({ summary: 'Get all customization groups' })
  findAllCustomizationGroups(@Param('tenantId') tenantId: string) {
    return this.menusService.findAllCustomizationGroups(tenantId);
  }

  @Post('customizations/:groupId/options')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Add option to customization group' })
  createCustomizationOption(
    @Param('groupId') groupId: string,
    @Body() createCustomizationOptionDto: CreateCustomizationOptionDto,
  ) {
    return this.menusService.createCustomizationOption(
      groupId,
      createCustomizationOptionDto,
    );
  }

  @Post('items/:itemId/customizations/:groupId')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Attach customization to menu item' })
  attachCustomization(
    @Param('itemId') itemId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.menusService.attachCustomizationToMenuItem(itemId, groupId);
  }

  @Delete('items/:itemId/customizations/:groupId')
  @Roles('ADMIN', 'OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Remove customization from menu item' })
  detachCustomization(
    @Param('itemId') itemId: string,
    @Param('groupId') groupId: string,
  ) {
    return this.menusService.detachCustomizationFromMenuItem(itemId, groupId);
  }
}
