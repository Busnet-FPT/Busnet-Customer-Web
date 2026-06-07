import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import registerHero from '../assets/register_hero.png'

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
      tempErrors.companyName = 'Vui lòng nhập tên nhà xe / doanh nghiệp'
    }

    if (!representativeName.trim()) {
      tempErrors.representativeName = 'Vui lòng nhập tên người đại diện'
    }

    if (!taxCode.trim()) {
      tempErrors.taxCode = 'Vui lòng nhập mã số thuế / GPKD'
    } else if (taxCode.trim().length < 5) {
      tempErrors.taxCode = 'Mã số thuế / GPKD không hợp lệ'
    }

    if (!phone.trim()) {
      tempErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^\d{10,11}$/.test(phone.trim())) {
      tempErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)'
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
            
            <h1 className="text-2xl font-extrabold text-slate-900">Đăng Ký Đối Tác Thành Công!</h1>
            <p className="mt-4 text-slate-600 font-secondary max-w-sm">
              Yêu cầu hợp tác của nhà xe <strong className="text-slate-900">{companyName}</strong> đã được gửi lên hệ thống. Đội ngũ BusNet sẽ kiểm duyệt hồ sơ và liên hệ với bạn trong vòng 24 giờ làm việc.
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
              Đăng Ký Hợp Tác Nhà Xe
            </h1>
            <p className="text-slate-500 text-xs font-secondary">
              Cung cấp thông tin doanh nghiệp để chúng tôi liên hệ xét duyệt.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Company Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tên nhà xe / doanh nghiệp</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Nhà xe Phương Trang, Limousine..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.companyName ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.companyName && <p className="text-red-500 text-[10px] mt-0.5">{errors.companyName}</p>}
              </div>

              {/* Representative Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Người đại diện pháp lý</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn B"
                    value={representativeName}
                    onChange={(e) => setRepresentativeName(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.representativeName ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.representativeName && <p className="text-red-500 text-[10px] mt-0.5">{errors.representativeName}</p>}
              </div>

              {/* Tax Code */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mã số thuế / GPKD</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Mã số doanh nghiệp"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.taxCode ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.taxCode && <p className="text-red-500 text-[10px] mt-0.5">{errors.taxCode}</p>}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Số điện thoại liên hệ</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full rounded-xl border bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 transition-all duration-200 ${
                      errors.phone ? 'border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-blue-100'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
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
                'ĐĂNG KÝ HỢP TÁC'
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

export default RegisterOperatorPage
