import api from './api'
import type { FavouriteItem, AddFavouriteRequest } from '../types/favourite'

export const getFavourites = () => {
  return api.get<{ message: string; data: FavouriteItem[] }>('/customer/favourites')
}

export const addFavourite = (data: AddFavouriteRequest) => {
  return api.post<{ message: string; data: FavouriteItem }>('/customer/favourites', data)
}

export const removeFavourite = (partnerId: string) => {
  return api.delete<{ message: string }>(`/customer/favourites/${partnerId}`)
}
