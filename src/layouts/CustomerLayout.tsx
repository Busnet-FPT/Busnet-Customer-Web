import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function CustomerLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <Header />
        <main className={isHome ? "" : "mx-auto max-w-6xl px-4 pt-24 pb-8"}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default CustomerLayout