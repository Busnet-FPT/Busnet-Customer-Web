import api from './api'

export interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
  phone: string
  gender?: string
  dob?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    account: {
      _id: string
      username: string
      email: string
      phone: string
      fullName: string
      gender: string
      dob: string | null
      role: string
      status: string
      profilePicture: string | null
      createdAt: string
    }
    verificationCode: string // Phase 1: for testing
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Array<{ field: string; message: string }>
}

/**
 * Register a new customer account
 * POST /api/customer/auth/register
 */
export const registerCustomer = async (data: RegisterData): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/customer/auth/register', data)
  return response.data
}

export interface GoogleAuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    account: {
      _id: string
      username: string
      email: string
      phone: string | null
      fullName: string
      role: string
      status: string
      profilePicture: string | null
    }
  }
}

/**
 * Login or register with Google OAuth Token
 * POST /api/customer/auth/google
 */
export const loginWithGoogle = async (idToken: string): Promise<GoogleAuthResponse> => {
  const response = await api.post<GoogleAuthResponse>('/customer/auth/google', { idToken })
  return response.data
}
