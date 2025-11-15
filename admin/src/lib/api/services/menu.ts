import { apiClient } from '../client';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime: number;
  calories?: number;
  tags: string[];
  allergens: string[];
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  imageUrl?: string;
  isActive: boolean;
  menuItems?: MenuItem[];
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  displayOrder: number;
  imageUrl?: string;
}

export interface CreateMenuItemDto {
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  imageUrl?: string;
  preparationTime: number;
  calories?: number;
  tags?: string[];
  allergens?: string[];
  isAvailable?: boolean;
}

export const menuApi = {
  // Categories
  getCategories: async (tenantId: string): Promise<Category[]> => {
    return apiClient.get(`/admin/tenants/${tenantId}/categories`);
  },

  createCategory: async (
    tenantId: string,
    data: CreateCategoryDto
  ): Promise<Category> => {
    return apiClient.post(`/admin/tenants/${tenantId}/categories`, data);
  },

  updateCategory: async (
    tenantId: string,
    categoryId: string,
    data: Partial<CreateCategoryDto>
  ): Promise<Category> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/categories/${categoryId}`, data);
  },

  deleteCategory: async (tenantId: string, categoryId: string): Promise<void> => {
    return apiClient.delete(`/admin/tenants/${tenantId}/categories/${categoryId}`);
  },

  // Menu Items
  getMenuItems: async (tenantId: string, categoryId?: string): Promise<MenuItem[]> => {
    const params = categoryId ? { categoryId } : {};
    return apiClient.get(`/admin/tenants/${tenantId}/menu-items`, { params });
  },

  createMenuItem: async (
    tenantId: string,
    data: CreateMenuItemDto
  ): Promise<MenuItem> => {
    return apiClient.post(`/admin/tenants/${tenantId}/menu-items`, data);
  },

  updateMenuItem: async (
    tenantId: string,
    itemId: string,
    data: Partial<CreateMenuItemDto>
  ): Promise<MenuItem> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/menu-items/${itemId}`, data);
  },

  deleteMenuItem: async (tenantId: string, itemId: string): Promise<void> => {
    return apiClient.delete(`/admin/tenants/${tenantId}/menu-items/${itemId}`);
  },

  toggleItemAvailability: async (
    tenantId: string,
    itemId: string,
    isAvailable: boolean
  ): Promise<MenuItem> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/menu-items/${itemId}`, {
      isAvailable,
    });
  },
};
