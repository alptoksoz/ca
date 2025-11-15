import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateCustomizationGroupDto,
  CreateCustomizationOptionDto,
} from './dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CATEGORIES
  // ============================================

  async createCategory(tenantId: string, createCategoryDto: CreateCategoryDto) {
    // Check if slug exists for this tenant
    const existing = await this.prisma.category.findFirst({
      where: {
        tenantId,
        slug: createCategoryDto.slug,
      },
    });

    if (existing) {
      throw new ConflictException('Category slug already exists for this tenant');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        tenantId,
      },
    });
  }

  async findAllCategories(tenantId: string, includeInactive = false) {
    return this.prisma.category.findMany({
      where: {
        tenantId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true, deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check slug conflict if being updated
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existing = await this.prisma.category.findFirst({
        where: {
          tenantId: category.tenantId,
          slug: updateCategoryDto.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Category slug already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { menuItems: true } } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.menuItems > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing menu items. Move or delete items first.',
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }

  // ============================================
  // MENU ITEMS
  // ============================================

  async createMenuItem(tenantId: string, createMenuItemDto: CreateMenuItemDto) {
    // Check slug uniqueness
    const existing = await this.prisma.menuItem.findFirst({
      where: {
        tenantId,
        slug: createMenuItemDto.slug,
      },
    });

    if (existing) {
      throw new ConflictException('Menu item slug already exists for this tenant');
    }

    // Verify category belongs to tenant if provided
    if (createMenuItemDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: createMenuItemDto.categoryId,
          tenantId,
        },
      });

      if (!category) {
        throw new BadRequestException('Invalid category for this tenant');
      }
    }

    return this.prisma.menuItem.create({
      data: {
        ...createMenuItemDto,
        tenantId,
        tags: createMenuItemDto.tags || [],
        allergens: createMenuItemDto.allergens || [],
      },
      include: {
        category: true,
      },
    });
  }

  async findAllMenuItems(
    tenantId: string,
    params?: {
      categoryId?: string;
      featured?: boolean;
      available?: boolean;
      search?: string;
    },
  ) {
    const { categoryId, featured, available, search } = params || {};

    return this.prisma.menuItem.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(categoryId && { categoryId }),
        ...(featured !== undefined && { isFeatured: featured }),
        ...(available !== undefined && { isAvailable: available }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: true,
        customizations: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });
  }

  async findMenuItemById(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        tenant: {
          select: {
            id: true,
            businessName: true,
            slug: true,
          },
        },
        customizations: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!menuItem || menuItem.deletedAt) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async findMenuItemBySlug(tenantId: string, slug: string) {
    const menuItem = await this.prisma.menuItem.findFirst({
      where: {
        tenantId,
        slug,
        deletedAt: null,
      },
      include: {
        category: true,
        customizations: {
          include: {
            customizationGroup: {
              include: {
                options: {
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem || menuItem.deletedAt) {
      throw new NotFoundException('Menu item not found');
    }

    // Check slug conflict
    if (updateMenuItemDto.slug && updateMenuItemDto.slug !== menuItem.slug) {
      const existing = await this.prisma.menuItem.findFirst({
        where: {
          tenantId: menuItem.tenantId,
          slug: updateMenuItemDto.slug,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Menu item slug already exists');
      }
    }

    // Verify category if being updated
    if (updateMenuItemDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: updateMenuItemDto.categoryId,
          tenantId: menuItem.tenantId,
        },
      });

      if (!category) {
        throw new BadRequestException('Invalid category');
      }
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
      include: {
        category: true,
      },
    });
  }

  async deleteMenuItem(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    // Soft delete
    return this.prisma.menuItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async toggleAvailability(id: string) {
    const menuItem = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !menuItem.isAvailable },
    });
  }

  // ============================================
  // CUSTOMIZATIONS
  // ============================================

  async createCustomizationGroup(
    tenantId: string,
    createCustomizationGroupDto: CreateCustomizationGroupDto,
  ) {
    return this.prisma.customizationGroup.create({
      data: {
        ...createCustomizationGroupDto,
        tenantId,
      },
    });
  }

  async findAllCustomizationGroups(tenantId: string) {
    return this.prisma.customizationGroup.findMany({
      where: { tenantId },
      include: {
        options: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async createCustomizationOption(
    groupId: string,
    createCustomizationOptionDto: CreateCustomizationOptionDto,
  ) {
    // Verify group exists
    const group = await this.prisma.customizationGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Customization group not found');
    }

    return this.prisma.customizationOption.create({
      data: {
        ...createCustomizationOptionDto,
        groupId,
      },
    });
  }

  async attachCustomizationToMenuItem(menuItemId: string, groupId: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    const group = await this.prisma.customizationGroup.findUnique({
      where: { id: groupId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }
    if (!group) {
      throw new NotFoundException('Customization group not found');
    }

    // Verify same tenant
    if (menuItem.tenantId !== group.tenantId) {
      throw new BadRequestException(
        'Menu item and customization group must belong to same tenant',
      );
    }

    return this.prisma.menuItemCustomization.create({
      data: {
        menuItemId,
        customizationGroupId: groupId,
      },
    });
  }

  async detachCustomizationFromMenuItem(menuItemId: string, groupId: string) {
    return this.prisma.menuItemCustomization.delete({
      where: {
        menuItemId_customizationGroupId: {
          menuItemId,
          customizationGroupId: groupId,
        },
      },
    });
  }

  // ============================================
  // FULL MENU (for customer view)
  // ============================================

  async getFullMenu(tenantSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const categories = await this.prisma.category.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        menuItems: {
          where: {
            isAvailable: true,
            deletedAt: null,
          },
          orderBy: { sortOrder: 'asc' },
          include: {
            customizations: {
              include: {
                customizationGroup: {
                  include: {
                    options: {
                      orderBy: { sortOrder: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return categories;
  }
}
