import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getBookingDetail,
  getBookingPayment,
  getBookingStatus,
  cancelBooking,
} from '../services/bookingService'
import type { BookingInfo, PaymentInfo, TripItem } from '../types/booking'
import { toast } from 'react-hot-toast'

type PaymentPagePayment = PaymentInfo & {
  status?: string
  currency?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  expiresAt?: string | null
}

type BookingInfoWithSnakeCase = BookingInfo & {
  payment_status?: string
}

function formatCurrency(value: number) {
  return Number(value || 0).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
}

function formatDate(value?: string | null) {
  if (!value) return 'N/A'

  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function normalizePaymentStatus(booking: BookingInfoWithSnakeCase | null) {
  return booking?.paymentStatus || booking?.payment_status || ''
}

function PaymentPage() {
  const { bookingCode } = useParams<{ bookingCode: string }>()
  const navigate = useNavigate()

  const [booking, setBooking] = useState<BookingInfoWithSnakeCase | null>(null)
  const [trip, setTrip] = useState<TripItem | null>(null)
  const [payment, setPayment] = useState<PaymentPagePayment | null>(null)
  const [seatCodes, setSeatCodes] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [serverTimeOffset, setServerTimeOffset] = useState(0)
  const [isCancelling, setIsCancelling] = useState(false)
  const [hasAutoCancelled, setHasAutoCancelled] = useState(false)

  const handleCancelBooking = async () => {
    if (!bookingCode || isCancelling) return
    
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    setIsCancelling(true)
    try {
      await cancelBooking(bookingCode)
      toast.success('Booking cancelled successfully')
      
      const tripId = trip?._id || trip?.tripId || (booking as any)?.tripId
      if (tripId) {
        navigate(`/booking?tripId=${tripId}`)
      } else {
        navigate('/my-bookings')
      }
    } catch (err: any) {
      console.error('[FE][PaymentPage][handleCancelBooking error]', err)
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setIsCancelling(false)
    }
  }

  useEffect(() => {
    if (!bookingCode) return

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [detailRes, paymentRes] = await Promise.all([
          getBookingDetail(bookingCode),
          getBookingPayment(bookingCode),
        ])

        console.log('[FE][PaymentPage][detailRes]', detailRes)
        console.log('[FE][PaymentPage][paymentRes]', paymentRes)

        const detailData = detailRes.data
        const paymentData = paymentRes.data

        console.log('[FE][PaymentPage][detailData]', detailData)
        console.log('[FE][PaymentPage][paymentData]', paymentData)

        const bookingData = paymentData.booking || detailData.booking
        const paymentInfo = paymentData.payment

        if (!bookingData) {
          throw new Error('Booking data is missing from backend response')
        }

        if (!paymentInfo) {
          throw new Error('Payment data is missing from backend response')
        }

        // Calculate server time offset
        const serverTimeStr = paymentData.serverTime
        if (serverTimeStr) {
          const serverTime = new Date(serverTimeStr).getTime()
          const localTime = Date.now()
          setServerTimeOffset(serverTime - localTime)
        }

        const normalizedBooking = bookingData as BookingInfoWithSnakeCase

        setBooking({
          ...normalizedBooking,
          paymentStatus:
            normalizedBooking.paymentStatus ||
            normalizedBooking.payment_status ||
            '',
          payment_status:
            normalizedBooking.payment_status ||
            normalizedBooking.paymentStatus ||
            '',
        })

        const detailSeats = detailData.seats || []
        const normalizedSeatCodes = detailSeats
          .map((seat: any) => seat.seatCode)
          .filter(Boolean)

        setSeatCodes(normalizedSeatCodes)

        const detailTrip =
          (detailData as any).trip ||
          (detailData.booking as any)?.tripId ||
          null

        setTrip(detailTrip)

        const normalizedPayment: PaymentPagePayment = {
          transactionId: paymentInfo.transactionId || null,
          status: (paymentInfo as any).status,
          gateway: paymentInfo.gateway || 'SEPAY',

          bankName:
            (paymentInfo as any).bankName ||
            paymentInfo.bankCode,

          bankCode:
            paymentInfo.bankCode ||
            (paymentInfo as any).bankName,

          bankNumber:
            paymentInfo.bankNumber ||
            (paymentInfo as any).accountNumber,

          accountNumber:
            (paymentInfo as any).accountNumber ||
            paymentInfo.bankNumber,

          bankAccountName:
            paymentInfo.bankAccountName ||
            (paymentInfo as any).accountName,

          accountName:
            (paymentInfo as any).accountName ||
            paymentInfo.bankAccountName,

          amount: paymentInfo.amount || 0,
          currency: (paymentInfo as any).currency || 'VND',
          content: paymentInfo.content || '',
          qrUrl: paymentInfo.qrUrl || null,
          expiresAt: (paymentInfo as any).expiresAt || normalizedBooking.expiresAt,
        }

        console.log('[FE][PaymentPage][normalizedBooking]', normalizedBooking)
        console.log('[FE][PaymentPage][normalizedSeatCodes]', normalizedSeatCodes)
        console.log('[FE][PaymentPage][normalizedTrip]', detailTrip)
        console.log('[FE][PaymentPage][normalizedPayment]', normalizedPayment)

        setPayment(normalizedPayment)
      } catch (err) {
        console.error('[FE][PaymentPage][loadData error]', err)
        setError('Unable to load payment details. Please check the booking code.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [bookingCode])

  useEffect(() => {
    if (!booking?.expiresAt) return

    const updateCountdown = () => {
      if (!booking.expiresAt) {
        setTimeLeft(0)
        return
      }

      const expiresTime = new Date(booking.expiresAt).getTime()
      const adjustedNow = Date.now() + serverTimeOffset
      setTimeLeft(Math.max(0, expiresTime - adjustedNow))
    }

    updateCountdown()

    const timer = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(timer)
  }, [booking, serverTimeOffset])

  useEffect(() => {
    if (!bookingCode || !booking) return

    const currentPaymentStatus =
      booking.paymentStatus ||
      (booking as any).payment_status ||
      ''

    const currentBookingStatus = booking.status || ''

    const isFinished =
      ['PAID', 'SUCCESS', 'CONFIRMED', 'EXPIRED', 'CANCELLED'].includes(
        currentPaymentStatus,
      ) || ['CONFIRMED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_OPERATOR'].includes(
        currentBookingStatus,
      )

    if (isFinished) return

    const checkStatus = async () => {
      try {
        const response = await getBookingStatus(bookingCode)
        const latest = response.data

        if (latest.serverTime) {
          const serverTime = new Date(latest.serverTime).getTime()
          const localTime = Date.now()
          setServerTimeOffset(serverTime - localTime)
        }

        const latestPaymentStatus =
          latest.paymentStatus ||
          latest.payment_status ||
          ''

        const latestBookingStatus = latest.status || ''

        console.log('[FE][PaymentPage][polling latest]', {
          latest,
          latestPaymentStatus,
          latestBookingStatus,
        })

        setBooking((prev) =>
          prev
            ? {
                ...prev,
                status: latestBookingStatus || prev.status,
                paymentStatus: latestPaymentStatus || prev.paymentStatus,
                payment_status: latestPaymentStatus,
                confirmedAt: latest.confirmedAt || prev.confirmedAt,
                expiresAt: latest.expiresAt || prev.expiresAt,
              } as any
            : prev,
        )

        if (
          latestPaymentStatus === 'PAID' ||
          latestPaymentStatus === 'SUCCESS' ||
          latestBookingStatus === 'CONFIRMED'
        ) {
          toast.success('Payment successful!')
          navigate(`/tickets/${bookingCode}`)
          return
        }

        if (
          latestPaymentStatus === 'EXPIRED' ||
          latestPaymentStatus === 'CANCELLED'
        ) {
          toast.error('Your booking has expired or was cancelled.')
        }
      } catch (err) {
        console.error('[FE][PaymentPage][polling error]', err)
      }
    }

    // gọi ngay lần đầu, không cần đợi
    checkStatus()

    const pollingInterval = window.setInterval(checkStatus, 5000)

    return () => window.clearInterval(pollingInterval)
  }, [bookingCode, booking?.bookingCode, booking?.status, booking?.paymentStatus, navigate])

  const countdownText = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [timeLeft])

  const isExpired = useMemo(() => {
    if (!booking?.expiresAt) return false

    const paymentStatus = normalizePaymentStatus(booking)
    const expiresTime = new Date(booking.expiresAt).getTime()
    const adjustedNow = Date.now() + serverTimeOffset

    return (
      adjustedNow >= expiresTime &&
      !['PAID', 'SUCCESS', 'CONFIRMED'].includes(paymentStatus)
    )
  }, [booking, serverTimeOffset])

  useEffect(() => {
    if (isExpired && bookingCode && !hasAutoCancelled && !isCancelling) {
      const autoCancel = async () => {
        setHasAutoCancelled(true)
        try {
          await cancelBooking(bookingCode)
        } catch (err) {
          console.error('[FE][PaymentPage][autoCancel error]', err)
        }
      }
      autoCancel()
    }
  }, [isExpired, bookingCode, hasAutoCancelled, isCancelling])

  const handleCopy = async (text: string, label: string) => {
    if (!text) {
      toast.error(`No ${label} to copy`)
      return
    }

    await navigator.clipboard.writeText(text)
    toast.success(`Copied ${label}!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-secondary">
        <div className="text-center font-bold text-slate-500 animate-pulse">
          Preparing payment details...
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <section className="min-h-screen bg-slate-50 py-12 font-secondary">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-rose-600 font-primary">
            Payment Error
          </h2>

          <p className="mt-2 text-slate-600">
            {error || 'Booking not found.'}
          </p>

          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-6 rounded-2xl btn-premium-gradient px-8 py-3 text-xs"
          >
            Back to Bookings
          </button>
        </div>
      </section>
    )
  }

  const bankDisplay = payment?.bankName || payment?.bankCode || 'N/A'
  const accountNameDisplay =
    payment?.bankAccountName || payment?.accountName || 'N/A'
  const accountNumberDisplay =
    payment?.bankNumber || payment?.accountNumber || ''
  const amountDisplay = payment?.amount || booking.total || 0
  const contentDisplay = payment?.content || booking.bookingCode || ''

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary font-primary">
            Secure Checkout
          </p>

          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">
            Payment Details
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Complete your payment to secure the tickets
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div
              className={`rounded-3xl border p-6 text-center bg-white shadow-xs ${isExpired ? 'border-rose-200' : 'border-slate-200'
                }`}
            >
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary">
                Time Remaining
              </span>

              <span
                className={`text-4xl font-black block mt-2 font-primary tracking-tight transition-all duration-300 ${isExpired
                    ? 'text-rose-600'
                    : 'text-amber-500 animate-pulse'
                  }`}
              >
                {isExpired ? '00:00' : countdownText}
              </span>

              <p className="text-[11px] text-slate-450 mt-2 font-medium">
                {isExpired
                  ? 'Your booking has expired. The seats have been released.'
                  : 'The system will automatically cancel the booking and release the seats when the time expires.'}
              </p>
            </div>

            {payment && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">
                  Bank Transfer Details
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-450 font-semibold shrink-0">
                      Bank:
                    </span>

                    <span className="text-slate-800 font-bold text-right">
                      {bankDisplay}
                    </span>
                  </div>

                  <div className="flex justify-between items-start gap-4">
                    <span className="text-slate-450 font-semibold shrink-0">
                      Account Name:
                    </span>

                    <span className="text-slate-800 font-bold text-right uppercase">
                      {accountNameDisplay}
                    </span>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <span className="text-slate-450 font-semibold shrink-0">
                      Account Number:
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-850 font-bold font-primary">
                        {accountNumberDisplay || 'N/A'}
                      </span>

                      <button
                        onClick={() =>
                          handleCopy(accountNumberDisplay, 'account number')
                        }
                        className="text-[10px] text-primary font-bold hover:underline cursor-pointer border border-primary/20 px-1.5 py-0.5 rounded bg-primary/5 active:scale-95"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <span className="text-slate-450 font-semibold shrink-0">
                      Amount:
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-primary font-black text-sm">
                        {formatCurrency(amountDisplay)}
                      </span>

                      <button
                        onClick={() =>
                          handleCopy(String(amountDisplay), 'amount')
                        }
                        className="text-[10px] text-primary font-bold hover:underline cursor-pointer border border-primary/20 px-1.5 py-0.5 rounded bg-primary/5 active:scale-95"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <span className="text-slate-450 font-semibold shrink-0">
                      Description:
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-850 font-extrabold bg-slate-150 px-2 py-1 rounded text-[11px] font-mono tracking-wider">
                        {contentDisplay || 'N/A'}
                      </span>

                      <button
                        onClick={() =>
                          handleCopy(contentDisplay, 'transfer description')
                        }
                        className="text-[10px] text-primary font-bold hover:underline cursor-pointer border border-primary/20 px-1.5 py-0.5 rounded bg-primary/5 active:scale-95"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 font-semibold leading-relaxed">
                  ⚠️ <strong>Important Note:</strong> You must transfer the exact{' '}
                  <strong>Amount</strong> and include the correct{' '}
                  <strong>Description</strong> as shown above for the system to
                  automatically confirm your tickets.
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-center">
              <p className="text-xs font-extrabold text-slate-800 font-primary">
                Scan QR to Pay
              </p>

              <p className="text-[11px] text-slate-400 mt-1">
                Supports all banking apps & e-wallets in Vietnam
              </p>

              {payment?.qrUrl && !isExpired ? (
                <div className="relative inline-block mt-5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-inner group transition-all duration-300 hover:scale-[1.02] hover:border-primary/30">
                  <img
                    src={payment.qrUrl}
                    alt="SePay QR Payment Code"
                    className="w-56 h-56 mx-auto object-contain"
                  />

                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="bg-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider shadow-sm font-primary">
                      SCAN ME
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-5 p-8 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/50 text-rose-600 font-semibold text-xs flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">⏳</span>
                  QR code is unavailable because the booking has expired or been
                  cancelled.
                </div>
              )}

              {!isExpired && (
                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Waiting for your payment...</span>
                </div>
              )}
            </div>

            {trip && (
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 space-y-3">
                <span className="text-[9px] font-extrabold tracking-widest text-slate-400 uppercase block font-primary">
                  Trip Information
                </span>

                <div className="text-xs space-y-2 font-semibold text-slate-600">
                  <p className="text-slate-800 font-bold text-sm">
                    {trip.route?.routeName || 'N/A'}
                  </p>

                  <p>
                    Booking Code:{' '}
                    <span className="text-slate-800 font-bold">
                      {bookingCode}
                    </span>
                  </p>

                  <p>
                    Operator:{' '}
                    <span className="text-slate-800 font-bold">
                      {trip.operator?.operatorName || 'N/A'}
                    </span>
                  </p>

                  <p>
                    Departure:{' '}
                    <span className="text-slate-800 font-bold">
                      {trip.departureTime || 'N/A'} •{' '}
                      {formatDate(trip.departureDate)}
                    </span>
                  </p>

                  <p>
                    Seats:{' '}
                    <span className="text-primary font-bold">
                      {seatCodes.length > 0 ? seatCodes.join(', ') : 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isExpired ? (
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition hover:underline cursor-pointer disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          ) : (
            (trip?._id || trip?.tripId || (booking as any)?.tripId) && (
              <button
                onClick={() => {
                  const tId = trip?._id || trip?.tripId || (booking as any)?.tripId
                  navigate(`/booking?tripId=${tId}`)
                }}
                className="text-xs font-bold text-blue-500 hover:text-blue-650 transition hover:underline cursor-pointer"
              >
                Rebook Seats
              </button>
            )
          )}
          
          <button
            onClick={() => navigate('/my-bookings')}
            className="text-xs font-bold text-slate-500 hover:text-primary transition hover:underline cursor-pointer"
          >
            Back to Booking History
          </button>
        </div>
      </div>
    </section>
  )
}

export default PaymentPage