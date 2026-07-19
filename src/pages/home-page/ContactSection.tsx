import { useState } from 'react'
import { createReport } from '../../services/reportService'
import { uploadImage } from '../../services/authService'
import { toast } from 'react-hot-toast'

function ContactSection() {
  const [reportType, setReportType] = useState<'TRIP' | 'BOOKING' | 'OPERATOR' | 'PAYMENT' | 'SYSTEM' | 'OTHER'>('SYSTEM')
  const [description, setDescription] = useState('')
  const [reportImages, setReportImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const remainingSlots = Math.max(0, 5 - reportImages.length)
    const selectedFiles = files.slice(0, remainingSlots)

    if (files.length > remainingSlots) {
      toast.error('You can attach up to 5 images per report')
    }

    setUploadingImages(true)
    const uploadToast = toast.loading('Uploading report images...')
    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => uploadImage(file, 'busnet/reports').then((res) => res.url))
      )
      setReportImages((prev) => [...prev, ...uploadedUrls])
      toast.success('Images uploaded successfully', { id: uploadToast })
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload images', { id: uploadToast })
    } finally {
      setUploadingImages(false)
      e.target.value = ''
    }
  }

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
        description,
        reportImages
      })
      toast.success('Your message has been sent successfully')
      setDescription('')
      setReportImages([])
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

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 font-primary">Attach Images</label>
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-5 text-center transition-all ${
              uploadingImages ? 'opacity-70 cursor-wait' : 'hover:border-primary hover:bg-primary/5'
            }`}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImages || reportImages.length >= 5}
              />
              <span className="text-sm font-bold text-slate-700 font-primary">
                {uploadingImages ? 'Uploading images...' : 'Click to upload evidence'}
              </span>
              <span className="mt-1 text-xs text-slate-400 font-secondary">Up to 5 images</span>
            </label>

            {reportImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {reportImages.map((url, index) => (
                  <div key={url} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img src={url} alt={`Report evidence ${index + 1}`} className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setReportImages((prev) => prev.filter((item) => item !== url))}
                      className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/70 px-2 py-0.5 text-xs font-bold text-white hover:bg-rose-500"
                      aria-label="Remove image"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading || uploadingImages}
            className={`w-full py-3.5 rounded-xl text-white font-bold font-primary transition-all shadow-md active:scale-[0.98] ${
              loading || uploadingImages ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'
            }`}
          >
            {loading ? 'Sending...' : uploadingImages ? 'Uploading...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactSection
