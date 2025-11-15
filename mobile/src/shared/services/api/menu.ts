import { apiClient } from './client';

export interface CustomizationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  required: boolean;
  minSelections: number;
  maxSelections: number;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string | null;
  isAvailable: boolean;
  preparationTime: number;
  calories: number | null;
  tags: string[];
  allergens: string[];
  customizations: CustomizationGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  imageUrl: string | null;
  menuItems: MenuItem[];
}

export interface FullMenu {
  tenant: {
    id: string;
    name: string;
    slug: string;
    branding: {
      primaryColor: string;
      secondaryColor: string;
      logoUrl: string | null;
    };
  };
  categories: MenuCategory[];
}

export const menuApi = {
  getFullMenu: async (tenantSlug: string): Promise<FullMenu> => {
    return apiClient.get(`/tenants/${tenantSlug}/menu`);
  },

  getCategory: async (tenantSlug: string, categoryId: string): Promise<MenuCategory> => {
    return apiClient.get(`/tenants/${tenantSlug}/categories/${categoryId}`);
  },

  getMenuItem: async (tenantSlug: string, itemId: string): Promise<MenuItem> => {
    return apiClient.get(`/tenants/${tenantSlug}/menu-items/${itemId}`);
  },
};
