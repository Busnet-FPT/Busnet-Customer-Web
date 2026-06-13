import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconSearch,
  IconStar,
  IconStarFilled,
  IconRoute,
  IconShieldCheck,
  IconArrowRight,
  IconLoader,
  IconBus,
  IconMapPin,
  IconX
} from '@tabler/icons-react'
import { getOperators, type Operator } from '../../services/operatorService'

function OperatorListPage() {
  const navigate = useNavigate()
  const [operators, setOperators] = useState<Operator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 })
  const [isMouseIn, setIsMouseIn] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect()
      setMouseCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const fetchOperators = async () => {
      setIsLoading(true)
      try {
        const data = await getOperators({
          page: currentPage,
          limit: 12,
          search: searchQuery || undefined
        })
        setOperators(data.operators)
        setTotalPages(data.pagination.totalPages)
        setTotalItems(data.pagination.totalItems)
      } catch (err) {
        console.error('Failed to fetch operators:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const delay = setTimeout(() => {
      fetchOperators()
    }, 300)

    return () => clearTimeout(delay)
  }, [searchQuery, currentPage])

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<IconStarFilled key={i} className="w-3.5 h-3.5 text-amber-400" />)
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="relative inline-flex">
            <IconStarFilled className="w-3.5 h-3.5 text-slate-200" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <IconStarFilled className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </span>
        )
      } else {
        stars.push(<IconStar key={i} className="w-3.5 h-3.5 text-slate-200" />)
      }
    }
    return stars
  }

  return (
    <div className="w-full min-h-screen font-primary">

      {/* Scope Keyframe Animations within component */}
      <style>{`
        @keyframes float-blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.96); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float-blob-reverse {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, 40px) scale(0.92); }
          66% { transform: translate(20px, -20px) scale(1.08); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(1, 133, 255, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(1, 133, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(1, 133, 255, 0); }
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-float-1 {
          animation: float-blob 12s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-blob-reverse 15s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float-blob 10s ease-in-out infinite 2s;
        }
        .animate-pulse-ring {
          animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        .shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-20deg);
          animation: shine 4s infinite ease-in-out;
        }
      `}</style>

      {/* Hero Header Section with Mouse tracking */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsMouseIn(true)}
        onMouseLeave={() => setIsMouseIn(false)}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-8 text-center mb-10 shadow-2xl border border-white/10 cursor-default transition-all duration-300"
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-65">
          <div className="absolute top-[-40px] left-[5%] w-80 h-80 rounded-full bg-primary/25 blur-3xl animate-float-1"></div>
          <div className="absolute bottom-[-40px] right-[5%] w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-2"></div>
          <div className="absolute top-[20%] right-[30%] w-56 h-56 rounded-full bg-indigo-500/15 blur-3xl animate-float-3"></div>
        </div>

        {/* Diagonal grid lines decoration for premium feel */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none opacity-50"></div>

        {/* Cursor Glow Aura (brightens the hovered area) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-300"
          style={{
            opacity: isMouseIn ? 0.35 : 0,
            background: `radial-gradient(circle 200px at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(1, 133, 255, 0.35), rgba(0, 242, 254, 0.15), transparent 100%)`,
          }}
        />

        {/* Masked Glowing Transit Map (Flashlight effect on hover) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          style={{
            opacity: isMouseIn ? 0.35 : 0,
            clipPath: isMouseIn 
              ? `circle(140px at ${mouseCoords.x}px ${mouseCoords.y}px)` 
              : 'circle(0px at 0px 0px)',
            transition: 'clip-path 0.12s ease-out, opacity 0.4s ease-in-out'
          }}
        >
          {/* Detailed SVG Stylized Route Map */}
          <svg className="w-full h-full opacity-70" viewBox="0 0 1000 400" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Grid Coordinates Map Lines */}
            <path d="M 0,100 L 1000,100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <path d="M 0,200 L 1000,200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <path d="M 0,300 L 1000,300" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <path d="M 250,0 L 250,400" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <path d="M 500,0 L 500,400" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <path d="M 750,0 L 750,400" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Glowing Bus Routes (Blue, Cyan, Indigo) */}
            <path d="M -50,150 Q 200,80 450,220 T 950,120 L 1050,150" stroke="#0185FF" strokeWidth="2.5" strokeDasharray="6 4" />
            <path d="M 120,-30 Q 320,280 650,150 T 880,430" stroke="#00f2fe" strokeWidth="2" />
            <path d="M -50,280 Q 350,220 750,330 T 1050,180" stroke="#a5b4fc" strokeWidth="3" opacity="0.6" />
            <path d="M 180,430 Q 480,120 780,-30" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="10 8" />

            {/* Station Nodes */}
            <g>
              <circle cx="450" cy="220" r="5" fill="#0185FF" />
              <circle cx="450" cy="220" r="10" stroke="#0185FF" strokeWidth="1.5" opacity="0.6" />
              <circle cx="450" cy="220" r="15" stroke="#0185FF" strokeWidth="1" opacity="0.3" className="animate-ping" style={{ transformOrigin: '450px 220px' }} />
              
              <circle cx="320" cy="180" r="4.5" fill="#00f2fe" />
              <circle cx="650" cy="150" r="5" fill="#00f2fe" />
              <circle cx="650" cy="150" r="9" stroke="#00f2fe" strokeWidth="1.5" opacity="0.6" />
              
              <circle cx="750" cy="330" r="6" fill="#a5b4fc" />
              <circle cx="750" cy="330" r="11" stroke="#a5b4fc" strokeWidth="1.5" opacity="0.5" />
              
              <circle cx="210" cy="115" r="4" fill="#38bdf8" />
              <circle cx="850" cy="140" r="4" fill="#0185FF" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md shine-effect animate-pulse-ring">
            <IconBus className="w-3.5 h-3.5 text-primary" />
            Trusted Bus Operators
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-primary">
            Find Your Perfect{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-cyan-400">
              Bus Operator
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-slate-400 font-secondary max-w-lg mx-auto leading-relaxed">
            Browse verified bus operators across Vietnam. Compare routes, schedules, amenities, and ratings to find the best ride for your journey.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative max-w-md focus-within:max-w-lg mx-auto w-full transition-all duration-300 mt-8">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search by operator name..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-12 py-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 focus:bg-slate-900/80 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 hover:border-white/20 backdrop-blur-md font-secondary shadow-lg"
              />
              <IconSearch className="absolute left-4 w-5 h-5 text-white/30 transition-colors" />
              
              {/* Clear button inside search bar */}
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setCurrentPage(1) }}
                  className="absolute right-4 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <IconX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          {!isLoading && (
            <p className="text-xs text-white/35 font-secondary pt-2">
              {totalItems} verified {totalItems === 1 ? 'operator' : 'operators'} available
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <IconLoader className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-400 text-sm font-secondary animate-pulse">Loading operators...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && operators.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <IconBus className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 text-sm font-secondary">No operators found matching your search.</p>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setCurrentPage(1) }}
              className="px-5 py-2 text-xs font-bold text-primary border border-primary/20 bg-primary/5 rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Operator Grid */}
      {!isLoading && operators.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operators.map((op) => (
              <article
                key={op._id}
                onClick={() => navigate(`/operators/${op.accountId}`)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200/60 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
              >
                {/* Cover / Header */}
                <div className="relative h-36 bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden">
                  {op.coverImage ? (
                    <img
                      src={op.coverImage}
                      alt={`${op.operatorName} cover`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/5 via-indigo-50 to-slate-50 flex items-center justify-center">
                      <IconBus className="w-16 h-16 text-primary/15" />
                    </div>
                  )}

                  {/* Verified badge */}
                  {op.isVerified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      <IconShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  )}

                  {/* Route count chip */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/70 text-white text-[10px] font-bold backdrop-blur-sm">
                    <IconRoute className="w-3 h-3" />
                    {op.routeCount} {op.routeCount === 1 ? 'Route' : 'Routes'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      {op.profilePicture ? (
                        <img
                          src={op.profilePicture}
                          alt={op.operatorName}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-base border border-primary/10">
                          {op.operatorName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-primary transition-colors">
                        {op.operatorName}
                      </h3>
                      {/* Star Rating */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex items-center gap-0.5">
                          {renderStars(op.ratingAvg)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          {op.ratingAvg.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-secondary">
                          ({op.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-secondary leading-relaxed line-clamp-2">
                    {op.description}
                  </p>

                  {/* Amenities Tags */}
                  {op.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {op.amenities.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 font-secondary"
                        >
                          {amenity}
                        </span>
                      ))}
                      {op.amenities.length > 4 && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-primary/5 text-[10px] font-bold text-primary">
                          +{op.amenities.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-2 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-secondary">
                        <IconMapPin className="w-3 h-3" />
                        {op.routeCount} active {op.routeCount === 1 ? 'route' : 'routes'}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                        View Details
                        <IconArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-10 pb-4 select-none font-primary">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs font-extrabold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OperatorListPage
