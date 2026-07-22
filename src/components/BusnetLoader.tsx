import { useState, useEffect } from 'react'

interface BusnetLoaderProps {
  message?: string
  fullScreen?: boolean
}

const loadingTexts = [
  'Đang kết nối hệ thống...',
  'Tìm kiếm những chuyến xe tốt nhất...',
  'Đang tải lộ trình chi tiết...',
  'Sắp xếp chỗ ngồi cho bạn...',
  'Chuẩn bị khởi hành...'
]

export default function BusnetLoader({ message, fullScreen = true }: BusnetLoaderProps) {
  const [currentText, setCurrentText] = useState(message || loadingTexts[0])

  useEffect(() => {
    if (message) {
      setCurrentText(message)
      return
    }

    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % loadingTexts.length
      setCurrentText(loadingTexts[index])
    }, 2500)

    return () => clearInterval(interval)
  }, [message])

  return (
    <div
      className={`flex flex-col items-center justify-center font-primary z-50 transition-all duration-300 ${
        fullScreen
          ? 'fixed inset-0 bg-slate-950/80 backdrop-blur-md w-screen h-screen'
          : 'relative w-full py-16 bg-slate-900/5 rounded-3xl border border-slate-100/10'
      }`}
    >
      {/* Scope CSS Keyframes within component */}
      <style>{`
        @keyframes busBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes wheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes roadScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-40px); }
        }
        @keyframes speedLine {
          0% { transform: translateX(60px); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { transform: translateX(-160px); opacity: 0; }
        }
        @keyframes exhaustSmoke {
          0% { transform: translate(0, 0) scale(0.6); opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { transform: translate(-25px, -8px) scale(1.4); opacity: 0; }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: scaleX(1); opacity: 0.3; }
          50% { transform: scaleX(0.95); opacity: 0.2; }
        }
        .animate-bus {
          animation: busBounce 0.6s ease-in-out infinite;
        }
        .animate-wheel {
          animation: wheelSpin 0.4s linear infinite;
        }
        .animate-road {
          animation: roadScroll 0.25s linear infinite;
        }
        .animate-speed-1 {
          animation: speedLine 1.2s linear infinite;
        }
        .animate-speed-2 {
          animation: speedLine 1.5s linear infinite 0.4s;
        }
        .animate-speed-3 {
          animation: speedLine 1.0s linear infinite 0.8s;
        }
        .animate-smoke {
          animation: exhaustSmoke 0.8s ease-out infinite;
        }
        .animate-shadow {
          animation: shadowPulse 0.6s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      {/* Loader Container */}
      <div className="relative flex flex-col items-center justify-center p-8 max-w-sm rounded-3xl bg-slate-900/40 border border-white/5 shadow-2xl backdrop-blur-xl">
        
        {/* SVG Wrapper with speed elements */}
        <div className="relative w-64 h-36 flex items-center justify-center overflow-hidden">
          
          {/* Speed Wind Lines (Background) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 256 144">
            <line x1="200" y1="35" x2="240" y2="35" stroke="#BFE3F1" strokeWidth="2" strokeLinecap="round" className="animate-speed-1" opacity="0.6" />
            <line x1="180" y1="65" x2="230" y2="65" stroke="#6FBAD1" strokeWidth="1.5" strokeLinecap="round" className="animate-speed-2" opacity="0.4" />
            <line x1="210" y1="85" x2="250" y2="85" stroke="#BFE3F1" strokeWidth="2" strokeLinecap="round" className="animate-speed-3" opacity="0.5" />
          </svg>

          {/* Core Animated Bus Assembly */}
          <div className="relative w-[200px] h-[90px]">
            <svg viewBox="0 0 200 90" className="w-full h-full">
              {/* Exhaust Smoke Puffing */}
              <circle cx="15" cy="68" r="4" fill="#BFE3F1" className="animate-smoke" style={{ transformOrigin: '15px 68px' }} />
              <circle cx="15" cy="68" r="5" fill="#6FBAD1" className="animate-smoke" style={{ transformOrigin: '15px 68px', animationDelay: '0.3s' }} />

              {/* Shadow underneath */}
              <ellipse cx="105" cy="79" rx="70" ry="3" fill="#000000" className="animate-shadow" />

              {/* The Bouncing Bus Body */}
              <g className="animate-bus" style={{ transformOrigin: 'bottom center' }}>
                {/* Main Body */}
                <rect x="25" y="15" width="150" height="52" rx="12" fill="#1e293b" />
                <rect x="25" y="20" width="150" height="47" rx="6" fill="#0f172a" />
                
                {/* Pastel Accent Stripe (Top) */}
                <path d="M 25,32 L 175,32 L 175,37 L 25,37 Z" fill="#6FBAD1" />
                {/* Pastel Accent Stripe (Bottom) */}
                <path d="M 25,58 L 175,58 L 175,61 L 25,61 Z" fill="#BFE3F1" />

                {/* Windows */}
                {/* Windshield */}
                <path d="M 152,22 L 170,22 Q 173,22 173,25 L 170,46 Q 169,48 166,48 L 152,48 Z" fill="#BFE3F1" opacity="0.9" />
                {/* Windshield Gloss Highlight */}
                <path d="M 162,24 L 168,24 L 164,46 L 158,46 Z" fill="#ffffff" opacity="0.3" />
                
                {/* Passenger Windows */}
                <rect x="35" y="24" width="22" height="18" rx="3" fill="#334155" />
                <rect x="64" y="24" width="22" height="18" rx="3" fill="#334155" />
                <rect x="93" y="24" width="22" height="18" rx="3" fill="#334155" />
                <rect x="122" y="24" width="22" height="18" rx="3" fill="#334155" />
                
                {/* Passenger Window Glass Reflection */}
                <path d="M 37,26 L 43,26 L 39,40 L 35,40 Z" fill="#ffffff" opacity="0.15" />
                <path d="M 66,26 L 72,26 L 68,40 L 64,40 Z" fill="#ffffff" opacity="0.15" />
                <path d="M 95,26 L 101,26 L 97,40 L 93,40 Z" fill="#ffffff" opacity="0.15" />
                <path d="M 124,26 L 130,26 L 126,40 L 122,40 Z" fill="#ffffff" opacity="0.15" />

                {/* Headlight (Yellow Glow) */}
                <path d="M 175,50 Q 178,50 178,52 L 175,54 Z" fill="#fef08a" />
                {/* Taillight (Red) */}
                <rect x="23" y="48" width="3" height="8" rx="1.5" fill="#f87171" />
                
                {/* Wheel Arches */}
                <path d="M 45,67 A 15,15 0 0 1 75,67 Z" fill="#0f172a" />
                <path d="M 125,67 A 15,15 0 0 1 155,67 Z" fill="#0f172a" />

                {/* Bus Brand Sign (Busnet) */}
                <rect x="75" y="46" width="50" height="8" rx="2" fill="#1e293b" />
                <text x="100" y="52" fill="#BFE3F1" fontSize="5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">BUSNET</text>
              </g>

              {/* Spinning Wheels (Placed outside group so they don't move up/down with the body) */}
              {/* Back Wheel */}
              <g className="animate-wheel" style={{ transformOrigin: '60px 67px' }}>
                <circle cx="60" cy="67" r="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <circle cx="60" cy="67" r="8" fill="#475569" />
                {/* Spokes/Details to make spin visible */}
                <line x1="60" y1="55" x2="60" y2="79" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="48" y1="67" x2="72" y2="67" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="60" cy="67" r="2.5" fill="#1e293b" />
              </g>

              {/* Front Wheel */}
              <g className="animate-wheel" style={{ transformOrigin: '140px 67px' }}>
                <circle cx="140" cy="67" r="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <circle cx="140" cy="67" r="8" fill="#475569" />
                {/* Spokes/Details to make spin visible */}
                <line x1="140" y1="55" x2="140" y2="79" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="128" y1="67" x2="152" y2="67" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="140" cy="67" r="2.5" fill="#1e293b" />
              </g>
            </svg>
          </div>
        </div>

        {/* Animated Road Lines underneath the bus */}
        <div className="w-48 h-1 overflow-hidden relative opacity-70 -mt-2">
          <svg viewBox="0 0 160 4" className="w-full h-full">
            <g className="animate-road">
              <line x1="0" y1="2" x2="30" y2="2" stroke="#6FBAD1" strokeWidth="3" strokeDasharray="5,5" />
              <line x1="40" y1="2" x2="70" y2="2" stroke="#6FBAD1" strokeWidth="3" strokeDasharray="5,5" />
              <line x1="80" y1="2" x2="110" y2="2" stroke="#6FBAD1" strokeWidth="3" strokeDasharray="5,5" />
              <line x1="120" y1="2" x2="150" y2="2" stroke="#6FBAD1" strokeWidth="3" strokeDasharray="5,5" />
              <line x1="160" y1="2" x2="190" y2="2" stroke="#6FBAD1" strokeWidth="3" strokeDasharray="5,5" />
              <line x1="200" y1="2" x2="230" y2="2" stroke="#6FBAD1" strokeWidth="3" strokeDasharray="5,5" />
            </g>
          </svg>
        </div>

        {/* Brand Name */}
        <div className="mt-6 flex flex-col items-center">
          <span className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-[#6FBAD1] to-[#BFE3F1] uppercase">
            Busnet
          </span>
          <div className="w-12 h-0.5 bg-linear-to-r from-transparent via-[#6FBAD1]/50 to-transparent mt-1.5" />
        </div>

        {/* Dynamic Loading Text */}
        <div className="mt-4 h-6 flex items-center justify-center">
          <p className="text-xs font-semibold text-slate-300 font-secondary text-center tracking-wide animate-pulse-slow">
            {currentText}
          </p>
        </div>
      </div>
    </div>
  )
}
