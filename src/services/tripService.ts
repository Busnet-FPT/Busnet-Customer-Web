import api from './api'
import type { TripSearchQuery, TripSearchResponse, TripDetailResponse, TripSeatsResponse } from '../types/trip'

/**
 * Search trips with filters and pagination
 * GET /api/customer/trips/search
 */
export const searchTrips = async (query: TripSearchQuery): Promise<TripSearchResponse> => {
  const params = {
    originProvince: query.originProvince,
    destinationProvince: query.destinationProvince,
    departureDate: query.departureDate,
    seatType: query.seatType,
    page: query.page,
    limit: query.limit
  }

  const response = await api.get<TripSearchResponse>('/customer/trips/search', { params })
  return response.data
}

/**
 * Get trip detail by id
 * GET /api/customer/trips/:id
 */
export const getTripDetail = async (tripId: string): Promise<TripDetailResponse> => {
  const response = await api.get<TripDetailResponse>(`/customer/trips/${tripId}`)
  return response.data
}

/**
 * Get seat layout for a trip
 * GET /api/customer/trips/:id/seats
 */
export const getTripSeats = async (tripId: string): Promise<TripSeatsResponse> => {
  const response = await api.get<TripSeatsResponse>(`/customer/trips/${tripId}/seats`)
  return response.data
}
