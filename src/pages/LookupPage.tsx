import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { retrieveBookingPublic, downloadTicketPdf } from '../services/bookingService'
import type { BookingInfo, TripItem } from '../types/booking'
import { toast } from 'react-hot-toast'

export default function LookupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [bookingCode, setBookingCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  
  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [trip, setTrip] = useState<TripItem | null>(null)
  const [seats, setSeats] = useState<any[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingCode.trim() || !email.trim()) return

    setLoading(true)
    const lookupToast = toast.loading('Searching for your booking...')
    try {
      const response = await retrieveBookingPublic(email, bookingCode)
      setBooking(response.data.booking)
      setTrip(response.data.trip)
      setSeats(response.data.seats || [])
      toast.success('Booking retrieved successfully!', { id: lookupToast })
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to retrieve booking. Please check your inputs.', { id: lookupToast })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!booking) return
    setDownloading(true)
    const downloadToast = toast.loading('Preparing PDF ticket...')
    try {
      const blob = await downloadTicketPdf(booking.bookingCode)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `BusNet-Ticket-${booking.bookingCode}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('PDF ticket downloaded successfully!', { id: downloadToast })
    } catch (err) {
      console.error(err)
      toast.error('Failed to download PDF ticket.', { id: downloadToast })
    } finally {
      setDownloading(false)
    }
  }

  const handleReset = () => {
    setBooking(null)
    setTrip(null)
    setSeats([])
    setBookingCode('')
  }

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    })
  }

  return (
    <section className="min-h-screen bg-slate-50/50 py-24 font-secondary px-4 pb-32">
      <div className="mx-auto max-w-4xl">
        
        {/* Title */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-h1 font-bold font-primary text-slate-900 tracking-tight">
            Retrieve Your Booking
          </h1>
          <p className="text-small text-slate-500 font-secondary max-w-lg mx-auto">
            Input your unique Booking Code and email address to view e-tickets and payment options.
          </p>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-2" />
        </div>

        {!booking || !trip ? (
          /* Search Form */
          <div className="mx-auto max-w-lg bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-primary">Booking Code</label>
                <input
                  type="text"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="e.g. BUSNET-12345678"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase placeholder:normal-case text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 font-primary">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email used for booking"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-white font-bold font-primary transition-all shadow-md active:scale-[0.98] ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-blue-600 shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'
                }`}
              >
                {loading ? 'Searching...' : 'Find My Booking'}
              </button>
            </form>
          </div>
        ) : (
          /* Retrieve Result (Ticket display) */
          <div className="space-y-6">
            
            {/* Header summary panel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary">Booking Code</span>
                <h2 className="text-2xl font-black text-slate-800 font-primary mt-0.5 tracking-tight">{booking.bookingCode}</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Booked at: {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-US') : '—'}
                </p>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-wide">
                <span className={`px-3 py-1.5 rounded-xl border ${
                  booking.payment_status === 'PAID'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : booking.status === 'CANCELLED_BY_CUSTOMER' || booking.status === 'CANCELLED_BY_OPERATOR' || booking.payment_status === 'CANCELLED' || booking.payment_status === 'EXPIRED'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {booking.status === 'CONFIRMED'
                    ? 'Confirmed'
                    : booking.status === 'COMPLETED'
                      ? 'Completed'
                      : booking.status === 'PENDING_PAYMENT'
                        ? 'Pending Payment'
                        : booking.status}
                </span>
                <span className={`px-3 py-1.5 rounded-xl border ${
                  booking.payment_status === 'PAID'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  Payment: {booking.payment_status}
                </span>
              </div>
            </div>

            {/* Ticket split board layout */}
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              
              {/* Left Column: Ticket Detail Grid */}
              <div className="space-y-6">
                
                {/* Journey & Bus info */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Journey Details</h3>
                  <div className="space-y-3 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Route:</span>
                      <span className="text-slate-800 font-bold text-right">{trip.route?.routeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Operator:</span>
                      <span className="text-slate-800 font-bold text-right">{trip.operator?.operatorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bus Type:</span>
                      <span className="text-slate-800 font-bold text-right">{trip.bus?.busName} ({trip.bus?.licensePlate})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Departure Time:</span>
                      <span className="text-slate-800 font-bold text-right">{trip.departureTime} • {formatDate(trip.departureDate)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-3 text-slate-850 font-bold text-[13px]">
                      <span>Reserved Seats:</span>
                      <span className="text-primary font-black">{seats.map(s => s.seatCode).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Passenger Info Card */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Passenger Information</h3>
                  <div className="space-y-3 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Passenger Name:</span>
                      <span className="text-slate-800 font-bold">{booking.passengerName || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Contact Number:</span>
                      <span className="text-slate-800 font-bold">{booking.passengerPhone || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email Address:</span>
                      <span className="text-slate-800 font-bold">{booking.passengerEmail || '—'}</span>
                    </div>
                    {booking.customerNote && (
                      <div className="border-t border-slate-100 pt-3">
                        <span className="text-[10px] uppercase text-slate-400 block mb-1">Customer Note:</span>
                        <span className="text-slate-700 italic">"{booking.customerNote}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pickup & Dropoff details */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary border-b border-slate-100 pb-2">📍 Pickup Point</span>
                    <p className="text-xs font-bold text-slate-800">{booking.pickupPoint_name || 'Default Point'}</p>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{booking.pickupPoint_address}</p>
                    <p className="text-[11px] text-slate-850 font-bold">Time: {booking.pickupPoint_time}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary border-b border-slate-100 pb-2">📍 Dropoff Point</span>
                    <p className="text-xs font-bold text-slate-800">{booking.dropoffPoint_name || 'Default Point'}</p>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{booking.dropoffPoint_address}</p>
                    <p className="text-[11px] text-slate-850 font-bold">Time: {booking.dropoffPoint_time}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions / Barcode E-ticket view */}
              <div className="space-y-6">
                
                {/* Print Ticket representation */}
                <div className="rounded-3xl border border-slate-200 bg-white shadow-md relative overflow-hidden flex flex-col justify-between">
                  {/* Top header decoration */}
                  <div className="h-2 bg-primary w-full" />
                  
                  {/* Body */}
                  <div className="p-6 space-y-6 flex-grow">
                    <div className="text-center space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-primary">BOARDING PASS</p>
                      <h4 className="text-base font-bold text-slate-800 font-primary">BusNet Electronic Ticket</h4>
                    </div>

                    {/* Dotted cutting line */}
                    <div className="relative my-4">
                      <div className="absolute left-[-24px] top-[-8px] w-4 h-4 rounded-full bg-slate-50 border-r border-slate-200" />
                      <div className="absolute right-[-24px] top-[-8px] w-4 h-4 rounded-full bg-slate-50 border-l border-slate-200" />
                      <div className="border-t-2 border-dashed border-slate-200 w-full" />
                    </div>

                    <div className="space-y-4 text-xs font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Price</span>
                        <span className="text-primary font-black text-sm">{formatCurrency(booking.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Seat Code</span>
                        <span className="text-slate-800 font-bold">{seats.map(s => s.seatCode).join(', ')}</span>
                      </div>
                    </div>

                    {/* Mockup Barcode */}
                    <div className="pt-6 pb-2 text-center space-y-2">
                      <div className="inline-block bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                        {/* CSS Barcode Mock */}
                        <div className="flex justify-center items-center h-12 w-48 gap-0.5 bg-white px-2">
                          {[3, 1, 4, 1, 2, 4, 1, 3, 1, 2, 1, 4, 1, 3, 2, 1, 4, 1, 2, 3].map((w, idx) => (
                            <div key={idx} className="bg-slate-900 h-full" style={{ width: `${w}px` }} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">{booking.bookingCode}</p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-3.5">
                    {booking.payment_status === 'PENDING' && booking.status === 'PENDING_PAYMENT' && (
                      <button
                        onClick={() => navigate(`/payment/${booking.bookingCode}`)}
                        className="w-full rounded-2xl btn-premium-gradient py-3.5 text-xs font-bold tracking-wider cursor-pointer text-center text-white"
                      >
                        Complete Payment
                      </button>
                    )}
                    
                    {booking.payment_status === 'PAID' && (
                      <button
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                        className="w-full rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-3 text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {downloading ? 'Downloading...' : 'Download PDF Ticket'}
                      </button>
                    )}

                    <button
                      onClick={handleReset}
                      className="w-full rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 py-3 text-xs font-bold transition-all cursor-pointer"
                    >
                      Look Up Another Booking
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  )
}
