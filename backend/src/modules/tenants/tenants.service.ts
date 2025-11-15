import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateTenantDto, UpdateTenantDto, UpdateBrandingDto, NearbyTenantsDto } from './dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new tenant (coffee shop onboarding)
   */
  async create(createTenantDto: CreateTenantDto) {
    // Check if slug is already taken
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: createTenantDto.slug },
    });

    if (existingTenant) {
      throw new ConflictException(`Tenant with slug '${createTenantDto.slug}' already exists`);
    }

    // Check if email is already registered
    const existingEmail = await this.prisma.tenant.findFirst({
      where: { email: createTenantDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    // Create tenant with default branding
    const tenant = await this.prisma.tenant.create({
      data: {
        ...createTenantDto,
        branding: {
          create: {
            // Default branding colors will be used from Prisma schema defaults
          },
        },
      },
      include: {
        branding: true,
      },
    });

    return tenant;
  }

  /**
   * Get all tenants (for customer discovery)
   * Supports pagination and filtering
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: any;
    orderBy?: any;
  }) {
    const { skip = 0, take = 20, where = {}, orderBy = { createdAt: 'desc' } } = params || {};

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take,
        where: {
          ...where,
          isActive: true,
          status: 'ACTIVE',
        },
        include: {
          branding: true,
          _count: {
            select: {
              orders: true,
              reviews: true,
            },
          },
        },
        orderBy,
      }),
      this.prisma.tenant.count({
        where: {
          ...where,
          isActive: true,
          status: 'ACTIVE',
        },
      }),
    ]);

    return {
      data: tenants,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        perPage: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Get tenant by slug (for customer viewing)
   */
  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        branding: true,
        categories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            menuItems: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with slug '${slug}' not found`);
    }

    if (!tenant.isActive || tenant.status !== 'ACTIVE') {
      throw new NotFoundException('Coffee shop is not available');
    }

    // Calculate average rating
    const ratingData = await this.prisma.review.aggregate({
      where: {
        tenantId: tenant.id,
        isApproved: true,
      },
      _avg: {
        rating: true,
      },
    });

    return {
      ...tenant,
      averageRating: ratingData._avg.rating || 0,
    };
  }

  /**
   * Get tenant by ID (for admin/staff)
   */
  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        branding: true,
        staff: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  /**
   * Find nearby tenants using geolocation
   */
  async findNearby(nearbyDto: NearbyTenantsDto) {
    const { latitude, longitude, radius = 5, limit = 20 } = nearbyDto;

    // Using Haversine formula to calculate distance
    // This is a raw SQL query for PostgreSQL with PostGIS-like functionality
    const tenants = await this.prisma.$queryRaw`
      SELECT
        t.*,
        tb.primary_color as "primaryColor",
        tb.logo_url as "brandingLogoUrl",
        (
          6371 * acos(
            cos(radians(${latitude}))
            * cos(radians(t.latitude::float))
            * cos(radians(t.longitude::float) - radians(${longitude}))
            + sin(radians(${latitude}))
            * sin(radians(t.latitude::float))
          )
        ) AS distance_km
      FROM tenants t
      LEFT JOIN tenant_branding tb ON t.id = tb.tenant_id
      WHERE t.latitude IS NOT NULL
        AND t.longitude IS NOT NULL
        AND t.is_active = true
        AND t.status = 'ACTIVE'
        AND (
          6371 * acos(
            cos(radians(${latitude}))
            * cos(radians(t.latitude::float))
            * cos(radians(t.longitude::float) - radians(${longitude}))
            + sin(radians(${latitude}))
            * sin(radians(t.latitude::float))
          )
        ) <= ${radius}
      ORDER BY distance_km ASC
      LIMIT ${limit}
    `;

    return tenants;
  }

  /**
   * Update tenant information (admin/owner only)
   */
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // If slug is being changed, check for conflicts
    if (updateTenantDto.slug && updateTenantDto.slug !== tenant.slug) {
      const existingSlug = await this.prisma.tenant.findUnique({
        where: { slug: updateTenantDto.slug },
      });
      if (existingSlug) {
        throw new ConflictException(`Slug '${updateTenantDto.slug}' is already taken`);
      }
    }

    // If email is being changed, check for conflicts
    if (updateTenantDto.email && updateTenantDto.email !== tenant.email) {
      const existingEmail = await this.prisma.tenant.findFirst({
        where: { email: updateTenantDto.email },
      });
      if (existingEmail) {
        throw new ConflictException('Email is already registered');
      }
    }

    const updatedTenant = await this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
      include: {
        branding: true,
      },
    });

    return updatedTenant;
  }

  /**
   * Update tenant branding
   */
  async updateBranding(tenantId: string, updateBrandingDto: UpdateBrandingDto) {
    // Check if tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { branding: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Update or create branding
    const branding = await this.prisma.tenantBranding.upsert({
      where: { tenantId },
      update: updateBrandingDto,
      create: {
        tenantId,
        ...updateBrandingDto,
      },
    });

    return branding;
  }

  /**
   * Soft delete tenant
   */
  async remove(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Check if tenant is open now
   */
  async isOpenNow(slug: string): Promise<boolean> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: { businessHours: true, timezone: true },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Get current day and time in tenant's timezone
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];

    const hours = tenant.businessHours as any;
    const todayHours = hours[currentDay];

    if (!todayHours || todayHours.closed) {
      return false;
    }

    // Parse current time (simplified - would use timezone in production)
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  }

  /**
   * Get tenant statistics (for admin dashboard)
   */
  async getStatistics(tenantId: string) {
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      averageRating,
      popularItems,
    ] = await Promise.all([
      // Total orders
      this.prisma.order.count({
        where: {
          tenantId,
          status: 'COMPLETED',
        },
      }),

      // Total revenue
      this.prisma.order.aggregate({
        where: {
          tenantId,
          status: 'COMPLETED',
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Unique customers
      this.prisma.order.findMany({
        where: { tenantId },
        distinct: ['userId'],
        select: { userId: true },
      }),

      // Average rating
      this.prisma.review.aggregate({
        where: {
          tenantId,
          isApproved: true,
        },
        _avg: {
          rating: true,
        },
      }),

      // Popular items (top 5)
      this.prisma.orderItem.groupBy({
        by: ['menuItemId'],
        where: {
          order: {
            tenantId,
            status: 'COMPLETED',
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalCustomers: totalCustomers.length,
      averageRating: averageRating._avg.rating || 0,
      popularItems,
    };
  }
}
