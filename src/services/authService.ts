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

export interface ForgotPasswordResponse {
  success: boolean
  message: string
  data: {
    message: string
  }
}

export interface VerifyResetCodeResponse {
  success: boolean
  message: string
  data: {
    valid: boolean
  }
}

export interface ResetPasswordResponse {
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
 * Resend verification OTP code for unverified customer email.
 * Backend uses the forgot-password endpoint to resend REGISTER code when account is unverified.
 * POST /api/customer/auth/forgot-password
 */
export const resendVerificationOtp = async (email: string): Promise<ResendOtpResponse> => {
  const response = await api.post<ResendOtpResponse>('/customer/auth/forgot-password', { email })
  return response.data
}

/**
 * Send customer password reset OTP
 * POST /api/customer/auth/forgot-password
 */
export const forgotPasswordCustomer = async (email: string): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>('/customer/auth/forgot-password', { email })
  return response.data
}

/**
 * Verify customer password reset OTP
 * POST /api/customer/auth/verify-reset-code
 */
export const verifyResetCodeCustomer = async (email: string, code: string): Promise<VerifyResetCodeResponse> => {
  const response = await api.post<VerifyResetCodeResponse>('/customer/auth/verify-reset-code', { email, code })
  return response.data
}

/**
 * Reset customer password with verified OTP
 * POST /api/customer/auth/reset-password
 */
export const resetPasswordCustomer = async (
  email: string,
  code: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>('/customer/auth/reset-password', { email, code, newPassword })
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

export interface RegisterOperatorData {
  email: string
  password?: string
  fullName: string
  phone: string
  operatorName: string
  taxCode: string
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
  businessLicense?: string
}

export interface SubmitRegistrationResponse {
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
      licenseStatus: string
    }
  }
}

export interface ContinueRegistrationResponse {
  success: boolean
  message: string
  data: {
    accountStatus: string
    licenseStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejectionReason: string | null
    account: {
      _id: string
      email: string
      phone: string
      fullName: string
    }
    partnerInfo: {
      _id: string
      operatorName: string
      businessLicense: string
      selectedPlanId: string
    }
  }
}

export interface CompletePaymentData {
  email: string
  password: string
  bankName: string
  bankNumber: string
  bankAccountName: string
  bankBranch?: string
  sepayVa: string
  sepayKey: string
}

export interface CompletePaymentResponse {
  success: boolean
  message: string
  data: {
    transaction: {
      _id: string
      amount: number
      content: string
      status: string
      qrUrl: string
    }
  }
}

export interface ResubmitLicenseResponse {
  success: boolean
  message: string
  data: {
    partnerInfo: {
      _id: string
      operatorName: string
      businessLicense: string
      licenseStatus: string
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
 * Phase 1: Submit operator registration (Plan + Profile + License)
 * POST /api/partner/auth/register
 */
export const submitOperatorRegistration = async (data: RegisterOperatorData): Promise<SubmitRegistrationResponse> => {
  const response = await api.post<SubmitRegistrationResponse>('/partner/auth/register', data)
  return response.data
}

/**
 * Continue registration - verify identity and check status
 * POST /api/partner/auth/continue-registration
 */
export const continueOperatorRegistration = async (email: string, password: string): Promise<ContinueRegistrationResponse> => {
  const response = await api.post<ContinueRegistrationResponse>('/partner/auth/continue-registration', { email, password })
  return response.data
}

/**
 * Phase 2: Complete payment (SePay config + create Transaction)
 * POST /api/partner/auth/complete-payment
 */
export const completeOperatorPayment = async (data: CompletePaymentData): Promise<CompletePaymentResponse> => {
  const response = await api.post<CompletePaymentResponse>('/partner/auth/complete-payment', data)
  return response.data
}

/**
 * Resubmit business license after rejection
 * POST /api/partner/auth/resubmit-license
 */
export const resubmitLicense = async (email: string, password: string, businessLicense: string): Promise<ResubmitLicenseResponse> => {
  const response = await api.post<ResubmitLicenseResponse>('/partner/auth/resubmit-license', { email, password, businessLicense })
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

