import React, { useState } from 'react'
import { uploadImage } from '../../../services/authService'
import { toast } from 'react-hot-toast'

interface Step3LicenseProps {
  businessLicense: string
  setBusinessLicense: (val: string) => void
  errors: { [key: string]: string }
}

const Step3License: React.FC<Step3LicenseProps> = ({
  businessLicense,
  setBusinessLicense,
  errors
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const result = await uploadImage(file, 'busnet/partners/licenses')
      setBusinessLicense(result.url)
      toast.success('Business license uploaded successfully!')
    } catch (err) {
      console.error('License upload failed:', err)
      toast.error('Failed to upload business license. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 border-2 border-white">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-[22px] font-extrabold text-slate-900 font-primary tracking-tight">
          Upload Business License
        </h2>
        <p className="text-[13.5px] text-slate-500 font-secondary max-w-md mx-auto leading-relaxed">
          Please upload your business license document for verification. Our admin team will review it within <strong className="text-slate-700">48 hours</strong>.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50 p-6 md:p-8 space-y-6">
        
        {/* Drag & Drop / Click Upload */}
        <div className="space-y-3">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
            Business License Document <span className="text-red-500">*</span>
          </label>
          
          <label className={`relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
            businessLicense 
              ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50' 
              : errors.businessLicense 
                ? 'border-red-300 bg-red-50/30 hover:bg-red-50/50'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-primary'
          }`}>
            {isUploading ? (
              <>
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <span className="text-[14px] text-primary font-semibold font-secondary">Uploading document...</span>
              </>
            ) : businessLicense ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[14px] text-emerald-700 font-bold font-secondary block">Document Uploaded Successfully</span>
                  <span className="text-[12px] text-slate-500 font-secondary">Click to replace with a different file</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:text-primary">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[14px] text-slate-700 font-bold font-secondary block">Click to upload your license</span>
                  <span className="text-[12px] text-slate-400 font-secondary">
                    Supports: Images, PDF, DOC, DOCX
                  </span>
                </div>
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.doc,.docx"
              onChange={handleLicenseUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Or paste URL */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-primary">Or paste URL</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <input
            type="url"
            placeholder="https://example.com/business-license.pdf"
            value={businessLicense}
            onChange={(e) => setBusinessLicense(e.target.value)}
            className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.businessLicense ? 'border-red-500 focus:ring-red-500/10' : ''}`}
          />
        </div>

        {errors.businessLicense && (
          <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.businessLicense}</p>
        )}

        {/* Preview link */}
        {businessLicense && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-[13px] text-emerald-700 font-semibold font-secondary">Document linked</span>
            <a
              href={businessLicense}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-[12px] text-primary hover:underline font-secondary font-semibold"
            >
              View Document ↗
            </a>
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="p-4 bg-blue-50/60 border border-blue-100/50 rounded-2xl text-[13px] text-blue-700 font-semibold leading-relaxed font-secondary">
        📋 <strong>What happens next?</strong> After you submit your license, our admin team will review it within 48 hours. You will receive an email notification once the review is complete. If approved, you can continue with the payment setup.
      </div>
    </div>
  )
}

export default Step3License
