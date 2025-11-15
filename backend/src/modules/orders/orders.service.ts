import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new order
   */
  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { tenantId, items, orderType, scheduledFor, notes, loyaltyPointsToUse, promotionCode } =
      createOrderDto;

    // Verify tenant exists and is active
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant || !tenant.isActive) {
      throw new BadRequestException('Coffee shop is not available');
    }

    // Fetch all menu items to validate and calculate pricing
    const menuItemIds = items.map((item) => item.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        tenantId,
        deletedAt: null,
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new BadRequestException('One or more menu items not found');
    }

    // Check if all items are available
    const unavailableItems = menuItems.filter((item) => !item.isAvailable);
    if (unavailableItems.length > 0) {
      throw new BadRequestException(
        `Items not available: ${unavailableItems.map((i) => i.name).join(', ')}`,
      );
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId);
      if (!menuItem) throw new Error('Menu item not found');

      // Calculate base price
      let unitPrice = Number(menuItem.basePrice);

      // Add customization prices
      if (item.customizations) {
        const customizationTotal = item.customizations.reduce(
          (sum, c) => sum + Number(c.price),
          0,
        );
        unitPrice += customizationTotal;
      }

      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      return {
        menuItemId: item.menuItemId,
        itemName: menuItem.name,
        itemImageUrl: menuItem.imageUrl,
        quantity: item.quantity,
        unitPrice,
        customizations: item.customizations || [],
        subtotal: itemSubtotal,
        specialInstructions: item.specialInstructions,
      };
    });

    // Apply loyalty points discount
    let loyaltyDiscount = 0;
    if (loyaltyPointsToUse && loyaltyPointsToUse > 0) {
      const userLoyalty = await this.prisma.userLoyalty.findFirst({
        where: { userId, tenantId },
      });

      if (!userLoyalty || userLoyalty.pointsBalance < loyaltyPointsToUse) {
        throw new BadRequestException('Insufficient loyalty points');
      }

      // Example: 100 points = 10 TRY discount
      loyaltyDiscount = loyaltyPointsToUse / 10;
    }

    // Apply promotion code discount
    let discountAmount = 0;
    if (promotionCode) {
      const promotion = await this.prisma.promotion.findFirst({
        where: {
          code: promotionCode,
          tenantId,
          isActive: true,
        },
      });

      if (promotion) {
        // Check validity dates
        const now = new Date();
        if (
          (promotion.validFrom && now < promotion.validFrom) ||
          (promotion.validUntil && now > promotion.validUntil)
        ) {
          throw new BadRequestException('Promotion code is not valid');
        }

        // Check usage limits
        if (promotion.maxUses && promotion.currentUses >= promotion.maxUses) {
          throw new BadRequestException('Promotion code usage limit reached');
        }

        // Calculate discount
        if (promotion.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(promotion.discountValue)) / 100;
          if (promotion.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, Number(promotion.maxDiscountAmount));
          }
        } else if (promotion.discountType === 'FIXED_AMOUNT') {
          discountAmount = Number(promotion.discountValue);
        }
      }
    }

    // Calculate final total
    const taxAmount = 0; // Can add tax calculation here
    const totalAmount = subtotal + taxAmount - discountAmount - loyaltyDiscount;

    // Generate order number
    const orderCount = await this.prisma.order.count();
    const orderNumber = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(
      orderCount + 1,
    ).padStart(4, '0')}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        tenantId,
        userId,
        orderType: orderType || 'PICKUP',
        status: 'PENDING',
        subtotal,
        taxAmount,
        discountAmount,
        loyaltyPointsUsed: loyaltyPointsToUse || 0,
        loyaltyDiscount,
        totalAmount,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        notes,
        items: {
          create: orderItems,
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Order created',
          },
        },
      },
      include: {
        items: true,
        tenant: {
          select: {
            id: true,
            businessName: true,
            slug: true,
          },
        },
      },
    });

    return order;
  }

  /**
   * Get user's order history
   */
  async findUserOrders(userId: string, params?: { limit?: number; offset?: number }) {
    const { limit = 20, offset = 0 } = params || {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          tenant: {
            select: {
              id: true,
              businessName: true,
              slug: true,
              logoUrl: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  /**
   * Get tenant's orders
   */
  async findTenantOrders(
    tenantId: string,
    params?: {
      status?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const { status, limit = 50, offset = 0 } = params || {};

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          tenantId,
          ...(status && { status: status as any }),
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.order.count({
        where: {
          tenantId,
          ...(status && { status: status as any }),
        },
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  /**
   * Get order by ID
   */
  async findOne(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        tenant: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            phone: true,
            addressLine1: true,
            city: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If userId provided, verify ownership
    if (userId && order.userId !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    updateStatusDto: UpdateOrderStatusDto,
    changedBy?: string,
  ) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    this.validateStatusTransition(order.status, updateStatusDto.status as any);

    // Update order
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateStatusDto.status as any,
        ...(updateStatusDto.status === 'READY' && { readyAt: new Date() }),
        ...(updateStatusDto.status === 'COMPLETED' && { completedAt: new Date() }),
        ...(updateStatusDto.status === 'CANCELLED' && {
          cancelledAt: new Date(),
          cancellationReason: updateStatusDto.notes,
        }),
        statusHistory: {
          create: {
            status: updateStatusDto.status as any,
            changedBy,
            notes: updateStatusDto.notes,
          },
        },
      },
      include: {
        items: true,
        tenant: true,
      },
    });

    // TODO: Send notification to user about status change
    // await this.notificationsService.sendOrderStatusUpdate(updatedOrder);

    return updatedOrder;
  }

  /**
   * Cancel order (by customer)
   */
  async cancel(orderId: string, userId: string, reason?: string) {
    const order = await this.findOne(orderId, userId);

    // Can only cancel if not yet preparing
    if (!['PENDING', 'PAID', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.updateStatus(
      orderId,
      {
        status: 'CANCELLED',
        notes: reason || 'Cancelled by customer',
      },
      userId,
    );
  }

  /**
   * Get order statistics
   */
  async getStatistics(tenantId: string, period?: 'today' | 'week' | 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    const [totalOrders, revenue, activeOrders] = await Promise.all([
      this.prisma.order.count({
        where: {
          tenantId,
          createdAt: { gte: startDate },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          tenantId,
          status: 'COMPLETED',
          createdAt: { gte: startDate },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: {
          tenantId,
          status: { in: ['CONFIRMED', 'PREPARING', 'READY'] },
        },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
      activeOrders,
      period,
    };
  }

  /**
   * Validate status transition logic
   */
  private validateStatusTransition(currentStatus: string, newStatus: string) {
    const validTransitions: { [key: string]: string[] } = {
      PENDING: ['PAID', 'CANCELLED'],
      PAID: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
      READY: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
