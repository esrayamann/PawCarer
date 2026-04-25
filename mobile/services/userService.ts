import { apiClient } from './apiClient';
import type { UserInfo } from './authService';

export interface UserUpdatePayload {
  fullName?: string;
  location?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export const userService = {
  getUser: async (userId: string): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, payload: UserUpdatePayload): Promise<UserInfo> => {
    const response = await apiClient.put<UserInfo>(`/users/${userId}`, payload);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },
};
