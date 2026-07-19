export interface TripSearchQuery {
  originProvince?: string
  destinationProvince?: string
  departureDate?: string
  seatType?: string
  page?: number
  limit?: number
}

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
  tripId: string
  tripCode: string
  route: RouteInfo | null
  schedule: ScheduleInfo | null
  bus: BusInfo | null
  partner: PartnerInfo | null
  operator?: PartnerInfo | null
  operatorName?: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  actualDepartureTime?: number
  actualArrivalTime?: number
  totalSeats: number
  availableSeats: number
  bookedSeats: number
  heldSeats: number
  status: string
  price: number
  minPrice: number
  seats: TripSeat[]
}

export interface TripSearchResponse {
  success: boolean
  message: string
  data: {
    trips: TripItem[]
    pagination: {
      totalItems: number
      totalPages: number
      currentPage: number
      limit: number
    }
  }
}

export interface TripDetailResponse {
  success: boolean
  message: string
  data: TripItem
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
