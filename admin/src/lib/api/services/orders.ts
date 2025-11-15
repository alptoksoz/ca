import { apiClient } from '../client';

export interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    basePrice: number;
    subtotal: number;
    customizations: Array<{
      name: string;
      priceModifier: number;
    }>;
    specialInstructions?: string;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  specialInstructions?: string;
  estimatedReadyTime?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
}

export interface OrderStats {
  todayOrders: number;
  todayRevenue: number;
  activeOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export const ordersApi = {
  getAll: async (tenantId: string, params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Order[]; total: number }> => {
    return apiClient.get(`/admin/tenants/${tenantId}/orders`, { params });
  },

  getById: async (tenantId: string, orderId: string): Promise<Order> => {
    return apiClient.get(`/admin/tenants/${tenantId}/orders/${orderId}`);
  },

  updateStatus: async (
    tenantId: string,
    orderId: string,
    status: Order['status']
  ): Promise<Order> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/orders/${orderId}/status`, {
      status,
    });
  },

  getStats: async (tenantId: string): Promise<OrderStats> => {
    return apiClient.get(`/admin/tenants/${tenantId}/orders/stats`);
  },

  cancelOrder: async (tenantId: string, orderId: string): Promise<Order> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/orders/${orderId}/cancel`);
  },
};
