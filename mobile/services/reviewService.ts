import { apiClient } from './apiClient';

export interface ReviewUpdatePayload {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  sitterId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewService = {
  updateReview: async (reviewId: string, payload: ReviewUpdatePayload): Promise<ReviewResponse> => {
    const response = await apiClient.put<ReviewResponse>(`/reviews/${reviewId}`, payload);
    return response.data;
  },
};
