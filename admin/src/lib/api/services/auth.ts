import { apiClient } from '../client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId?: string;
  };
}

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    return apiClient.post('/auth/login', data);
  },

  logout: () => {
    apiClient.clearToken();
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },
};
