
export interface FavouriteItem {
  _id: string
  customerId: string
  partnerId: string

  partner: {
    account: {
      _id: string
      email: string
      phone: string
      role: string
      status: string
      fullName: string
      profilePicture: string | null
    }

    information: {
      _id: string
      accountId: string
      operatorName: string
      operatorPhone: string
      description: string
      amenities: string[]
      profilePicture: string | null
      coverImage: string | null
      isVerified: boolean
      ratingAvg: number
      totalReviews: number
    }
  }
}

export interface AddFavouriteRequest {
  partnerId: string
}
