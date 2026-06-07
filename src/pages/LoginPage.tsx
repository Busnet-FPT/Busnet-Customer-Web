import { useState } from 'react'
import { Link } from 'react-router-dom'
import registerHero from '../assets/register_hero.png'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Error/loading states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const tempErrors: { [key: string]: string } = {}
    if (!email) {
      tempErrors.email = 'Vui lòng nhập email'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email không hợp lệ'
    }
    if (!password) {
      tempErrors.password = 'Vui lòng nhập mật khẩu'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      // Simulate API login call
      setTimeout(() => {
        setIsLoading(false)
        alert('Đăng nhập thành công! (Simulated)')
      }, 1500)
    }
  }

  return (
    <div className="mx-auto w-full rounded-3xl bg-white shadow-xl overflow-hidden border border-slate-100 animate-fade-in">
      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Dark Hero Panel (Matches RegisterPage) */}
        <div className="hidden md:flex md:w-1/2 bg-[#0B1528] relative p-12 flex-col justify-between overflow-hidden select-none">
          {/* Background Blur & Glowing Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-primary/20 blur-3xl"></div>

          <div className="relative z-10 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight font-primary uppercase">
              Bus<span className="text-primary">Net</span>
            </span>
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center">
            {/* Custom glowing rings behind image */}
            <div className="absolute w-[280px] h-[280px] rounded-full border border-primary/20 flex items-center justify-center animate-spin-slow">
              <div className="w-[240px] h-[240px] rounded-full border border-dashed border-primary/10"></div>
            </div>

            <img
              src={registerHero}
              alt="BusNet futuristic electric coach"
              className="w-full max-w-[390px] object-contain drop-shadow-[0_20px_40px_rgba(1,133,255,0.4)] relative z-10 hover:scale-105 transition-transform duration-500"
            />
            <div className="text-center mt-10 space-y-3 relative z-10">
              <h2 className="text-white text-2xl font-bold tracking-wide font-primary">
                RIDE SMARTER SAVE TOGETHER
              </h2>
              <p className="text-slate-400 text-sm font-secondary max-w-xs mx-auto">
                Kết nối mọi hành trình, đồng hành trên từng nẻo đường cùng trải nghiệm công nghệ vượt trội.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Modern Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 font-primary">Đăng Nhập</h1>
              <p className="text-slate-500 text-sm font-secondary">
                Chào mừng bạn trở lại! Vui lòng điền thông tin đăng nhập.
              </p>
            </div>

            {/* Google Authentication Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 font-semibold text-slate-700 font-primary hover:bg-slate-50 active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.69-5.32 3.69-8.74Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.12c-1.12.75-2.55 1.19-3.95 1.19-3.05 0-5.63-2.06-6.55-4.83H1.31v3.22A12.002 12.002 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.45 14.33a7.14 7.14 0 0 1 0-4.66V6.45H1.31a12.002 12.002 0 0 0 0 11.1l4.14-3.22Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.33 0 3.28 2.69 1.31 6.45l4.14 3.22c.92-2.77 3.5-4.92 6.55-4.92Z"
                />
              </svg>
              ĐĂNG NHẬP BẰNG GOOGLE
            </button>

            {/* Separator */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-xs font-semibold text-slate-400 font-primary">HOẶC ĐĂNG NHẬP VỚI EMAIL</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase font-primary tracking-wider">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                      }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs font-secondary mt-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase font-primary tracking-wider">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-10 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${errors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs font-secondary mt-1">{errors.password}</p>}
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 transition-colors"
                  />
                  <span className="text-xs text-slate-500 font-secondary">Duy trì đăng nhập</span>
                </label>
                <a href="/forgot-password" className="text-xs font-semibold text-primary hover:underline font-secondary">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-6 rounded-xl bg-primary text-white py-3.5 font-bold font-primary tracking-wide text-center uppercase shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    ĐANG ĐĂNG NHẬP...
                  </div>
                ) : (
                  'ĐĂNG NHẬP'
                )}
              </button>
            </form>

            {/* Register Redirect Link (The requested part) */}
            <div className="text-center text-sm text-slate-500 font-secondary mt-4">
              Bạn chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage