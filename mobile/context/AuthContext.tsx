import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveToken, removeToken } from '../services/apiClient';
import type { UserInfo } from '../services/authService';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Uygulama açılırken kayıtlı token'ı kontrol et
    const loadStoredAuth = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('pawcarer_jwt');
        const storedUser = await SecureStore.getItemAsync('pawcarer_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        // Hata varsa temizle
        await SecureStore.deleteItemAsync('pawcarer_jwt');
        await SecureStore.deleteItemAsync('pawcarer_user');
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  const login = async (newToken: string, newUser: UserInfo) => {
    await saveToken(newToken);
    await SecureStore.setItemAsync('pawcarer_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await removeToken();
    await SecureStore.deleteItemAsync('pawcarer_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: UserInfo) => {
    setUser(updatedUser);
    SecureStore.setItemAsync('pawcarer_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
