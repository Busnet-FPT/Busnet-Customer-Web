import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import registerHero from '../assets/register_hero.png'

function RegisterPassengerPage() {
  const navigate = useNavigate()

  // Form Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')

  // Visibility states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Error/Success validation states
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const tempErrors: { [key: string]: string } = {}

    if (!fullName.trim()) {
      tempErrors.fullName = 'Vui lòng nhập họ và tên'
    }

    if (!username.trim()) {
      tempErrors.username = 'Vui lòng nhập tên đăng nhập'
    } else if (username.trim().length < 3) {
      tempErrors.username = 'Tên đăng nhập phải ít nhất 3 ký tự'
    }

    if (!gender) {
      tempErrors.gender = 'Vui lòng chọn giới tính'
    }

    if (!dob) {
      tempErrors.dob = 'Vui lòng chọn ngày sinh'
    }

    if (!email) {
      tempErrors.email = 'Vui lòng nhập email'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email không hợp lệ'
    }

    if (!password) {
      tempErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (password.length < 6) {
      tempErrors.password = 'Mật khẩu phải chứa ít nhất 6 ký tự'
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (!agreeTerms) {
      tempErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản dịch vụ'
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
      <div className="mx-auto w-full rounded-3xl bg-white shadow-xl overflow-hidden border border-slate-100 animate-fade-in font-primary">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Hero Side */}
          <div className="hidden md:flex md:w-1/2 bg-[#0B1528] relative p-12 flex-col justify-between overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/20 blur-3xl"></div>
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight uppercase">
                Bus<span className="text-primary">Net</span>
              </span>
            </div>

            <div className="relative z-10 my-auto flex flex-col items-center">
              <img
                src={registerHero}
                alt="BusNet futuristic electric coach"
                className="w-full max-w-[380px] object-contain drop-shadow-[0_15px_30px_rgba(1,133,255,0.3)] animate-pulse-slow"
              />
              <div className="text-center mt-8 space-y-3">
                <h2 className="text-white text-2xl font-bold tracking-wide">
                  RIDE SMARTER SAVE TOGETHER
                </h2>
                <p className="text-slate-400 text-sm font-secondary max-w-xs mx-auto">
                  Tham gia cùng hàng nghìn hành khách lựa chọn di chuyển thông minh và an toàn mỗi ngày.
                </p>
              </div>
            </div>

            <div className="relative z-10 text-xs text-slate-500 font-secondary">
              © 2026 BusNet Inc. All rights reserved.
            </div>
          </div>

          {/* Right Success Side */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6 text-emerald-500 animate-bounce">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-extrabold text-slate-900">Đăng Ký Thành Công!</h1>
            <p className="mt-4 text-slate-600 font-secondary max-w-sm">
              Tài khoản của bạn đã được khởi tạo thành công với tên đăng nhập <strong className="text-slate-900">@{username}</strong>. Hãy bắt đầu tìm kiếm những chuyến đi tuyệt vời cùng BusNet ngay bây giờ.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs">
              <Link
                to="/login"
                className="flex-1 rounded-xl bg-primary text-white py-3 font-semibold text-center hover:bg-blue-600 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                ĐĂNG NHẬP NGAY
              </Link>
              <Link
                to="/"
                className="flex-1 rounded-xl border border-slate-200 text-slate-700 py-3 font-semibold text-center hover:bg-slate-50 transition-all duration-300"
              >
                TRANG CHỦ
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full rounded-3xl bg-white shadow-xl overflow-hidden border border-slate-100 font-primary">
      <div className="flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Dark Hero Panel */}
        <div className="hidden md:flex md:w-1/2 bg-[#0B1528] relative p-12 flex-col justify-between overflow-hidden select-none animate-fade-in">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-primary/20 blur-3xl"></div>
          
          <div className="relative z-10 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white tracking-tight uppercase">
              Bus<span className="text-primary">Net</span>
            </span>
          </div>

          <div className="relative z-10 my-auto flex flex-col items-center">
            <div className="absolute w-[280px] h-[280px] rounded-full border border-primary/20 flex items-center justify-center animate-spin-slow">
              <div className="w-[240px] h-[240px] rounded-full border border-dashed border-primary/10"></div>
            </div>
            
            <img
              src={registerHero}
              alt="BusNet futuristic coach"
              className="w-full max-w-[390px] object-contain drop-shadow-[0_20px_40px_rgba(1,133,255,0.4)] relative z-10 hover:scale-105 transition-transform duration-500"
            />
            <div className="text-center mt-10 space-y-3 relative z-10">
              <h2 className="text-white text-2xl font-bold tracking-wide">
                RIDE SMARTER SAVE TOGETHER
              </h2>
              <p className="text-slate-400 text-sm font-secondary max-w-xs mx-auto">
                Tìm chuyến đi nhanh chóng, chọn ghế ngồi thông minh và trải nghiệm dịch vụ xe khách chuẩn 5 sao cùng BusNet.
              </p>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500 font-secondary">
            © 2026 BusNet Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white animate-fade-in">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary font-bold transition-all duration-200 cursor-pointer active:scale-[0.98] self-start mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            QUAY LẠI CHỌN LOẠI TÀI KHOẢN
          </button>

          <div className="space-y-1 mb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Đăng Ký Hành Khách
            </h1>
            <p className="text-slate-500 text-xs font-secondary">
              Điền thông tin của bạn để đặt chuyến đi đầu tiên.
            </p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-2.5 px-4 font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 cursor-pointer text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.69-5.32 3.69-8.74Z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.12c-1.12.75-2.55 1.19-3.95 1.19-3.05 0-5.63-2.06-6.55-4.83H1.31v3.22A12.002 12.002 0 0 0 12 24Z" />
              <path fill="#FBBC05" d="M5.45 14.33a7.14 7.14 0 0 1 0-4.66V6.45H1.31a12.002 12.002 0 0 0 0 11.1l4.14-3.22Z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.33 0 3.28 2.69 1.31 6.45l4.14 3.22c.92-2.77 3.5-4.92 6.55-4.92Z" />
            </svg>
            ĐĂNG KÝ BẰNG GOOGLE
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[9px] font-bold text-slate-400">HOẶC ĐIỀN THÔNG TIN</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Họ và tên</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName}</p>}
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tên đăng nhập</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <span className="text-sm font-semibold">@</span>
                  </div>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className={`w-full rounded-xl border bg-slate-50 pl-8 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.username ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-[10px] mt-0.5">{errors.username}</p>}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Giới tính</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
                    </svg>
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 transition-all duration-200 appearance-none ${
                      errors.gender ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.gender && <p className="text-red-500 text-[10px] mt-0.5">{errors.gender}</p>}
              </div>

              {/* DOB */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ngày sinh</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.dob ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.dob && <p className="text-red-500 text-[10px] mt-0.5">{errors.dob}</p>}
              </div>

              {/* Account Credentials Header */}
              <div className="sm:col-span-2 border-t border-slate-100 pt-3 my-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Thông tin đăng nhập hệ thống</span>
              </div>

              {/* Email */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.email ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-10 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.password ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
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
                {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
              </div>

              {/* Rewrite Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nhập lại mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Rewrite Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-10 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-0.5">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Agree Terms Checkbox */}
            <div className="space-y-1 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 transition-colors"
                />
                <span className="text-xs text-slate-500 font-secondary leading-tight">
                  Tôi đồng ý với{' '}
                  <a href="/terms" className="text-primary hover:underline font-semibold">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a href="/privacy" className="text-primary hover:underline font-semibold">
                    Chính sách bảo mật
                  </a>{' '}
                  của BusNet.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-[10px] mt-0.5">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 rounded-xl bg-primary hover:bg-blue-600 text-white py-3 font-bold tracking-wide uppercase transition-all duration-300 relative overflow-hidden active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none cursor-pointer text-xs"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  ĐANG XỬ LÝ...
                </div>
              ) : (
                'ĐĂNG KÝ HÀNH KHÁCH'
              )}
            </button>
          </form>

          <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs font-secondary text-slate-500">
            <span>Bạn đã có tài khoản?</span>
            <Link to="/login" className="text-primary font-bold hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPassengerPage
