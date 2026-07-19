import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPopularRoutes } from '../../services/tripService'
import type { PopularRouteInfo } from '../../services/tripService'

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
            <div key={i} className="h-44 bg-slate-200 rounded-2xl"></div>
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
            return (
              <div
                key={route._id}
                onClick={() => handleRouteClick(route)}
                className="snap-start shrink-0 w-[280px] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] p-6 rounded-2xl bg-white shadow-xs border border-slate-200/90 hover:shadow-xl hover:border-primary/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between text-left"
              >
                <div>
                  {/* Top Badge & Destination Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-md font-primary tracking-wider">
                      ★ Popular
                    </span>
                    {route.operatorName && (
                      <span className="text-[10px] font-bold text-slate-400 font-primary uppercase tracking-wider truncate max-w-[120px]">
                        {route.operatorName}
                      </span>
                    )}
                  </div>

                  <h3 className="font-primary font-bold text-slate-900 text-base group-hover:text-primary transition-colors line-clamp-1">
                    {route.routeName}
                  </h3>
                  
                  <p className="text-xs text-slate-400 font-secondary mt-1">
                    To destination: <span className="font-bold text-slate-700">{route.destination_provinceName}</span>
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3.5 text-xs text-slate-500 font-medium font-secondary mt-3">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {route.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuration(route.estimatedDuration)}
                    </span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block font-primary uppercase tracking-wider">Starting from</span>
                    <span className="text-base font-extrabold text-primary font-secondary">
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
