import api from './api'
import type { SearchHistoryItem, SaveSearchHistoryPayload } from '../types/searchHistory'

export const saveSearchHistory = (payload: SaveSearchHistoryPayload) => {
  return api.post<{ success: boolean; message: string; data: SearchHistoryItem }>(
    '/customer/search-history',
    payload
  )
}

export const getSearchHistories = (limit = 3) => {
  return api.get<{ success: boolean; message: string; data: SearchHistoryItem[] }>(
    `/customer/search-history?limit=${limit}`
  )
}

export const deleteSearchHistory = (id: string) => {
  return api.delete<{ success: boolean; message: string }>(
    `/customer/search-history/${id}`
  )
}

export const clearSearchHistories = () => {
  return api.delete<{ success: boolean; message: string }>(
    '/customer/search-history'
  )
}
