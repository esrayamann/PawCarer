import { apiClient } from './apiClient';

export interface PetCreatePayload {
  name: string;
  petType: string;
  breed: string;
  age?: number;
  notes?: string;
}

export interface PetResponse {
  id: string;
  ownerId: string;
  name: string;
  petType: string;
  breed: string;
  age?: number;
  notes?: string;
}

export const petService = {
  createPet: async (payload: PetCreatePayload): Promise<PetResponse> => {
    const response = await apiClient.post<PetResponse>('/pets', payload);
    return response.data;
  },
};
