import type { PartnerInfo } from './booking'

export interface FavouriteItem {
  favouriteId: string
  operator: PartnerInfo
  createdAt: string
}

export interface AddFavouriteRequest {
  partnerId: string
}
