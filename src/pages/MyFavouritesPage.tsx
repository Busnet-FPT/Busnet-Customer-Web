import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavourites, removeFavourite } from '../services/favouriteService'
import type { FavouriteItem } from '../types/favourite'
import { toast } from 'react-hot-toast'

function MyFavouritesPage() {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavourites = async () => {
    try {
      const res = await getFavourites()
      setFavourites(res.data.data)
    } catch (err) {
      toast.error('Failed to load your favourite operators')
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
      setFavourites(favourites.filter(f => f.operator?.accountId !== partnerId))
    } catch (err) {
      toast.error('Failed to remove favourite')
    }
  }

  if (loading) return <div className="p-8 text-center mt-20">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20 font-primary">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Favourite Operators</h1>

      {favourites.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
          <p className="text-slate-500 mb-4">You haven't saved any operators yet.</p>
          <Link to="/operators" className="text-primary font-bold hover:underline">
            Explore Operators
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map(item => {
            const op = item.operator
            if (!op) return null
            const opId = op.accountId
            
            return (
              <div key={item.favouriteId} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {op.profilePicture ? (
                    <img src={op.profilePicture} alt={op.operatorName} className="w-16 h-16 rounded-full object-cover border border-slate-100" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                      {op.operatorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{op.operatorName}</h3>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{op.ratingAvg ? op.ratingAvg.toFixed(1) : 'New'}</span>
                      {op.totalReviews !== undefined && <span className="text-xs">({op.totalReviews} reviews)</span>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                  <Link 
                    to={`/operators/${opId}`}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleRemove(opId as string)}
                    className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyFavouritesPage
