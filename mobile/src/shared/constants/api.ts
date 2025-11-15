export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3000/api/v1'
    : 'https://api.coffeeapp.com/api/v1',
  TIMEOUT: 10000,
};

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Tenants
  TENANTS: {
    LIST: '/tenants',
    NEARBY: '/tenants/nearby',
    DETAIL: (slug: string) => `/tenants/${slug}`,
    IS_OPEN: (slug: string) => `/tenants/${slug}/open`,
  },

  // Menu
  MENU: {
    FULL_MENU: (tenantSlug: string) => `/tenants/${tenantSlug}/menu`,
    ITEMS: (tenantSlug: string) => `/tenants/${tenantSlug}/menu/items`,
    ITEM_DETAIL: (tenantSlug: string, slug: string) =>
      `/tenants/${tenantSlug}/menu/items/${slug}`,
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },
};
