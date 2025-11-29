/**
 * API Configuration and Base Service
 */

// API Base URL - Use empty string for relative paths (works with Nginx proxy)
// Endpoints already include '/api' prefix, so relative paths will work correctly
// When accessed via Docker/network IP, relative paths ensure requests go through Nginx proxy
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
    // Construct URL - handle empty API_BASE_URL for relative paths
    const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;

    // Get auth token and include it in headers
    const authHeader = getAuthHeader();
    const token = getAuthToken();

    // Debug: Log token presence (always log in dev, and log errors)
    if (!token) {
      console.warn('[API] No auth token found in localStorage for endpoint:', endpoint);
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

    // Debug: Log request details
    console.log('[API] Request:', {
      url,
      method: options.method || 'GET',
      hasAuth: !!headers.Authorization,
      hasToken: !!token,
      tokenLength: token?.length || 0,
      authPrefix: headers.Authorization ? headers.Authorization.substring(0, 25) + '...' : 'none',
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // If unauthorized, log detailed error info
      if (response.status === 401) {
        console.error('[API] 401 Unauthorized Error:', {
          endpoint,
          url,
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
          responseData: data,
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
 * Get auth token from localStorage or Zustand store
 */
export function getAuthToken(): string | null {
  // First try localStorage (primary source)
  let token = localStorage.getItem('auth_token');

  // If not found, try to get from Zustand store as fallback
  if (!token && typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed?.state?.token) {
          token = parsed.state.token;
          // Also store it in the primary location for consistency
          if (token) {
            localStorage.setItem('auth_token', token);
          }
        }
      }
    } catch (e) {
      console.warn('[API] Failed to read token from Zustand store:', e);
    }
  }

  return token;
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


// --- Cars API ---
export interface Car {
  id: number;
  user_id: number;
  make: string;
  model: string;
  year: number;
  registration_number: string;
  image_url?: string;
}

export interface CarCreate {
  make: string;
  model: string;
  year: number;
  registration_number: string;
  image_url?: string;
}

export const carService = {
  getAll: () => apiCall<Car[]>('/api/v1/cars/'),
  get: (id: number) => apiCall<Car>(`/api/v1/cars/${id}`),
  create: (data: CarCreate) => apiCall<Car>('/api/v1/cars/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/api/v1/cars/${id}`, {
    method: 'DELETE',
  }),
};

// --- Service History API ---
export interface ServiceHistory {
  id: number;
  car_id: number;
  service_name: string;
  service_date: string;
  description?: string;
  status: string;
}

export interface ServiceHistoryCreate {
  car_id: number;
  service_name: string;
  service_date: string;
  description?: string;
  status?: string;
}

export const serviceHistoryService = {
  getAll: (carId: number) => apiCall<ServiceHistory[]>(`/api/v1/service-history/?car_id=${carId}`),
  create: (data: ServiceHistoryCreate) => apiCall<ServiceHistory>('/api/v1/service-history/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// --- Pick Up Requests API ---
export interface PickUpRequest {
  id: number;
  user_id: number;
  car_id: number;
  location: string;
  latitude?: number;
  longitude?: number;
  scheduled_date: string;
  status: string;
  admin_comment?: string;
}

export interface PickUpRequestCreate {
  car_id: number;
  location: string;
  latitude?: number;
  longitude?: number;
  scheduled_date: string;
}

export interface PickUpRequestUpdate {
  status?: string;
  admin_comment?: string;
}

export const pickupRequestService = {
  getAll: () => apiCall<PickUpRequest[]>('/api/v1/pickup-requests/'),
  getById: (id: number) => apiCall<PickUpRequest>(`/api/v1/pickup-requests/${id}`),
  create: (data: PickUpRequestCreate) => apiCall<PickUpRequest>('/api/v1/pickup-requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: PickUpRequestUpdate) => apiCall<PickUpRequest>(`/api/v1/pickup-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};
