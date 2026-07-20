import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { getFavourites, removeFavourite } from '../services/favouriteService'
import type { FavouriteItem } from '../types/favourite'

function MyFavouritesPage() {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavourites = async () => {
    setLoading(true)
    try {
      const res = await getFavourites()
      const rawData = res.data?.data
      const list = Array.isArray(rawData)
        ? rawData
        : (rawData && typeof rawData === 'object' && Array.isArray((rawData as any).favourites))
          ? (rawData as any).favourites
          : []
      setFavourites(list)
    } catch (err) {
      toast.error('Failed to load your favourite operators')
      setFavourites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFavourites()
  }, [])

  const handleRemove = async (partnerId: string) => {
    try {
      await removeFavourite(partnerId)
      toast.success('Removed from favourites')
      setFavourites((prev) => prev.filter((item) => item.partnerId !== partnerId))
    } catch (err) {
      toast.error('Failed to remove favourite')
    }
  }

  const favouriteList = Array.isArray(favourites) ? favourites : []

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary font-primary">Saved Operators</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">My Favourite Operators</h1>
          <p className="text-xs text-slate-500 mt-1">Operators you saved for faster booking.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-xs" />
            ))}
          </div>
        ) : favouriteList.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3 className="font-extrabold text-slate-700 text-sm font-primary">No favourite operators</h3>
            <p className="text-xs text-slate-400 mt-1">Save an operator and it will appear here.</p>
            <Link to="/operators" className="mt-6 inline-flex rounded-xl btn-premium-gradient px-6 py-3 text-xs font-primary">
              Explore Operators
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favouriteList.map((item) => {
              const op = item.partner?.information
              const account = item.partner?.account
              const opId = item.partnerId

              return (
                <div key={item.favouriteId || item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      {op?.profilePicture ? (
                        <img src={op.profilePicture} alt={op.operatorName} className="h-16 w-16 rounded-xl object-cover border border-slate-200" />
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-primary text-white flex items-center justify-center text-xl font-black">
                          {op?.operatorName?.charAt(0) || 'O'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-900 font-primary truncate">{op?.operatorName || account?.fullName || 'Operator'}</h3>
                        <p className="text-xs text-slate-500 font-semibold truncate">{account?.email || 'No email provided'}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Rating: <span className="font-bold text-slate-700">{op?.ratingAvg ? op.ratingAvg.toFixed(1) : 'New'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/operators/${opId}`} className="rounded-xl bg-primary px-4 py-2.5 text-center text-xs font-bold text-white hover:bg-blue-600">
                        View Details
                      </Link>
                      <button onClick={() => handleRemove(opId)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyFavouritesPage
