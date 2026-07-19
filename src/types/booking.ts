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

export interface PointOption {
  name: string
  address: string
  time: string
}

export interface PartnerInfo {
  accountId: string
  operatorName: string
  profilePicture?: string | null
  coverImage?: string | null
  ratingAvg?: number
  totalReviews?: number
  isVerified?: boolean
}

export interface TripRoute {
  _id?: string
  routeName: string
  originProvince: string
  originDistrict?: string | null
  destinationProvince: string
  destinationDistrict?: string | null
  distanceKm?: number
  estimatedDuration?: string
  origin_representativeAddress?: string
  destination_representativeAddress?: string
}

export interface TripBus {
  _id?: string
  busId?: string
  busName: string
  busType: string
  totalSeats: number
  licensePlate: string
  images?: string[]
}

export interface TripSeat {
  seatCode: string
  price: number
  seatType?: string
  status: string
  bookingId?: string | null
  holdToken?: string | null
  lockedUntil?: string | null
  ticketId?: string | null
}

export interface TripItem {
  _id?: string
  tripId?: string
  tripCode?: string
  route: TripRoute | null
  bus: TripBus | null
  operator: PartnerInfo | null
  partner?: PartnerInfo | null
  departureDate: string
  departureTime?: string
  actualDepartureTime?: number
  arrivalTime?: string
  actualArrivalTime?: number
  totalSeats: number
  availableSeats: number
  bookedSeats?: number
  heldSeats?: number
  status: string
  price?: number
  minPrice?: number
  seats?: TripSeat[]
}

export interface BookingInfo {
  _id?: string
  id?: string
  bookingCode: string
  status: string
  payment_status: string
  paymentStatus?: string
  total: number
  payment_amount?: number
  expiresAt?: string
  confirmedAt?: string
  cancelReason?: string
  cancelResponse?: string
  cancelRequestedAt?: string
  cancelledAt?: string
  createdAt?: string
  updatedAt?: string
  passengerName?: string
  passengerPhone?: string
  passengerEmail?: string | null
  customerNote?: string
  pickupPoint_name?: string
  pickupPoint_address?: string
  pickupPoint_time?: string
  dropoffPoint_name?: string
  dropoffPoint_address?: string
  dropoffPoint_time?: string
}

export interface BookingSeat {
  ticketId?: string
  seatCode: string
  price: number
}

export interface PaymentInfo {
  transactionId: string | null
  status?: string
  gateway: string
  bankName?: string
  bankCode?: string
  bankNumber?: string
  accountNumber?: string
  bankAccountName?: string
  accountName?: string
  amount: number
  currency?: string
  content: string
  qrUrl: string | null
  expiresAt?: string | null
}

export interface TicketInfo {
  ticketId: string
  ticketCode: string
  bookingId: string
  bookingCode: string
  seatCode: string
  price: number
  status: string
  passengerName: string
  passengerPhone: string
  createdAt: string
  updatedAt: string
}

export interface BookingResponse {
  success: boolean
  message: string
  data: {
    booking: BookingInfo
    seats: BookingSeat[]
    payment: PaymentInfo
    serverTime: string
  }
}

export interface BookingStatusResponse {
  success: boolean
  message: string
  data: BookingInfo & { serverTime: string }
}

export interface BookingDetailResponse {
  success: boolean
  message: string
  data: {
    booking: BookingInfo
    seats: BookingSeat[]
    transaction?: any
    trip?: TripItem
  }
}

export interface BookingHistoryResponse {
  success: boolean
  message: string
  data: {
    bookings: any[]
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
  data: {
    bookingCode: string
    tickets: TicketInfo[]
    booking: BookingInfo
    trip: TripItem
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

export interface BookingPaymentResponse {
  success: boolean
  message: string
  data: {
    booking: BookingInfo
    payment: PaymentInfo
    serverTime: string
  }
}

export interface BookingHistoryItem extends BookingInfo {
  bookingId?: string;
  tripId?: any;
  trip?: any;
  partnerId?: any;
}