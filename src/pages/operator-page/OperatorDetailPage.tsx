import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  IconArrowLeft,
  IconStar,
  IconStarFilled,
  IconShieldCheck,
  IconPhone,
  IconRoute,
  IconClock,
  IconMapPin,
  IconChevronDown,
  IconChevronUp,
  IconBus,
  IconCurrencyDollar,
  IconLoader,
  IconWifi,
  IconSnowflake,
  IconDeviceUsb,
  IconMail,
  IconMap2,
  IconHeart,
  IconHeartFilled,
  IconSearch
} from '@tabler/icons-react'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { getFavouriteStatus, addFavourite, removeFavourite } from '../../services/favouriteService'
import WriteOperatorFeedbackModal from '../../components/WriteOperatorFeedbackModal'
import {
  getOperatorDetail,
  type OperatorDetailResponse,
  type RouteDetail,
  type ScheduleDetail
} from '../../services/operatorService'

function OperatorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<OperatorDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'routes' | 'info'>('routes')
  const [routeSearch, setRouteSearch] = useState('')
  const { user } = useAuth()
  const [isFavourite, setIsFavourite] = useState(false)
  const [isFavouriteLoading, setIsFavouriteLoading] = useState(false)
  const [showOperatorFeedbackModal, setShowOperatorFeedbackModal] = useState(false)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const result = await getOperatorDetail(id)
        setData(result)
        // Auto-expand first route
        if (result.routes.length > 0) {
          setExpandedRoutes(new Set([result.routes[0]._id]))
        }
        if (user && result.partner?.accountId) {
          try {
             const statusRes = await getFavouriteStatus(result.partner.accountId)
             setIsFavourite(statusRes.data.data.isFavourite)
          } catch (e) {}
        }
      } catch (err: any) {
        console.error('Failed to fetch operator detail:', err)
        setError(err?.response?.data?.message || 'Failed to load operator details.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [id, user])

  const toggleFavourite = async () => {
    if (!user) {
      toast.error('Please login to save favourite operators')
      return
    }
    if (!data?.partner?.accountId || isFavouriteLoading) return

    setIsFavouriteLoading(true)
    try {
      if (isFavourite) {
        await removeFavourite(data.partner.accountId)
        setIsFavourite(false)
        toast.success('Removed from favourites')
      } else {
        await addFavourite(data.partner.accountId)
        setIsFavourite(true)
        toast.success('Added to favourites')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update favourite status')
    } finally {
      setIsFavouriteLoading(false)
    }
  }

  const openOperatorFeedback = () => {
    if (!user) {
      toast.error('Please login to write feedback')
      return
    }
    setShowOperatorFeedbackModal(true)
  }

  const toggleRoute = (routeId: string) => {
    setExpandedRoutes((prev) => {
      const next = new Set(prev)
      if (next.has(routeId)) {
        next.delete(routeId)
      } else {
        next.add(routeId)
      }
      return next
    })
  }

  // Format price VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
  }

  // Format duration from minutes
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  // Render star rating
  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<IconStarFilled key={i} className={`${size} text-amber-400`} />)
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="relative inline-flex">
            <IconStarFilled className={`${size} text-slate-200`} />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <IconStarFilled className={`${size} text-amber-400`} />
            </span>
          </span>
        )
      } else {
        stars.push(<IconStar key={i} className={`${size} text-slate-200`} />)
      }
    }
    return stars
  }

  // Amenity icon mapping
  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes('wifi')) return <IconWifi className="w-4 h-4" />
    if (lower.includes('air') || lower.includes('ac')) return <IconSnowflake className="w-4 h-4" />
    if (lower.includes('usb') || lower.includes('charg')) return <IconDeviceUsb className="w-4 h-4" />
    return null
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 font-primary">
        <IconLoader className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 text-sm font-secondary animate-pulse">Loading operator details...</p>
      </div>
    )
  }

  // Error State
  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-5 font-primary">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto">
          <IconBus className="w-8 h-8" />
        </div>
        <p className="text-red-600 text-sm font-bold">{error || 'Operator not found'}</p>
        <button
          onClick={() => navigate('/operators')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
        >
          ← Back to Operators
        </button>
      </div>
    )
  }

  const { partner, routes } = data

  const filteredRoutes = routes.filter((route) => {
    const query = routeSearch.toLowerCase().trim()
    if (!query) return true
    return (
      route.routeName.toLowerCase().includes(query) ||
      route.origin_provinceName.toLowerCase().includes(query) ||
      route.destination_provinceName.toLowerCase().includes(query)
    )
  })

  return (
    <div className="w-full min-h-screen font-primary space-y-8">

      {/* Back Button */}
      <button
        onClick={() => navigate('/operators')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer group"
      >
        <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Operators
      </button>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-lg">
        {/* Cover Image / Gradient */}
        <div className="h-48 md:h-56 relative overflow-hidden">
          {partner.coverImage ? (
            <img
              src={partner.coverImage}
              alt={`${partner.operatorName} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/10 via-indigo-50 to-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-6 left-10 w-48 h-48 rounded-full bg-primary blur-3xl"></div>
                <div className="absolute bottom-4 right-16 w-32 h-32 rounded-full bg-indigo-400 blur-3xl"></div>
              </div>
              <IconBus className="w-24 h-24 text-primary/10 relative z-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent"></div>
        </div>

        {/* Partner Info Overlay */}
        <div className="relative -mt-16 px-6 md:px-8 pb-6 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {/* Avatar */}
            <div className="shrink-0">
              {partner.profilePicture ? (
                <img
                  src={partner.profilePicture}
                  alt={partner.operatorName}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-3xl border-4 border-white shadow-xl">
                  {partner.operatorName.charAt(0)}
                </div>
              )}
            </div>

            {/* Text Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {partner.operatorName}
                </h1>
                {partner.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    <IconShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 flex-wrap mt-2">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {renderStars(partner.ratingAvg)}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{partner.ratingAvg.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-secondary">({partner.totalReviews} reviews)</span>
                </div>

                <span className="h-4 w-px bg-slate-200 hidden sm:block"></span>

                {/* Routes count */}
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 font-secondary">
                  <IconRoute className="w-3.5 h-3.5 text-primary" />
                  {routes.length} {routes.length === 1 ? 'Route' : 'Routes'}
                </span>

                {/* Phone */}
                {partner.operatorPhone && (
                  <>
                    <span className="h-4 w-px bg-slate-200 hidden sm:block"></span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 font-secondary">
                      <IconPhone className="w-3.5 h-3.5 text-slate-400" />
                      {partner.operatorPhone}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Action buttons (Favourite) */}
            <div className="md:ml-auto self-end mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={openOperatorFeedback}
                className="px-4 py-3 rounded-2xl bg-primary text-white hover:bg-blue-600 transition-all cursor-pointer font-bold text-xs"
              >
                Write Feedback
              </button>
              <button
                onClick={toggleFavourite}
                disabled={isFavouriteLoading}
                className={`p-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer font-bold text-xs ${
                  isFavourite 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {isFavourite ? (
                  <IconHeartFilled className={`w-5 h-5 ${isFavouriteLoading ? 'animate-pulse' : ''}`} />
                ) : (
                  <IconHeart className={`w-5 h-5 ${isFavouriteLoading ? 'animate-pulse' : ''}`} />
                )}
                <span className="hidden sm:inline">{isFavourite ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('routes')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === 'routes'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <span className="flex items-center gap-1.5">
            <IconRoute className="w-4 h-4" />
            Routes & Schedules
          </span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === 'info'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          <span className="flex items-center gap-1.5">
            <IconBus className="w-4 h-4" />
            About & Amenities
          </span>
        </button>
      </div>

      {/* Routes & Schedules Tab */}
      {activeTab === 'routes' && (
        <div className="space-y-4">
          {/* Route Search Box */}
          {routes.length > 0 && (
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Find a route..."
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                className="w-full rounded-2xl bg-white border border-slate-100 pl-11 pr-4 py-3 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 shadow-xs"
              />
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            </div>
          )}

          {filteredRoutes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
              <p className="text-slate-400 text-xs font-secondary">
                {routes.length === 0 ? 'No routes available yet.' : 'No routes found.'}
              </p>
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <RouteAccordionCard
                key={route._id}
                route={route}
                isExpanded={expandedRoutes.has(route._id)}
                onToggle={() => toggleRoute(route._id)}
                formatPrice={formatPrice}
                formatDuration={formatDuration}
              />
            ))
          )}
        </div>
      )}

      {/* About & Amenities Tab */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">About</h3>
            <p className="text-sm text-slate-600 font-secondary leading-relaxed">
              {partner.description || 'No description provided.'}
            </p>

            {/* Contact */}
            <div className="space-y-2 pt-2 border-t border-slate-50">
              {partner.operatorPhone && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-secondary">
                  <IconPhone className="w-4 h-4 text-slate-400" />
                  <span>{partner.operatorPhone}</span>
                </div>
              )}
              {partner.account?.email && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-secondary">
                  <IconMail className="w-4 h-4 text-slate-400" />
                  <span>{partner.account.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Amenities</h3>
            {partner.amenities.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {partner.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {getAmenityIcon(amenity) || <IconBus className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 font-secondary">{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-secondary">No amenities listed.</p>
            )}
          </div>

          {/* Policies */}
          {partner.policies && Object.keys(partner.policies).length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 md:col-span-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Policies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(partner.policies).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-700 capitalize">{key.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-slate-500 font-secondary leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showOperatorFeedbackModal && (
        <WriteOperatorFeedbackModal
          isOpen={true}
          partnerId={partner.accountId}
          operatorName={partner.operatorName}
          onClose={() => setShowOperatorFeedbackModal(false)}
          onSuccess={() => {
            setShowOperatorFeedbackModal(false)
          }}
        />
      )}
    </div>
  )
}

// ======== Route Accordion Card Component ========

interface RouteAccordionProps {
  route: RouteDetail
  isExpanded: boolean
  onToggle: () => void
  formatPrice: (p: number) => string
  formatDuration: (m: number) => string
}

function RouteAccordionCard({ route, isExpanded, onToggle, formatPrice, formatDuration }: RouteAccordionProps) {
  // Find lowest price across all schedules
  const allPrices = route.schedules.flatMap((s) => [s.basePrice, ...s.prices.map((p) => p.price)])
  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary/30 shadow-md shadow-primary/5' : 'border-slate-100 shadow-sm hover:shadow-md'
      }`}>
      {/* Route Header (clickable) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer group"
      >
        {/* Route icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
          }`}>
          <IconMap2 className="w-5 h-5" />
        </div>

        {/* Route info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-extrabold text-slate-900 truncate">
              {route.routeName}
            </h3>
            {route.isPopular && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-wider border border-amber-100">
                Popular
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-secondary flex-wrap">
            <span className="flex items-center gap-1">
              <IconMapPin className="w-3 h-3" />
              {route.origin_provinceName} → {route.destination_provinceName}
            </span>
            <span className="flex items-center gap-1">
              <IconClock className="w-3 h-3" />
              {formatDuration(route.estimatedDuration)}
            </span>
            <span>{route.distanceKm} km</span>
          </div>
        </div>

        {/* Price + Chevron */}
        <div className="flex items-center gap-4 shrink-0">
          {lowestPrice > 0 && (
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-400 font-secondary block">From</span>
              <span className="text-sm font-extrabold text-primary">{formatPrice(lowestPrice)}</span>
            </div>
          )}
          {isExpanded ? (
            <IconChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <IconChevronDown className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          )}
        </div>
      </button>

      {/* Expanded: Schedules */}
      {isExpanded && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {route.schedules.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-xs text-slate-400 font-secondary">No schedules available for this route.</p>
            </div>
          ) : (
            route.schedules.map((schedule) => (
              <ScheduleRow
                key={schedule._id}
                schedule={schedule}
                formatPrice={formatPrice}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ======== Schedule Row Component ========

interface ScheduleRowProps {
  schedule: ScheduleDetail
  formatPrice: (p: number) => string
}

function ScheduleRow({ schedule, formatPrice }: ScheduleRowProps) {
  const [showDetails, setShowDetails] = useState(false)
  const bus = schedule.busId

  return (
    <div className="p-4 md:p-5">
      {/* Main schedule info */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Time block */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <p className="text-base font-extrabold text-slate-900">{schedule.departureTime}</p>
            <p className="text-[10px] text-slate-400 font-secondary">Depart</p>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-12 h-px bg-slate-200 relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 font-secondary whitespace-nowrap">
                Direct
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          </div>
          <div className="text-center">
            <p className="text-base font-extrabold text-slate-900">{schedule.arrivalTime}</p>
            <p className="text-[10px] text-slate-400 font-secondary">Arrive</p>
          </div>
        </div>

        {/* Bus info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <IconBus className="w-4 h-4 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-700 truncate">{bus?.busName || 'N/A'}</p>
            <p className="text-[10px] text-slate-400 font-secondary">
              {bus?.busType} • {bus?.totalSeats} seats
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-sm font-extrabold text-primary">{formatPrice(schedule.basePrice)}</p>
          <p className="text-[10px] text-slate-400 font-secondary">per seat</p>
        </div>

        {/* Details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] font-bold text-primary hover:text-blue-600 transition-colors cursor-pointer shrink-0"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      {/* Extended Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Ticket Prices */}
          {schedule.prices.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <IconCurrencyDollar className="w-3 h-3" />
                Ticket Prices
              </h5>
              <div className="space-y-1.5">
                {schedule.prices.map((tp) => (
                  <div key={tp._id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-600 font-secondary">{tp.seatType}</span>
                    <span className="font-bold text-slate-900">{formatPrice(tp.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pickup Points */}
          {schedule.pickupPoints.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                <IconMapPin className="w-3 h-3" />
                Pickup Points
              </h5>
              <div className="space-y-1.5">
                {schedule.pickupPoints.map((pp) => (
                  <div key={pp._id} className="px-3 py-2 rounded-lg bg-emerald-50/50 border border-emerald-100/50 text-xs space-y-0.5">
                    <p className="font-bold text-slate-700">{pp.name}</p>
                    <p className="text-slate-500 font-secondary text-[11px]">{pp.address}</p>
                    <p className="text-emerald-600 font-bold text-[10px]">{pp.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dropoff Points */}
          {schedule.dropoffPoints.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1">
                <IconMapPin className="w-3 h-3" />
                Dropoff Points
              </h5>
              <div className="space-y-1.5">
                {schedule.dropoffPoints.map((dp) => (
                  <div key={dp._id} className="px-3 py-2 rounded-lg bg-blue-50/50 border border-blue-100/50 text-xs space-y-0.5">
                    <p className="font-bold text-slate-700">{dp.name}</p>
                    <p className="text-slate-500 font-secondary text-[11px]">{dp.address}</p>
                    <p className="text-blue-600 font-bold text-[10px]">{dp.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bus Amenities */}
          {bus?.amenities && bus.amenities.length > 0 && (
            <div className="space-y-2 md:col-span-3">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <IconBus className="w-3 h-3" />
                Bus Amenities
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {bus.amenities.map((a, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 font-secondary">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OperatorDetailPage
