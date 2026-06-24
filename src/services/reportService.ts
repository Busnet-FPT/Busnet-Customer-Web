import api from './api'
import type { ReportItem, CreateReportRequest } from '../types/report'

export const getReports = () => {
  return api.get<{ message: string; data: ReportItem[] }>('/customer/reports')
}

export const getReportDetail = (reportId: string) => {
  return api.get<{ message: string; data: ReportItem }>(`/customer/reports/${reportId}`)
}

export const createReport = (data: CreateReportRequest) => {
  return api.post<{ message: string; data: ReportItem }>('/customer/reports', data)
}
