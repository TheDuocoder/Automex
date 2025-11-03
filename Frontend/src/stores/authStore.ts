/**
 * Zustand Auth Store
 * Manages user authentication state and user data
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRole: (role: Role | null) => void;
  setAuthData: (user: User, token: string, role: Role) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      setRole: (role) => set({ role }),

      setAuthData: (user, token, role) =>
        set({
          user,
          token,
          role,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

