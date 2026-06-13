import api from './api'

export interface SubscriptionPlan {
  _id: string
  planName: string
  code: string
  description: string
  price: number
  durationDays: number
  discount: number
  planFeatures: string[]
  maxBuses: number
  maxRoutes: number
  isPopular: boolean
  status: string
  chartColor: string | null
  createdAt: string
  updatedAt: string
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await api.get<{
    success: boolean
    message: string
    data: SubscriptionPlan[]
  }>('/customer/subscriptions/plans')
  return response.data.data
}
