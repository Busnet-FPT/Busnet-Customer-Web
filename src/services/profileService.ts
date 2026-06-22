import api from './api'

export interface UserProfile {
  _id: string
  username: string
  email: string
  phone: string | null
  fullName: string
  gender: string
  dob: string | null
  role: string
  status: string
  profilePicture: string | null
  createdAt: string
  updatedAt: string
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: UserProfile & {
    account?: UserProfile
  }
}

export interface UpdateProfileData {
  fullName?: string
  phone?: string
  gender?: string
  dob?: string | null
}

export interface ChangePasswordData {
  currentPassword?: string
  newPassword?: string
}

export interface GenericResponse {
  success: boolean
  message: string
}

/**
 * Get current customer profile details
 * GET /api/customer/profile/me
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>('/customer/profile/me')
  return response.data
}

/**
 * Update customer profile details
 * PATCH /api/customer/profile/me
 */
export const updateProfile = async (data: UpdateProfileData): Promise<ProfileResponse> => {
  const response = await api.patch<ProfileResponse>('/customer/profile/me', data)
  return response.data
}

/**
 * Change customer password
 * PATCH /api/customer/profile/change-password
 */
export const changePassword = async (data: ChangePasswordData): Promise<GenericResponse> => {
  const response = await api.patch<GenericResponse>('/customer/profile/change-password', data)
  return response.data
}
