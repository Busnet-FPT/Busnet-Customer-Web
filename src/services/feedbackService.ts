import api from './api'
import type { FeedbackItem, CreateFeedbackRequest } from '../types/feedback'

export const getFeedbacks = () => {
  return api.get<{ message: string; data: FeedbackItem[] }>('/customer/feedbacks')
}

export const getFeedbackDetail = (feedbackId: string) => {
  return api.get<{ message: string; data: FeedbackItem }>(`/customer/feedbacks/${feedbackId}`)
}

export const createFeedback = (data: CreateFeedbackRequest) => {
  return api.post<{ message: string; data: FeedbackItem }>('/customer/feedbacks', data)
}
