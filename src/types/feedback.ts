export interface FeedbackItem {
  feedbackId: string
  bookingCode: string
  rating: number
  comment: string
  operatorResponse?: string
  createdAt: string
}

export interface CreateFeedbackRequest {
  bookingCode: string
  rating: number
  comment: string
}
