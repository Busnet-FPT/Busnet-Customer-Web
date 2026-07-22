import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { type SubscriptionPlan } from '../../../services/subscriptionService'

interface Step5SuccessProps {
  email: string
  operatorName: string
  sepayVa: string
  selectedPlan: SubscriptionPlan | null
}

const Step5Success: React.FC<Step5SuccessProps> = ({ email, operatorName, sepayVa, selectedPlan }) => {
  useEffect(() => {
    // 1. Immediate center burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.55 },
      disableForReducedMotion: true
    })

    // 2. Continuous fireworks on the sides for 5 seconds
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Sparklers columns on the left and right sides
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto my-4 flex flex-col items-center text-center space-y-8 animate-fade-in">
      {/* Premium Success Checkmark with Ping Pulse */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-100/60 animate-ping opacity-75"></div>
        <div className="relative w-24 h-24 rounded-full bg-linear-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 border-4 border-white">
          <svg className="w-12 h-12 stroke-white stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Headline & Description */}
      <div className="space-y-3">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 font-primary">
          Registration Successful!
        </h1>
        <p className="text-[14px] text-slate-500 font-secondary max-w-md mx-auto leading-relaxed">
          Congratulations, <span className="text-slate-900 font-semibold">{operatorName}</span>! Your operator registration is complete, and payment was successfully received.
          A confirmation has been sent to{' '}
          <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{email}</span>.
        </p>
      </div>

      {/* Workspace Highlights Card */}
      <div className="w-full bg-linear-to-b from-white to-slate-50/50 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50 p-6 md:p-8 text-left space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-400 font-primary">
            Workspace Configuration
          </span>
          <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operator Name */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider font-primary block">Operator Name</span>
              <span className="text-[14px] text-slate-800 font-extrabold">{operatorName}</span>
            </div>
          </div>

          {/* Active Plan */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.888a1 1 0 00-1.175 0l-3.97 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.888c-.784-.57-.373-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider font-primary block">Subscription Plan</span>
              <span className="text-[14px] text-slate-800 font-extrabold">{selectedPlan?.planName || 'Custom Plan'}</span>
            </div>
          </div>

          {/* Limits */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider font-primary block">Allocated Resources</span>
              <span className="text-[14px] text-slate-800 font-extrabold">
                {selectedPlan?.maxBuses || 0} Buses • {selectedPlan?.maxRoutes || 0} Routes
              </span>
            </div>
          </div>

          {/* Instant Payments */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider font-primary block">SePay Integration</span>
              <span className="text-[14px] text-slate-800 font-extrabold">VA: {sepayVa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons & Explanatory Banner */}
      <div className="w-full max-w-xl font-primary pt-4 text-center space-y-6">
        <div className="p-4 bg-emerald-50/60 border border-emerald-100/50 rounded-2xl text-[13px] text-emerald-700 font-semibold leading-relaxed">
          🎉 Welcome to BusNet! Your account is now fully active. You can log in to the Partner Dashboard using your registered email and password to start managing your fleet and routes.
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <a
            href="http://localhost:5173/login"
            className="flex-1 rounded-full bg-linear-to-r from-emerald-600 to-teal-500 py-3.5 text-[14px] font-extrabold text-white text-center shadow-lg shadow-emerald-550/20 hover:shadow-xl hover:shadow-emerald-550/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            GO TO DASHBOARD
          </a>
          <Link
            to="/"
            className="flex-1 rounded-full border border-slate-200 bg-white py-3.5 text-[14px] font-extrabold text-slate-700 text-center shadow-sm hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Step5Success
