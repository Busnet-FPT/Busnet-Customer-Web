import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail, resendVerificationOtp } from '../../services/authService'
import axios from 'axios'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')

  // Resend OTP Countdown Timer
  useEffect(() => {
    let interval: any = null
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer])

  const handleResend = async () => {
    if (!canResend || !email) return
    setIsResending(true)
    setApiError('')
    setApiSuccess('')

    try {
      const response = await resendVerificationOtp(email)
      setApiSuccess(response.message || 'Verification code resent successfully!')
      setTimer(60)
      setCanResend(false)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        setApiError(error.response.data.message || 'Failed to resend code. Please try again.')
      } else {
        setApiError('Unable to connect to server. Please try again later.')
      }
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setApiSuccess('')

    if (!email) {
      setApiError('Missing email address. Please register again.')
      return
    }

    if (code.length !== 6) {
      setApiError('Verification code must be exactly 6 digits')
      return
    }

    setIsLoading(true)
    try {
      await verifyEmail(email, code)
      setIsSuccess(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        setApiError(error.response.data.message || 'Verification failed. Please check your code.')
      } else {
        setApiError('Unable to connect to server. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-fade-in my-4 font-primary">
        <div className="flex flex-col md:flex-row min-h-[620px]">
          
          {/* Left Hero Side */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-950 via-[#0B1528] to-blue-950 relative p-12 flex-col justify-between overflow-hidden text-white select-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/20 blur-[90px] pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="BusNet Logo"
                className="w-10 h-10 object-cover rounded-xl shadow-md border border-white/10"
              />
              <span className="brand-logo text-white">
                Bus<span className="text-primary">Net</span>
              </span>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center">
              <img
                src="/images/busnet_hero.jpg"
                alt="BusNet success"
                className="w-full max-w-[280px] object-contain drop-shadow-[0_20px_45px_rgba(1,133,255,0.4)] rounded-2xl border border-white/10"
              />
              <div className="text-center mt-6 space-y-2">
                <h2 className="text-white text-lg font-bold tracking-wide uppercase">
                  Account Activated
                </h2>
                <p className="text-slate-400 text-xs font-secondary max-w-xs mx-auto leading-relaxed">
                  Your email has been verified. Welcome aboard to BusNet!
                </p>
              </div>
            </div>

            <div className="relative z-10 text-xs text-slate-500 font-secondary text-left">
              © 2026 BusNet Inc. All rights reserved.
            </div>
          </div>

          {/* Right Success Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10 border border-emerald-100 animate-bounce">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-primary">
              Verification Successful!
            </h1>
            <p className="mt-3 text-sm text-slate-500 font-secondary max-w-sm leading-relaxed">
              Your account for <strong className="text-slate-900 font-bold break-all">{email}</strong> has been successfully verified and activated. You can now sign in to access all passenger services.
            </p>
            <div className="mt-8 w-full max-w-xs">
              <Link
                to="/login"
                className="block w-full rounded-xl btn-premium-gradient py-3 text-sm font-bold text-center active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg shadow-primary/20"
              >
                SIGN IN NOW
              </Link>
            </div>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-fade-in my-4 font-primary">
      <div className="flex flex-col md:flex-row min-h-[620px]">
        
        {/* Left Side: Verification Form */}
        <div className="w-full md:w-[50%] p-8 md:p-12 flex flex-col justify-between bg-white relative">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 self-start group">
            <img
              src="/images/logo.jpg"
              alt="BusNet Logo"
              className="w-10 h-10 object-cover rounded-xl shadow-md border border-slate-100 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="brand-logo text-slate-900 font-extrabold tracking-tight">
              Bus<span className="text-primary">Net</span>
            </span>
          </Link>

          <div className="w-full max-w-sm mx-auto my-auto py-8 space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Verify Your Email
              </h1>
              <p className="text-slate-500 text-sm font-secondary leading-relaxed">
                We sent a 6-digit verification code to <br />
                <strong className="text-slate-800 font-bold break-all">{email || 'your email'}</strong>
              </p>
            </div>

            {apiError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-secondary flex items-start gap-2.5 animate-fade-in" role="alert">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{apiError}</span>
              </div>
            )}

            {apiSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-secondary flex items-start gap-2.5 animate-fade-in" role="alert">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{apiSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Monospace Code Input */}
              <div className="space-y-2 text-left w-full">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-primary">
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    className="w-full text-center font-mono text-3xl tracking-[0.4em] pl-[0.2em] rounded-xl border border-slate-200 bg-slate-50/50 py-3 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full rounded-xl btn-premium-gradient py-3 text-sm font-bold tracking-wide active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                {isLoading ? 'VERIFYING...' : 'VERIFY NOW'}
              </button>

              {/* Resend Actions */}
              <div className="text-center font-secondary text-sm text-slate-500 pt-2">
                Didn't receive the code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-primary font-bold hover:underline cursor-pointer focus:outline-none disabled:opacity-50"
                  >
                    {isResending ? 'Resending...' : 'Resend Code'}
                  </button>
                ) : (
                  <span className="text-slate-400 font-semibold">
                    Resend code in {timer}s
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Navigation link to sign in */}
          <div className="text-center text-sm font-secondary text-slate-500 pt-4 border-t border-slate-50">
            <Link to="/login" className="font-bold text-slate-650 hover:text-primary transition-colors duration-200 flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Return to Login
            </Link>
          </div>
        </div>

        {/* Right Side: Mesh Background panel */}
        <div className="hidden md:flex md:w-[50%] fluid-gradient-mesh p-12 flex-col justify-between text-white select-none">
          
          {/* Top Info Badge */}
          <div className="flex justify-end">
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-wide">
              SECURE VERIFICATION
            </span>
          </div>

          <div className="my-auto max-w-sm backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] space-y-4 animate-fade-in w-full text-left">
            <h2 className="text-3xl font-extrabold tracking-tight leading-none text-white font-primary">
              Security first.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed font-secondary">
              We need to make sure you own this email address before you can log in. This protects your account security and transaction records.
            </p>
          </div>

          <div className="text-xs text-white/45 font-secondary text-right">
            © 2026 BusNet Inc. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  )
}

export default VerifyEmailPage
