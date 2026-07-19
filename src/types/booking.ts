import type { TripItem, TripSeat } from './trip'

export type { TripItem, TripSeat }

export interface RouteInfo {
  routeName: string
  originProvince: string
  originDistrict: string | null
  destinationProvince: string
  destinationDistrict: string | null
  distanceKm: number
  estimatedDuration: string
  origin_representativeAddress?: string
  destination_representativeAddress?: string
  origin_provinceName?: string
  destination_provinceName?: string
}

export interface ScheduleInfo {
  scheduleId: string
  scheduleCode: string
  departureTime: string
  arrivalTime: string
  recurrenceType: string
}

export interface BusInfo {
  busId: string
  busName: string
  busType: string
  totalSeats: number
  licensePlate: string
  images: string[]
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
  bookingId: string
  bookingCode: string
  status: string
  paymentStatus: string
  total: number
  expiresAt: string | null
  confirmedAt: string | null
  tripId: string
  paymentTransactionId?: string | null
}

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
    total: number
    expiresAt: string | null
    confirmedAt: string | null
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
