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

export interface RegisterOperatorData {
  email: string
  password?: string
  fullName: string
  phone: string
  operatorName: string
  taxCode: string
  bankName: string
  bankNumber: string
  bankAccountName: string
  bankBranch?: string
  sepayVa: string
  sepayKey: string
  planId: string
  operatorPhone?: string
  description?: string
  amenities?: string[]
  policies?: {
    cancellation?: string
    luggage?: string
    children?: string
    [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  profilePicture?: string
  coverImage?: string
}

export interface RegisterOperatorResponse {
  success: boolean
  message: string
  data: {
    account: {
      _id: string
      email: string
      phone: string
      fullName: string
      role: string
      status: string
    }
    partnerInfo: {
      _id: string
      operatorName: string
      taxCode: string
      sepayVa: string
    }
    transaction: {
      _id: string
      amount: number
      content: string
      status: string
      qrUrl: string
    }
  }
}

export interface SubscriptionStatusResponse {
  success: boolean
  message: string
  data: {
    transactionId: string
    status: 'PENDING' | 'SUCCESS' | 'FAILED'
    amount: number
  }
}

/**
 * Register a new partner/operator account
 * POST /api/partner/auth/register
 */
export const registerOperator = async (data: RegisterOperatorData): Promise<RegisterOperatorResponse> => {
  const response = await api.post<RegisterOperatorResponse>('/partner/auth/register', data)
  return response.data
}

/**
 * Get transaction status (Polling)
 * GET /api/partner/subscription/status/:transactionId
 */
export const getSubscriptionStatus = async (transactionId: string): Promise<SubscriptionStatusResponse> => {
  const response = await api.get<SubscriptionStatusResponse>(`/partner/subscription/status/${transactionId}`)
  return response.data
}

export interface UploadResponse {
  success: boolean
  message: string
  url: string
  publicId: string
}

/**
 * Upload an image file to Cloudinary
 * POST /api/upload
 */
export const uploadImage = async (file: File, folder?: string): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post<UploadResponse>(
    `/upload${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}


