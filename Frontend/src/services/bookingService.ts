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
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
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
  contact_name?: string;
  contact_phone?: string;
  pickup_address?: string;
  special_instructions?: string;
  estimated_cost?: number;
  actual_cost?: number;
  technician_notes?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

/**
 * Create a service booking from Zustand store data
 */
export async function createServiceBooking(bookingData: ServiceBookingCreate): Promise<Booking> {
  const response = await apiCall<Booking>('/api/v1/bookings/service-booking', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });

  if (response.error) {
    // Include status code in error message for 401 errors
    if (response.status === 401) {
      throw new Error(`Unauthorized: ${response.error}. Please log in again.`);
    }
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Failed to create booking');
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

