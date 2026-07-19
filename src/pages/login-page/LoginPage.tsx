// Reading this as: Login interface for transit passengers and operators, with a clean premium tech vibe, leaning toward modern card splits, glassmorphic accents, and fluid-mesh gradient side panels.
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginWithGoogle, loginCustomer } from '../../services/authService'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

declare global {
  interface Window {
    google?: any
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Error/loading states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleGoogleCallback = async (response: any) => {
    const idToken = response.credential
    setIsLoading(true)
    setApiError('')

    try {
      const result = await loginWithGoogle(idToken)
<<<<<<< HEAD
      login(result.data.account, result.data.token)
=======
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.account))
      toast.success('Signed in successfully!')
>>>>>>> cb94e3795164dbe8a556bc40106880fc220f368c
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errMsg = error.response.data.message || 'Google login failed. Please try again.'
        setApiError(errMsg)
        toast.error(errMsg)
      } else {
        const errMsg = 'Unable to connect to server. Please try again later.'
        setApiError(errMsg)
        toast.error(errMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('googleBtn'),
          {
            theme: 'outline',
            size: 'large',
            width: 320,
            shape: 'pill',
            text: 'signin_with',
          }
        )
      }
    }

    if (window.google) {
      initializeGoogle()
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (script) {
        script.addEventListener('load', initializeGoogle)
      }
    }
  }, [])

  const validate = () => {
    const tempErrors: { [key: string]: string } = {}
    if (!email) {
      tempErrors.email = 'Please enter your username or email'
    }
    if (!password) {
      tempErrors.password = 'Please enter your password'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    if (validate()) {
      setIsLoading(true)
      try {
        const result = await loginCustomer({
          identifier: email.trim(),
          password: password
        })
<<<<<<< HEAD
        login(result.data.account, result.data.token)
=======
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.account))
        toast.success('Login successful!')
>>>>>>> cb94e3795164dbe8a556bc40106880fc220f368c
        navigate('/')
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const errorData = error.response.data;
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const detailedMsg = errorData.errors.map((e: any) => e.message).join(', ');
            setApiError(`${errorData.message}: ${detailedMsg}`);
          } else {
            setApiError(errorData.message || 'Login failed. Please check your credentials.');
          }
        } else {
          setApiError('Unable to connect to server. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
      <div className="flex flex-col md:flex-row min-h-[620px]">

        {/* Left Side: Clean Modern Form Panel */}
        <div className="w-full md:w-[45%] p-8 md:p-10 flex flex-col justify-between bg-white relative">

          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5">
            {/* Brand Logo Image */}
            <div className="flex shrink-0">
              <img
                src="/images/logo.jpg"
                alt="BusNet Logo"
                className="w-9 h-9 object-cover rounded-xl shadow-md border border-slate-100"
              />
            </div>
            <span className="brand-logo text-slate-800 font-extrabold tracking-tight">
              Bus<span className="text-primary">Net</span>
            </span>
          </div>

          <div className="max-w-xs w-full mx-auto my-auto space-y-6">

            <div className="text-center space-y-1">
              <h1 className="text-[16px] text-slate-900 font-extrabold uppercase tracking-wide">SIGN IN</h1>
              <p className="text-slate-400 text-[13px] font-secondary">Enter your username and password</p>
            </div>

            {apiError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] font-secondary flex items-center gap-2" role="alert">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5 text-left w-full">
                <label htmlFor="email" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                  Username or Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="text"
                    placeholder="name@example.com or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    autoComplete="username"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left w-full">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-[11px] font-extrabold text-slate-500 hover:text-primary hover:underline font-primary uppercase tracking-wider">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
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
                {errors.password && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2.5 rounded-full btn-premium-gradient py-2.5 text-[14px] active:scale-[0.98] transition-all duration-300 disabled:opacity-75 cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                {isLoading ? 'SIGNING IN...' : 'LOGIN'}
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Or</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Google Sign-in Container */}
              <div id="googleBtn" className="w-full flex justify-center min-h-[44px]">Login with Google</div>

              {/* Remember me Checkbox */}
              <div className="flex items-center justify-start px-1 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-slate-300 transition-colors"
                  />
                  <span className="text-[13px] text-slate-500 font-medium font-secondary">Remember this device</span>
                </label>
              </div>
            </form>
          </div>

          {/* Three Dots Pagination Indicator */}
          <div className="flex justify-center gap-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
          </div>

        </div>

        {/* Right Side: Animated fluid gradient panel */}
        <div className="hidden md:flex md:w-[55%] fluid-gradient-mesh p-10 flex-col justify-between text-white select-none">

          {/* Top Links Navigation */}
          <div className="flex items-center justify-end gap-6 text-[14px] font-bold tracking-wider text-white/80 font-primary">
            <Link to="/register" className="px-4 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white hover:text-slate-950 transition-all duration-300">SIGN UP</Link>
          </div>

          {/* Welcome Message inside Glassmorphic panel */}
          <div className="my-auto max-w-sm backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] space-y-4 animate-fade-in w-full text-left">
            <h2 className="text-[22px] font-extrabold tracking-tight leading-none text-white font-primary">
              Welcome back.
            </h2>
            <p className="text-white/85 text-[14px] leading-relaxed font-secondary">
              Connecting journeys, accompanying every road with premium transit tech experience. Join thousands of smart travelers.
            </p>
            <div className="pt-2 text-[14px] font-secondary">
              <span className="text-white/70">Not a member? </span>
              <Link to="/register" className="text-white font-bold hover:underline">
                Sign up now
              </Link>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-[12px] text-white/40 font-secondary text-right">
            © 2026 BusNet Inc. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage