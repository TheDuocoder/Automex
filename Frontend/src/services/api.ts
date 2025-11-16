/**
 * API Configuration and Base Service
 */

// API Base URL - Update this based on your environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Generic API call handler with error handling
 * Automatically includes JWT token in Authorization header
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Get auth token and include it in headers
    const authHeader = getAuthHeader();
    const token = getAuthToken();
    
    // Debug: Log token presence (only in development)
    if (import.meta.env.DEV && !token) {
      console.warn('[API] No auth token found in localStorage');
    }
    
    // Build headers - ensure auth header is included
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeader, // This includes Authorization: Bearer <token> if token exists
    };
    
    // Merge with any headers passed in options
    if (options.headers) {
      Object.assign(headers, options.headers);
    }
    
    // Debug: Log headers in development (but hide token value)
    if (import.meta.env.DEV && token) {
      console.log('[API] Request:', {
        url,
        method: options.method || 'GET',
        hasAuth: !!headers.Authorization,
        authPrefix: headers.Authorization?.substring(0, 20) + '...',
      });
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // If unauthorized, log token info for debugging
      if (response.status === 401 && import.meta.env.DEV) {
        console.error('[API] 401 Unauthorized:', {
          endpoint,
          hasToken: !!token,
          tokenLength: token?.length || 0,
        });
      }
      
      return {
        error: data?.detail || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
    };
  }
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Get authorization header
 */
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  if (!token) {
    return {};
  }
  // Ensure token doesn't have extra whitespace and is properly formatted
  const cleanToken = token.trim();
  return { Authorization: `Bearer ${cleanToken}` };
}

