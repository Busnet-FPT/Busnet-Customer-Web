// Reading this as: Passenger registration page for transit passengers, leaning toward clear form layouts with labels above inputs, tactile states, and glassmorphic welcome overlay.
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerCustomer, loginWithGoogle } from '../../services/authService'
import axios from 'axios'
import { toast } from 'react-hot-toast'

declare global {
  interface Window {
    google?: any
  }
}

function RegisterPassengerPage() {
  const navigate = useNavigate()

  // Custom Dropdown State
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const genderDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Password Validation Checkers
  const isPasswordLengthValid = password.length > 6
  const hasPasswordUppercase = /[A-Z]/.test(password)
  const hasPasswordNumber = /\d/.test(password)
  const hasPasswordSpecialChar = /[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\';]/.test(password)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')

  // Visibility states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Error/Success validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const tempErrors: { [key: string]: string } = {}

    if (!fullName.trim()) {
      tempErrors.fullName = 'Please enter your full name'
    }

    if (!username.trim()) {
      tempErrors.username = 'Please enter a username'
    } else if (username.trim().length < 3) {
      tempErrors.username = 'Username must be at least 3 characters'
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Please enter your phone number'
    } else if (!/^0\d{9}$/.test(phone.trim())) {
      tempErrors.phone = 'Phone must be exactly 10 digits and start with 0'
    }

    if (!gender) {
      tempErrors.gender = 'Please select your gender'
    }

    if (!dob) {
      tempErrors.dob = 'Please select your date of birth'
    }

    if (!email) {
      tempErrors.email = 'Please enter your email'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address'
    }

    if (!password) {
      tempErrors.password = 'Please enter a password'
    } else if (!isPasswordLengthValid || !hasPasswordUppercase || !hasPasswordNumber || !hasPasswordSpecialChar) {
      tempErrors.password = 'Password does not meet all complexity requirements'
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeTerms) {
      tempErrors.agreeTerms = 'You must agree to the terms and conditions'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) {
      toast.error('Please fix the errors in the form.')
      return
    }

    setIsLoading(true)
    try {
      await registerCustomer({
        username: username.trim(),
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
        gender: gender.toUpperCase(),
        dob: dob || undefined
      })

      toast.success('Registration successful! Please check your email for verification.')
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data

        // Handle validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors: { [key: string]: string } = {}
          data.errors.forEach((err: { field: string; message: string }) => {
            backendErrors[err.field] = err.message
          })
          setErrors(backendErrors)
          toast.error('Validation failed. Please check the fields.')
        } else {
          const errMsg = data.message || 'Registration failed. Please try again.'
          setApiError(errMsg)
          toast.error(errMsg)
        }
      } else {
        const errMsg = 'Unable to connect to server. Please try again later.'
        setApiError(errMsg)
        toast.error(errMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleCallback = async (response: any) => {
    const idToken = response.credential
    setIsLoading(true)
    setApiError('')

    try {
      const result = await loginWithGoogle(idToken)
      localStorage.setItem('token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.account))
      toast.success('Signed in successfully with Google!')
      navigate('/')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errMsg = error.response.data.message || 'Google registration failed. Please try again.'
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
            width: 384,
            shape: 'pill',
            text: 'continue_with',
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



  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
      <div className="flex flex-col md:flex-row min-h-[660px]">

        {/* Left Side: Clean Modern Form Panel */}
        <div className="w-full md:w-[50%] pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-8 flex flex-col justify-between bg-white relative">

          <div className="flex items-center gap-2.5 mb-3">
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

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 text-[14px] text-slate-400 hover:text-primary font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] self-start mb-4 uppercase tracking-wider"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="w-full max-w-sm mx-auto my-auto space-y-4">

            <div className="text-center space-y-1">
              <h1 className="text-[16px] text-slate-900 font-extrabold uppercase tracking-wide">REGISTER PASSENGER</h1>
              <p className="text-slate-400 text-[13px] font-secondary">Enter your travel profile details</p>
            </div>

            {apiError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[14px] font-secondary flex items-center gap-2" role="alert">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">

                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="fullName" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.fullName ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.fullName}</p>}
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <span className="text-[14px] font-bold">@</span>
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.username ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                      autoComplete="username"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.username}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-1.5" ref={genderDropdownRef}>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Gender
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 z-10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-8 py-2.5 text-[14px] text-left flex items-center justify-between outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.gender ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    >
                      <span className={gender ? 'text-slate-800 font-medium font-secondary' : 'text-slate-400 font-secondary'}>
                        {gender === 'MALE' ? 'Male' : gender === 'FEMALE' ? 'Female' : gender === 'OTHER' ? 'Other' : 'Select'}
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isGenderDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isGenderDropdownOpen && (
                      <div className="absolute left-0 mt-1 w-full rounded-xl bg-white border border-slate-100 shadow-lg py-1 z-50 animate-fade-in animate-duration-200">
                        {[{ label: 'Male', value: 'MALE' }, { label: 'Female', value: 'FEMALE' }, { label: 'Other', value: 'OTHER' }].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setGender(option.value)
                              setIsGenderDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-[14px] font-medium hover:bg-slate-50 font-secondary ${gender === option.value ? 'text-primary' : 'text-slate-600'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.gender && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="dob" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.dob ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                    />
                  </div>
                  {errors.dob && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.dob}</p>}
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="phone" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="0912345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.phone ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
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
                  {errors.password && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? (
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
                  {errors.confirmPassword && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.confirmPassword}</p>}
                </div>

                {/* Password Requirements (Spans full width) */}
                {password.length > 0 && (
                  <div className="sm:col-span-2">
                    <div className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 backdrop-blur-xs text-[13px] space-y-1.5 animate-fade-in transition-all">
                      <span className="font-bold text-slate-700 block text-[12px] uppercase tracking-wider font-primary">Password requirements:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 font-secondary">
                        <div className={`flex items-center gap-1.5 transition-colors duration-300 ${isPasswordLengthValid ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          {isPasswordLengthValid ? (
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0 text-slate-300 font-bold">•</div>
                          )}
                          <span>Over 6 characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors duration-300 ${hasPasswordUppercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          {hasPasswordUppercase ? (
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0 text-slate-300 font-bold">•</div>
                          )}
                          <span>Contains uppercase letter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors duration-300 ${hasPasswordNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          {hasPasswordNumber ? (
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0 text-slate-300 font-bold">•</div>
                          )}
                          <span>Contains a number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 transition-colors duration-300 ${hasPasswordSpecialChar ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          {hasPasswordSpecialChar ? (
                            <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0 text-slate-300 font-bold">•</div>
                          )}
                          <span>Contains special character</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Agree Terms Checkbox */}
              <div className="space-y-1 pt-0.5 px-1 text-left">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 border-slate-300 transition-colors"
                  />
                  <span className="text-[13px] text-slate-500 font-secondary leading-tight">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline font-semibold">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline font-semibold">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2.5 rounded-full btn-premium-gradient py-2.5 text-[14px] active:scale-[0.98] transition-all duration-300 disabled:opacity-75 cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                {isLoading ? 'PROCESSING...' : 'REGISTER'}
              </button>

              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 text-slate-400 text-[10px] uppercase font-bold tracking-widest">Or</span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>

              {/* Google Sign-in Container */}
              <div id="googleBtn" className="w-full flex justify-center min-h-[44px]">Register with Google</div>
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

          {/* Welcome Message inside Glassmorphic panel */}
          <div className="my-auto max-w-sm backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] space-y-4 animate-fade-in w-full text-left">
            <h2 className="text-[22px] font-extrabold tracking-tight leading-none text-white font-primary">
              Join Us.
            </h2>
            <p className="text-white/85 text-[14px] leading-relaxed font-secondary">
              Create your passenger account to search trips, earn reward points, and book smart rides today.
            </p>
            <div className="pt-2 text-[14px] font-secondary">
              <span className="text-white/70">Already have an account? </span>
              <Link to="/login" className="text-white font-bold hover:underline">
                Sign in now
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

export default RegisterPassengerPage
