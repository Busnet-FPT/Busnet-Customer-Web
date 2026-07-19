import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPopularRoutes } from '../../services/tripService'
import type { PopularRouteInfo } from '../../services/tripService'

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop"

const getDestinationImage = (destination: string): string => {
  const destClean = destination.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  if (destClean.includes("ho chi minh") || destClean.includes("hcm") || destClean.includes("sai gon")) {
    return "https://images.unsplash.com/photo-1508919801845-fc2ae1bc2a28?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("ha noi")) {
    return "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("da lat") || destClean.includes("lam dong")) {
    return "https://images.unsplash.com/photo-1583002621948-406a4b1ca8c3?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("nha trang") || destClean.includes("khanh hoa")) {
    return "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("da nang")) {
    return "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("hai phong")) {
    return "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("can tho")) {
    return "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("cat ba") || destClean.includes("cat hai")) {
    return "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("quang ninh") || destClean.includes("ha long")) {
    return "https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("ninh binh")) {
    return "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=600&auto=format&fit=crop"
  }
  if (destClean.includes("hue")) {
    return "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop"
  }
  
  return FALLBACK_IMAGE
}

export default function PopularRoutesSection() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [routes, setRoutes] = useState<PopularRouteInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getPopularRoutes()
        setRoutes(data)
      } catch (err) {
        console.error('Failed to fetch popular routes', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoutes()
  }, [])

  const handleRouteClick = (route: PopularRouteInfo) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dateStr = tomorrow.toISOString().split('T')[0]

    const params = new URLSearchParams()
    params.append('from', route.origin_provinceName)
    params.append('to', route.destination_provinceName)
    params.append('date', dateStr)
    navigate(`/trips?${params.toString()}`)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const offset = clientWidth * 0.85
      const scrollTo = direction === 'left' ? scrollLeft - offset : scrollLeft + offset
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-h2 font-bold font-primary text-slate-800 text-center">Popular Routes</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-72 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (routes.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      {/* Scope CSS to hide scrollbars */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Section Header with Navigation Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-1.5 text-left">
          <h2 className="text-h2 font-bold font-primary text-slate-900 tracking-tight">
            Popular Routes
          </h2>
          <p className="text-small text-slate-500 font-secondary max-w-xl">
            Explore top-rated journeys chosen by travelers. Instantly book your seat for tomorrow's departures.
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <button
            onClick={() => scroll('left')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer active:scale-95"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 shadow-xs hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer active:scale-95"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Scroller Container */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory py-4 px-1"
        >
          {routes.map((route) => {
            const imgUrl = getDestinationImage(route.destination_provinceName)
            return (
              <div
                key={route._id}
                onClick={() => handleRouteClick(route)}
                className="snap-start shrink-0 w-[280px] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-100 hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                {/* Card Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={route.routeName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Visual gradient filter over the image */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 to-transparent opacity-80" />
                  
                  {/* Distance Badge on Image */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-extrabold uppercase text-slate-800 px-2 py-0.5 rounded-md shadow-xs font-primary">
                    ★ Popular
                  </span>

                  {/* Destination overlay text */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold font-secondary opacity-95">To destination</p>
                    <p className="text-lg font-bold font-primary tracking-wide truncate">{route.destination_provinceName}</p>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-4 grow flex flex-col justify-between">
                  <div>
                    {route.operatorName && (
                      <span className="text-[10px] font-bold text-slate-400 font-primary uppercase tracking-wider block mb-1">
                        {route.operatorName}
                      </span>
                    )}
                    <h3 className="font-primary font-bold text-slate-800 text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {route.routeName}
                    </h3>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-3.5 text-xs text-slate-500 font-medium font-secondary mt-2">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {route.distanceKm} km
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(route.estimatedDuration)}
                      </span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-4 pt-3.5 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block font-primary uppercase tracking-wider">Starting from</span>
                      <span className="text-sm font-extrabold text-primary font-secondary">
                        {formatPrice(route.minPrice)}
                      </span>
                    </div>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs">
                      <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
