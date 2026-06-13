import api from './api'

// === Interfaces for Operator List ===
export interface OperatorAccount {
  _id: string
  fullName: string
  email: string
  profilePicture: string | null
}

export interface Operator {
  _id: string
  accountId: string
  operatorName: string
  operatorPhone: string
  description: string
  amenities: string[]
  profilePicture: string | null
  coverImage: string | null
  ratingAvg: number
  totalReviews: number
  isVerified: boolean
  routeCount: number
  account: OperatorAccount
}

export interface OperatorListResponse {
  operators: Operator[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

// === Interfaces for Operator Detail ===
export interface PickupDropoffPoint {
  _id: string
  name: string
  address: string
  provinceName: string
  districtName: string
  time: string
  lat: number | null
  lng: number | null
  orderIndex: number
}

export interface TicketPrice {
  _id: string
  seatType: string
  price: number
  discount: number
  effectiveFrom: string
  effectiveTo: string | null
  isActive: boolean
}

export interface BusInfo {
  _id: string
  busName: string
  licensePlate: string
  busType: string
  totalSeats: number
  amenities: string[]
  images: string[]
}

export interface ScheduleDetail {
  _id: string
  scheduleCode: string
  basePrice: number
  departureTime: string
  arrivalTime: string
  recurrenceType: string
  busId: BusInfo
  prices: TicketPrice[]
  pickupPoints: PickupDropoffPoint[]
  dropoffPoints: PickupDropoffPoint[]
  isActive: boolean
}

export interface RouteDetail {
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
  isActive: boolean
  isPopular: boolean
  schedules: ScheduleDetail[]
}

export interface PartnerDetail {
  _id: string
  accountId: string
  operatorName: string
  operatorPhone: string
  description: string
  amenities: string[]
  policies: Record<string, string>
  profilePicture: string | null
  coverImage: string | null
  ratingAvg: number
  totalReviews: number
  isVerified: boolean
  verifiedAt: string | null
  account: OperatorAccount
}

export interface OperatorDetailResponse {
  partner: PartnerDetail
  routes: RouteDetail[]
}

// === API Calls ===

export const getOperators = async (params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<OperatorListResponse> => {
  const response = await api.get<{
    success: boolean
    message: string
    data: OperatorListResponse
  }>('/customer/operators', { params })
  return response.data.data
}

export const getOperatorDetail = async (id: string): Promise<OperatorDetailResponse> => {
  const response = await api.get<{
    success: boolean
    message: string
    data: OperatorDetailResponse
  }>(`/customer/operators/${id}`)
  return response.data.data
}
