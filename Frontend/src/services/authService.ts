/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiCall, setAuthToken, removeAuthToken, getAuthHeader, API_BASE_URL } from './api';
import { useAuthStore } from '@/stores/authStore';

/**
 * Role interface
 */
export interface Role {
  id: number;
  name: string;
  description?: string;
}

/**
 * User interface
 */
export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone_number?: string;
  is_active: boolean;
  is_verified: boolean;
  is_superuser: boolean;
  role_id?: number;
  role?: Role;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
}

/**
 * Login data interface
 */
export interface LoginData {
  username: string; // FastAPI Users uses 'username' field for email
  password: string;
}

/**
 * User interface with role
 */
export interface UserWithRole extends User {
  role_id: number;
  role: Role;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserWithRole;
  role: Role;
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData) {
  const response = await apiCall<User>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

/**
 * Login user
 * Uses the custom login endpoint that accepts email and password as JSON
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    // Construct URL - handle empty API_BASE_URL for relative paths
    const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/auth/login` : '/api/v1/auth/login';

    console.log('[Auth] Login request URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Invalid email or password');
    }

    const data: LoginResponse = await response.json();

    console.log('[Auth] Login successful, storing token. Token length:', data.access_token?.length || 0);

    // Store the access token in localStorage
    setAuthToken(data.access_token);

    // Verify token was stored
    const storedToken = localStorage.getItem('auth_token');
    console.log('[Auth] Token stored successfully:', !!storedToken, 'Length:', storedToken?.length || 0);

    // Store user data in localStorage for persistence
    localStorage.setItem('user_data', JSON.stringify(data.user));

    // Store in Zustand store
    const store = useAuthStore.getState();
    store.setAuthData(data.user, data.access_token, data.role);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed. Please try again.');
  }
}

/**
 * Logout user
 */
export async function logoutUser() {
  try {
    await apiCall('/api/v1/auth/jwt/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Remove token and user data from localStorage
    removeAuthToken();
    localStorage.removeItem('user_data');

    // Clear Zustand store
    useAuthStore.getState().clearAuth();
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const response = await apiCall<UserWithRole>('/api/v1/auth/me', {
    method: 'GET',
  });

  if (response.error) {
    throw new Error(response.error);
  }

  // Store updated user data in localStorage and Zustand
  if (response.data) {
    localStorage.setItem('user_data', JSON.stringify(response.data));
    // Update Zustand store
    const store = useAuthStore.getState();
    store.setUser(response.data);
  }

  return response.data || null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: Partial<User>): Promise<User> {
  // Update user profile using the /auth/me endpoint which supports PATCH
  // This endpoint was added to the backend to support profile updates

  const response = await apiCall<User>('/api/v1/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (response.error) {
    // If /users/me fails, let's try /auth/me just in case?
    // No, that's bad practice to try-catch endpoints.

    throw new Error(response.error);
  }

  if (response.data) {
    // Update localStorage
    localStorage.setItem('user_data', JSON.stringify(response.data));

    // Update Zustand store
    const store = useAuthStore.getState();
    store.setUser(response.data);

    return response.data;
  }

  throw new Error('Failed to update profile');
}
