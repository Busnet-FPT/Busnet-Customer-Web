import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import registerHero from '../../assets/register_hero.png'

function RegisterOperatorPage() {
  const navigate = useNavigate()

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [representativeName, setRepresentativeName] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [phone, setPhone] = useState('')

  // Visibility states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Error/Success validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const tempErrors: { [key: string]: string } = {}

    if (!companyName.trim()) {
      tempErrors.companyName = 'Please enter your company / operator name'
    }

    if (!representativeName.trim()) {
      tempErrors.representativeName = 'Please enter legal representative name'
    }

    if (!taxCode.trim()) {
      tempErrors.taxCode = 'Please enter tax code / business license ID'
    } else if (taxCode.trim().length < 5) {
      tempErrors.taxCode = 'Invalid tax code / business license ID'
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Please enter contact phone number'
    } else if (!/^\d{10,11}$/.test(phone.trim())) {
      tempErrors.phone = 'Invalid phone number (must be 10-11 digits)'
    }

    if (!email) {
      tempErrors.email = 'Please enter your email address'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address'
    }

    if (!password) {
      tempErrors.password = 'Please enter a password'
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters'
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeTerms) {
      tempErrors.agreeTerms = 'You must agree to the terms of service'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      // Simulate API registration call
      setTimeout(() => {
        setIsLoading(false)
        setIsSubmitted(true)
      }, 1500)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
        <div className="flex flex-col md:flex-row min-h-[620px]">

          {/* Left Hero Side */}
          <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-slate-950 via-[#0B1528] to-blue-950 relative p-12 flex-col justify-between overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/20 blur-[90px]"></div>
            <div className="relative z-10 flex items-center gap-2">
              <span className="brand-logo text-white">
                Bus<span className="text-primary">Net</span>
              </span>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center">
              <img
                src={registerHero}
                alt="BusNet futuristic electric coach"
                className="w-full max-w-[350px] object-contain drop-shadow-[0_20px_45px_rgba(1,133,255,0.4)] animate-pulse-slow"
              />
              <div className="text-center mt-8 space-y-2.5">
                <h2 className="text-white text-[18px] font-bold tracking-wide">
                  RIDE SMARTER SAVE TOGETHER
                </h2>
                <p className="text-slate-400 text-[14px] font-secondary max-w-xs mx-auto">
                  Join thousands of operators providing smart and safe transit every day.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-[14px] text-slate-500 font-secondary">
              © 2026 BusNet Inc. All rights reserved.
            </div>
          </div>

          {/* Right Success Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-inner border border-emerald-100 animate-bounce">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-[20px] font-extrabold text-slate-900 font-primary">Partner Registration Successful!</h1>
            <p className="mt-3 text-[14px] text-slate-600 font-secondary max-w-sm leading-relaxed">
              Transit partner request for <strong className="text-slate-950 font-bold">{companyName}</strong> has been successfully submitted. Our team will verify details and contact you within 24 business hours.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs font-primary">
              <Link
                to="/login"
                className="flex-1 rounded-xl btn-premium-gradient py-2 text-[14px] text-center"
              >
                SIGN IN NOW
              </Link>
              <Link
                to="/"
                className="flex-1 rounded-xl border border-slate-200 text-slate-700 py-2 text-[14px] font-bold text-center hover:bg-slate-50 active:scale-[0.99] transition-all duration-300"
              >
                HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
      <div className="flex flex-col md:flex-row min-h-[660px]">

        {/* Left Side: Clean Modern Form Panel */}
        <div className="w-full md:w-[50%] pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-8 flex flex-col justify-between bg-white relative">

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 mb-3">
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

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 text-[14px] text-slate-400 hover:text-primary font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] self-start mb-4 uppercase tracking-wider"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to selection
          </button>

          <div className="w-full mx-auto my-auto space-y-4">

            {/* Round Avatar Icon Placeholder */}
            <div className="mx-auto w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-[20px] text-slate-900 font-extrabold uppercase tracking-wide">REGISTER OPERATOR</h2>
              <p className="text-slate-400 text-[14px] font-secondary">Enter transit business profile details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Company Name */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="COMPANY / OPERATOR NAME"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.companyName ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.companyName && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.companyName}</p>}
                </div>

                {/* Representative Name */}
                <div className="space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="LEGAL REPRESENTATIVE"
                      value={representativeName}
                      onChange={(e) => setRepresentativeName(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.representativeName ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.representativeName && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.representativeName}</p>}
                </div>

                {/* Tax Code */}
                <div className="space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="TAX CODE / LICENSE ID"
                      value={taxCode}
                      onChange={(e) => setTaxCode(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.taxCode ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.taxCode && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.taxCode}</p>}
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      placeholder="PHONE NUMBER"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.phone ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-2 space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-4 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="PASSWORD"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-10 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="CONFIRM PASSWORD"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full rounded-full border border-slate-300 bg-white pl-10 pr-10 py-2 text-[14px] uppercase font-bold tracking-wider outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.confirmPassword}</p>}
                </div>

              </div>

              {/* Agree Terms Checkbox */}
              <div className="space-y-1 pt-0.5 px-2">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 border-slate-300 transition-colors"
                  />
                  <span className="text-[14px] text-slate-500 font-secondary leading-tight">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline font-semibold">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline font-semibold">
                      Privacy Policy
                    </a>{' '}
                    of BusNet.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-[14px] pl-4 font-secondary mt-0.5">{errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2.5 rounded-full btn-premium-gradient py-2.5 text-[14px] active:scale-[0.98] transition-all duration-300 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? 'PROCESSING...' : 'REGISTER PARTNER'}
              </button>
            </form>
          </div>

          {/* Three Dots Pagination Indicator */}
          <div className="flex justify-center gap-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
          </div>

        </div>

        {/* Right Side: Animated fluid gradient panel */}
        <div className="hidden md:flex md:w-[50%] fluid-gradient-mesh p-10 flex-col justify-between text-white select-none">

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
              Register as a transit partner to manage layouts, sell tickets online, and track business revenue with BusNet.
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

export default RegisterOperatorPage
