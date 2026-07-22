import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { createOperatorFeedback } from '../services/feedbackService'

interface WriteOperatorFeedbackModalProps {
  isOpen: boolean
  partnerId: string
  operatorName: string
  onClose: () => void
  onSuccess?: () => void
}

function WriteOperatorFeedbackModal({ isOpen, partnerId, operatorName, onClose, onSuccess }: WriteOperatorFeedbackModalProps) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!review.trim()) {
      toast.error('Please enter your operator feedback.')
      return
    }

    setSubmitting(true)
    const loadToast = toast.loading('Submitting operator feedback...')
    try {
      await createOperatorFeedback(partnerId, {
        rating,
        review: review.trim(),
      })
      toast.success('Thank you for writing feedback!', { id: loadToast })
      setRating(5)
      setReview('')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit operator feedback.', { id: loadToast })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-secondary">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 bg-blue-50/60">
          <h2 className="text-xl font-bold text-slate-800 font-primary">Write Operator Feedback</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Operator: <span className="text-primary font-bold">{operatorName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
              How do you rate this operator?
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
                  &#9733;
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
              Your Feedback <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Share your thoughts about this operator..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold resize-none"
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
              disabled={submitting || !review.trim()}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-primary hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-sm shadow-primary/20 active:scale-95 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteOperatorFeedbackModal
