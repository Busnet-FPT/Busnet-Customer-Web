import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import {
  forgotPasswordCustomer,
  resetPasswordCustomer,
  verifyResetCodeCustomer,
} from '../../services/authService'

type Step = 'email' | 'code' | 'password' | 'success'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')

  const passwordChecks = useMemo(() => ({
    length: newPassword.length > 6,
    uppercase: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>_+\-=;']/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  }), [confirmPassword, newPassword])

  const isPasswordValid = Object.values(passwordChecks).every(Boolean)

  useEffect(() => {
    if (timer <= 0) return undefined

    const interval = window.setInterval(() => {
      setTimer((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [timer])

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as { message?: string; errors?: Array<{ message: string }> }
      if (data.errors?.length) {
        return data.errors.map((item) => item.message).join(', ')
      }
      return data.message || fallback
    }
    return fallback
  }

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setApiError('')
    setApiSuccess('')

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setApiError('Please enter your email address.')
      return
    }

    setIsLoading(true)
    try {
      const response = await forgotPasswordCustomer(normalizedEmail)
      setEmail(normalizedEmail)
      setStep('code')
      setTimer(60)
      setApiSuccess(response.message || 'Reset code has been sent to your email.')
      toast.success('Reset code sent.')
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to send reset code. Please try again.')
      setApiError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setApiSuccess('')

    if (code.length !== 6) {
      setApiError('Reset code must be exactly 6 digits.')
      return
    }

    setIsLoading(true)
    try {
      await verifyResetCodeCustomer(email, code)
      setStep('password')
      setApiSuccess('Code verified. You can set a new password now.')
    } catch (error) {
      const message = getErrorMessage(error, 'Invalid or expired reset code.')
      setApiError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    setApiSuccess('')

    if (!isPasswordValid) {
      setApiError('Please make sure the new password meets all requirements.')
      return
    }

    setIsLoading(true)
    try {
      await resetPasswordCustomer(email, code, newPassword)
      setStep('success')
      toast.success('Password reset successfully.')
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to reset password. Please try again.')
      setApiError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 animate-fade-in my-4 font-primary">
      <div className="flex flex-col md:flex-row min-h-[620px]">
        <div className="w-full md:w-[50%] p-8 md:p-12 flex flex-col justify-between bg-white relative">
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
              <p className="text-xs font-extrabold uppercase tracking-wider text-primary">Account recovery</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {step === 'success' ? 'Password Updated' : 'Forgot Password'}
              </h1>
              <p className="text-slate-500 text-sm font-secondary leading-relaxed">
                {getStepDescription(step, email)}
              </p>
            </div>

            {apiError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-secondary flex items-start gap-2.5 animate-fade-in" role="alert">
                <AlertIcon />
                <span>{apiError}</span>
              </div>
            )}

            {apiSuccess && step !== 'success' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-secondary flex items-start gap-2.5 animate-fade-in" role="alert">
                <CheckIcon />
                <span>{apiSuccess}</span>
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendCode} className="space-y-5">
                <FieldLabel label="Email Address">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </FieldLabel>
                <PrimaryButton disabled={isLoading}>{isLoading ? 'SENDING...' : 'SEND RESET CODE'}</PrimaryButton>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <FieldLabel label="Reset Code">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full text-center font-mono text-3xl tracking-[0.35em] pl-[0.35em] rounded-xl border border-slate-200 bg-slate-50/50 py-3 outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                    disabled={isLoading}
                    autoFocus
                  />
                </FieldLabel>
                <PrimaryButton disabled={isLoading || code.length !== 6}>
                  {isLoading ? 'VERIFYING...' : 'VERIFY CODE'}
                </PrimaryButton>
                <div className="text-center font-secondary text-sm text-slate-500">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={() => handleSendCode()}
                    disabled={timer > 0 || isLoading}
                    className="text-primary font-bold hover:underline cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  showPassword={showPassword}
                  disabled={isLoading}
                  onToggle={() => setShowPassword((current) => !current)}
                  onChange={setNewPassword}
                />
                <PasswordField
                  label="Confirm Password"
                  value={confirmPassword}
                  showPassword={showPassword}
                  disabled={isLoading}
                  onToggle={() => setShowPassword((current) => !current)}
                  onChange={setConfirmPassword}
                />
                <div className="grid grid-cols-1 gap-2 text-xs font-secondary">
                  <PasswordRule ok={passwordChecks.length} text="More than 6 characters" />
                  <PasswordRule ok={passwordChecks.uppercase} text="At least one uppercase letter" />
                  <PasswordRule ok={passwordChecks.number} text="At least one number" />
                  <PasswordRule ok={passwordChecks.special} text="At least one special character" />
                  <PasswordRule ok={passwordChecks.match} text="Passwords match" />
                </div>
                <PrimaryButton disabled={isLoading || !isPasswordValid}>
                  {isLoading ? 'UPDATING...' : 'RESET PASSWORD'}
                </PrimaryButton>
              </form>
            )}

            {step === 'success' && (
              <div className="space-y-5 text-center md:text-left">
                <div className="mx-auto md:mx-0 w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/10 border border-emerald-100">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <PrimaryButton onClick={() => navigate('/login')}>RETURN TO LOGIN</PrimaryButton>
              </div>
            )}
          </div>

          <div className="text-center text-sm font-secondary text-slate-500 pt-4 border-t border-slate-50">
            <Link to="/login" className="font-bold text-slate-500 hover:text-primary flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Return to Login
            </Link>
          </div>
        </div>

        <div className="hidden md:flex md:w-[50%] fluid-gradient-mesh p-12 flex-col justify-between text-white select-none">
          <div className="flex justify-end">
            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-wide">
              SECURE RESET
            </span>
          </div>

          <div className="my-auto max-w-sm backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] space-y-4 animate-fade-in w-full text-left">
            <h2 className="text-3xl font-extrabold tracking-tight leading-none text-white font-primary">
              Back on board.
            </h2>
            <p className="text-white/80 text-sm leading-relaxed font-secondary">
              We will verify your email with a one-time code before allowing a new password, keeping bookings and tickets protected.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['Email', 'OTP', 'Reset'].map((item, index) => (
                <div key={item} className={`rounded-2xl border px-3 py-2 text-center text-xs font-bold ${getStepIndex(step) >= index ? 'border-white/40 bg-white/20 text-white' : 'border-white/10 bg-white/5 text-white/45'}`}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/45 font-secondary text-right">
            (c) 2026 BusNet Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

function getStepIndex(step: Step) {
  if (step === 'email') return 0
  if (step === 'code') return 1
  return 2
}

function getStepDescription(step: Step, email: string) {
  if (step === 'email') return 'Enter the email linked to your BusNet customer account.'
  if (step === 'code') return `We sent a 6-digit reset code to ${email}.`
  if (step === 'password') return 'Choose a new password for your customer account.'
  return 'Your password has been reset. You can sign in with the new password now.'
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-left w-full block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-primary">{label}</span>
      {children}
    </label>
  )
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-xl btn-premium-gradient py-3 text-sm font-bold tracking-wide active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 hover:shadow-primary/30"
    >
      {children}
    </button>
  )
}

function PasswordField({
  label,
  value,
  showPassword,
  disabled,
  onToggle,
  onChange,
}: {
  label: string
  value: string
  showPassword: boolean
  disabled: boolean
  onToggle: () => void
  onChange: (value: string) => void
}) {
  return (
    <FieldLabel label={label}>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter password"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-12 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
          autoComplete="new-password"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </FieldLabel>
  )
}

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <span>{text}</span>
    </div>
  )
}

function AlertIcon() {
  return (
    <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

export default ForgotPasswordPage
