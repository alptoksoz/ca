import { apiClient } from './client';

export interface OrderItemCustomization {
  customizationOptionId: string;
  name: string;
  priceModifier: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  customizations: OrderItemCustomization[];
  subtotal: number;
  specialInstructions: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
  total: number;
  specialInstructions: string | null;
  scheduledFor: string | null;
  estimatedReadyTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemDto {
  menuItemId: string;
  quantity: number;
  customizations: Array<{
    customizationOptionId: string;
  }>;
  specialInstructions?: string;
}

export interface CreateOrderDto {
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  items: CreateOrderItemDto[];
  paymentMethodId?: string;
  promotionCode?: string;
  loyaltyPointsToUse?: number;
  deliveryAddressId?: string;
  specialInstructions?: string;
  scheduledFor?: string;
}

export const ordersApi = {
  createOrder: async (tenantSlug: string, data: CreateOrderDto): Promise<Order> => {
    return apiClient.post(`/tenants/${tenantSlug}/orders`, data);
  },

  getMyOrders: async (tenantSlug: string): Promise<Order[]> => {
    return apiClient.get(`/tenants/${tenantSlug}/orders/my-orders`);
  },

  getOrderById: async (tenantSlug: string, orderId: string): Promise<Order> => {
    return apiClient.get(`/tenants/${tenantSlug}/orders/${orderId}`);
  },

  cancelOrder: async (tenantSlug: string, orderId: string): Promise<Order> => {
    return apiClient.patch(`/tenants/${tenantSlug}/orders/${orderId}/cancel`);
  },
};
