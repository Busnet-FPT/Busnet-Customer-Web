import api from './api'
import type { FeedbackItem, CreateFeedbackRequest, CreateOperatorFeedbackRequest } from '../types/feedback'

export const getFeedbacks = () => {
  return api.get<{ message: string; data: { feedbacks: FeedbackItem[], pagination: any } }>('/customer/feedbacks/me')
}

export const getFeedbackDetail = (feedbackId: string) => {
  return api.get<{ message: string; data: { feedback: FeedbackItem } }>(`/customer/feedbacks/${feedbackId}`)
}

export const createFeedback = (data: CreateFeedbackRequest) => {
  return api.post<{ message: string; data: { feedback: FeedbackItem } }>('/customer/feedbacks', data)
}

export const createOperatorFeedback = (partnerId: string, data: CreateOperatorFeedbackRequest) => {
  return api.post<{ message: string; data: { feedback: FeedbackItem } }>(`/customer/feedbacks/operators/${partnerId}`, data)
}
