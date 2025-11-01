/**
 * Authentication Context
 * Provides authentication state and functions throughout the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, loginUser, logoutUser, getCurrentUser, isAuthenticated } from '@/services/authService';

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

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    if (isAuthenticated()) {
      try {
        const userData = await getCurrentUser();
        setUser(userData || null);
      } catch (error) {
        console.error('Failed to get user:', error);
        setUser(null);
      }
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    await loginUser(email, password);
    await refreshUser();
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

