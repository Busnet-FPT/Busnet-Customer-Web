import api from './api'

export interface BlogAuthor {
  _id: string
  fullName: string
  profilePicture: string | null
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  summary?: string
  content?: string
  tag: string
  coverImage: string
  authorId: BlogAuthor
  views: number
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface BlogsResponse {
  blogs: BlogPost[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export const getBlogs = async (params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
}) => {
  const response = await api.get<{ success: boolean; message: string; data: BlogsResponse }>('/customer/blogs', {
    params
  })
  return response.data.data
}

export const getBlogDetail = async (identifier: string) => {
  const response = await api.get<{ success: boolean; message: string; data: BlogPost }>(`/customer/blogs/${identifier}`)
  return response.data.data
}
