import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBookingDetail, getBookingTickets, downloadTicketPdf } from '../services/bookingService'
import type { BookingInfo, TicketInfo } from '../types/booking'
import type { TripItem } from '../types/booking'
import { toast } from 'react-hot-toast'
import confetti from 'canvas-confetti'


function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function TicketPage() {
  const { bookingCode } = useParams<{ bookingCode: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [trip, setTrip] = useState<TripItem | null>(null)
  const [tickets, setTickets] = useState<TicketInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [hasCelebrated, setHasCelebrated] = useState(false)

  useEffect(() => {
    if (tickets.length > 0 && !hasCelebrated) {
      // Trigger a nice confetti explosion
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      })
      setHasCelebrated(true)
    }
  }, [tickets, hasCelebrated])

  useEffect(() => {
    if (!bookingCode) return

    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        // Try fetching official tickets endpoint first
        let loadedTickets: TicketInfo[] = []
        let bookingData: BookingInfo | null = null
        let tripData: TripItem | null = null

        try {
          const ticketRes = await getBookingTickets(bookingCode)
          loadedTickets = ticketRes.data.tickets
          bookingData = ticketRes.data.booking
          tripData = ticketRes.data.trip
        } catch {
          // ticket endpoint failed, we'll fall back to booking detail
        }

        // Fetch booking detail as backup or to fill missing data
        const detailRes = await getBookingDetail(bookingCode)
        if (!bookingData) bookingData = detailRes.data.booking
        if (!tripData) tripData = (detailRes.data as any).trip || (detailRes.data.booking as any)?.tripId || null

        // If tickets array is empty, reconstruct from booking detail seats list
        if (loadedTickets.length === 0 && detailRes.data.seats) {
          loadedTickets = detailRes.data.seats.map((seat: any, index: number) => ({
            ticketId: seat.ticketId || `${bookingData!.id || bookingData!._id || ''}-${index}`,
            ticketCode: seat.ticketId || `${bookingData!.bookingCode}-${seat.seatCode}`,
            bookingId: bookingData!.id || bookingData!._id || '',
            bookingCode: bookingData!.bookingCode,
            seatCode: seat.seatCode,
            price: seat.price,
            status: bookingData!.status,
            passengerName: detailRes.data.booking.passengerName || 'Passenger',
            passengerPhone: detailRes.data.booking.passengerPhone || '',
            createdAt: bookingData!.confirmedAt || '',
            updatedAt: ''
          }))
        }

        setBooking(bookingData)
        setTrip(tripData)
        setTickets(loadedTickets)
      } catch (err) {
        console.error(err)
        setError('Unable to load e-tickets.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [bookingCode])

  const handleDownloadPdf = async () => {
    if (!bookingCode) return
    setDownloading(true)
    const downloadToast = toast.loading('Preparing PDF ticket...')
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
      toast.success('PDF ticket downloaded successfully!', { id: downloadToast })
    } catch (err) {
      console.error(err)
      toast.error('Unable to download PDF ticket. Please try again later.', { id: downloadToast })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-secondary">
        <div className="text-center font-bold text-slate-500 animate-pulse">
          Preparing e-tickets...
        </div>
      </div>
    )
  }

  if (error || !booking || !trip) {
    return (
      <section className="min-h-screen bg-slate-50 py-12 font-secondary">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-rose-600 font-primary">Ticket Error</h2>
          <p className="mt-2 text-slate-655">{error || 'Ticket information not found.'}</p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-6 rounded-2xl btn-premium-gradient px-8 py-3 text-xs"
          >
            Back to Booking History
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header Success */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center mx-auto text-3xl shadow-sm">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-primary">Your E-Ticket</h1>
          <p className="text-xs text-slate-500">
            Booking Code: <span className="font-extrabold text-slate-800 font-primary">{bookingCode}</span> • Status: <span className="text-emerald-600 font-bold uppercase">{booking.paymentStatus}</span>
          </p>
        </div>

        {/* Action Panel */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl btn-premium-gradient py-3 text-xs tracking-wider disabled:opacity-70 cursor-pointer"
          >
            {downloading ? 'Downloading PDF...' : '📥 Download PDF'}
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 text-xs cursor-pointer active:scale-98 transition-all"
          >
            📋 View Booking History
          </button>
        </div>

        {/* Tickets Grid */}
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-stretch"
            >
              {/* Left Main Ticket Panel */}
              <div className="flex-1 p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-primary">Operator</span>
                    <h3 className="text-base font-extrabold text-slate-800 font-primary mt-0.5">{(booking as any)?.partnerId?.fullName || trip.operator?.operatorName || 'BusNet Operator'}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-primary">Seat No</span>
                    <span className="text-lg font-black text-primary font-primary mt-0.5">{ticket.seatCode}</span>
                  </div>
                </div>

                {/* Road Trip summary */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-slate-800 font-primary">{(trip as any)?.routeId?.routeName || trip.route?.routeName || 'Unnamed Route'}</p>
                  <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500 font-semibold">
                    <p>Departure: <span className="text-slate-800 font-bold">{trip.departureTime || (trip as any)?.actualDepartureTime ? new Date((trip as any)?.actualDepartureTime * 60000).toISOString().substring(11, 16) : 'N/A'}</span></p>
                    <p>Date: <span className="text-slate-800 font-bold">{formatDate(trip.departureDate)}</span></p>
                  </div>
                </div>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-primary block">Passenger:</span>
                    <span className="text-slate-850 font-bold mt-0.5 block">{ticket.passengerName || booking?.passengerName || 'Passenger'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-primary block">Phone Number:</span>
                    <span className="text-slate-850 font-bold mt-0.5 block">{ticket.passengerPhone || booking?.passengerPhone || 'N/A'}</span>
                  </div>
                  {booking?.pickupPoint_name && (
                    <div className="col-span-2 pt-2 border-t border-slate-50">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-primary block">Pickup:</span>
                      <span className="text-slate-850 font-bold mt-0.5 block">{booking.pickupPoint_name} <span className="text-primary">• {booking.pickupPoint_time}</span></span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block truncate">{booking.pickupPoint_address}</span>
                    </div>
                  )}
                  {booking?.dropoffPoint_name && (
                    <div className="col-span-2 pt-2 border-t border-slate-50">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-primary block">Dropoff:</span>
                      <span className="text-slate-850 font-bold mt-0.5 block">{booking.dropoffPoint_name} <span className="text-rose-500">• {booking.dropoffPoint_time}</span></span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5 block truncate">{booking.dropoffPoint_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Aisle / Perforation visual divider */}
              <div className="hidden md:flex flex-col items-center justify-between py-4 shrink-0 relative w-6">
                <div className="w-6 h-6 rounded-full bg-slate-50 border-r border-slate-200 absolute -top-3"></div>
                <div className="grow border-l border-dashed border-slate-200 h-full my-3"></div>
                <div className="w-6 h-6 rounded-full bg-slate-50 border-r border-slate-200 absolute -bottom-3"></div>
              </div>

              {/* Right Ticket Stub/Barcode Panel */}
              <div className="w-full md:w-52 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-150 p-6 flex flex-col justify-between items-center text-center shrink-0 min-h-[160px]">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-primary">Ticket Code</span>
                  <span className="text-xs font-black text-slate-800 font-primary tracking-wide">{ticket.ticketCode}</span>
                </div>

                {/* Real QR Code API */}
                <div className="p-2 bg-white border border-slate-200 rounded-xl flex flex-col items-center gap-1.5 shadow-inner">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticket.ticketCode)}&margin=1`} 
                    alt={`QR Code for ${ticket.ticketCode}`}
                    className="w-20 h-20 object-contain mix-blend-multiply pointer-events-none"
                    loading="lazy"
                  />
                  <span className="text-[8px] font-mono tracking-widest text-slate-400 font-bold">{ticket.ticketCode}</span>
                </div>

                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1 uppercase tracking-wider">
                  {ticket.status === 'CONFIRMED' || ticket.status === 'PAID' ? 'Confirmed' : ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TicketPage
