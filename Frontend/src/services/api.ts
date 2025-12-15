/**
 * API Configuration and Base Service
 */

// API Base URL - Use empty string for relative paths (works with Nginx proxy)
// Endpoints already include '/api' prefix, so relative paths will work correctly
// When accessed via Docker/network IP, relative paths ensure requests go through Nginx proxy
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Import auth store for clearing auth state on 401
import { useAuthStore } from '@/stores/authStore';

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

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (fetchError) {
      // Handle network errors (CORS, connection refused, etc.)
      console.error('[API] Fetch error:', fetchError);
      if (fetchError instanceof TypeError) {
        return {
          error: 'Failed to fetch: Unable to connect to server. Please check your internet connection and ensure the backend server is running.',
          status: 0,
        };
      }
      throw fetchError;
    }

    let data: any = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (parseError) {
      console.warn('[API] Failed to parse response as JSON:', parseError);
      // data remains null
    }

    if (!response.ok) {
      // If unauthorized, clear auth and redirect to landing page
      if (response.status === 401) {
        console.error('[API] 401 Unauthorized Error:', {
          endpoint,
          url,
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'none',
          responseData: data,
        });

        // Clear all authentication data
        removeAuthToken();
        localStorage.removeItem('user_data');

        // Clear Zustand auth store
        try {
          useAuthStore.getState().clearAuth();
        } catch (e) {
          console.warn('[API] Failed to clear Zustand store:', e);
        }

        // Clear Zustand persisted storage (double-check)
        try {
          localStorage.removeItem('auth-storage');
        } catch (e) {
          console.warn('[API] Failed to clear auth-storage:', e);
        }

        // Redirect to landing page (/) to login again
        // Avoid redirect loop if already on landing page
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && !currentPath.includes('/login') && !currentPath.includes('/register')) {
          console.log('[API] Redirecting to landing page due to 401 Unauthorized');
          // Use replace to avoid adding to history
          window.location.replace('/');
        } else if (currentPath === '/') {
          // Already on landing page, just clear state (login form will show)
          console.log('[API] Already on landing page, auth state cleared');
        }
      }

      let errorMessage = data?.detail || data?.message || `Request failed with status ${response.status}`;

      // If error message is an object or array (e.g. Pydantic validation errors), stringify it
      if (typeof errorMessage === 'object') {
        try {
          // If it's a Pydantic error array, try to make it more readable
          if (Array.isArray(errorMessage) && errorMessage.length > 0 && errorMessage[0].msg) {
            errorMessage = errorMessage.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
          } else {
            errorMessage = JSON.stringify(errorMessage);
          }
        } catch (e) {
          errorMessage = "An error occurred (could not parse error details)";
        }
      }

      console.error('[API] Request failed:', {
        endpoint,
        url,
        status: response.status,
        error: errorMessage,
        responseData: data,
      });

      return {
        error: errorMessage,
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
  vin_number?: string;
  image_url?: string;
  user?: any; // For Admin view
}

export interface CarCreate {
  make: string;
  model: string;
  year: number;
  registration_number: string;
  vin_number?: string;
  image_url?: string;
}

