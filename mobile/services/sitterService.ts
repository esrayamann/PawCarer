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

export const sitterService = {
  searchSitters: async (params: SitterSearchParams): Promise<SitterResponse[]> => {
    const response = await apiClient.get<SitterResponse[]>('/sitters', { params });
    return response.data;
  },

  getSitterById: async (sitterId: string): Promise<SitterDetail> => {
    const response = await apiClient.get<SitterDetail>(`/sitters/${sitterId}`);
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
