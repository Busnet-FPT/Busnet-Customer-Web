import { useState } from 'react'
import { createReport } from '../../services/reportService'
import { toast } from 'react-hot-toast'

function ContactSection() {
  const [reportType, setReportType] = useState<'TRIP' | 'BOOKING' | 'OPERATOR' | 'PAYMENT' | 'SYSTEM' | 'OTHER'>('SYSTEM')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to send a message')
      return
    }

    setLoading(true)
    try {
      await createReport({
        reportType,
        description
      })
      toast.success('Your message has been sent successfully')
      setDescription('')
      setReportType('SYSTEM')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-20 mb-20">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4 font-primary">Contact & Report</h2>
        <p className="text-slate-500 mb-8 max-w-2xl mx-auto font-secondary">
          Have an issue with your trip or want to report a problem? Send us a message and our support team will get back to you shortly.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5 text-left">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-primary">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
              required
            >
              <option value="SYSTEM">System/Website Issue</option>
              <option value="PAYMENT">Payment Problem</option>
              <option value="OPERATOR">Operator Feedback</option>
              <option value="TRIP">Trip Issue</option>
              <option value="BOOKING">Booking/Ticket Issue</option>
              <option value="OTHER">Other Inquiry</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-primary">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              placeholder="Please describe your issue in detail..."
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl text-white font-bold font-primary transition-all shadow-md active:scale-[0.98] ${
              loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'
            }`}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactSection
