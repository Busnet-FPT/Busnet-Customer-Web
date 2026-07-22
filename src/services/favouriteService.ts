import api from './api'
import type { FavouriteItem } from '../types/favourite'

export const getFavourites = () => {
  return api.get<{ message: string; data: FavouriteItem[] | { favourites: FavouriteItem[] } }>('/customer/favourites/operators')
}

export const addFavourite = (partnerId: string) => {
  return api.post<{ message: string; data: FavouriteItem }>(`/customer/favourites/operators/${partnerId}`)
}

export const removeFavourite = (partnerId: string) => {
  return api.delete<{ message: string }>(`/customer/favourites/operators/${partnerId}`)
}

export const getFavouriteStatus = (partnerId: string) => {
  return api.get<{ message: string; data: { isFavourite: boolean; favouriteId: string | null; createdAt: string | null } }>(`/customer/favourites/operators/${partnerId}/status`)
}
