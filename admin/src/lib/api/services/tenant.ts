import { apiClient } from '../client';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  email?: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
  operatingHours?: Record<string, { open: string; close: string; closed: boolean }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface UpdateTenantDto {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
  };
  operatingHours?: Record<string, { open: string; close: string; closed: boolean }>;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export const tenantApi = {
  getTenant: async (tenantId: string): Promise<Tenant> => {
    return apiClient.get(`/admin/tenants/${tenantId}`);
  },

  updateTenant: async (
    tenantId: string,
    data: UpdateTenantDto
  ): Promise<Tenant> => {
    return apiClient.patch(`/admin/tenants/${tenantId}`, data);
  },

  updateBranding: async (
    tenantId: string,
    branding: {
      primaryColor?: string;
      secondaryColor?: string;
      logoUrl?: string;
    }
  ): Promise<Tenant> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/branding`, branding);
  },

  updateOperatingHours: async (
    tenantId: string,
    hours: Record<string, { open: string; close: string; closed: boolean }>
  ): Promise<Tenant> => {
    return apiClient.patch(`/admin/tenants/${tenantId}/operating-hours`, {
      operatingHours: hours,
    });
  },
};
