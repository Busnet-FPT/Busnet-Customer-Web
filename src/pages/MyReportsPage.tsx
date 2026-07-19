import { useEffect, useState } from 'react'
import { getReports } from '../services/reportService'
import type { ReportItem } from '../types/report'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusMeta: Record<ReportItem['status'], { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  IN_REVIEW: {
    label: 'In Review',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-rose-50 text-rose-600 border-rose-200',
  },
  DISMISSED: {
    label: 'Dismissed',
    className: 'bg-slate-100 text-slate-500 border-slate-200',
  },
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
      const data = response.data.data as any
      setReports(data.reports || [])
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

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary font-primary">My Reports</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">Issue Reports</h1>
          <p className="text-xs text-slate-500 mt-1">Reports you submitted from BusNet support.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-xs" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center font-bold text-rose-700 shadow-xs">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3 className="font-extrabold text-slate-700 text-sm font-primary">No reports</h3>
            <p className="text-xs text-slate-400 mt-1">Reports you submit from the home page will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const meta = statusMeta[report.status] || statusMeta.PENDING
              const images = report.reportImages || []

              return (
                <div key={report._id || `${report.reportType}-${report.createdAt}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                        {report.reportType}
                      </span>
                      <p className="mt-2 text-xs font-semibold text-slate-500">{formatDate(report.createdAt)}</p>
                    </div>
                    <span className={`rounded-xl border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${meta.className}`}>
                      {meta.label}
                    </span>
                  </div>

                  <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-600">
                    {report.description}
                  </p>

                  {images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {images.map((image, index) => (
                        <a key={image} href={image} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                          <img src={image} alt={`Report attachment ${index + 1}`} className="h-20 w-20 object-cover" />
                        </a>
                      ))}
                    </div>
                  )}

                  {report.isResponse && report.responseDescription && (
                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider font-primary mb-2">Admin Response</p>
                      <p className="text-sm font-bold text-slate-700">{report.responseDescription}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyReportsPage
