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

export interface VerifyEmailResponse {
  success: boolean
  message: string
  data: {
    account: {
      _id: string
      username: string
      email: string
      status: string
      isEmailVerified: boolean
    }
  }
}

export interface ResendOtpResponse {
  success: boolean
  message: string
  data: {
    message: string
  }
}

/**
 * Verify customer email address with OTP
 * POST /api/customer/auth/verify-email
 */
export const verifyEmail = async (email: string, code: string): Promise<VerifyEmailResponse> => {
  const response = await api.post<VerifyEmailResponse>('/customer/auth/verify-email', { email, code })
  return response.data
}

/**
 * Resend verification OTP code
 * POST /api/customer/auth/forgot-password
 */
export const resendVerificationOtp = async (email: string): Promise<ResendOtpResponse> => {
  const response = await api.post<ResendOtpResponse>('/customer/auth/forgot-password', { email })
  return response.data
}

export interface LoginData {
  identifier: string
  password: string
}

export interface LoginResponse {
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
      createdAt: string
    }
  }
}

/**
 * Login a customer account
 * POST /api/customer/auth/login
 */
export const loginCustomer = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/customer/auth/login', data)
  return response.data
}

