/**
 * Authentication Context
 * Provides authentication state and functions throughout the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, loginUser, logoutUser, getCurrentUser } from '@/services/authService';
import { removeAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user data from Zustand store on mount
  useEffect(() => {
    const store = useAuthStore.getState();
    
    // Restore from Zustand (which persists to localStorage)
    if (store.user && store.token) {
      setUser(store.user);
    }
    
    setIsLoading(false);
  }, []);

  async function checkAuth() {
    try {
      const userData = await getCurrentUser();
      setUser(userData || null);
    } catch (error) {
      console.error('Failed to get user:', error);
      // Clear invalid token on any error
      removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const loginResponse = await loginUser(email, password);
    // Set user from login response (includes role information)
    setUser(loginResponse.user);
    // Zustand store is already updated in loginUser function
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  async function refreshUser() {
    try {
      const userData = await getCurrentUser();
      setUser(userData || null);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

