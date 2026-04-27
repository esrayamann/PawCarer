import { apiClient } from './apiClient';

export interface SitterResponse {
  id: string;
  userId: string;
  fullName: string;
  location?: string;
  hourlyRate?: number;
  acceptedPetTypes?: string[];
  acceptedPetBreeds?: string[];
  bio?: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface Review {
  id: string;
  reviewerId?: string;
  rating: number;
  comment: string;
  reviewerName?: string;
  createdAt?: string;
}

export interface SitterDetail extends SitterResponse {
  reviews: Review[];
}

export interface SitterSearchParams {
  location?: string;
  petType?: string;
  petBreed?: string;
}

export interface SitterUpdatePayload {
  hourlyRate?: number;
  acceptedPetTypes?: string[];
  acceptedPetBreeds?: string[];
  bio?: string;
}

export const sitterService = {
  searchSitters: async (params: SitterSearchParams): Promise<SitterResponse[]> => {
    const response = await apiClient.get<SitterResponse[]>('/sitters', { params });
    return response.data;
  },

  getSitterById: async (sitterId: string): Promise<SitterDetail> => {
    const response = await apiClient.get<SitterDetail>(`/sitters/${sitterId}`);
    return response.data;
  },

  // Kullanıcının kendi bakıcı profilini userId üzerinden getirir
  getMySitterProfile: async (userId: string): Promise<SitterDetail | null> => {
    // Tüm bakıcıları çekip userId'ye göre filtrele
    const response = await apiClient.get<SitterResponse[]>('/sitters');
    const all = response.data;
    const mine = all.find((s) => s.userId === userId);
    if (!mine) return null;
    // Detayları getir
    const detail = await apiClient.get<SitterDetail>(`/sitters/${mine.id}`);
    return detail.data;
  },

  updateSitter: async (
    sitterId: string,
    payload: SitterUpdatePayload
  ): Promise<SitterResponse> => {
    const response = await apiClient.put<SitterResponse>(`/sitters/${sitterId}`, payload);
    return response.data;
  },

  addReview: async (
    sitterId: string,
    payload: { rating: number; comment: string }
  ): Promise<Review> => {
    const response = await apiClient.post<Review>(`/sitters/${sitterId}/reviews`, payload);
    return response.data;
  },
};
