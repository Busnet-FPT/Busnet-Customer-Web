import api from './api'
import type { TripDetailResponse, TripSeatsResponse } from '../types/trip'

export interface SearchTripsParams {
  from?: string
  to?: string
  date: string
  departureTimes?: string[]
  operators?: string[]
  busTypes?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  page?: number
  limit?: number
}

export interface TripRoute {
  _id: string
  routeName: string
  origin_provinceName: string
  origin_districtName: string
  origin_representativeAddress: string
  destination_provinceName: string
  destination_districtName: string
  destination_representativeAddress: string
  distanceKm: number
  estimatedDuration: number
}

export interface TripBus {
  _id: string
  busName: string
  licensePlate: string
  busType: string
  totalSeats: number
  amenities: string[]
}

export interface TripOperator {
  _id: string
  operatorName: string
  operatorPhone: string
  description: string
  ratingAvg: number
  totalReviews: number
  isVerified: boolean
  profilePicture: string | null
  coverImage: string | null
  amenities: string[]
}

export interface TripInfo {
  _id: string
  tripCode: string
  departureDate: string
  actualDepartureTime: number // minutes from midnight
  actualArrivalTime: number
  totalSeats: number
  availableSeats: number
  status: string
  route: TripRoute
  bus: TripBus
  price: number
  operator: TripOperator | null
}

export interface SearchTripsResponse {
  trips: TripInfo[]
  pagination: {
    totalResults: number
    page: number
    limit: number
    totalPages: number
  }
}

export const searchTrips = async (params: SearchTripsParams): Promise<SearchTripsResponse> => {
  const formattedParams: any = { ...params }
  if (params.departureTimes && params.departureTimes.length > 0) {
    formattedParams.departureTimes = params.departureTimes.join(',')
  } else {
    delete formattedParams.departureTimes
  }
  if (params.operators && params.operators.length > 0) {
    formattedParams.operators = params.operators.join(',')
  } else {
    delete formattedParams.operators
  }
  if (params.busTypes && params.busTypes.length > 0) {
    formattedParams.busTypes = params.busTypes.join(',')
  } else {
    delete formattedParams.busTypes
  }

  const response = await api.get<{
    success: boolean
    message: string
    data: SearchTripsResponse
  }>('/customer/trips', { params: formattedParams })
  return response.data.data
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

export interface LocationsResponse {
  origins: string[]
  destinations: string[]
}

export const getSearchLocations = async (): Promise<LocationsResponse> => {
  const response = await api.get<{
    success: boolean
    message: string
    data: LocationsResponse
  }>('/customer/trips/locations')
  return response.data.data
}

export interface PopularRouteInfo {
  _id: string
  routeName: string
  origin_provinceName: string
  destination_provinceName: string
  distanceKm: number
  estimatedDuration: number
  minPrice: number
  operatorName: string
}

export const getPopularRoutes = async (): Promise<PopularRouteInfo[]> => {
  const response = await api.get<{
    success: boolean
    message: string
    data: PopularRouteInfo[]
  }>('/customer/trips/popular-routes')
  return response.data.data
}
