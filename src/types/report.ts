export interface ReportItem {
  _id?: string
  reportType: 'TRIP' | 'BOOKING' | 'OPERATOR' | 'PAYMENT' | 'SYSTEM' | 'OTHER'
  description: string
  reportImages?: string[]
  isResponse?: boolean
  responseDescription?: string
  status: 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED' | 'DISMISSED'
  adminNote?: string
  createdAt: string
}

export interface CreateReportRequest {
  reportType: 'TRIP' | 'BOOKING' | 'OPERATOR' | 'PAYMENT' | 'SYSTEM' | 'OTHER'
  description: string
  reportImages?: string[]
}
