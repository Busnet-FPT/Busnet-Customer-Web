import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { createBooking, getBookingStatus } from '../services/bookingService'
import { getTripDetail, getTripSeats } from '../services/tripService'
import type { TripItem, TripSeat } from '../types/trip'
import type { BookingRequest, BookingResponseData } from '../types/booking'

function formatCurrency(value: number) {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
  ) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Đã xảy ra lỗi, vui lòng thử lại.'
}

function BookingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const tripId = searchParams.get('tripId') || ''
  const [trip, setTrip] = useState<TripItem | null>(null)
  const [seats, setSeats] = useState<TripSeat[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([])
  const [bookingResult, setBookingResult] = useState<BookingResponseData | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  const [pickupName, setPickupName] = useState('')
  const [pickupAddress, setPickupAddress] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [dropoffName, setDropoffName] = useState('')
  const [dropoffAddress, setDropoffAddress] = useState('')
  const [dropoffTime, setDropoffTime] = useState('')
  const [passengerName, setPassengerName] = useState(user?.fullName || '')
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '')
  const [passengerEmail, setPassengerEmail] = useState(user?.email || '')
  const [customerNote, setCustomerNote] = useState('')

  useEffect(() => {
    if (!tripId) return

    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [tripRes, seatsRes] = await Promise.all([
          getTripDetail(tripId),
          getTripSeats(tripId),
        ])
        setTrip(tripRes.data)
        setSeats(seatsRes.data.seats)
      } catch (error) {
        setError(getErrorMessage(error) || 'Không thể tải thông tin chuyến và ghế.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tripId])

  useEffect(() => {
    if (!bookingResult?.booking?.expiresAt) return

    const updateCountdown = () => {
      if (!bookingResult.booking.expiresAt) {
        setTimeLeft(0)
        return
      }

      const expiresAt = new Date(bookingResult.booking.expiresAt).getTime()
      setTimeLeft(Math.max(0, expiresAt - Date.now()))
    }

    updateCountdown()
    const countdownTimer = window.setInterval(updateCountdown, 1000)

    return () => window.clearInterval(countdownTimer)
  }, [bookingResult])

  useEffect(() => {
    if (!bookingResult?.booking?.bookingCode) return

    const shouldPoll =
      bookingResult.booking.paymentStatus !== 'PAID' &&
      bookingResult.booking.paymentStatus !== 'SUCCESS' &&
      bookingResult.booking.paymentStatus !== 'CONFIRMED' &&
      bookingResult.booking.paymentStatus !== 'EXPIRED' &&
      bookingResult.booking.paymentStatus !== 'CANCELLED' &&
      timeLeft > 0

    if (!shouldPoll) return

    const pollStatus = async () => {
      try {
        const response = await getBookingStatus(bookingResult.booking.bookingCode)
        const latest = response.data

        if (latest.paymentStatus === 'EXPIRED' || latest.paymentStatus === 'CANCELLED') {
          setError('Mã đặt vé đã hết hạn. Vui lòng tạo lại booking mới.')
        }

        setBookingResult((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            booking: {
              ...prev.booking,
              status: latest.status ?? prev.booking.status,
              paymentStatus: latest.paymentStatus ?? prev.booking.paymentStatus,
              expiresAt: latest.expiresAt ?? prev.booking.expiresAt,
            },
          }
        })
      } catch {
        // ignore polling errors
      }
    }

    pollStatus()
    const statusTimer = window.setInterval(pollStatus, 10000)

    return () => window.clearInterval(statusTimer)
  }, [bookingResult?.booking?.bookingCode, bookingResult?.booking?.paymentStatus, timeLeft])

  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatCodes.includes(seat.seatCode)),
    [seats, selectedSeatCodes],
  )
  const totalAmount = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + Number(seat.price || 0), 0),
    [selectedSeats],
  )

  const countdownText = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [timeLeft])

  const isPaymentExpired = useMemo(() => {
    if (!bookingResult?.booking?.expiresAt) return false
    return (
      timeLeft <= 0 &&
      !['PAID', 'SUCCESS', 'CONFIRMED'].includes(bookingResult.booking.paymentStatus)
    )
  }, [bookingResult, timeLeft])

  const toggleSeat = (seatCode: string) => {
    setSelectedSeatCodes((current) =>
      current.includes(seatCode)
        ? current.filter((code) => code !== seatCode)
        : [...current, seatCode],
    )
  }

  const handleBooking = async () => {
    if (!tripId || selectedSeatCodes.length === 0) {
      setError('Vui lòng chọn ít nhất một ghế.')
      return
    }

    const payload: BookingRequest = {
      tripId,
      seatCodes: selectedSeatCodes,
      pickupPoint_name: pickupName,
      pickupPoint_address: pickupAddress,
      pickupPoint_time: pickupTime,
      dropoffPoint_name: dropoffName,
      dropoffPoint_address: dropoffAddress,
      dropoffPoint_time: dropoffTime,
      passengerName,
      passengerPhone,
      passengerEmail,
      customerNote,
    }

    setSubmitting(true)
    setError('')
    try {
      const result = await createBooking(payload)
      setBookingResult(result.data)
    } catch (error) {
      setError(getErrorMessage(error) || 'Không thể tạo booking. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!tripId) {
    return (
      <section className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Chọn chuyến trước</h1>
          <p className="mt-2 text-slate-600">Vui lòng quay lại trang chuyến xe và chọn một chuyến để đặt vé.</p>
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Tìm chuyến xe
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef7ff_100%)] py-12">
      <div className="mx-auto w-full max-w-7xl px-4">
        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-600 shadow-sm">Đang tải chuyến...</div>
        )}
        {error && !bookingResult && (
          <div className="rounded-3xl bg-rose-50 p-8 text-center text-rose-700 shadow-sm">{error}</div>
        )}

        {trip && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-linear-to-r from-primary/10 to-cyan-500/10 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-primary">Booking flow</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">{trip.route?.routeName || 'Chuyến xe'}</h1>
                  <p className="mt-2 text-sm text-slate-600">
                    {trip.route?.originProvince} → {trip.route?.destinationProvince} • {formatDate(trip.departureDate)} • {trip.departureTime}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  {trip.availableSeats} ghế còn lại
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Step 1</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Chọn ghế</h2>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {selectedSeatCodes.length} ghế
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex h-4 w-4 rounded-full bg-primary" /> Có sẵn
                <span className="inline-flex h-4 w-4 rounded-full bg-slate-200" /> Đã khóa
                <span className="inline-flex h-4 w-4 rounded-full bg-primary/80" /> Đang chọn
              </div>
              <div className="grid grid-cols-4 gap-3">
                {seats.map((seat) => {
                  const isSelected = selectedSeatCodes.includes(seat.seatCode)
                  const isAvailable = seat.status === 'AVAILABLE'
                  return (
                    <button
                      key={seat.seatCode}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => toggleSeat(seat.seatCode)}
                      className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        !isAvailable
                          ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                          : isSelected
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {seat.seatCode}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Step 2</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Thông tin hành khách</h2>
            </div>
            <div className="mt-4 space-y-3">
              <input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Tên hành khách" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              <input value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} placeholder="Số điện thoại" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              <input value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              <textarea value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} placeholder="Ghi chú cho nhà xe" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" rows={3} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Step 3</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Điểm đón / trả</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Điểm đón</p>
                <input value={pickupName} onChange={(e) => setPickupName(e.target.value)} placeholder="Tên điểm đón" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <input value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} placeholder="Địa chỉ" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <input value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} placeholder="HH:mm" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Điểm trả</p>
                <input value={dropoffName} onChange={(e) => setDropoffName(e.target.value)} placeholder="Tên điểm trả" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <input value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} placeholder="Địa chỉ" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                <input value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} placeholder="HH:mm" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Step 4</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Tóm tắt</h2>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Ghế đã chọn</span>
                <span>{selectedSeatCodes.join(', ') || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Số lượng</span>
                <span>{selectedSeatCodes.length}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Tổng tiền</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <button
                type="button"
                onClick={handleBooking}
                disabled={submitting || selectedSeatCodes.length === 0}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? 'Đang tạo booking...' : 'Đặt vé ngay'}
              </button>
            </div>
          </div>
        </div>

        {bookingResult && (
          <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Step 5</p>
              <h2 className="mt-1 text-xl font-bold text-emerald-900">Thanh toán</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.1fr]">
              <div className="space-y-3 rounded-2xl bg-white p-4 text-sm text-emerald-900">
                <div className={`rounded-2xl p-3 text-center ${isPaymentExpired ? 'bg-rose-50' : 'bg-amber-50'}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Thời gian giữ vé</p>
                  <p className={`mt-1 text-3xl font-bold ${isPaymentExpired ? 'text-rose-600' : 'text-amber-600'}`}>{countdownText}</p>
                  <p className="mt-1 text-xs text-slate-500">{isPaymentExpired ? 'Mã đã hết hạn, vui lòng tạo lại đặt vé' : 'Mã sẽ tự hủy khi hết thời gian'}</p>
                </div>
                <p><span className="font-semibold">Mã đặt vé:</span> {bookingResult.booking.bookingCode}</p>
                <p><span className="font-semibold">Trạng thái:</span> {bookingResult.booking.status}</p>
                <p><span className="font-semibold">Thanh toán:</span> {bookingResult.booking.paymentStatus}</p>
                <p><span className="font-semibold">Hết hạn:</span> {bookingResult.booking.expiresAt ? new Date(bookingResult.booking.expiresAt).toLocaleString('vi-VN') : '—'}</p>
                <p><span className="font-semibold">Số tiền:</span> {formatCurrency(bookingResult.payment?.amount || 0)}</p>
                <p><span className="font-semibold">Ngân hàng:</span> {bookingResult.payment?.bankAccountName || ''}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center">
                <p className="text-sm font-semibold text-emerald-900">QR thanh toán</p>
                {bookingResult.payment?.qrUrl && !isPaymentExpired ? (
                  <img src={bookingResult.payment.qrUrl} alt="QR payment" className="mx-auto mt-3 max-w-full rounded-2xl border bg-white p-3" />
                ) : (
                  <div className="mt-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
                    QR không còn khả dụng vì mã đã hết hạn
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default BookingPage