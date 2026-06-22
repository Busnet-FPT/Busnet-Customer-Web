import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSearchLocations } from '../../services/tripService'

const VIETNAM_LOCATIONS = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Nha Trang", "Kiên Giang", "Rạch Giá", "Phu Quốc", "Kon Tum", "Lai Châu", "Lạng Sơn", "Lào Cai", "Sapa", "Lâm Đồng", "Đà Lạt", "Long An", "Nam Định", "Nghệ An", "Vinh", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Tuy Hòa", "Quảng Bình", "Đồng Hới", "Quảng Nam", "Hội An", "Quảng Ngãi", "Quảng Ninh", "Hạ Long", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Huế", "Tiền Giang", "Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
]

function HeroPage() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [isMuted, setIsMuted] = useState(true)

  const [origins, setOrigins] = useState<string[]>([])
  const [destinations, setDestinations] = useState<string[]>([])
  const [filteredOrigins, setFilteredOrigins] = useState<string[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([])
  const [showOrigins, setShowOrigins] = useState(false)
  const [showDestinations, setShowDestinations] = useState(false)

  const cleanStr = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

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

  useEffect(() => {
    const query = cleanStr(from.trim())
    let filtered = VIETNAM_LOCATIONS
    if (query) {
      filtered = VIETNAM_LOCATIONS.filter(loc => cleanStr(loc).includes(query))
    }
    setFilteredOrigins(filtered)
  }, [from])

  useEffect(() => {
    const query = cleanStr(to.trim())
    let filtered = VIETNAM_LOCATIONS
    if (query) {
      filtered = VIETNAM_LOCATIONS.filter(loc => cleanStr(loc).includes(query))
    }
    setFilteredDestinations(filtered)
  }, [to])

  const isLocationActive = (locName: string, activeList: string[]) => {
    const cleanLoc = cleanStr(locName)
    return activeList.some(item => {
      const cleanItem = cleanStr(item)
      return cleanItem.includes(cleanLoc) || cleanLoc.includes(cleanItem)
    })
  }

  const handleSwap = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      alert('Please select a Departure Date.')
      return
    }
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      alert('Origin and destination cannot be the same.')
      return
    }
    const params = new URLSearchParams()
    if (from.trim()) params.append('from', from.trim())
    if (to.trim()) params.append('to', to.trim())
    params.append('date', date)
    navigate(`/trips?${params.toString()}`)
  }

  return (
    <div className="relative w-full overflow-hidden bg-white font-sans flex flex-col justify-between min-h-[650px] md:min-h-[780px]">
      {/* Inline styles for scrolling brand ticker and animations */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Full Background Video/Image Container with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          src="/videos/introvideo.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="/images/busnet_hero.jpg"
          className="w-full h-full object-cover object-center scale-105 filter blur-[0.5px]"
        />
        {/* Modern semi-transparent dark glass gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/85 via-slate-900/50 to-white"></div>
      </div>

      {/* Main Content Area (Overlaid on Top of Background) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24 md:pt-28 pb-6 flex flex-col items-center text-center w-full grow justify-center">

        {/* Large Heading */}
        <h1 className="mt-4 text-display font-bold tracking-tight text-white font-primary leading-tight max-w-4xl drop-shadow-sm">
          Connecting Hubs, <br className="sm:hidden" />
          <span className="bg-linear-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Simplifying Journeys
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 max-w-2xl text-body font-secondary text-slate-200 leading-relaxed drop-shadow-sm">
          BusNet connects over 500 premium operators across Vietnam. Book your seat in 60 seconds, choose your preferred slot, and travel with ultimate peace of mind.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => document.getElementById('search-widget')?.scrollIntoView({ behavior: 'smooth' })}
            className="group btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-button font-semibold uppercase tracking-wider shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl hover:shadow-primary/35 active:scale-[0.98] cursor-pointer"
          >
            Book Tickets Now
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          {/* Integrated Play Demo button next to primary CTA */}
          <button
            onClick={() => navigate('/blog')}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-button font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 active:scale-[0.98] cursor-pointer font-primary"
          >
            <svg className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            View Blog
          </button>
        </div>

        {/* Glassmorphic Search Widget */}
        <div
          id="search-widget"
          className="mt-6 w-full max-w-4xl rounded-2xl border border-white/50 bg-white/90 p-4 shadow-2xl backdrop-blur-lg md:p-5 transition-all duration-500 hover:border-white/80 hover:shadow-blue-900/10"
        >
          <form onSubmit={handleSearch} className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-4 items-end text-left">
            {/* From Field */}
            <div className="relative space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 font-primary">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Origin (From)
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setShowOrigins(true)}
                onBlur={() => setTimeout(() => setShowOrigins(false), 200)}
                placeholder="e.g. Ho Chi Minh City"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-body text-slate-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium placeholder-slate-400 font-secondary"
              />
              {/* Suggestions dropdown */}
              {showOrigins && filteredOrigins.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl z-30 py-1">
                  {filteredOrigins.map((item) => {
                    const active = isLocationActive(item, origins)
                    return active ? (
                      <button
                        key={item}
                        type="button"
                        onMouseDown={() => {
                          setFrom(item)
                          setShowOrigins(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>📍 {item}</span>
                        <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Active</span>
                      </button>
                    ) : (
                      <div
                        key={item}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-400 opacity-60 flex items-center justify-between cursor-not-allowed select-none bg-slate-50/20"
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
                className="absolute right-[-17px] top-[34px] z-20 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 shadow-md hover:text-primary hover:border-primary hover:shadow-lg transition-all cursor-pointer active:scale-90 font-bold"
                title="Swap Locations"
              >
                ⇄
              </button>
            </div>

            {/* To Field */}
            <div className="relative space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 font-primary">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Destination (To)
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setShowDestinations(true)}
                onBlur={() => setTimeout(() => setShowDestinations(false), 200)}
                placeholder="e.g. Da Lat"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-body text-slate-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium placeholder-slate-400 font-secondary"
              />
              {/* Suggestions dropdown */}
              {showDestinations && filteredDestinations.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl z-30 py-1">
                  {filteredDestinations.map((item) => {
                    const active = isLocationActive(item, destinations)
                    return active ? (
                      <button
                        key={item}
                        type="button"
                        onMouseDown={() => {
                          setTo(item)
                          setShowDestinations(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>📍 {item}</span>
                        <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Active</span>
                      </button>
                    ) : (
                      <div
                        key={item}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-400 opacity-60 flex items-center justify-between cursor-not-allowed select-none bg-slate-50/20"
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

            {/* Departure Date Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 font-primary">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Departure Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-body text-slate-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium font-secondary"
                required
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold uppercase tracking-wider py-3 text-button transition-all duration-300 shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] cursor-pointer font-primary"
            >
              Search Trips
            </button>
          </form>
        </div>
      </div>

      {/* Floating Speaker Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-28 right-6 md:right-12 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-slate-950/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-slate-950/80 active:scale-95 cursor-pointer shadow-xl"
        title={isMuted ? "Turn On" : "Turn Off"}
      >
        {isMuted ? (
          <svg className="w-5.5 h-5.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5.5 h-5.5 text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default HeroPage
