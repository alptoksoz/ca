import { apiClient } from './client';
import { ENDPOINTS } from '@/shared/constants/api';

export interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterDto {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export const authApi = {
  login: (data: LoginDto) =>
    apiClient.post<{ data: AuthResponse }>(ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterDto) =>
    apiClient.post<{ data: AuthResponse }>(ENDPOINTS.AUTH.REGISTER, data),

  refresh: (refreshToken: string) =>
    apiClient.post<{ data: AuthResponse }>(ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    }),

  logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),

  forgotPassword: (email: string) =>
    apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password }),
};
