import { Link, useNavigate } from 'react-router-dom'
import registerHero from '../assets/register_hero.png'

function RegisterPage() {
  const navigate = useNavigate()

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

        {/* Right Side: Step Selector */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white">
          <div className="w-full mx-auto space-y-6 animate-fade-in">
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold text-slate-900">Đăng Ký Tài Khoản</h1>
              <p className="text-slate-500 text-sm font-secondary">
                Chọn loại hình tài khoản phù hợp với nhu cầu của bạn để bắt đầu.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Option 1: Passenger */}
              <div
                onClick={() => navigate('/register/passenger')}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/50 hover:bg-blue-50/15 cursor-pointer transition-all duration-300 active:scale-[0.99] shadow-sm hover:shadow"
              >
                <div className="p-3 rounded-xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Tài khoản Hành khách (Passenger)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-secondary">
                    Đặt vé trực tuyến, chọn ghế thông minh, tích lũy điểm thưởng và quản lý lịch trình di chuyển dễ dàng.
                  </p>
                </div>
              </div>

              {/* Option 2: Operator / Transit Partner */}
              <div
                onClick={() => navigate('/register/operator')}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-primary/50 hover:bg-blue-50/15 cursor-pointer transition-all duration-300 active:scale-[0.99] shadow-sm hover:shadow"
              >
                <div className="p-3 rounded-xl bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                    Đối tác Nhà xe (Transit Operator)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-secondary">
                    Đăng ký bán vé, quản lý sơ đồ xe, điều xe, theo dõi doanh thu và phát triển thương hiệu cùng BusNet.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-secondary text-slate-500">
              <span>Bạn đã có tài khoản?</span>
              <Link to="/login" className="text-primary font-bold hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage