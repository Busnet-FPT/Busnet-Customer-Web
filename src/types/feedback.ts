export interface FeedbackItem {
  _id: string
  bookingId?: {
    _id: string
    bookingCode: string
    status: string
    total: number
    passengerName: string
    passengerPhone: string
    createdAt: string
  }
  partnerId: {
    _id: string
    fullName: string
    email: string
    phone: string
    role: string
    status: string
  }
  rating: number
  review: string
  reviewImages?: string[]
  type: 'TRIP' | 'OPERATOR'
  createdAt: string
}

export interface CreateFeedbackRequest {
  bookingId: string
  rating: number
  review: string
  reviewImages?: string[]
  type?: 'TRIP'
}

export interface CreateOperatorFeedbackRequest {
  rating: number
  review: string
  reviewImages?: string[]
}
