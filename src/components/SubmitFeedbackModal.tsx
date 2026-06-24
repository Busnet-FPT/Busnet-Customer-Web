import { useState } from 'react'
import { createFeedback } from '../services/feedbackService'
import { toast } from 'react-hot-toast'

interface SubmitFeedbackModalProps {
  isOpen: boolean
  bookingCode: string
  operatorName: string
  onClose: () => void
  onSuccess?: () => void
}

function SubmitFeedbackModal({ isOpen, bookingCode, operatorName, onClose, onSuccess }: SubmitFeedbackModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('Please enter your feedback comment.')
      return
    }

    setSubmitting(true)
    const loadToast = toast.loading('Submitting feedback...')
    try {
      await createFeedback({
        bookingCode,
        rating,
        comment: comment.trim()
      })
      toast.success('Thank you for your feedback!', { id: loadToast })
      setRating(5)
      setComment('')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit feedback.', { id: loadToast })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-secondary">
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 bg-amber-50/50">
          <h2 className="text-xl font-bold text-slate-800 font-primary">Rate Your Trip</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Operator: <span className="text-amber-600 font-bold">{operatorName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star Rating */}
          <div className="text-center">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
              How was your experience?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                  style={{ color: star <= rating ? '#fbbf24' : '#e2e8f0' }}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-xs font-bold mt-2 text-slate-600">
              {rating === 1 && 'Terrible'}
              {rating === 2 && 'Poor'}
              {rating === 3 && 'Average'}
              {rating === 4 && 'Good'}
              {rating === 5 && 'Excellent!'}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
              Your Comments <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or how they can improve..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all font-semibold resize-none"
              maxLength={500}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-50 shadow-sm shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubmitFeedbackModal
