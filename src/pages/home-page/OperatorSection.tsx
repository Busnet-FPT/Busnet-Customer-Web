import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOperators, type Operator } from '../../services/operatorService'
import {
  IconStarFilled,
  IconRoute,
  IconShieldCheck,
  IconArrowRight,
  IconLoader,
  IconBus,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'

export default function OperatorSection() {
  const navigate = useNavigate()
  const [operators, setOperators] = useState<Operator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getOperators({ page: 1, limit: 8 }) // Fetch up to 8 operators for carousel
        setOperators(data.operators)
      } catch (err) {
        console.error('Failed to fetch operators for homepage:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOperators()
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8
      scrollContainerRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 font-primary">
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div className="text-left space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Trusted Partners
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Bus Operators
          </h2>
          <p className="text-sm text-slate-500 font-secondary max-w-lg leading-relaxed">
            Travel with leading, highly rated transportation providers offering top-tier amenities and safety.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        {!isLoading && operators.length > 3 && (
          <div className="flex gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full border border-slate-100 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-primary transition-all active:scale-90 cursor-pointer flex items-center justify-center"
              aria-label="Previous operators"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full border border-slate-100 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-primary transition-all active:scale-90 cursor-pointer flex items-center justify-center"
              aria-label="Next operators"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <IconLoader className="w-8 h-8 text-primary animate-spin" />
          <p className="text-slate-400 text-xs font-secondary animate-pulse">Loading operators...</p>
        </div>
      ) : operators.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-secondary">
          No operators available.
        </div>
      ) : (
        <div className="space-y-10">
          {/* Carousel Track Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none pb-4"
          >
            {operators.map((op) => (
              <div
                key={op._id}
                onClick={() => navigate(`/operators/${op.accountId}`)}
                className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] group bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-slate-200/50 transition-all duration-350 overflow-hidden cursor-pointer hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Cover Image */}
                <div className="relative h-32 bg-slate-100 shrink-0 overflow-hidden">
                  {op.coverImage ? (
                    <img
                      src={op.coverImage}
                      alt={`${op.operatorName} cover`}
                      className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/5 via-indigo-50/50 to-slate-100 flex items-center justify-center">
                      <IconBus className="w-12 h-12 text-primary/10" />
                    </div>
                  )}

                  {op.isVerified && (
                    <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-xs">
                      <IconShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3 text-left">
                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {op.profilePicture ? (
                          <img
                            src={op.profilePicture}
                            alt={op.operatorName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-sm border border-primary/10">
                            {op.operatorName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-primary transition-colors">
                          {op.operatorName}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <IconStarFilled className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px] font-bold text-slate-700">
                            {op.ratingAvg.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-secondary">
                            ({op.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 font-secondary leading-relaxed line-clamp-2">
                      {op.description || "No description provided."}
                    </p>

                    {/* Amenities */}
                    {op.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {op.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 font-secondary"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-secondary">
                      <IconRoute className="w-3.5 h-3.5 text-primary" />
                      {op.routeCount} routes
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-1.5 transition-all">
                      View Detail
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/operators')}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 cursor-pointer shadow-md shadow-slate-900/10 hover:shadow-lg"
            >
              View All Operators
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
