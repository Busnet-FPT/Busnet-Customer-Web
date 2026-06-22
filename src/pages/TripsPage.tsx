import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { searchTrips, getSearchLocations, type TripInfo } from '../services/tripService'
import { getOperators, type Operator } from '../services/operatorService'
import {
  IconWifi,
  IconSnowflake,
  IconDeviceUsb,
  IconMapPin,
  IconClock,
  IconStarFilled,
  IconBus,
  IconShieldCheck,
  IconArrowsExchange,
  IconAdjustmentsHorizontal,
  IconAlertCircle
} from '@tabler/icons-react'

const VIETNAM_LOCATIONS = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Nha Trang", "Kiên Giang", "Rạch Giá", "Phu Quốc", "Kon Tum", "Lai Châu", "Lạng Sơn", "Lào Cai", "Sapa", "Lâm Đồng", "Đà Lạt", "Long An", "Nam Định", "Nghệ An", "Vinh", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Tuy Hòa", "Quảng Bình", "Đồng Hới", "Quảng Nam", "Hội An", "Quảng Ngãi", "Quảng Ninh", "Hạ Long", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Huế", "Tiền Giang", "Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
]

function TripsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const getTodayDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Extract initial search parameters from URL
  const fromParam = searchParams.get('from') || ''
  const toParam = searchParams.get('to') || ''
  const dateParam = searchParams.get('date') || getTodayDateString()

  // Input states for top search widget
  const [searchFrom, setSearchFrom] = useState(fromParam)
  const [searchTo, setSearchTo] = useState(toParam)
  const [searchDate, setSearchDate] = useState(dateParam)

  // Synchronization with URL changes
  useEffect(() => {
    setSearchFrom(fromParam)
    setSearchTo(toParam)
    setSearchDate(dateParam)
  }, [fromParam, toParam, dateParam])

  // Filter states
  const [departureTimes, setDepartureTimes] = useState<string[]>([])
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState<number>(1000000)
  const [sortBy, setSortBy] = useState<string>('cheapest')
  const [page, setPage] = useState<number>(1)

  // Data states
  const [trips, setTrips] = useState<TripInfo[]>([])
  const [operatorsList, setOperatorsList] = useState<Operator[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Locations states
  const [origins, setOrigins] = useState<string[]>([])
  const [destinations, setDestinations] = useState<string[]>([])
  const [filteredOrigins, setFilteredOrigins] = useState<string[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([])
  const [showOrigins, setShowOrigins] = useState(false)
  const [showDestinations, setShowDestinations] = useState(false)

  const cleanStr = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // Fetch unique search locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getSearchLocations()
        setOrigins(data.origins)
        setDestinations(data.destinations)
      } catch (err) {
        console.error('Failed to load search locations', err)
      }
    }
    fetchLocations()
  }, [])

  // Filter locations on input change
  useEffect(() => {
    const query = cleanStr(searchFrom.trim())
    let filtered = VIETNAM_LOCATIONS
    if (query) {
      filtered = VIETNAM_LOCATIONS.filter(loc => cleanStr(loc).includes(query))
    }
    setFilteredOrigins(filtered)
  }, [searchFrom])

  useEffect(() => {
    const query = cleanStr(searchTo.trim())
    let filtered = VIETNAM_LOCATIONS
    if (query) {
      filtered = VIETNAM_LOCATIONS.filter(loc => cleanStr(loc).includes(query))
    }
    setFilteredDestinations(filtered)
  }, [searchTo])

  const isLocationActive = (locName: string, activeList: string[]) => {
    const cleanLoc = cleanStr(locName)
    return activeList.some(item => {
      const cleanItem = cleanStr(item)
      return cleanItem.includes(cleanLoc) || cleanLoc.includes(cleanItem)
    })
  }

  // Fetch all operators for the sidebar filter
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getOperators({ limit: 100 })
        setOperatorsList(data.operators)
      } catch (err) {
        console.error('Failed to load operators list', err)
      }
    }
    fetchOperators()
  }, [])

  // Fetch matching trips
  useEffect(() => {
    if (!dateParam) return

    const loadTrips = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchTrips({
          from: fromParam || undefined,
          to: toParam || undefined,
          date: dateParam,
          departureTimes: departureTimes.length > 0 ? departureTimes : undefined,
          operators: selectedOperators.length > 0 ? selectedOperators : undefined,
          busTypes: selectedBusTypes.length > 0 ? selectedBusTypes : undefined,
          maxPrice: maxPrice < 1000000 ? maxPrice : undefined,
          minPrice: 50000,
          sortBy,
          page,
          limit: 6
        })
        setTrips(data.trips)
        setTotalResults(data.pagination.totalResults)
        setTotalPages(data.pagination.totalPages)
      } catch (err: any) {
        console.error('Error fetching trips', err)
        setError(err.response?.data?.message || 'Something went wrong while searching for trips.')
      } finally {
        setLoading(false)
      }
    }

    loadTrips()
  }, [fromParam, toParam, dateParam, departureTimes, selectedOperators, selectedBusTypes, maxPrice, sortBy, page])

  useEffect(() => {
    setPage(1)
  }, [departureTimes, selectedOperators, selectedBusTypes, maxPrice, sortBy])

  // Handlers
  const handleSwap = () => {
    const temp = searchFrom
    setSearchFrom(searchTo)
    setSearchTo(temp)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchDate) {
      alert('Please fill in Departure Date.')
      return
    }
    if (searchFrom.trim() && searchTo.trim() && searchFrom.trim().toLowerCase() === searchTo.trim().toLowerCase()) {
      alert('Origin and destination cannot be the same.')
      return
    }
    const nextParams: any = { date: searchDate }
    if (searchFrom.trim()) nextParams.from = searchFrom.trim()
    if (searchTo.trim()) nextParams.to = searchTo.trim()
    setSearchParams(nextParams)
  }

  const handleTimeCheckbox = (timeSlot: string) => {
    if (departureTimes.includes(timeSlot)) {
      setDepartureTimes(departureTimes.filter(t => t !== timeSlot))
    } else {
      setDepartureTimes([...departureTimes, timeSlot])
    }
  }

  const handleOperatorCheckbox = (opId: string) => {
    if (selectedOperators.includes(opId)) {
      setSelectedOperators(selectedOperators.filter(id => id !== opId))
    } else {
      setSelectedOperators([...selectedOperators, opId])
    }
  }

  const handleBusTypeCheckbox = (type: string) => {
    if (selectedBusTypes.includes(type)) {
      setSelectedBusTypes(selectedBusTypes.filter(t => t !== type))
    } else {
      setSelectedBusTypes([...selectedBusTypes, type])
    }
  }

  const resetAllFilters = () => {
    setDepartureTimes([])
    setSelectedOperators([])
    setSelectedBusTypes([])
    setMaxPrice(1000000)
    setSortBy('cheapest')
    setPage(1)
  }

  // Helpers
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  const formatDuration = (dep: number, arr: number) => {
    let diff = arr - dep
    if (diff < 0) diff += 1440
    const hrs = Math.floor(diff / 60)
    const mins = diff % 60
    return `${hrs}h ${mins}m`
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ'
  }

  return (
    <div className="w-full bg-slate-50/50 min-h-screen font-sans pb-24">

      {/* 1. Floating Search Card Header */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="w-full bg-white rounded-3xl border border-slate-200/60 p-4 md:p-5 shadow-lg shadow-slate-100/80">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 items-end">

            {/* From Field */}
            <div className="md:col-span-3 space-y-1 relative">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block ml-1 font-primary">Leaving From</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <IconMapPin className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  onFocus={() => setShowOrigins(true)}
                  onBlur={() => setTimeout(() => setShowOrigins(false), 200)}
                  placeholder="e.g. Ho Chi Minh City"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-10 py-3 text-sm text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold placeholder-slate-400 font-secondary"
                />
                {/* Suggestions dropdown */}
                {showOrigins && filteredOrigins.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2.5 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl z-30 py-1">
                    {filteredOrigins.map((item) => {
                      const active = isLocationActive(item, origins)
                      return active ? (
                        <button
                          key={item}
                          type="button"
                          onMouseDown={() => {
                            setSearchFrom(item)
                            setShowOrigins(false)
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>📍 {item}</span>
                          <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Active</span>
                        </button>
                      ) : (
                        <div
                          key={item}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-400 opacity-60 flex items-center justify-between cursor-not-allowed select-none bg-slate-50/20"
                          title="No routes available for this location"
                        >
                          <span>📍 {item}</span>
                          <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">Unavailable</span>
                        </div>
                      )
                    })}
                  </div>
                )}
                {/* Desktop Swap Button */}
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute right-[-18px] top-1/2 -translate-y-1/2 z-25 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 shadow-md hover:text-blue-600 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-90"
                  title="Swap locations"
                >
                  <IconArrowsExchange className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* To Field */}
            <div className="md:col-span-3 space-y-1 relative">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block ml-1 font-primary">Going To</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <IconMapPin className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  onFocus={() => setShowDestinations(true)}
                  onBlur={() => setTimeout(() => setShowDestinations(false), 200)}
                  placeholder="e.g. Da Lat"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-10 py-3 text-sm text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold placeholder-slate-400 font-secondary"
                />
                {/* Suggestions dropdown */}
                {showDestinations && filteredDestinations.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2.5 max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl z-30 py-1">
                    {filteredDestinations.map((item) => {
                      const active = isLocationActive(item, destinations)
                      return active ? (
                        <button
                          key={item}
                          type="button"
                          onMouseDown={() => {
                            setSearchTo(item)
                            setShowDestinations(false)
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>📍 {item}</span>
                          <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Active</span>
                        </button>
                      ) : (
                        <div
                          key={item}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-400 opacity-60 flex items-center justify-between cursor-not-allowed select-none bg-slate-50/20"
                          title="No routes available for this location"
                        >
                          <span>📍 {item}</span>
                          <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">Unavailable</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Date Field */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block ml-1 font-primary">Departure Date</label>
              <div className="relative group">
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none hover:bg-slate-50 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold font-secondary"
                  required
                />
              </div>
            </div>

            {/* Search Submit button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase py-3 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-center"
              >
                Search Trips
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Main Page Content */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* 2a. Left Sidebar Filter Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden">
              {/* Filter title */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 text-base font-primary">
                  <IconAdjustmentsHorizontal className="w-5 h-5 text-blue-500" />
                  Filters
                </span>
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-blue-500 font-bold hover:text-blue-600 hover:underline cursor-pointer transition-all"
                >
                  Clear All
                </button>
              </div>

              {/* Time Slots */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-0.5">Departure Time</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTimeCheckbox('earlyMorning')}
                    className={`py-3 px-2 text-center rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 ${departureTimes.includes('earlyMorning')
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-xs'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/40'
                      }`}
                  >
                    <span>Early Morning</span>
                    <span className="text-[9px] text-slate-400 font-normal font-secondary">before 06:00</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeCheckbox('morning')}
                    className={`py-3 px-2 text-center rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 ${departureTimes.includes('morning')
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-xs'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/40'
                      }`}
                  >
                    <span>Morning</span>
                    <span className="text-[9px] text-slate-400 font-normal font-secondary">06:00 - 12:00</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeCheckbox('afternoon')}
                    className={`py-3 px-2 text-center rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 ${departureTimes.includes('afternoon')
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-xs'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/40'
                      }`}
                  >
                    <span>Afternoon</span>
                    <span className="text-[9px] text-slate-400 font-normal font-secondary">12:00 - 18:00</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeCheckbox('evening')}
                    className={`py-3 px-2 text-center rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 active:scale-95 ${departureTimes.includes('evening')
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-xs'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50/40'
                      }`}
                  >
                    <span>Evening</span>
                    <span className="text-[9px] text-slate-400 font-normal font-secondary">18:00 - 24:00</span>
                  </button>
                </div>
              </div>

              {/* Operators checkboxes */}
              <div className="space-y-3 mb-6 border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-0.5">Operators</h4>
                {operatorsList.length === 0 ? (
                  <p className="text-xs text-slate-400 font-secondary animate-pulse">Loading operators list...</p>
                ) : (
                  <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
                    {operatorsList.map(op => (
                      <label key={op._id} className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedOperators.includes(op.accountId)}
                          onChange={() => handleOperatorCheckbox(op.accountId)}
                          className="rounded-md border-slate-300 text-blue-500 focus:ring-blue-500/30 h-4.5 w-4.5 cursor-pointer accent-blue-500 transition-all"
                        />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-200">{op.operatorName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Bus Type checkboxes */}
              <div className="space-y-3 mb-6 border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-0.5">Bus Type</h4>
                <div className="space-y-3.5">
                  {[
                    { label: 'Sleeper', val: 'Sleeper' },
                    { label: 'Limousine', val: 'Limousine' },
                    { label: 'Royal Cabin VIP', val: 'Cabin' },
                    { label: 'Seater', val: 'Seater' }
                  ].map(type => (
                    <label key={type.val} className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBusTypes.includes(type.val)}
                        onChange={() => handleBusTypeCheckbox(type.val)}
                        className="rounded-md border-slate-300 text-blue-500 focus:ring-blue-500/30 h-4.5 w-4.5 cursor-pointer accent-blue-500 transition-all"
                      />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className="space-y-3 mb-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block ml-0.5">Max Ticket Price</h4>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{formatCurrency(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-extrabold tracking-wider">
                  <span>100K VNĐ</span>
                  <span>1,000K VNĐ</span>
                </div>
              </div>

            </div>
          </div>

          {/* 2b. Right Results List Area */}
          <div className="lg:col-span-3 space-y-5">

            {/* Header filters details (Count + Sort) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800 font-primary">
                  {loading ? 'Searching for trips...' : `${totalResults} Trips Found`}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/25 cursor-pointer hover:bg-slate-100/50 transition-all font-secondary"
                >
                  <option value="cheapest">Cheapest</option>
                  <option value="earliest">Earliest Departure</option>
                  <option value="latest">Latest Departure</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 text-red-600 rounded-3xl border border-red-100 p-6 text-center text-sm font-bold flex items-center justify-center gap-2 shadow-xs">
                <IconAlertCircle className="w-5 h-5" />
                <span>An error occurred: {error}</span>
              </div>
            )}

            {/* Empty results */}
            {!loading && trips.length === 0 && !error && (
              <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-xs">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-3xl mb-4">
                  🚍
                </div>
                <h3 className="font-extrabold text-slate-700 text-lg font-primary">No Trips Found</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto font-secondary leading-relaxed">
                  No scheduled trips found matching your travel criteria. Try checking another date or changing your locations.
                </p>
              </div>
            )}

            {/* Loading placeholder cards */}
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white border border-slate-100 rounded-3xl h-48 animate-pulse p-6 flex flex-col justify-between shadow-xs">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-200"></div>
                        <div className="space-y-2 mt-1">
                          <div className="w-32 h-5 bg-slate-200 rounded-md"></div>
                          <div className="w-24 h-4 bg-slate-100 rounded-md"></div>
                        </div>
                      </div>
                      <div className="w-24 h-8 bg-slate-200 rounded-md"></div>
                    </div>
                    <div className="w-3/4 h-8 bg-slate-50 rounded-md my-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="w-36 h-5 bg-slate-200 rounded-md"></div>
                      <div className="w-24 h-10 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Results trips list cards
              <div className="space-y-5">
                {trips.map(trip => {
                  const ratingVal = trip.operator?.ratingAvg || 4.0
                  const isPopular = ratingVal >= 4.5

                  return (
                    <div
                      key={trip._id}
                      className={`group relative bg-white rounded-3xl border transition-all duration-300 p-6 flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-xs hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-200 ${isPopular ? 'border-blue-100 ring-1 ring-blue-50/50' : 'border-slate-100'
                        }`}
                    >
                      {/* Popular highlight Tag */}
                      {isPopular && (
                        <div className="absolute top-0 right-0 bg-linear-to-r from-blue-500 to-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-tr-3xl rounded-bl-2xl shadow-xs flex items-center gap-1 font-primary">
                          <span>★ POPULAR</span>
                        </div>
                      )}

                      {/* Left Side: Operator Info and Trip path details */}
                      <div className="flex-1 flex flex-col justify-between">

                        {/* Operator Identity details */}
                        <div className="flex gap-4 items-start">
                          {/* Logo container */}
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                            {trip.operator?.profilePicture ? (
                              <img src={trip.operator.profilePicture} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl font-black text-slate-300">{trip.operator?.operatorName.charAt(0) || 'B'}</span>
                            )}
                          </div>

                          {/* Rating and name */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-slate-800 text-base tracking-tight font-primary">
                                {trip.operator?.operatorName || 'Operator'}
                              </h3>
                              {trip.operator?.isVerified && (
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-0.5 tracking-wider uppercase">
                                  <IconShieldCheck className="w-3.5 h-3.5" />
                                  Partner
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 font-secondary">
                              <IconStarFilled className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-slate-700 font-extrabold">{ratingVal.toFixed(1)}</span>
                              <span className="text-slate-400 font-normal">({trip.operator?.totalReviews || 0} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle Side: Departure and arrival flow representation */}
                        <div className="flex items-center gap-6 mt-6 w-full max-w-lg">

                          {/* Start Point */}
                          <div className="text-left shrink-0">
                            <span className="block text-xl md:text-2xl font-black text-slate-800 font-primary">{formatTime(trip.actualDepartureTime)}</span>
                            <span className="block text-xs font-bold text-slate-600 mt-1 max-w-[130px] truncate" title={trip.route.origin_provinceName}>
                              {trip.route.origin_provinceName}
                            </span>
                            <span className="block text-[10px] text-slate-400 truncate max-w-[130px] font-secondary">
                              {trip.route.origin_representativeAddress?.split(',')[0]}
                            </span>
                          </div>

                          {/* Connection bar path */}
                          <div className="grow flex flex-col items-center justify-center relative">
                            <span className="text-[10px] font-extrabold text-slate-500 mb-1 flex items-center gap-1 font-secondary">
                              <IconClock className="w-3.5 h-3.5 text-slate-400" />
                              {formatDuration(trip.actualDepartureTime, trip.actualArrivalTime)}
                            </span>

                            {/* The line */}
                            <div className="w-full flex items-center justify-between">
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-white"></div>
                              <div className="grow border-t-2 border-dashed border-slate-200 mx-1 flex justify-center relative">
                                <span className="absolute -top-3 text-slate-400 bg-white px-1 group-hover:animate-bounce transition-all duration-300">
                                  <IconBus className="w-4 h-4 text-blue-500" />
                                </span>
                              </div>
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white"></div>
                            </div>

                            <span className="text-[9px] text-slate-400 mt-1.5 font-extrabold uppercase tracking-widest">Direct</span>
                          </div>

                          {/* End Point */}
                          <div className="text-right shrink-0">
                            <span className="block text-xl md:text-2xl font-black text-slate-800 font-primary">{formatTime(trip.actualArrivalTime)}</span>
                            <span className="block text-xs font-bold text-slate-600 mt-1 max-w-[130px] truncate" title={trip.route.destination_provinceName}>
                              {trip.route.destination_provinceName}
                            </span>
                            <span className="block text-[10px] text-slate-400 truncate max-w-[130px] font-secondary">
                              {trip.route.destination_representativeAddress?.split(',')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Amenities / Utilities Capsules */}
                        <div className="flex items-center gap-4 mt-6">
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded-lg px-2.5 py-1 flex items-center gap-1 font-secondary border border-slate-200/50">
                            🚍 {trip.bus?.busName || 'Bus'}
                          </span>

                          <div className="flex gap-1.5 flex-wrap">
                            {trip.bus?.amenities?.slice(0, 3).map((amenity, index) => {
                              const lower = amenity.toLowerCase()
                              return (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200/50 rounded-lg px-2.5 py-1 font-secondary"
                                >
                                  {lower.includes('wifi') && <IconWifi className="w-3.5 h-3.5 text-blue-400" />}
                                  {lower.includes('air') || lower.includes('ac') || lower.includes('điều hòa') ? <IconSnowflake className="w-3.5 h-3.5 text-cyan-400" /> : null}
                                  {lower.includes('usb') || lower.includes('charg') || lower.includes('sạc') ? <IconDeviceUsb className="w-3.5 h-3.5 text-violet-400" /> : null}
                                  <span>{amenity}</span>
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Seat count and Pricing with CTA button */}
                      <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-8 flex flex-col justify-between items-end shrink-0 min-w-[180px] text-right">
                        <div className="space-y-1.5 w-full">
                          <span className="block text-2xl font-black text-blue-600 font-primary">{formatCurrency(trip.price)}</span>

                          {/* Seat count warning */}
                          <div className="flex justify-end">
                            {trip.availableSeats <= 5 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 animate-pulse font-secondary">
                                Only {trip.availableSeats} seats left!
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50/50 text-blue-600 text-[10px] font-bold border border-blue-100/30 font-secondary">
                                {trip.availableSeats} seats left
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/booking?tripId=${trip._id}`)}
                          className="w-full md:w-auto px-6 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer mt-4"
                        >
                          Select Seat
                        </button>
                      </div>

                    </div>
                  )
                })}
              </div>
            )}

            {/* Pagination block */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                {/* Previous Button */}
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer font-bold text-slate-600 active:scale-95 ${page === 1
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  ⟨
                </button>

                {/* Page numbers list */}
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1
                  const isCurrent = page === pNum
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all font-extrabold text-sm cursor-pointer active:scale-95 ${isCurrent
                          ? 'bg-blue-500 text-white border border-blue-500 shadow-md shadow-blue-500/10'
                          : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      {pNum}
                    </button>
                  )
                })}

                {/* Next Button */}
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all cursor-pointer font-bold text-slate-600 active:scale-95 ${page === totalPages
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  ⟩
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  )
}

export default TripsPage