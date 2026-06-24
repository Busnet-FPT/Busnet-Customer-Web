import { useEffect, useState } from 'react'
import { getReports } from '../services/reportService'
import type { ReportItem } from '../types/report'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function MyReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReports = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getReports()
      setReports(response.data.data || [])
    } catch (err) {
      console.error(err)
      setError('Unable to load reports. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const getStatusBadge = (status: ReportItem['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-slate-100 text-slate-600 border-slate-200 px-2 py-0.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider">Pending</span>
      case 'IN_REVIEW':
        return <span className="bg-amber-50 text-amber-600 border-amber-200 px-2 py-0.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider">In Review</span>
      case 'RESOLVED':
        return <span className="bg-emerald-50 text-emerald-600 border-emerald-200 px-2 py-0.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider">Resolved</span>
      case 'REJECTED':
        return <span className="bg-rose-50 text-rose-600 border-rose-200 px-2 py-0.5 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider">Rejected</span>
      default:
        return null
    }
  }

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-rose-500 font-primary">My Reports</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">Issue Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Track the status of your submitted trip reports</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-40 border border-slate-100 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-700 font-bold border border-rose-100 rounded-3xl p-8 text-center shadow-xs">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
            <span className="text-4xl">📝</span>
            <h3 className="font-extrabold text-slate-700 text-sm font-primary mt-3">No reports</h3>
            <p className="text-xs text-slate-400 mt-1">You haven't submitted any reports yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report._id || Math.random().toString()}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div>
                      <h3 className="text-base font-black text-slate-800 font-primary">{report.reportType} Report</h3>
                      <p className="text-[11px] font-semibold text-slate-500 mt-1">
                        Reported on {formatDate(report.createdAt)}
                      </p>
                    </div>
                    <div>{getStatusBadge(report.status)}</div>
                  </div>
                  <p className="text-sm font-medium text-slate-650 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {report.description}
                  </p>
                </div>

                {report.isResponse && report.responseDescription && (
                  <div className="p-5 sm:p-6 bg-slate-50/50">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary mb-2">Admin Response</p>
                    <p className="text-sm font-bold text-slate-700">{report.responseDescription}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyReportsPage
