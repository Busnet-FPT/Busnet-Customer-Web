import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HeroPage() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [isMuted, setIsMuted] = useState(true)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Searching trips from "${from}" to "${to}" on ${date || 'today'}`)
  }

  const partners = [
    'Phuong Trang',
    'Thanh Buoi',
    'Hoa Mai Limousine',
    'Sao Viet',
    'Mai Linh Express',
    'Kumho Samco',
    'Hai Van',
    'Cuc Tung',
    'Hoang Long'
  ]

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
            <div className="space-y-1">
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
                placeholder="e.g. Ho Chi Minh City"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-body text-slate-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium placeholder-slate-400 font-secondary"
                required
              />
            </div>

            {/* To Field */}
            <div className="space-y-1">
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
                placeholder="e.g. Da Lat"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-body text-slate-800 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 font-medium placeholder-slate-400 font-secondary"
                required
              />
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

      {/* Brand Partners Horizontal Infinite Ticker */}
      <div className="relative z-10 border-t border-slate-100 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 mb-3">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 font-primary">
            OUR PREFERED TRANSPORT PARTNERS
          </p>
        </div>

        <div className="relative w-full overflow-hidden whitespace-nowrap mask-gradient">
          {/* Fading side overlays to make ticker look premium */}
          <div className="absolute top-0 bottom-0 left-0 z-10 w-20 bg-linear-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 z-10 w-20 bg-linear-to-l from-white to-transparent pointer-events-none"></div>

          <div className="animate-scroll flex gap-16 items-center">
            {/* First Set */}
            {partners.map((partner, index) => (
              <span
                key={`p1-${index}`}
                className="text-body font-bold tracking-widest text-slate-400 uppercase transition-colors duration-300 hover:text-primary select-none cursor-default font-primary"
              >
                {partner}
              </span>
            ))}
            {/* Second Set (Duplicate for seamless loop) */}
            {partners.map((partner, index) => (
              <span
                key={`p2-${index}`}
                className="text-body font-bold tracking-widest text-slate-400 uppercase transition-colors duration-300 hover:text-primary select-none cursor-default font-primary"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroPage
