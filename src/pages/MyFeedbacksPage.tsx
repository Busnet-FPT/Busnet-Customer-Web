import { useEffect, useState } from 'react'
import { getFeedbacks } from '../services/feedbackService'
import type { FeedbackItem } from '../types/feedback'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-base ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}>
          &#9733;
        </span>
      ))}
    </div>
  )
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
      setFeedbacks(response.data.data.feedbacks || [])
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
        <div className="mb-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary font-primary">My Reviews</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">Trip Feedbacks</h1>
          <p className="text-xs text-slate-500 mt-1">Reviews you submitted for completed bookings.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-xs" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center font-bold text-rose-700 shadow-xs">
            {error}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <h3 className="font-extrabold text-slate-700 text-sm font-primary">No reviews</h3>
            <p className="text-xs text-slate-400 mt-1">Completed trips you review will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <RatingStars value={feedback.rating} />
                    <h3 className="mt-2 text-sm font-black text-slate-900 font-primary">{feedback.partnerId?.fullName || 'BusNet Operator'}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Booking <span className="text-slate-800">{feedback.bookingId?.bookingCode || 'N/A'}</span>
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{formatDate(feedback.createdAt)}</span>
                </div>

                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-600">
                  {feedback.review || 'No written comment.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyFeedbacksPage
