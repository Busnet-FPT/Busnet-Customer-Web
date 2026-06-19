import api from './api'
import type { BookingRequest, BookingResponse, BookingStatusResponse, BookingDetailResponse } from '../types/booking'

/**
 * Create booking and hold seats
 * POST /api/customer/bookings
 */
export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>('/customer/bookings', data)
  return response.data
}

/**
 * Get booking status by booking code
 * GET /api/customer/bookings/:bookingCode/status
 */
export const getBookingStatus = async (bookingCode: string): Promise<BookingStatusResponse> => {
  const response = await api.get<BookingStatusResponse>(`/customer/bookings/${bookingCode}/status`)
  return response.data
}

/**
 * Get booking detail by booking code
 * GET /api/customer/bookings/:bookingCode
 */
export const getBookingDetail = async (bookingCode: string): Promise<BookingDetailResponse> => {
  const response = await api.get<BookingDetailResponse>(`/customer/bookings/${bookingCode}`)
  return response.data
}
