/**
 * Cost Service
 * Handles cost-related API calls
 */

import { apiCall, API_BASE_URL } from './api';

export interface Cost {
  id: number;
  booking_id: number;
  item_name: string;
  amount: number;
  description?: string;
  warranty_details?: string;
  created_at: string;
  updated_at: string;
}

export interface CostCreate {
  booking_id: number;
  item_name: string;
  amount: number;
  description?: string;
  warranty_details?: string;
}

export interface CostUpdate {
  item_name?: string;
  amount?: number;
  description?: string;
  warranty_details?: string;
}

export interface CostListResponse {
  costs: Cost[];
  total: number;
}

/**
 * Get all costs for a booking
 */
export async function getBookingCosts(bookingId: number): Promise<CostListResponse> {
  const response = await apiCall<CostListResponse>(`/api/v1/costs/booking/${bookingId}`, {
    method: 'GET',
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}

/**
 * Create a new cost item
 */
export async function createCost(costData: CostCreate): Promise<Cost> {
  const response = await apiCall<Cost>('/api/v1/costs/', {
    method: 'POST',
    body: JSON.stringify(costData),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}

/**
 * Update a cost item
 */
export async function updateCost(costId: number, costData: CostUpdate): Promise<Cost> {
  const response = await apiCall<Cost>(`/api/v1/costs/${costId}`, {
    method: 'PUT',
    body: JSON.stringify(costData),
  });

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data!;
}

/**
 * Delete a cost item
 */
export async function deleteCost(costId: number): Promise<void> {
  const response = await apiCall(`/api/v1/costs/${costId}`, {
    method: 'DELETE',
  });

  if (response.error) {
    throw new Error(response.error);
  }
}

