import { apiClient } from './apiClient';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: 'OWNER' | 'SITTER';
  location?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  role: 'OWNER' | 'SITTER' | 'ADMIN';
  location?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },
};
