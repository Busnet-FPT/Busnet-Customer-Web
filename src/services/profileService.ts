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
  profilePicture?: File
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
  if (data.profilePicture instanceof File) {
    const formData = new FormData()
    if (data.fullName) formData.append('fullName', data.fullName)
    if (data.phone) formData.append('phone', data.phone)
    if (data.gender) formData.append('gender', data.gender)
    if (data.dob !== undefined) formData.append('dob', data.dob || '')
    formData.append('profilePicture', data.profilePicture)
    
    const response = await api.patch<ProfileResponse>('/customer/profile/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

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
