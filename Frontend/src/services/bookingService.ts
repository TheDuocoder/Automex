/**
 * Booking Service
 * Handles all booking-related API calls
 */

import { apiCall } from './api';

/**
 * Booking status enum
 */
export enum BookingStatus {
  PENDING = "pending",
  ANALYSE = "analyse",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/**
 * Service booking create interface (from Zustand store)
 */
export interface ServiceBookingCreate {
  booking_date: string; // ISO datetime string
  car_brand: string;
  car_model: string;
  fuel_type: string;
  service_name: string;
  booking_group_id?: string; // Group ID for multi-service bookings
  skip_email?: boolean;
}

/**
 * Booking interface
 */
export interface Booking {
  id: number;
  user_id: number;
  service_id?: number;
  booking_date: string;
  status: BookingStatus;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_registration?: string;
  car_brand?: string;
  car_model?: string;
  fuel_type?: string;
  service_name?: string;
  booking_group_id?: string; // Group ID for multi-service bookings
  contact_name?: string;
  contact_phone?: string;
  pickup_address?: string;
  special_instructions?: string;
  estimated_cost?: number;
  actual_cost?: number;
  technician_notes?: string;
  daily_work_logs?: DailyWorkLog[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  user_email?: string; // User email (for admin view and notifications)
  email_sent?: boolean; // Whether email was sent
  assigned_employee_id?: number; // Assigned employee ID
  assigned_employee_name?: string; // Assigned employee name
  employee_assignment_history?: EmployeeAssignmentHistory[]; // Assignment history
}

/**
 * Employee Assignment History interface
 */
export interface EmployeeAssignmentHistory {
  id: number;
  employee_id?: number;
  employee_name?: string;
  assigned_by_user_id: number;
  assigned_by_name?: string;
  notes?: string;
  created_at: string;
}

/**
 * Assign Employee to Booking request
 */
export interface AssignEmployeeRequest {
  employee_id?: number; // Set to null/undefined to unassign
  notes?: string;
}

/**
 * Daily Work Log interface
 */
export interface DailyWorkLog {
  id: number;
  booking_id: number;
  log_date: string; // YYYY-MM-DD format
  description?: string;
  photos?: (string | { url: string; date: string })[];
  videos?: (string | { url: string; date: string })[];
  created_at: string;
  updated_at: string;
}

/**
 * Create a service booking from Zustand store data
 */
export async function createServiceBooking(bookingData: ServiceBookingCreate): Promise<Booking> {
  console.log('[Booking Service] Sending booking request:', bookingData);

  const response = await apiCall<Booking>('/api/v1/bookings/service-booking', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });

  console.log('[Booking Service] Response received:', {
    hasData: !!response.data,
    hasError: !!response.error,
    status: response.status,
    error: response.error,
  });

  if (response.error) {
    // Include status code in error message for 401 errors
    if (response.status === 401) {
      throw new Error(`Unauthorized: ${response.error}. Please log in again.`);
    }
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Failed to create booking: No data returned from server');
  }

  return response.data;
}

/**
 * Get all bookings for current user
 */
export async function getUserBookings(): Promise<Booking[]> {
  const response = await apiCall<Booking[]>('/api/v1/bookings/', {
    method: 'GET',
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data || [];
}

/**
 * Get a specific booking by ID
 */
export async function getBooking(bookingId: number): Promise<Booking> {
  const response = await apiCall<Booking>(`/api/v1/bookings/${bookingId}`, {
    method: 'GET',
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Booking not found');
  }

  return response.data;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: number): Promise<void> {
  const response = await apiCall(`/api/v1/bookings/${bookingId}`, {
    method: 'DELETE',
  });

  if (response.error) {
    throw new Error(response.error);
  }
}

/**
 * Update booking status (Admin/Super Admin only)
 */
export async function updateBookingStatus(bookingId: number, newStatus: BookingStatus): Promise<Booking> {
  const response = await apiCall<Booking>(`/api/v1/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Failed to update booking status');
  }

  return response.data;
}

/**
 * Create a new daily work log entry (Admin/Super Admin only)
 */
export async function createDailyWorkLog(
  bookingId: number,
  logDate: string,
  description?: string
): Promise<DailyWorkLog> {
  const response = await apiCall<DailyWorkLog>(`/api/v1/bookings/${bookingId}/daily-work-logs`, {
    method: 'POST',
    body: JSON.stringify({
      log_date: logDate,
      description: description || null,
      photos: [],
      videos: [],
    }),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Failed to create daily work log');
  }

  return response.data;
}

/**
 * Update daily work log description (Admin/Super Admin only)
 */
export async function updateDailyWorkLogDescription(bookingId: number, logId: number, description: string): Promise<DailyWorkLog> {
  const response = await apiCall<DailyWorkLog>(`/api/v1/bookings/${bookingId}/daily-work-logs/${logId}/description`, {
    method: 'PATCH',
    body: JSON.stringify({ description }),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Failed to update daily work log description');
  }

  return response.data;
}

/**
 * Upload daily work media (photos/videos) for a specific date (Admin/Super Admin only)
 */
export async function uploadDailyWorkMedia(bookingId: number, logDate: string, files: File[]): Promise<DailyWorkLog> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  const url = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/bookings/${bookingId}/daily-work-logs/${logDate}/media`
    : `/api/v1/bookings/${bookingId}/daily-work-logs/${logDate}/media`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (fetchError) {
    if (fetchError instanceof TypeError) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }
    throw new Error('Failed to upload media: ' + (fetchError instanceof Error ? fetchError.message : 'Unknown error'));
  }

  if (!response.ok) {
    let errorDetail = 'Failed to upload media';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || errorDetail;
    } catch {
      errorDetail = response.statusText || `Server error (${response.status})`;
    }
    throw new Error(errorDetail);
  }

  const data: DailyWorkLog = await response.json();
  return data;
}

/**
 * Delete daily work media (Admin/Super Admin only)
 */
export async function deleteDailyWorkMedia(bookingId: number, logId: number, mediaUrl: string): Promise<DailyWorkLog> {
  const response = await apiCall<DailyWorkLog>(`/api/v1/bookings/${bookingId}/daily-work-logs/${logId}/media?media_url=${encodeURIComponent(mediaUrl)}`, {
    method: 'DELETE',
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Failed to delete media');
  }

  return response.data;
}

/**
 * Delete all daily work log for a specific date (Admin/Super Admin only)
 */
export async function deleteDailyWorkByDate(bookingId: number, logDate: string): Promise<void> {
  const response = await apiCall(`/api/v1/bookings/${bookingId}/daily-work-logs/${logDate}`, {
    method: 'DELETE',
  });

  if (response.error) {
    throw new Error(response.error);
  }
}

/**
 * Assign employee to booking (Super Admin only)
 */
export async function assignEmployeeToBooking(
  bookingId: number,
  request: AssignEmployeeRequest
): Promise<Booking> {
  const response = await apiCall<Booking>(`/api/v1/bookings/${bookingId}/assign-employee`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('No data returned from server');
  }

  return response.data;
}

/**
 * Send batch booking email for a booking group
 */
export async function sendBatchBookingEmail(bookingGroupId: string): Promise<void> {
  const response = await apiCall(`/api/v1/bookings/batch-email/${bookingGroupId}`, {
    method: 'POST',
  });

  if (response.error) {
    console.warn('Failed to send batch email:', response.error);
    // We don't throw here to avoid disrupting the user flow if the booking was successful
  }
}

