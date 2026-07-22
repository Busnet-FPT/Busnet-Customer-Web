import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { getBookingDetail, cancelBooking, requestCancelBooking, downloadTicketPdf } from '../services/bookingService'
import type { BookingInfo } from '../types/booking'
import type { TripItem } from '../types/booking'
import { toast } from 'react-hot-toast'
import { getFeedbacks } from '../services/feedbackService'
import SubmitFeedbackModal from '../components/SubmitFeedbackModal'

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

type BookingSeatView = {
  seatCode: string
}

type PopulatedTrip = TripItem & {
  routeId?: {
    routeName?: string
  }
  busId?: {
    busName?: string
    licensePlate?: string
  }
}

type PopulatedBooking = BookingInfo & {
  tripId?: TripItem
  partnerId?: {
    fullName?: string
  }
}

function BookingDetailPage() {
  const { bookingCode } = useParams<{ bookingCode: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [trip, setTrip] = useState<TripItem | null>(null)
  const [seats, setSeats] = useState<BookingSeatView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [hasFeedback, setHasFeedback] = useState(false)
  const [checkingFeedback, setCheckingFeedback] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const loadData = useCallback(async () => {
    if (!bookingCode) return
    setLoading(true)
    setError('')
    try {
      const response = await getBookingDetail(bookingCode)
      const loadedBooking = response.data.booking
      const populatedBooking = loadedBooking as PopulatedBooking
      setBooking(loadedBooking)
      setTrip(response.data.trip || populatedBooking.tripId || null)
      setSeats(response.data.seats || [])

      setCheckingFeedback(true)
      try {
        const feedbackResponse = await getFeedbacks()
        const feedbacks = feedbackResponse.data.data.feedbacks || []
        const loadedBookingId = loadedBooking._id || loadedBooking.id
        const reviewed = feedbacks.some((feedback) => {
          const feedbackBooking = feedback.bookingId
          return (
            feedbackBooking?._id === loadedBookingId ||
            feedbackBooking?.bookingCode === loadedBooking.bookingCode
          )
        })
        setHasFeedback(reviewed)
      } catch (feedbackErr) {
        console.error('Unable to check feedback status', feedbackErr)
        setHasFeedback(false)
      } finally {
        setCheckingFeedback(false)
      }
    } catch (err) {
      console.error(err)
      setError('Unable to load booking details.')
    } finally {
      setLoading(false)
    }
  }, [bookingCode])

  useEffect(() => {
    queueMicrotask(() => {
      void loadData()
    })
  }, [loadData])

  const handleCancelBooking = async () => {
    if (!bookingCode) return
    const isConfirm = window.confirm(`Are you sure you want to cancel booking ${bookingCode}?`)
    if (!isConfirm) return

    setCancelling(true)
    const cancelToast = toast.loading('Processing cancellation...')
    try {
      await cancelBooking(bookingCode)
      toast.success('Booking cancelled successfully!', { id: cancelToast })
      loadData() // refresh
    } catch (err) {
      console.error(err)
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to cancel booking.'
        : 'Failed to cancel booking.'
      toast.error(message, { id: cancelToast })
    } finally {
      setCancelling(false)
    }
  }

  const handleRequestCancelBooking = async () => {
    if (!bookingCode) return
    if (!cancelReason.trim()) {
      toast.error('Cancellation reason is required.')
      return
    }

    setCancelling(true)
    const cancelToast = toast.loading('Submitting cancellation request...')
    try {
      const response = await requestCancelBooking(bookingCode, cancelReason.trim())
      toast.success(response.data?.message || response.message || 'Cancellation request submitted successfully!', { id: cancelToast })
      setShowCancelRequestModal(false)
      setCancelReason('')
      loadData()
    } catch (err) {
      console.error(err)
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to submit cancellation request.'
        : 'Failed to submit cancellation request.'
      toast.error(message, { id: cancelToast })
    } finally {
      setCancelling(false)
    }
  }

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
      toast.error('Failed to download PDF ticket.', { id: downloadToast })
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-secondary">
        <div className="text-center font-bold text-slate-500 animate-pulse">
          Loading booking details...
        </div>
      </div>
    )
  }

  if (error || !booking || !trip) {
    return (
      <section className="min-h-screen bg-slate-50 py-12 font-secondary">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-rose-600 font-primary">Data Loading Error</h2>
          <p className="mt-2 text-slate-600">{error || 'Booking not found.'}</p>
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

  const paymentStatus = booking.paymentStatus || booking.payment_status
  const isPending = paymentStatus === 'PENDING' && booking.status !== 'CANCELLED_BY_CUSTOMER' && booking.status !== 'CANCELLED_BY_OPERATOR'
  const isPaid = paymentStatus === 'PAID' || paymentStatus === 'SUCCESS' || booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' || booking.status === 'CANCEL_REQUESTED'
  const isCancelled = booking.status === 'CANCELLED_BY_CUSTOMER' || booking.status === 'CANCELLED_BY_OPERATOR' || paymentStatus === 'CANCELLED'
  const isExpired = paymentStatus === 'EXPIRED'
  const canRequestCancel = booking.status === 'CONFIRMED' && (paymentStatus === 'PAID' || paymentStatus === 'SUCCESS')
  const canWriteFeedback = booking.status === 'COMPLETED' && !hasFeedback
  const populatedTrip = trip as PopulatedTrip
  const populatedBooking = booking as PopulatedBooking

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back Link */}
        <button
          onClick={() => navigate('/my-bookings')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary font-bold transition-all uppercase tracking-wider mb-6 cursor-pointer"
        >
          Back to Booking History
        </button>

        {/* Header summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs mb-6">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary">Booking Code</span>
            <h1 className="text-2xl font-black text-slate-800 font-primary mt-0.5 tracking-tight">{bookingCode}</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Booked at: {booking.confirmedAt ? new Date(booking.confirmedAt).toLocaleString('en-US') : '-'}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-wide">
            <span className={`px-3 py-1.5 rounded-xl border ${
              isPaid
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : isCancelled || isExpired
                  ? 'bg-rose-50 text-rose-600 border-rose-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
              Ticket: {booking.status === 'CONFIRMED' ? 'Confirmed' : booking.status === 'CANCEL_REQUESTED' ? 'Cancellation Requested' : booking.status === 'COMPLETED' ? 'Completed' : booking.status === 'PENDING_PAYMENT' ? 'Pending Payment' : booking.status}
            </span>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          {/* Left panel: Journey Details & Passenger Form */}
          <div className="space-y-6">
            {/* Journey info */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Journey Details</h3>
              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Route:</span>
                  <span className="text-slate-800 font-bold text-right">{populatedTrip.routeId?.routeName || trip.route?.routeName || 'Unnamed Route'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operator:</span>
                  <span className="text-slate-800 font-bold text-right">{populatedBooking.partnerId?.fullName || trip.operator?.operatorName || 'BusNet Operator'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Type:</span>
                  <span className="text-slate-800 font-bold text-right">{populatedTrip.busId?.busName || trip.bus?.busName} ({populatedTrip.busId?.licensePlate || trip.bus?.licensePlate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Departure Time:</span>
                  <span className="text-slate-800 font-bold text-right">{trip.departureTime || (trip.actualDepartureTime != null ? new Date(trip.actualDepartureTime * 60000).toISOString().substring(11, 16) : 'N/A')} - {formatDate(trip.departureDate)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-slate-850 font-bold text-[13px]">
                  <span>Reserved Seats:</span>
                  <span className="text-primary font-black">{seats.map(s => s.seatCode).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Passenger details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Passenger Information</h3>
              <div className="space-y-3 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-slate-800 font-bold">{booking.passengerName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-800 font-bold">{booking.passengerPhone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-800 font-bold">{booking.passengerEmail || '-'}</span>
                </div>
                {booking.customerNote && (
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[10px] uppercase text-slate-400 block mb-1">Note from Customer:</span>
                    <span className="text-slate-700 italic">"{booking.customerNote}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pickup & Dropoff details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Pickup point */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary border-b border-slate-100 pb-2">Pickup Point</span>
                <p className="text-xs font-bold text-slate-800">{booking.pickupPoint_name || 'Default Pickup Point'}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{booking.pickupPoint_address || trip.route?.origin_representativeAddress}</p>
                <p className="text-[11px] text-slate-800 font-bold">Time: {booking.pickupPoint_time || trip.departureTime}</p>
              </div>

              {/* Dropoff point */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary border-b border-slate-100 pb-2">Dropoff Point</span>
                <p className="text-xs font-bold text-slate-800">{booking.dropoffPoint_name || 'Default Dropoff Point'}</p>
                <p className="text-[11px] text-slate-500 font-semibold">{booking.dropoffPoint_address || trip.route?.destination_representativeAddress}</p>
                <p className="text-[11px] text-slate-800 font-bold">Time: {booking.dropoffPoint_time || trip.arrivalTime}</p>
              </div>
            </div>
          </div>

          {/* Right panel: Timeline & Actions */}
          <div className="space-y-6">
            {/* Timeline progress card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Booking Progress</h3>

              {/* Timeline steps */}
              <div className="space-y-6 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Step 1: Created */}
                <div className="relative text-xs">
                  <span className="absolute left-[-21px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                  <p className="font-bold text-slate-800">Booking Successful</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Your seat reservation request has been created successfully.</p>
                </div>

                {/* Step 2: Payment */}
                <div className="relative text-xs">
                  <span className={`absolute left-[-21px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    isPaid ? 'bg-emerald-500' : isCancelled || isExpired ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'
                  }`} />
                  <p className="font-bold text-slate-850">
                    {isPaid ? 'Payment Completed' : isCancelled ? 'Transaction Cancelled' : isExpired ? 'Payment Expired' : 'Pending Payment'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {isPaid ? 'The payment gateway has received the full ticket amount.' : isCancelled ? 'The booking was cancelled.' : isExpired ? 'The payment time has expired.' : 'Please scan the QR code to transfer.'}
                  </p>
                </div>

                {/* Step 3: Finished journey */}
                <div className="relative text-xs">
                  <span className={`absolute left-[-21px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                    booking.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                  <p className={`font-bold ${booking.status === 'COMPLETED' ? 'text-slate-850' : 'text-slate-400'}`}>Journey Completed</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">The bus has departed and completed bringing passengers to the dropoff point.</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Available Actions</h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-3 text-slate-800 font-bold text-sm">
                  <span>Total Amount:</span>
                  <span className="text-primary text-base font-black">{formatCurrency(booking.total)}</span>
                </div>

                <div className="space-y-2 pt-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => navigate(`/payment/${bookingCode}`)}
                        className="w-full rounded-2xl btn-premium-gradient py-3.5 text-xs font-bold tracking-wider cursor-pointer"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={handleCancelBooking}
                        disabled={cancelling}
                        className="w-full rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 py-3 text-xs font-bold active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {cancelling ? 'Processing...' : 'Cancel Booking'}
                      </button>
                    </>
                  )}
                  {isPaid && (
                    <>
                      <button
                        onClick={() => navigate(`/tickets/${bookingCode}`)}
                        className="w-full rounded-2xl btn-premium-gradient py-3.5 text-xs font-bold tracking-wider cursor-pointer"
                      >
                        View E-Ticket
                      </button>
                      <button
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                        className="w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 py-3 text-xs font-bold active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {downloading ? 'Downloading PDF...' : 'Download PDF Ticket'}
                      </button>
                      {canRequestCancel && (
                        <button
                          onClick={() => setShowCancelRequestModal(true)}
                          disabled={cancelling}
                          className="w-full rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-600 py-3 text-xs font-bold active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {cancelling ? 'Processing...' : 'Request Cancel'}
                        </button>
                      )}
                      {booking.status === 'COMPLETED' && (
                        hasFeedback ? (
                          <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 py-3 text-center text-xs font-bold text-emerald-600">
                            Review submitted
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowFeedbackModal(true)}
                            disabled={checkingFeedback}
                            className="w-full rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 py-3 text-xs font-bold active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {checkingFeedback ? 'Checking Review...' : 'Write Review'}
                          </button>
                        )
                      )}
                    </>
                  )}
                  {!isPending && !isPaid && (
                    <div className="text-center py-4 bg-slate-50 border rounded-2xl text-slate-400 font-bold">
                      No actions available for this booking
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showFeedbackModal && canWriteFeedback && (
        <SubmitFeedbackModal
          isOpen={true}
          bookingId={booking.id || booking._id || ''}
          operatorName={populatedBooking.partnerId?.fullName || trip.operator?.operatorName || 'Operator'}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={() => {
            setHasFeedback(true)
            setShowFeedbackModal(false)
          }}
        />
      )}

      {showCancelRequestModal && canRequestCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-rose-500 font-primary">Cancellation Request</p>
              <h3 className="mt-1 text-lg font-black text-slate-900 font-primary">Request ticket cancellation</h3>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs font-semibold text-slate-500">
              <div className="flex justify-between gap-4">
                <span>Booking code</span>
                <span className="font-black text-slate-800">{booking.bookingCode}</span>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">Reason</span>
              <textarea
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                rows={4}
                maxLength={300}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100"
                placeholder="Tell us why you need to cancel this ticket..."
                autoFocus
              />
              <span className="mt-1 block text-right text-[10px] font-bold text-slate-400">{cancelReason.length}/300</span>
            </label>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (cancelling) return
                  setShowCancelRequestModal(false)
                  setCancelReason('')
                }}
                disabled={cancelling}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleRequestCancelBooking}
                disabled={cancelling || !cancelReason.trim()}
                className="rounded-2xl bg-rose-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelling ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BookingDetailPage

