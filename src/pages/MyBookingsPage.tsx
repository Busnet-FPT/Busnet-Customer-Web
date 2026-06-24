import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookingHistory, cancelBooking, downloadTicketPdf } from '../services/bookingService'
import type { BookingHistoryItem } from '../types/booking'
import { toast } from 'react-hot-toast'

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
}

type TabType = 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'

function MyBookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('ALL')

  const loadHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getBookingHistory({ page: 1, limit: 100 })
      setBookings(response.data.bookings || [])
    } catch (err) {
      console.error(err)
      setError('Unable to load booking history. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleCancelBooking = async (bookingCode: string) => {
    const isConfirm = window.confirm(`Are you sure you want to cancel booking ${bookingCode}?`)
    if (!isConfirm) return

    const cancelToast = toast.loading('Processing cancellation...')
    try {
      await cancelBooking(bookingCode)
      toast.success('Booking cancelled successfully!', { id: cancelToast })
      // Reload history to get updated states
      loadHistory()
    } catch (err) {
      console.error(err)
      toast.error('Failed to cancel booking. Please try again.', { id: cancelToast })
    }
  }

  const handleDownloadPdf = async (e: React.MouseEvent, bookingCode: string) => {
    e.stopPropagation()
    const downloadToast = toast.loading('Preparing PDF file...')
    try {
      const blob = await downloadTicketPdf(bookingCode)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `BusNet-Ticket-${bookingCode}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('PDF ticket downloaded!', { id: downloadToast })
    } catch (err) {
      console.error(err)
      toast.error('Failed to download PDF ticket.', { id: downloadToast })
    }
  }

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter((b) => {
    const status = b.status || ''
    const paymentStatus = b.paymentStatus || ''

    if (activeTab === 'PENDING') {
      return (
        paymentStatus === 'PENDING' &&
        status !== 'CANCELLED_BY_CUSTOMER' &&
        status !== 'CANCELLED_BY_OPERATOR'
      )
    }
    if (activeTab === 'PAID') {
      return (
        paymentStatus === 'PAID' ||
        paymentStatus === 'SUCCESS' ||
        status === 'CONFIRMED' ||
        status === 'COMPLETED'
      )
    }
    if (activeTab === 'CANCELLED') {
      return (
        status === 'CANCELLED_BY_CUSTOMER' ||
        status === 'CANCELLED_BY_OPERATOR' ||
        paymentStatus === 'CANCELLED'
      )
    }
    if (activeTab === 'EXPIRED') {
      return paymentStatus === 'EXPIRED'
    }
    return true
  })

  // Render Status Badge helper
  const renderStatusBadges = (b: BookingHistoryItem) => {
    const status = b.status

    let statusText = status
    let statusClass = 'bg-slate-100 text-slate-600 border-slate-200'

    if (status === 'PENDING_PAYMENT') {
      statusText = 'Pending Payment'
      statusClass = 'bg-amber-50 text-amber-600 border-amber-200/50'
    } else if (status === 'CONFIRMED') {
      statusText = 'Confirmed'
      statusClass = 'bg-blue-50 text-blue-600 border-blue-200/50'
    } else if (status === 'COMPLETED') {
      statusText = 'Completed'
      statusClass = 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
    } else if (status === 'CANCELLED_BY_CUSTOMER' || status === 'CANCELLED_BY_OPERATOR') {
      statusText = 'Cancelled'
      statusClass = 'bg-rose-50 text-rose-600 border-rose-200/50'
    }

    return (
      <div className="flex gap-2 flex-wrap">
        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border tracking-wide ${statusClass}`}>
          Ticket: {statusText}
        </span>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary font-primary">Booking History</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">Your Tickets</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and review details of your past and upcoming trips</p>
        </div>

        {/* Tab Filters */}
        <div className="mb-6 flex gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-xs shrink-0 max-w-full">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PENDING', label: 'Pending Payment' },
            { id: 'PAID', label: 'Paid' },
            { id: 'CANCELLED', label: 'Cancelled' },
            { id: 'EXPIRED', label: 'Expired' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-550 hover:bg-slate-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-36 border border-slate-100 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-700 font-bold border border-rose-100 rounded-3xl p-8 text-center shadow-xs">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
            <span className="text-4xl">🎫</span>
            <h3 className="font-extrabold text-slate-700 text-sm font-primary mt-3">No tickets found</h3>
            <p className="text-xs text-slate-400 mt-1">You do not have any bookings matching this status.</p>
            <button
              onClick={() => navigate('/trips')}
              className="mt-6 rounded-2xl btn-premium-gradient px-8 py-3 text-xs"
            >
              Book a Trip Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const routeName = b.trip?.route?.routeName || 'Unnamed Route'
              const operatorName = b.trip?.operator?.operatorName || 'BusNet Operator'

              const isPending = b.paymentStatus === 'PENDING' && b.status !== 'CANCELLED_BY_CUSTOMER' && b.status !== 'CANCELLED_BY_OPERATOR'
              const isPaid = b.paymentStatus === 'PAID' || b.paymentStatus === 'SUCCESS' || b.status === 'CONFIRMED' || b.status === 'COMPLETED'

              return (
                <div
                  key={b.bookingId}
                  onClick={() => navigate(`/my-bookings/${b.bookingCode}`)}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 items-stretch justify-between cursor-pointer hover:border-blue-200 group"
                >
                  {/* Left Column: Trip summary */}
                  <div className="flex-1 space-y-3.5 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-black text-slate-800 font-primary group-hover:text-primary transition-colors">
                          {routeName}
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-450 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded">
                          {operatorName}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">
                        Booking Code: <span className="font-bold text-slate-800">{b.bookingCode}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-500 font-semibold border-t border-slate-100/60 pt-3">
                      <p>Passenger: <span className="text-slate-800 font-bold">{b.passengerName || '—'}</span></p>
                      <p>Phone: <span className="text-slate-800 font-bold">{b.passengerPhone || '—'}</span></p>
                    </div>
                  </div>

                  {/* Right Column: Badges & Pricing & CTAs */}
                  <div className="flex flex-col justify-between items-start sm:items-end gap-4 shrink-0 min-w-[200px] text-left sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="space-y-2">
                      {renderStatusBadges(b)}
                      <span className="block text-base font-black text-primary font-primary mt-1">
                        {formatCurrency(b.total)}
                      </span>
                    </div>

                    {/* Actions button */}
                    <div className="flex gap-2 w-full justify-start sm:justify-end flex-wrap text-xs">
                      {isPending && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/payment/${b.bookingCode}`)
                            }}
                            className="bg-primary hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl transition"
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelBooking(b.bookingCode)
                            }}
                            className="border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold px-4 py-2 rounded-xl transition"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {isPaid && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/tickets/${b.bookingCode}`)
                            }}
                            className="bg-primary hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl transition"
                          >
                            View Ticket
                          </button>
                          <button
                            onClick={(e) => handleDownloadPdf(e, b.bookingCode)}
                            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold px-4 py-2 rounded-xl transition"
                          >
                            Download PDF
                          </button>
                        </>
                      )}
                      {!isPending && !isPaid && (
                        <span className="text-[11px] font-bold text-slate-400">View Details ➔</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyBookingsPage
