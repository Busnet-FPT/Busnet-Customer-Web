import { useEffect, useState } from 'react'
import { getFeedbacks } from '../services/feedbackService'
import type { FeedbackItem } from '../types/feedback'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function MyFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFeedbacks = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getFeedbacks()
      setFeedbacks(response.data.data || [])
    } catch (err) {
      console.error(err)
      setError('Unable to load your reviews. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbacks()
  }, [])

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-amber-500 font-primary">My Reviews</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">Trip Feedbacks</h1>
          <p className="text-xs text-slate-500 mt-1">View your past reviews and operator responses</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-40 border border-slate-100 animate-pulse shadow-xs" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 text-rose-700 font-bold border border-rose-100 rounded-3xl p-8 text-center shadow-xs">
            {error}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
            <span className="text-4xl">⭐</span>
            <h3 className="font-extrabold text-slate-700 text-sm font-primary mt-3">No reviews</h3>
            <p className="text-xs text-slate-400 mt-1">You haven't submitted any feedback for your trips yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbacks.map((fb) => (
              <div
                key={fb.feedbackId}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
              >
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${star <= fb.rating ? 'text-amber-400' : 'text-slate-200'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500">
                        Booking Code: <span className="font-bold text-slate-800">{fb.bookingCode}</span> • {formatDate(fb.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-650 leading-relaxed">
                    {fb.comment}
                  </p>
                </div>

                {fb.operatorResponse && (
                  <div className="p-5 sm:p-6 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-primary">Operator Response</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 italic">"{fb.operatorResponse}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyFeedbacksPage
