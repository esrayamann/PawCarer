import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Production (Vercel — RabbitMQ yok):
// const BASE_URL = 'https://paw-carer.vercel.app/api';

// Local Docker backend (RabbitMQ aktif):
const BASE_URL = 'http://172.20.10.2:3000/api';
const TOKEN_KEY = 'pawcarer_jwt';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: her istekte JWT token ekle
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Token okunamazsa devam et
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: 401 → token temizle
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export const saveToken = (token: string) =>
  SecureStore.setItemAsync(TOKEN_KEY, token);

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);

export const removeToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);
