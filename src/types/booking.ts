import type { TripItem, TripSeat, PartnerInfo, RouteInfo, BusInfo, ScheduleInfo } from './trip'

export type { TripItem, TripSeat, PartnerInfo, RouteInfo, BusInfo, ScheduleInfo }

export interface TicketInfo {
  ticketId: string
  ticketCode?: string
  bookingId: string
  seatCode: string
  status?: string
  passengerName?: string
  passengerPhone?: string
  passengerEmail?: string
  qrCodeUrl?: string
  price: number
  pickupPoint_name?: string
  pickupPoint_address?: string
  pickupPoint_time?: string
  dropoffPoint_name?: string
  dropoffPoint_address?: string
  dropoffPoint_time?: string
}

export interface PointOption {
  name: string
  address: string
  time: string
}

export interface BookingRequest {
  tripId: string
  seatCodes: string[]
  pickupPoint_name: string
  pickupPoint_address: string
  pickupPoint_time: string
  dropoffPoint_name: string
  dropoffPoint_address: string
  dropoffPoint_time: string
  passengerName: string
  passengerPhone: string
  passengerEmail?: string
  customerNote?: string
}

export interface BookingInfo {
  _id?: string
  id?: string
  bookingId: string
  bookingCode: string
  status: string
  paymentStatus: string
  payment_status?: string
  total: number
  expiresAt: string | null
  confirmedAt: string | null
  createdAt?: string
  tripId: string
  paymentTransactionId?: string | null
  passengerName?: string
  passengerPhone?: string
  passengerEmail?: string
  customerNote?: string
  pickupPoint_name?: string
  pickupPoint_address?: string
  pickupPoint_time?: string
  dropoffPoint_name?: string
  dropoffPoint_address?: string
  dropoffPoint_time?: string
}

export type BookingHistoryItem = BookingInfo

export interface PaymentInfo {
  transactionId: string | null
  gateway: string
  bankCode?: string
  bankNumber?: string
  bankAccountName?: string
  amount: number
  content?: string | null
  qrUrl?: string | null
}

export interface BookingResponseData {
  booking: BookingInfo
  seats: Array<TripSeat>
  payment: PaymentInfo
  serverTime?: string
}

export interface BookingResponse {
  success: boolean
  message: string
  data: BookingResponseData
}

export interface BookingStatusResponse {
  success: boolean
  message: string
  data: {
    status: string
    paymentStatus: string
    payment_status?: string
    total: number
    expiresAt: string | null
    confirmedAt: string | null
    serverTime?: string
    transaction?: any
  }
}

export interface BookingDetailResponse {
  success: boolean
  message: string
  data: {
    booking: BookingInfo
    seats: Array<TripSeat>
    trip: TripItem
    transaction?: any
  }
}

export interface BookingOptionsResponse {
  success: boolean
  message: string
  data: {
    trip: TripItem
    pickupPoints: PointOption[]
    dropoffPoints: PointOption[]
  }
}

export interface BookingHistoryResponse {
  success: boolean
  message: string
  data: {
    bookings: BookingInfo[]
    pagination: {
      totalItems: number
      totalPages: number
      currentPage: number
      limit: number
    }
  }
}

export interface TicketResponse {
  success: boolean
  message: string
  data: any
}

export interface BookingPaymentResponse {
  success: boolean
  message: string
  data: any
}
