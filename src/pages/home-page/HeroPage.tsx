import { useState } from 'react'

function HeroPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

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
    <div className="relative w-full overflow-hidden bg-white font-sans flex flex-col justify-between min-h-[500px] md:min-h-[600px]">
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

      {/* Full Background Image Container with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/busnet_hero.jpg"
          alt="BusNet Smart Transit Network"
          className="w-full h-full object-cover object-center scale-105 filter blur-[0.5px]"
        />
        {/* Modern semi-transparent glass gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-white/95 via-white/60 to-white"></div>
      </div>

      {/* Main Content Area (Overlaid on Top of Background) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 md:pt-4 pb-6 flex flex-col items-center text-center w-full flex-grow justify-center">

        {/* Large Heading */}
        <h1 className="mt-4 text-display font-bold tracking-tight text-slate-900 font-primary leading-tight max-w-4xl drop-shadow-sm">
          Connecting Hubs, <br className="sm:hidden" />
          <span className="bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Simplifying Journeys
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 max-w-2xl text-body font-secondary text-slate-700 leading-relaxed drop-shadow-sm">
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
            onClick={() => alert("Launching 3D Simulator Demo...")}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white/95 px-6 py-3 text-button font-semibold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary active:scale-[0.98] cursor-pointer font-primary"
          >
            <svg className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch 3D Demo
          </button>
        </div>

        {/* Glassmorphic Search Widget */}
        <div
          id="search-widget"
          className="mt-6 w-full max-w-4xl rounded-2xl border border-white/50 bg-white/80 p-4 shadow-2xl backdrop-blur-lg md:p-5 transition-all duration-500 hover:border-white/80 hover:shadow-blue-900/10"
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

        {/* Floating Badges container relative to the Hero */}
        <div className="w-full max-w-4xl flex flex-wrap justify-center gap-4 mt-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-105 select-none font-primary">
            <span className="text-emerald-500 text-sm">📍</span>
            <span className="text-xs font-bold text-slate-700">Tech-Hub A Terminal</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-105 select-none font-primary">
            <span className="text-amber-500 text-sm">⭐</span>
            <span className="text-xs font-bold text-slate-700">4.9/5 Rating (10k+ Daily Trips)</span>
          </div>
        </div>
      </div>

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
