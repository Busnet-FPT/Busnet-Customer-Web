import type { PartnerInfo } from './booking'

export interface FavouritePartnerAccount {
  _id: string
  fullName: string
  email: string
  phone?: string
  role: string
  status: string
  profilePicture?: string | null
}

export interface FavouriteItem {
  _id: string
  favouriteId?: string
  customerId: string
  partnerId: string
  partner: {
    account: FavouritePartnerAccount
    information: PartnerInfo | null
  }
  createdAt: string
  updatedAt: string
}
