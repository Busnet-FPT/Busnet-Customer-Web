import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-5xl font-bold text-blue-600">404</h1>
      <p className="mt-3 text-lg text-slate-600">Không tìm thấy trang.</p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Về trang chủ
      </Link>
    </div>
  )
}

export default NotFoundPage