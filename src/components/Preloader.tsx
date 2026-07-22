import { useState, useEffect } from 'react'

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Show the preloader for a minimum of 1.5 seconds, then trigger fade out
    const timer = setTimeout(() => {
      setFadeOut(true)
      const removeTimer = setTimeout(() => {
        setVisible(false)
      }, 700) // Match transition duration (700ms)
      return () => clearTimeout(removeTimer)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-99999 flex flex-col items-center justify-center bg-[#FAF9F6] transition-all duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Scope CSS Keyframes for logo animation */}
      <style>{`
        @keyframes logoFloatPulse {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.05); }
        }
        .animate-logo-custom {
          animation: logoFloatPulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="relative w-[120px] h-[120px] flex items-center justify-center">
        {/* Spinner Track */}
        <div className="absolute inset-0 rounded-full border-3 border-primary/10" />
        
        {/* Spinning Arc */}
        <div 
          className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary animate-spin" 
          style={{ animationDuration: '1.2s', animationTimingFunction: 'cubic-bezier(0.5, 0, 0.5, 1)' }} 
        />
        
        {/* Logo Container */}
        <div className="w-[102px] h-[102px] rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden p-0.5 z-10 animate-logo-custom">
          <img 
            src="/images/logo.jpg" 
            alt="BusNet Logo" 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
      </div>
      
      {/* Title */}
      <h1 className="mt-6 mb-2 font-primary text-2xl font-extrabold tracking-wider text-slate-800 uppercase">
        BusNet
      </h1>
      
      {/* Subtitle */}
      <p className="font-secondary text-sm text-slate-500 font-medium flex items-center gap-0.5">
        Loading content, please wait
        <span className="inline-flex">
          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
          <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>.</span>
        </span>
      </p>
    </div>
  )
}
