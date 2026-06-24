import { useState } from 'react'
import { createReport } from '../services/reportService'
import { toast } from 'react-hot-toast'

interface ReportModalProps {
  isOpen: boolean
  tripId?: string
  tripName: string
  onClose: () => void
  onSuccess?: () => void
}

function ReportModal({ isOpen, tripName, onClose, onSuccess }: ReportModalProps) {
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      toast.error('Please provide a description.')
      return
    }

    setSubmitting(true)
    const loadToast = toast.loading('Submitting report...')
    try {
      await createReport({
        reportType: 'TRIP',
        description: description.trim()
      })
      toast.success('Report submitted successfully. We will review it soon.', { id: loadToast })
      setDescription('')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to submit report.', { id: loadToast })
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
        <div className="p-6 border-b border-slate-100 bg-rose-50/50">
          <h2 className="text-xl font-bold text-slate-800 font-primary">Report Trip</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Trip: <span className="text-rose-600 font-bold">{tripName}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 transition-all font-semibold resize-none"
              maxLength={1000}
            />
            <div className="text-right mt-1">
              <span className="text-[10px] font-bold text-slate-400">{description.length}/1000</span>
            </div>
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
              disabled={submitting || !description.trim()}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white bg-rose-500 hover:bg-rose-600 transition-colors disabled:opacity-50 shadow-sm shadow-rose-500/20 active:scale-95 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportModal
