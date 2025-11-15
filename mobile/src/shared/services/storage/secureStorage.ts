import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: '@auth/access_token',
  REFRESH_TOKEN: '@auth/refresh_token',
  USER: '@auth/user',
  CURRENT_TENANT: '@app/current_tenant',
};

export const secureStorage = {
  // Access Token
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, token);
  },

  async removeAccessToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.ACCESS_TOKEN);
  },

  // Refresh Token
  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);
  },

  async removeRefreshToken(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.REFRESH_TOKEN);
  },

  // User
  async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  // Current Tenant
  async getCurrentTenant(): Promise<any | null> {
    const tenant = await AsyncStorage.getItem(KEYS.CURRENT_TENANT);
    return tenant ? JSON.parse(tenant) : null;
  },

  async setCurrentTenant(tenant: any): Promise<void> {
    await AsyncStorage.setItem(KEYS.CURRENT_TENANT, JSON.stringify(tenant));
  },

  async removeCurrentTenant(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.CURRENT_TENANT);
  },

  // Clear all
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.USER,
      KEYS.CURRENT_TENANT,
    ]);
  },
};
