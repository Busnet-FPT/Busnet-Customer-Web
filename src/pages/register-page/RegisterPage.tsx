import { Link, useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
      <div className="flex flex-col md:flex-row min-h-[620px]">

        {/* Left Side: Clean Modern Selection Panel */}
        <div className="w-full md:w-[45%] p-8 md:p-10 flex flex-col justify-between bg-white relative">

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5">
            {/* Brand Logo Image */}
            <div className="flex shrink-0">
              <img
                src="/logo.jpg"
                alt="BusNet Logo"
                className="w-9 h-9 object-cover rounded-xl shadow-md border border-slate-100"
              />
            </div>
            <span className="brand-logo text-slate-800 font-extrabold tracking-tight">
              Bus<span className="text-primary">Net</span>
            </span>
          </div>

          <div className="max-w-sm w-full mx-auto my-auto space-y-5 animate-fade-in">
            <div className="text-center space-y-1">
              <h1 className="text-[18px] text-slate-900 font-extrabold uppercase tracking-wide">CREATE AN ACCOUNT</h1>
              <p className="text-slate-400 text-[13px] font-secondary">Choose the account type to get started</p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Option 1: Passenger */}
              <div
                onClick={() => navigate('/register/passenger')}
                className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-primary/50 hover:bg-blue-50/10 cursor-pointer transition-all duration-300 active:scale-[0.99] shadow-sm hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="p-3 rounded-xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                  <svg className="w-5.5 h-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="space-y-0.5 select-none text-left">
                  <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-primary transition-colors font-primary">
                    Passenger Account
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-secondary">
                    Book tickets online, choose seats, accumulate points, and manage your travel schedule easily.
                  </p>
                </div>
              </div>

              {/* Option 2: Operator / Transit Partner */}
              <div
                onClick={() => navigate('/register/operator')}
                className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-primary/50 hover:bg-blue-50/10 cursor-pointer transition-all duration-300 active:scale-[0.99] shadow-sm hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="p-3 rounded-xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                  <svg className="w-5.5 h-5.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="space-y-0.5 select-none text-left">
                  <h3 className="text-[14px] font-bold text-slate-900 group-hover:text-primary transition-colors font-primary">
                    Transit Operator Account
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed font-secondary">
                    Register to sell tickets, manage layouts, track revenue, and grow your transit brand with BusNet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Three Dots Pagination Indicator */}
          <div className="flex justify-center gap-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
          </div>

        </div>

        {/* Right Side: Animated fluid gradient panel */}
        <div className="hidden md:flex md:w-[55%] fluid-gradient-mesh p-10 flex-col justify-between text-white select-none">

          {/* Top Links Navigation */}
          <div className="flex items-center justify-end gap-6 text-[14px] font-bold tracking-wider text-white/80 font-primary">
            <Link to="/login" className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white hover:text-slate-950 transition-all duration-300">SIGN IN</Link>
          </div>

          {/* Welcome Message */}
          <div className="my-auto max-w-sm space-y-3.5">
            <h1 className="text-[22px] font-extrabold tracking-tight leading-none text-white animate-fade-in font-primary">
              Join Us.
            </h1>
            <p className="text-white/70 text-[14px] leading-relaxed font-secondary">
              Create your passenger account to search trips, earn reward points, and book smart rides today.
            </p>
            <div className="pt-2 text-[14px] font-secondary">
              <span className="text-white/60">Already have an account? </span>
              <Link to="/login" className="text-white font-bold hover:underline">
                Sign in now
              </Link>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-[14px] text-white/40 font-secondary">
            © 2026 BusNet Inc. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage