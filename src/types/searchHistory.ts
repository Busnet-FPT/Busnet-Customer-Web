export interface SearchHistoryItem {
  _id: string;
  customerId?: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: string;
  searchedAt: string;
}

export interface SaveSearchHistoryPayload {
  departureLocation: string;
  arrivalLocation: string;
  departureDate: string;
}