export const carService = {
  getAll: (userId?: number) => {
    const query = userId ? `?user_id=${userId}` : '';
    return apiCall<Car[]>(`/api/v1/cars/${query}`);
  },
  get: (id: number) => apiCall<Car>(`/api/v1/cars/${id}`),
  create: async (data: CarCreate, imageFile?: File): Promise<ApiResponse<Car>> => {
    const formData = new FormData();
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', data.year.toString());
    formData.append('registration_number', data.registration_number);

    if (data.vin_number) {
      formData.append('vin_number', data.vin_number);
    }

    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Get auth token and include it in headers
    const authHeader = getAuthHeader();
    const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/cars/` : '/api/v1/cars/';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...authHeader,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          error: responseData?.detail || `Request failed with status ${response.status}`,
          status: response.status,
        };
      }

      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
      };
    }
  },
  update: async (id: number, data: Partial<CarCreate>, imageFile?: File): Promise<ApiResponse<Car>> => {
    const formData = new FormData();

    if (data.make) formData.append('make', data.make);
    if (data.model) formData.append('model', data.model);
    if (data.year) formData.append('year', data.year.toString());
    if (data.registration_number) formData.append('registration_number', data.registration_number);
    if (data.vin_number) formData.append('vin_number', data.vin_number);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Get auth token and include it in headers
    const authHeader = getAuthHeader();
    const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/cars/${id}` : `/api/v1/cars/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          ...authHeader,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          error: responseData?.detail || `Request failed with status ${response.status}`,
          status: response.status,
        };
      }

      return {
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
      };
    }
  },
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
  car?: Car; // For Admin view
}

export interface ServiceHistoryCreate {
  car_id: number;
  service_name: string;
  service_date: string;
  description?: string;
  status?: string;
}

export const serviceHistoryService = {
  getAll: (carId?: number, userId?: number) => {
    const params = new URLSearchParams();
    if (carId) params.append('car_id', carId.toString());
    if (userId) params.append('user_id', userId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall<ServiceHistory[]>(`/api/v1/service-history/${query}`);
  },
  create: (data: ServiceHistoryCreate) => apiCall<ServiceHistory>('/api/v1/service-history/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<ServiceHistoryCreate>) => apiCall<ServiceHistory>(`/api/v1/service-history/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/api/v1/service-history/${id}`, {
    method: 'DELETE',
  }),
};

// --- Pick Up Requests API ---
export interface PickUpRequest {
  id: number;
  user_id: number;
  car_id: number;
  location?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  scheduled_date: string;
  pickup_time?: string;
  drop_time?: string;
  status: string;
  admin_comment?: string;
  created_at: string;
  car?: Car; // For Admin view
  user?: any; // For Admin view
}

export interface PickUpRequestCreate {
  car_id: number;
  location?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  scheduled_date: string;
}

export interface PickUpRequestUpdate {
  status?: string;
  admin_comment?: string;
  car_id?: number;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  scheduled_date?: string;
  pickup_time?: string;
  drop_time?: string;
}

export const pickupRequestService = {
  getAll: (userId?: number) => {
    const query = userId ? `?user_id=${userId}` : '';
    return apiCall<PickUpRequest[]>(`/api/v1/pickup-requests/${query}`);
  },
  getById: (id: number) => apiCall<PickUpRequest>(`/api/v1/pickup-requests/${id}`),
  create: (data: PickUpRequestCreate) => apiCall<PickUpRequest>('/api/v1/pickup-requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: PickUpRequestUpdate) => apiCall<PickUpRequest>(`/api/v1/pickup-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/api/v1/pickup-requests/${id}`, {
    method: 'DELETE',
  }),
};

// --- Employees API ---
export interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string;
  position?: string;
  department?: string;
  address?: string;
  salary?: number;
  hire_date?: string;
  last_working_day?: string;
  employee_id?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_user_id: number;
}

export interface EmployeeCreate {
  full_name: string;
  email: string;
  phone_number?: string;
  position?: string;
  department?: string;
  address?: string;
  salary?: number;
  hire_date?: string;
  last_working_day?: string;
  employee_id?: string;
  notes?: string;
  is_active?: boolean;
}

export interface EmployeeUpdate {
  full_name?: string;
  email?: string;
  phone_number?: string;
  position?: string;
  department?: string;
  address?: string;
  salary?: number;
  hire_date?: string;
  last_working_day?: string;
  employee_id?: string;
  notes?: string;
  is_active?: boolean;
}

export const employeeService = {
  getAll: () => apiCall<Employee[]>('/api/v1/employees/'),
  get: (id: number) => apiCall<Employee>(`/api/v1/employees/${id}`),
  create: (data: EmployeeCreate) => apiCall<Employee>('/api/v1/employees/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: EmployeeUpdate) => apiCall<Employee>(`/api/v1/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/api/v1/employees/${id}`, {
    method: 'DELETE',
  }),
};

// --- Extra Services API ---

export interface ExtraService {
  id: number;
  service_name: string;
  vehicle_name?: string;
  assigned_employee_id?: number;
  assigned_employee_name?: string;
  price: number;
  owner_details?: string;
  service_description?: string;
  created_by_user_id: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ExtraServiceCreate {
  service_name: string;
  vehicle_name?: string;
  assigned_employee_id?: number;
  price: number;
  owner_details?: string;
  service_description?: string;
}

export interface ExtraServiceUpdate {
  service_name?: string;
  vehicle_name?: string;
  assigned_employee_id?: number;
  price?: number;
  owner_details?: string;
  service_description?: string;
}

export const extraServiceService = {
  getAll: () => apiCall<ExtraService[]>('/api/v1/extra-services/'),
  get: (id: number) => apiCall<ExtraService>(`/api/v1/extra-services/${id}`),
  create: (data: ExtraServiceCreate) => apiCall<ExtraService>('/api/v1/extra-services/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: ExtraServiceUpdate) => apiCall<ExtraService>(`/api/v1/extra-services/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall<void>(`/api/v1/extra-services/${id}`, {
    method: 'DELETE',
  }),
};

// --- Users API ---

