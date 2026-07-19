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
  route: RouteInfo | null
  schedule?: ScheduleInfo | null
  bus: BusInfo | null
  operator: PartnerInfo | null
  departureDate: string
  departureTime: string
  arrivalTime?: string
  actualDepartureTime?: number
  actualArrivalTime?: number
  totalSeats: number
  availableSeats: number
  bookedSeats?: number
  heldSeats?: number
  status: string
  price: number
  priceOverride?: number
  minPrice?: number
  seats?: TripSeat[]
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
  passengerEmail: string
  customerNote?: string
}

export interface BookingInfo {
  id?: string
  _id?: string
  bookingCode: string
  status: string

  // FE cũ dùng camelCase
  paymentStatus?: string

  // Backend hiện tại trả snake_case
  payment_status?: string

  total: number
  expiresAt: string | null
  confirmedAt?: string | null
  cancelledAt?: string | null
  createdAt?: string
  updatedAt?: string

  // các field khác backend populate thêm
  tripId?: any
  partnerId?: any
  payment_transactionId?: string
  payment_amount?: number
  passengerName?: string
  passengerPhone?: string
  passengerEmail?: string | null

  // Pickup and Dropoff fields
  pickupPoint_name?: string
  pickupPoint_address?: string
  pickupPoint_time?: string
  dropoffPoint_name?: string
  dropoffPoint_address?: string
  dropoffPoint_time?: string
  customerNote?: string
}

export interface PaymentInfo {
  transactionId: string | null
  status?: string
  gateway: string

  // hiển thị
  bankName?: string

  // mã bank thật để QR: VPB, VCB, ACB...
  bankCode?: string

  // số tài khoản
  bankNumber?: string
  accountNumber?: string

  // tên chủ tài khoản
  bankAccountName?: string
  accountName?: string

  amount: number
  currency?: string
  content?: string | null
  qrUrl?: string | null
  expiresAt?: string | null
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

export interface BookingPaymentResponse {
  success: boolean
  message: string
  data: {
    booking: BookingInfo
    payment: PaymentInfo
    serverTime?: string
  }
}

export interface BookingStatusResponse {
  success: boolean
  message: string
  data: {
    bookingCode?: string
    status: string

    paymentStatus?: string
    payment_status?: string

    total: number
    payment_amount?: number
    expiresAt: string | null
    confirmedAt: string | null
    cancelledAt?: string | null
    createdAt?: string
    updatedAt?: string
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

export interface BookingHistoryItem {
  bookingId?: string
  bookingCode: string
  status: string
  paymentStatus: string
  total: number
  expiresAt: string | null
  confirmedAt: string | null
  tripId: string
  trip?: TripItem
  seatCodes: string[]
  passengerName: string
  passengerPhone: string
  createdAt: string
}

export interface BookingHistoryResponse {
  success: boolean
  message: string
  data: {
    bookings: BookingHistoryItem[]
    pagination: {
      totalItems: number
      totalPages: number
      currentPage: number
      limit: number
    }
  }
}

export interface TicketInfo {
  ticketId: string
  ticketCode: string
  bookingId?: string
  bookingCode: string
  seatCode: string
  price: number
  status: string
  passengerName: string
  passengerPhone: string
  createdAt: string
  updatedAt: string
}

export interface TicketResponse {
  success: boolean
  message: string
  data: {
    tickets: TicketInfo[]
    booking: BookingInfo
    trip: TripItem
  }
}

export interface TripDetailResponse {
  success: boolean
  message: string
  data: {
    trip: TripItem
  }
}

export interface PointOption {
  name: string
  address: string
  time: string
  orderIndex: number
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

export interface TripSeatsResponse {
  success: boolean
  message: string
  data: {
    tripId: string
    tripCode: string
    seats: TripSeat[]
  }
}
