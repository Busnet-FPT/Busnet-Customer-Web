import { Link, Outlet } from 'react-router-dom'

function CustomerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BusNet
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-600">
              Trang chủ
            </Link>
            <Link to="/trips" className="hover:text-blue-600">
              Tìm chuyến
            </Link>
            <Link to="/booking" className="hover:text-blue-600">
              Vé của tôi
            </Link>
            <Link to="/profile" className="hover:text-blue-600">
              Tài khoản
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-12 border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          © 2026 BusNet. Customer Web.
        </div>
      </footer>
    </div>
  )
}

export default CustomerLayout