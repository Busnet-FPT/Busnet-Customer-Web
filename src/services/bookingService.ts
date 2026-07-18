import api from './api'
import type {
  BookingRequest,
  BookingResponse,
  BookingStatusResponse,
  BookingDetailResponse,
  BookingHistoryResponse,
  TicketResponse,
  BookingOptionsResponse,
  BookingPaymentResponse
} from '../types/booking'

/**
 * Fetch trip detail specifically for booking flow (to avoid modifying tripService)
 * GET /customer/trips/:tripId/booking-options
 */
export const getTripDetailForBooking = async (tripId: string): Promise<BookingOptionsResponse> => {
  const response = await api.get<BookingOptionsResponse>(`/customer/trips/${tripId}/booking-options`)
  return response.data
}


/**
 * Create booking and hold seats
 * POST /customer/bookings
 */
export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>('/customer/bookings', data)
  return response.data
}

/**
 * Get booking status by booking code
 * GET /customer/bookings/:bookingCode/status
 */
export const getBookingStatus = async (bookingCode: string): Promise<BookingStatusResponse> => {
  const response = await api.get<BookingStatusResponse>(`/customer/bookings/${bookingCode}/status`)
  return response.data
}

/**
 * Get booking detail by booking code
 * GET /customer/bookings/:bookingCode
 */
export const getBookingDetail = async (bookingCode: string): Promise<BookingDetailResponse> => {
  const response = await api.get<BookingDetailResponse>(`/customer/bookings/${bookingCode}`)
  return response.data
}

/**
 * Get booking payment by booking code
 * GET /customer/bookings/:bookingCode/payment
 */
export const getBookingPayment = async (bookingCode: string): Promise<BookingPaymentResponse> => {
  const response = await api.get<BookingPaymentResponse>(`/customer/bookings/${bookingCode}/payment`)

  console.log('[FE][bookingService][getBookingPayment raw]', response.data)

  return response.data
}

/**
 * Get booking history with pagination
 * GET /customer/bookings
 */
export const getBookingHistory = async (params: { page?: number; limit?: number }): Promise<BookingHistoryResponse> => {
  const response = await api.get<BookingHistoryResponse>('/customer/bookings', { params })
  return response.data
}

/**
 * Get tickets for a booking
 * GET /customer/bookings/:bookingCode/tickets
 */
export const getBookingTickets = async (bookingCode: string): Promise<TicketResponse> => {
  const response = await api.get<TicketResponse>(`/customer/bookings/${bookingCode}/tickets`)
  return response.data
}

/**
 * Cancel a pending booking
 * POST /customer/bookings/:bookingCode/cancel
 */
export const cancelBooking = async (bookingCode: string, reason?: string): Promise<any> => {
  const response = await api.post(`/customer/bookings/${bookingCode}/cancel`, {
    reason: reason || 'Cancelled by customer'
  })
  return response.data
}

/**
 * Download booking tickets PDF
 * GET /customer/bookings/:bookingCode/tickets/pdf
 */
export const downloadTicketPdf = async (bookingCode: string): Promise<Blob> => {
  const response = await api.get(`/customer/bookings/${bookingCode}/tickets/pdf`, {
    responseType: 'blob'
  })
  return response.data
}
