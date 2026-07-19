import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createBooking, getTripDetailForBooking } from '../services/bookingService'
import { useAuth } from '../contexts/AuthContext'
import type { TripItem, TripSeat, BookingRequest, PointOption } from '../types/booking'
import { toast } from 'react-hot-toast'

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) return '0 đ'
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
}

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getDepartureTime(trip?: any) {
  if (!trip) return ''
  if (trip.schedule?.departureTime) return trip.schedule.departureTime
  if (trip.departureTime) return trip.departureTime
  if (trip.actualDepartureTime !== undefined && trip.actualDepartureTime !== null) {
    const hrs = Math.floor(Number(trip.actualDepartureTime) / 60)
    const mins = Number(trip.actualDepartureTime) % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }
  return ''
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

  return 'An error occurred, please try again.'
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

  // Steps state: 1 = Seat Selection, 2 = Passenger & Route Details, 3 = Review & Confirm
  const [step, setStep] = useState(1)

  // Booking details states
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([])
  const [pickupPointsOptions, setPickupPointsOptions] = useState<PointOption[]>([])
  const [dropoffPointsOptions, setDropoffPointsOptions] = useState<PointOption[]>([])
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
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Load user data when available
  useEffect(() => {
    if (user) {
      setPassengerName(user.fullName || '')
      setPassengerPhone(user.phone || '')
      setPassengerEmail(user.email || '')
    }
  }, [user])

  useEffect(() => {
    if (!tripId) return

    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const tripRes = await getTripDetailForBooking(tripId)
        setTrip(tripRes.data.trip)
        setSeats(tripRes.data.trip.seats || [])

        const pickups = tripRes.data.pickupPoints || []
        const dropoffs = tripRes.data.dropoffPoints || []
        setPickupPointsOptions(pickups)
        setDropoffPointsOptions(dropoffs)

        const t = tripRes.data.trip as any
        const route = t?.route || {}
        const schedule = t?.schedule || {}

        // Set default pickup points
        if (pickups.length > 0) {
          setPickupName(pickups[0].name || 'Departure Station')
          setPickupAddress(pickups[0].address || route.origin_representativeAddress || route.origin_provinceName || route.originProvince || 'Departure Bus Station')
          setPickupTime(pickups[0].time || schedule.departureTime || getDepartureTime(t) || '07:00')
        } else {
          setPickupName('Departure Station')
          setPickupAddress(route.origin_representativeAddress || route.origin_provinceName || route.originProvince || 'Departure Bus Station')
          setPickupTime(schedule.departureTime || getDepartureTime(t) || '07:00')
        }

        // Set default dropoff points
        if (dropoffs.length > 0) {
          setDropoffName(dropoffs[0].name || 'Arrival Station')
          setDropoffAddress(dropoffs[0].address || route.destination_representativeAddress || route.destination_provinceName || route.destinationProvince || 'Arrival Bus Station')
          setDropoffTime(dropoffs[0].time || schedule.arrivalTime || '09:30')
        } else {
          setDropoffName('Arrival Station')
          setDropoffAddress(route.destination_representativeAddress || route.destination_provinceName || route.destinationProvince || 'Arrival Bus Station')
          setDropoffTime(schedule.arrivalTime || '09:30')
        }
      } catch (error) {
        setError(getErrorMessage(error) || 'Failed to load trip and seat details.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tripId])

  const selectedSeatsObj = useMemo(
    () => seats.filter((seat) => selectedSeatCodes.includes(seat.seatCode)),
    [seats, selectedSeatCodes],
  )
  const totalAmount = useMemo(
    () => selectedSeatsObj.reduce((sum, seat) => sum + Number(seat.price || 0), 0),
    [selectedSeatsObj],
  )

  const toggleSeat = (seatCode: string) => {
    setSelectedSeatCodes((current) =>
      current.includes(seatCode)
        ? current.filter((code) => code !== seatCode)
        : [...current, seatCode],
    )
  }

  const handleBooking = async () => {
    if (!tripId || selectedSeatCodes.length === 0) {
      toast.error('Please select at least one seat.')
      return
    }

    if (!passengerName.trim() || !passengerPhone.trim()) {
      toast.error('Please enter passenger name and phone number.')
      return
    }

    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Policies.')
      return
    }

    const route = (trip?.route || {}) as any
    const schedule = (trip?.schedule || {}) as any

    const payload: BookingRequest = {
      tripId,
      seatCodes: selectedSeatCodes,
      pickupPoint_name: pickupName.trim() || 'Departure Station',
      pickupPoint_address: pickupAddress.trim() || route.origin_representativeAddress || route.origin_provinceName || route.originProvince || 'Departure Bus Station',
      pickupPoint_time: pickupTime.trim() || schedule.departureTime || getDepartureTime(trip) || '07:00',
      dropoffPoint_name: dropoffName.trim() || 'Arrival Station',
      dropoffPoint_address: dropoffAddress.trim() || route.destination_representativeAddress || route.destination_provinceName || route.destinationProvince || 'Arrival Bus Station',
      dropoffPoint_time: dropoffTime.trim() || schedule.arrivalTime || '09:30',
      passengerName: passengerName.trim(),
      passengerPhone: passengerPhone.trim(),
      passengerEmail: passengerEmail.trim(),
      customerNote: customerNote.trim() || undefined,
    }

    setSubmitting(true)
    try {
      const result = await createBooking(payload)
      toast.success('Booking successful!')
      navigate(`/payment/${result.data.booking.bookingCode}`)
    } catch (error) {
      const errMsg = getErrorMessage(error) || 'Failed to create booking. Please try again.'
      toast.error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!tripId) {
    return (
      <section className="min-h-screen bg-slate-50 py-12 font-secondary">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 font-primary">Select a trip first</h1>
          <p className="mt-2 text-slate-650">Please return to the trips page and select a trip to book.</p>
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="mt-6 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 text-sm transition-all shadow-md active:scale-95"
          >
            Find Trips
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-32">
      <div className="mx-auto w-full max-w-5xl px-4">
        {loading && (
          <div className="rounded-3xl bg-white p-16 text-center text-slate-500 shadow-sm border border-slate-100 animate-pulse font-bold">
            Loading trip details...
          </div>
        )}
        {error && (
          <div className="rounded-3xl bg-rose-50 p-8 text-center text-rose-700 shadow-sm border border-rose-100 font-bold mb-6">
            {error}
          </div>
        )}

        {trip && !loading && (
          <>
            {/* Step Stepper Progress Bar */}
            <div className="flex items-center justify-between max-w-md mx-auto mb-8 font-primary">
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step === 1 ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' : 'bg-white border border-slate-200 text-slate-500'
                  }`}>1</span>
                <span className={`text-xs font-bold transition-all duration-300 ${step === 1 ? 'text-slate-800' : 'text-slate-400'}`}>Select Seat</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-3" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step === 2 ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' : 'bg-white border border-slate-200 text-slate-500'
                  }`}>2</span>
                <span className={`text-xs font-bold transition-all duration-300 ${step === 2 ? 'text-slate-800' : 'text-slate-400'}`}>Passenger Info</span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-200 mx-3" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${step === 3 ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' : 'bg-white border border-slate-200 text-slate-500'
                  }`}>3</span>
                <span className={`text-xs font-bold transition-all duration-300 ${step === 3 ? 'text-slate-800' : 'text-slate-400'}`}>Confirm</span>
              </div>
            </div>

            {/* Trip Details Card Summary */}
            <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500 font-primary">Itinerary</p>
                <h1 className="mt-1.5 text-xl font-bold text-slate-800 font-primary">{trip.route?.routeName || 'Trip'}</h1>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {trip.route?.originProvince} → {trip.route?.destinationProvince} • {formatDate(trip.departureDate)} • {getDepartureTime(trip)}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-extrabold px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600">
                  {trip.bus?.busName || 'Premium Bus'}
                </span>
                <span className="text-xs font-extrabold px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg">
                  {trip.availableSeats} seats available
                </span>
              </div>
            </div>

            {/* Step Render Area */}
            <div className="grid gap-6">

              {/* STEP 1: Seat Selection */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Seat Map Panel */}
                  <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-base font-extrabold text-slate-800 font-primary">Seat Map</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Please select your preferred seats</p>
                      </div>
                      <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        Selected: <span className="text-blue-500 font-extrabold">{selectedSeatCodes.join(', ') || 'None'}</span>
                      </div>
                    </div>

                    {/* Steer/Driver visual representation */}
                    {/* <div className="max-w-xs mx-auto mb-6 bg-slate-50/70 border border-slate-100 rounded-2xl py-3 px-4 flex justify-between items-center text-slate-400">
                      <span className="text-xs font-bold tracking-wider font-primary">Front</span>
                      <span className="text-xl">☸️ Driver</span>
                    </div> */}

                    {/* Seat Grid Map */}
                    <div className="max-w-xs mx-auto bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 shadow-inner">
                      <div className="grid grid-cols-4 gap-3">
                        {seats.map((seat) => {
                          const isSelected = selectedSeatCodes.includes(seat.seatCode)
                          const isBooked = seat.status === 'BOOKED'
                          const isHeld = seat.status === 'HELD'
                          const isAvailable = seat.status === 'AVAILABLE'

                          return (
                            <button
                              key={seat.seatCode}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => toggleSeat(seat.seatCode)}
                              className={`h-11 rounded-xl text-xs font-bold transition-all cursor-pointer ${isBooked
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                                : isHeld
                                  ? 'bg-amber-100 text-amber-600 border border-amber-200 cursor-not-allowed'
                                  : isSelected
                                    ? 'bg-blue-500 text-white border border-blue-500 shadow-md shadow-blue-500/20 scale-105'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/10'
                                }`}
                              title={seat.seatCode + ` - ${formatCurrency(seat.price)}`}
                            >
                              {seat.seatCode}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Color legends */}
                    <div className="flex justify-center gap-4 flex-wrap mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-white border border-slate-200 inline-block" /> Available</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-blue-500 inline-block" /> Selected</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-slate-200 inline-block" /> Booked</span>
                      <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-200 inline-block" /> Held</span>
                    </div>
                  </div>

                  {/* Summary Sidebar Panel */}
                  <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Booking Details</h3>
                      <div className="mt-4 space-y-3.5 text-xs text-slate-500 font-semibold">
                        <div className="flex justify-between">
                          <span>Route:</span>
                          <span className="text-slate-800 font-bold">{trip.route?.routeName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operator:</span>
                          <span className="text-slate-800 font-bold">{trip.partner?.operatorName || trip.operator?.operatorName || trip.operatorName || 'BusNet Operator'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Selected Seats:</span>
                          <span className="text-blue-500 font-bold">{selectedSeatCodes.length} seats</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seat Codes:</span>
                          <span className="text-slate-800 font-bold">{selectedSeatCodes.join(', ') || 'None'}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3.5 text-sm text-slate-800 font-bold">
                          <span>Subtotal:</span>
                          <span className="text-blue-600 text-base font-black">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={selectedSeatCodes.length === 0}
                      onClick={() => setStep(2)}
                      className="w-full mt-6 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 text-xs font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Passenger & Pickup/Dropoff Form */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Forms input block */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Passenger form card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                      <h2 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3.5 mb-4">Passenger Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Full Name</label>
                          <input
                            type="text"
                            value={passengerName}
                            onChange={(e) => setPassengerName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Phone Number</label>
                            <input
                              type="tel"
                              value={passengerPhone}
                              onChange={(e) => setPassengerPhone(e.target.value)}
                              placeholder="+84..."
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Email (Optional)</label>
                            <input
                              type="email"
                              value={passengerEmail}
                              onChange={(e) => setPassengerEmail(e.target.value)}
                              placeholder="email@example.com"
                              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Route Details (Pickup/Dropoff) form card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                      <h2 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3.5 mb-4">Pickup & Dropoff</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Pickup fields */}
                        <div className="p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl space-y-3">
                          <p className="text-xs font-black text-slate-800 font-primary border-b border-slate-100 pb-2 flex items-center gap-1.5">
                            Pickup Point
                          </p>
                          {pickupPointsOptions.length > 0 ? (
                            <div>
                              <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Select Location</label>
                              <select
                                value={`${pickupName}|${pickupTime}`}
                                onChange={(e) => {
                                  const [n, t] = e.target.value.split('|')
                                  const pt = pickupPointsOptions.find(p => p.name === n && p.time === t)
                                  if (pt) {
                                    setPickupName(pt.name)
                                    setPickupAddress(pt.address)
                                    setPickupTime(pt.time)
                                  }
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                              >
                                {pickupPointsOptions.map((pt, idx) => (
                                  <option key={idx} value={`${pt.name}|${pt.time}`}>
                                    {pt.time} - {pt.name}
                                  </option>
                                ))}
                              </select>
                              <div className="mt-2 text-[10px] text-slate-500 font-secondary leading-relaxed">
                                <span className="font-bold text-slate-700">Address:</span> {pickupAddress}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Location Name</label>
                                <input
                                  type="text"
                                  value={pickupName}
                                  onChange={(e) => setPickupName(e.target.value)}
                                  placeholder="e.g. Mien Dong Station"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Detailed Address</label>
                                <input
                                  type="text"
                                  value={pickupAddress}
                                  onChange={(e) => setPickupAddress(e.target.value)}
                                  placeholder="Specific address"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Estimated Time</label>
                                <input
                                  type="text"
                                  value={pickupTime}
                                  onChange={(e) => setPickupTime(e.target.value)}
                                  placeholder="e.g. 14:00"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Dropoff fields */}
                        <div className="p-4 bg-slate-50/50 border border-slate-200/50 rounded-2xl space-y-3">
                          <p className="text-xs font-black text-slate-800 font-primary border-b border-slate-100 pb-2 flex items-center gap-1.5">
                            Dropoff Point
                          </p>
                          {dropoffPointsOptions.length > 0 ? (
                            <div>
                              <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Select Location</label>
                              <select
                                value={`${dropoffName}|${dropoffTime}`}
                                onChange={(e) => {
                                  const [n, t] = e.target.value.split('|')
                                  const pt = dropoffPointsOptions.find(p => p.name === n && p.time === t)
                                  if (pt) {
                                    setDropoffName(pt.name)
                                    setDropoffAddress(pt.address)
                                    setDropoffTime(pt.time)
                                  }
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                              >
                                {dropoffPointsOptions.map((pt, idx) => (
                                  <option key={idx} value={`${pt.name}|${pt.time}`}>
                                    {pt.time} - {pt.name}
                                  </option>
                                ))}
                              </select>
                              <div className="mt-2 text-[10px] text-slate-500 font-secondary leading-relaxed">
                                <span className="font-bold text-slate-700">Address:</span> {dropoffAddress}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Location Name</label>
                                <input
                                  type="text"
                                  value={dropoffName}
                                  onChange={(e) => setDropoffName(e.target.value)}
                                  placeholder="e.g. Da Lat Station"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Detailed Address</label>
                                <input
                                  type="text"
                                  value={dropoffAddress}
                                  onChange={(e) => setDropoffAddress(e.target.value)}
                                  placeholder="Specific address"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-extrabold uppercase text-slate-400 block mb-1">Estimated Time</label>
                                <input
                                  type="text"
                                  value={dropoffTime}
                                  onChange={(e) => setDropoffTime(e.target.value)}
                                  placeholder="e.g. 20:00"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 font-semibold"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                      <h2 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3 mb-4">Trip Notes</h2>
                      <textarea
                        value={customerNote}
                        onChange={(e) => setCustomerNote(e.target.value)}
                        placeholder="Any special requests for the operator or driver?"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Summary Sidebar Panel */}
                  <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between h-fit space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Booking Summary</h3>
                      <div className="mt-4 space-y-3 text-xs text-slate-500 font-semibold">
                        <div className="flex justify-between">
                          <span>Passenger:</span>
                          <span className="text-slate-800 font-bold truncate max-w-[130px]">{passengerName || 'Not filled'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span className="text-slate-800 font-bold">{passengerPhone || 'Not filled'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seats count:</span>
                          <span className="text-slate-800 font-bold">{selectedSeatCodes.length}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3 text-sm text-slate-800 font-bold">
                          <span>Total:</span>
                          <span className="text-blue-600 text-base font-black">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        disabled={!passengerName.trim() || !passengerPhone.trim()}
                        className="w-full rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 text-xs font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 transition-all"
                      >
                        Checkout
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 py-3 text-xs font-bold active:scale-95 transition-all"
                      >
                        Back to Seats
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Confirm */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Detailed review panel */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                      <h2 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Review Details</h2>

                      {/* Info Sections */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        {/* Journey Summary */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Trip Info</p>
                          <p className="font-bold text-slate-800">{trip.route?.routeName}</p>
                          <p className="text-xs text-slate-500 font-semibold">{trip.partner?.operatorName || trip.operator?.operatorName || trip.operatorName || 'BusNet Operator'} • {trip.bus?.busName}</p>
                          <p className="text-xs text-slate-500 font-semibold">Departure: {formatDate(trip.departureDate)} at {getDepartureTime(trip)}</p>
                          <p className="text-xs text-slate-500 font-semibold">Seats: <span className="text-blue-500 font-bold">{selectedSeatCodes.join(', ')}</span></p>
                        </div>

                        {/* Passenger Summary */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Passenger Info</p>
                          <p className="font-bold text-slate-800">{passengerName}</p>
                          <p className="text-xs text-slate-500 font-semibold">Phone: {passengerPhone}</p>
                          {passengerEmail && <p className="text-xs text-slate-500 font-semibold">Email: {passengerEmail}</p>}
                          {customerNote && <p className="text-xs text-slate-500 font-semibold italic">Note: "{customerNote}"</p>}
                        </div>

                        {/* Pickup Point Summary */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">📍 Pickup</p>
                          <p className="font-bold text-slate-800 text-xs">{pickupName}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">{pickupAddress}</p>
                          <p className="text-[11px] text-slate-500 font-bold">Time: {pickupTime}</p>
                        </div>

                        {/* Dropoff Point Summary */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">📍 Dropoff</p>
                          <p className="font-bold text-slate-800 text-xs">{dropoffName}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">{dropoffAddress}</p>
                          <p className="text-[11px] text-slate-500 font-bold">Time: {dropoffTime}</p>
                        </div>
                      </div>

                      {/* Ticket Rules Warning */}
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-xs leading-relaxed">
                        <p className="font-bold mb-1">⚠️ Important Note:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>After confirming the booking, you will have 10 minutes to complete the payment via QR code.</li>
                          <li>If the time expires, the system will automatically cancel the booking and release the seats.</li>
                          <li>Please ensure you transfer the exact amount and include the correct transaction content.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Summary Sidebar Panel */}
                  <div className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-base font-extrabold text-slate-800 font-primary border-b border-slate-100 pb-3">Payment</h3>
                      <div className="space-y-3.5 text-xs text-slate-500 font-semibold">
                        <div className="flex justify-between">
                          <span>Seats count:</span>
                          <span className="text-slate-800 font-bold">{selectedSeatCodes.length}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3.5 text-slate-800 font-bold text-sm">
                          <span>Total Amount:</span>
                          <span className="text-blue-600 text-lg font-black">{formatCurrency(totalAmount)}</span>
                        </div>
                      </div>

                      {/* Terms Acceptance */}
                      <div className="pt-2">
                        <label className="flex items-start gap-2.5 cursor-pointer text-slate-600">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="mt-0.5 rounded text-blue-500 focus:ring-blue-500/20 border-slate-300 w-4 h-4 cursor-pointer accent-blue-500"
                          />
                          <span className="text-[11px] font-semibold leading-relaxed">
                            I agree to BusNet's{' '}
                            <a href="/terms" className="text-blue-500 hover:underline font-bold">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-blue-500 hover:underline font-bold">
                              Privacy Policy
                            </a>.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        type="button"
                        disabled={submitting || !agreeTerms}
                        onClick={handleBooking}
                        className="w-full rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 text-xs font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 transition-all"
                      >
                        {submitting ? 'Processing...' : 'Checkout'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 py-3 text-xs font-bold active:scale-95 transition-all"
                      >
                        Back to Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default BookingPage