/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { apiCall, setAuthToken, removeAuthToken, getAuthHeader, API_BASE_URL } from './api';

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
 * Login response interface
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
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
 */
export async function loginUser(email: string, password: string) {
  // FastAPI Users expects form data for login
  const formData = new URLSearchParams();
  formData.append('username', email); // FastAPI Users uses 'username' field
  formData.append('password', password);

  try {
    const url = `${API_BASE_URL}/api/v1/auth/jwt/login`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Invalid email or password');
    }

    const data: LoginResponse = await response.json();
    
    // Store the access token
    setAuthToken(data.access_token);
    
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
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const response = await apiCall<User>('/api/v1/auth/me', {
    method: 'GET',
    headers: getAuthHeader(),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

