import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchTrips } from '../services/tripService'
import type { TripItem } from '../types/trip'

function formatPrice(value: number) {
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function TripsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<TripItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10, totalItems: 0, totalPages: 0 })

  const query = useMemo(
    () => ({
      originProvince: searchParams.get('originProvince') || '',
      destinationProvince: searchParams.get('destinationProvince') || '',
      departureDate: searchParams.get('departureDate') || '',
      seatType: searchParams.get('seatType') || '',
      page: Number(searchParams.get('page') || '1'),
      limit: Number(searchParams.get('limit') || '10')
    }),
    [searchParams],
  )

  useEffect(() => {
    if (!query.originProvince && !query.destinationProvince && !query.departureDate) {
      return
    }

    const fetchTrips = async () => {
      setLoading(true)
      setError('')

      try {
        const result = await searchTrips(query)
        setTrips(result.data.trips)
        setPagination(result.data.pagination)
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load trips. Please try again.')
        setTrips([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [query])

  useEffect(() => {
    if (!query.originProvince && !query.destinationProvince && !query.departureDate) {
      return
    }

    if (query.originProvince && query.destinationProvince) {
      document.title = `Trips: ${query.originProvince} → ${query.destinationProvince}`
    } else {
      document.title = 'Trips'
    }
  }, [query])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    navigate(`/trips?${params.toString()}`)
  }

  return (
    <section className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Trip Search</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Danh sách chuyến xe</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                {query.originProvince && query.destinationProvince && query.departureDate
                  ? `Tìm chuyến từ ${query.originProvince} đến ${query.destinationProvince} vào ${formatDate(query.departureDate)}.`
                  : 'Vui lòng điền điểm đi, điểm đến và ngày khởi hành trên homepage để tìm chuyến.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Thay đổi tìm kiếm
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Đang tìm chuyến, vui lòng chờ...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
            {error}
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Chưa có kết quả</p>
            <p className="mt-2 text-sm">Hãy thử điều chỉnh điểm đi, điểm đến hoặc ngày khởi hành.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {trips.map((trip) => (
              <article key={trip.tripId} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.24em] text-primary">{trip.status}</div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
                      <div>
                        <p className="text-sm text-slate-500">{trip.route?.originProvince} → {trip.route?.destinationProvince}</p>
                        <h2 className="text-2xl font-bold text-slate-900">{trip.route?.routeName || 'Chuyến xe không tên'}</h2>
                      </div>
                      <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        {formatPrice(trip.price)} / ghế
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                        <p className="text-slate-400">Ngày đi</p>
                        <p className="mt-1 font-semibold text-slate-900">{formatDate(trip.departureDate)}</p>
                        <p className="text-slate-500">Giờ: {trip.departureTime}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                        <p className="text-slate-400">Xe</p>
                        <p className="mt-1 font-semibold text-slate-900">{trip.bus?.busName || 'Không rõ'}</p>
                        <p className="text-slate-500">{trip.bus?.licensePlate || '---'}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-50 p-4 text-sm">
                        <p className="text-slate-400">Ghế trống</p>
                        <p className="mt-1 font-semibold text-slate-900">{trip.availableSeats}</p>
                        <p className="text-slate-500">Tổng ghế: {trip.totalSeats}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-left sm:text-right">
                    <div className="rounded-3xl bg-slate-100 px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Partner</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{trip.partner?.operatorName || 'BusNet Operator'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/booking?tripId=${encodeURIComponent(trip.tripId)}`)}
                      className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Chọn ghế
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {pagination.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`min-w-11 rounded-full px-4 py-2 text-sm font-semibold transition ${page === pagination.currentPage ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default TripsPage
