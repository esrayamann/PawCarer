import { apiClient } from './apiClient';
import type { UserInfo } from './authService';

export type UserRole = 'OWNER' | 'SITTER' | 'ADMIN';

export const adminService = {
  deleteReview: async (reviewId: string): Promise<void> => {
    await apiClient.delete(`/admin/reviews/${reviewId}`);
  },

  deleteSitter: async (sitterId: string): Promise<void> => {
    await apiClient.delete(`/admin/sitters/${sitterId}`);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  updateUserRole: async (userId: string, role: UserRole): Promise<UserInfo> => {
    const response = await apiClient.put<UserInfo>(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  getAllUsers: async (): Promise<UserInfo[]> => {
    const response = await apiClient.get<UserInfo[]>('/admin/users');
    return response.data;
  },

  getAllReviews: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/admin/reviews');
    return response.data;
  },

  getAllSitters: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/admin/sitters');
    return response.data;
  },
};
