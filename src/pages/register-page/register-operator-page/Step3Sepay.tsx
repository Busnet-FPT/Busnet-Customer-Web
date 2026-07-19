import React, { useState } from 'react'

const BANKS = [
  { code: 'MB', name: 'MBBank' },
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'CTG', name: 'VietinBank' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'ACB', name: 'ACB' },
  { code: 'TPB', name: 'TPBank' },
  { code: 'VPB', name: 'VPBank' }
]

const SEPAY_GUIDE_STEPS = [
  {
    title: 'Step 1: Register on SePay',
    description:
      'Visit sepay.vn and click the \'Register\' button to create your account. SePay allows you to automate and track all bank transfer payments in real-time, ensuring secure financial management.',
    images: [
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076950/1_qzysq6.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076951/2_nhllzp.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076952/3_gnqtfq.png'
    ]
  },
  {
    title: 'Step 2: Link Your Bank',
    description:
      'In the SePay admin dashboard, link your bank account to receive payments.',
    images: [
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/4_ujz6d7.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/5_d9bmph.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/6_y024kj.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076952/7_gtpgth.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/8_lcilfu.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/9_ehi5yu.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/10_vy1vnz.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076954/11_rjlzcf.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076953/12_lvjwv7.png'
    ]
  },
  {
    title: 'Step 3: Setup Webhook Integration',
    description:
      'Configure the Webhook URL in your SePay account. This allows our system to receive real-time notifications as soon as customers complete their bank transfers.',
    images: [
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076954/13_wx0fge.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076955/14_iav5jx.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076956/15_z54mxd.png',
      'https://res.cloudinary.com/dvqgpblgc/image/upload/v1774076956/16_jg0m81.png'
    ]
  }
]

interface Step3SepayProps {
  bankName: string
  setBankName: (val: string) => void
  bankNumber: string
  setBankNumber: (val: string) => void
  bankAccountName: string
  setBankAccountName: (val: string) => void
  bankBranch: string
  setBankBranch: (val: string) => void
  sepayVa: string
  setSepayVa: (val: string) => void
  sepayKey: string
  setSepayKey: (val: string) => void
  errors: { [key: string]: string }
}

const Step3Sepay: React.FC<Step3SepayProps> = ({
  bankName,
  setBankName,
  bankNumber,
  setBankNumber,
  bankAccountName,
  setBankAccountName,
  bankBranch,
  setBankBranch,
  sepayVa,
  setSepayVa,
  sepayKey,
  setSepayKey,
  errors
}) => {
  const [showGuideModal, setShowGuideModal] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [subStep, setSubStep] = useState(0)
  const [showZoomModal, setShowZoomModal] = useState(false)
  const [zoomedImageUrl, setZoomedImageUrl] = useState('')
  const [copiedWebhook, setCopiedWebhook] = useState(false)
  const [showSepayKey, setShowSepayKey] = useState(false)

  const WEBHOOK_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/sepay/webhook`

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(WEBHOOK_URL)
    setCopiedWebhook(true)
    setTimeout(() => setCopiedWebhook(false), 2000)
  }

  return (
    <div className="w-full max-w-full mx-auto my-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-[18px] text-slate-900 font-extrabold uppercase tracking-wide">
          Configure Bank & SePay Settings
        </h1>
        <p className="text-slate-400 text-[13px] font-secondary">
          Set up payout routing details to receive ticket booking payments directly
        </p>
      </div>

      <div className="w-full space-y-6 text-left">
        {/* Form Inputs (Full width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          {/* Select Bank */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
              Receiving Bank
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.bankName ? 'border-red-500 focus:ring-red-500/10' : ''
                }`}
            >
              <option value="">-- Select Receiving Bank --</option>
              {BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
            {errors.bankName && (
              <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.bankName}</p>
            )}
          </div>

          {/* Bank Account Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
              Account Number
            </label>
            <input
              type="text"
              placeholder="e.g. 19082000xxxx"
              value={bankNumber}
              onChange={(e) => setBankNumber(e.target.value.replace(/[^0-9]/g, ''))}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.bankNumber ? 'border-red-500 focus:ring-red-500/10' : ''
                }`}
            />
            {errors.bankNumber && (
              <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.bankNumber}</p>
            )}
          </div>

          {/* Account Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
              Account Holder Name
            </label>
            <input
              type="text"
              placeholder="e.g. JOHN DOE"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.bankAccountName ? 'border-red-500 focus:ring-red-500/10' : ''
                }`}
            />
            {errors.bankAccountName && (
              <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.bankAccountName}</p>
            )}
          </div>

          {/* Branch */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
              Bank Branch (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ha Noi East Branch"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {/* SePay VA */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
              SePay Virtual Account (VA)
            </label>
            <input
              type="text"
              placeholder="e.g. SEP102345"
              value={sepayVa}
              onChange={(e) => setSepayVa(e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.sepayVa ? 'border-red-500 focus:ring-red-500/10' : ''
                }`}
            />
            {errors.sepayVa && (
              <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.sepayVa}</p>
            )}
          </div>

          {/* SePay API Key */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
              SePay API Key
            </label>
            <div className="relative">
              <input
                type={showSepayKey ? 'text' : 'password'}
                placeholder="e.g. apikey_xxxxxxxxxxxxxxxx"
                value={sepayKey}
                onChange={(e) => setSepayKey(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.sepayKey ? 'border-red-500 focus:ring-red-500/10' : ''
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowSepayKey(!showSepayKey)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
              >
                {showSepayKey ? (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.sepayKey && (
              <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.sepayKey}</p>
            )}
          </div>
        </div>

        {/* Instruction Panel (Full Width Below) */}
        <div className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 text-[13px] text-slate-600 font-secondary">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Steps (Left half on large screens) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-[14px]">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                How to get SePay configuration?
              </div>

              <p className="leading-relaxed">
                Follow these short steps to enable instant passenger payments directly to your bank account:
              </p>

              <ol className="list-decimal pl-4 space-y-2.5 leading-relaxed">
                <li>
                  Log in to your dashboard at{' '}
                  <a
                    href="https://sepay.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    sepay.vn
                  </a>
                  .
                </li>
                <li>
                  Go to the <strong>Bank Integration</strong> menu and link your official business bank account.
                </li>
                <li>
                  Navigate to <strong>API Configuration</strong> and click <strong>Create API Key</strong>.
                </li>
                <li>
                  Copy the generated <strong>API Key</strong> and your <strong>Virtual Account (VA)</strong>, then
                  paste them in the fields above.
                </li>
                <li>
                  Go to the <strong>Webhooks</strong> menu and create a new webhook pointing to our URL below.
                </li>
              </ol>
            </div>

            {/* Actions & Webhook (Right half on large screens) */}
            <div className="space-y-4 lg:border-l lg:border-slate-200/80 lg:pl-8">
              <div className="text-slate-900 font-extrabold text-[14px]">
                Integration Actions & Webhook
              </div>

              <p className="leading-relaxed">
                Click the button below to view step-by-step setup screenshots, and copy your webhook URL to paste it in SePay:
              </p>

              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-all flex items-center justify-center gap-2 border border-primary/20 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Visual Guide (Screenshots)
              </button>

              <div className="space-y-3 p-3.5 bg-white rounded-xl border border-slate-100 shadow-xs mt-4">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">Your Webhook URL</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={WEBHOOK_URL}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11.5px] font-mono text-slate-600 outline-none select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyWebhook}
                      className={`px-3 py-1.5 ${copiedWebhook ? 'bg-green-500' : 'bg-primary hover:bg-blue-600'
                        } text-white font-bold rounded-lg text-[11.5px] transition-all active:scale-[0.98] shrink-0 cursor-pointer`}
                    >
                      {copiedWebhook ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? (
                <div className="pt-1 text-amber-600 text-[11px] leading-relaxed font-medium bg-amber-50/60 p-2.5 rounded-lg border border-amber-100/50">
                  ⚠️ <strong>Local Testing Tip:</strong> Since you are running on localhost, SePay cannot send webhook events to this local address. Please use your active <strong>ngrok URL</strong> (e.g. <code>https://detrital-nadine-cubicly.ngrok-free.dev/api/sepay/webhook</code>) in the SePay Webhook configuration.
                </div>
              ) : (
                <div className="pt-1 text-slate-400 text-[11px] leading-relaxed italic">
                  * Note: Make sure the webhook URL is configured correctly to receive transfer events in real-time.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-slate-50 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-slate-800">
                    SePay Integration Guide
                  </h3>
                  <p className="text-slate-500 text-[12px] hidden sm:block">
                    Follow these 3 simple steps to connect automated payments for your bus network.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowGuideModal(false)
                  setGuideStep(0)
                  setSubStep(0)
                }}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Webhook URL Section */}
            <div className="px-6 py-3 bg-primary/5 border-b border-slate-200 shrink-0">
              <div className="max-w-xl">
                {/* Webhook URL */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Your Webhook URL
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 px-3 py-1.5 bg-white rounded-lg border border-slate-200 transition-all shadow-xs">
                      <code className="text-[12px] font-mono text-slate-600 truncate block leading-tight">
                        {WEBHOOK_URL}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyWebhook}
                      className={`shrink-0 p-2 rounded-lg transition-all duration-300 shadow-xs cursor-pointer ${copiedWebhook
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-slate-600 hover:text-primary hover:bg-white border border-slate-200'
                        } flex items-center justify-center`}
                      title="Copy Webhook URL"
                    >
                      {copiedWebhook ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side: Instructions */}
                  <div className="lg:w-1/3 space-y-6">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        Step {guideStep + 1}
                      </div>
                      <h4 className="text-[20px] font-bold text-slate-800 leading-tight">
                        {SEPAY_GUIDE_STEPS[guideStep].title}
                      </h4>
                      <p className="text-slate-600 text-[13px] leading-relaxed">
                        {SEPAY_GUIDE_STEPS[guideStep].description}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                      <h5 className="font-semibold text-slate-800 text-[13px] flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Key Benefits
                      </h5>
                      <ul className="space-y-2">
                        {[
                          'Instant transfer notification',
                          'Automatic status updates',
                          'Secure bank connection',
                          'No manual tracking needed'
                        ].map((benefit) => (
                          <li
                            key={benefit}
                            className="text-[12px] text-slate-500 flex items-center gap-1.5"
                          >
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {guideStep === 0 && (
                      <a
                        href="https://sepay.vn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-all text-xs"
                      >
                        Go to SePay Website
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Right side: Visual Guide */}
                  <div className="lg:w-2/3">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[350px] lg:h-[400px]">
                      {/* Image Viewer */}
                      <div className="flex-1 relative bg-slate-100 group flex items-center justify-center">
                        <img
                          src={SEPAY_GUIDE_STEPS[guideStep].images[subStep]}
                          alt={`Step ${guideStep + 1} visual`}
                          className="max-w-full max-h-[320px] object-contain p-4 cursor-zoom-in"
                          onClick={() => {
                            setZoomedImageUrl(SEPAY_GUIDE_STEPS[guideStep].images[subStep])
                            setShowZoomModal(true)
                          }}
                        />
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-700 shadow-md border border-white flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                            Click to zoom
                          </div>
                        </div>

                        {/* Navigation Overlay */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 pointer-events-none">
                          <button
                            type="button"
                            disabled={subStep === 0}
                            onClick={() => setSubStep(Math.max(0, subStep - 1))}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center pointer-events-auto disabled:opacity-30 hover:bg-white transition-all text-primary cursor-pointer border border-slate-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            disabled={subStep === SEPAY_GUIDE_STEPS[guideStep].images.length - 1}
                            onClick={() => setSubStep(Math.min(SEPAY_GUIDE_STEPS[guideStep].images.length - 1, subStep + 1))}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center pointer-events-auto disabled:opacity-30 hover:bg-white transition-all text-primary cursor-pointer border border-slate-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Pagination / Sub-steps */}
                      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2">
                        {SEPAY_GUIDE_STEPS[guideStep].images.map((_, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setSubStep(i)}
                            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${subStep === i ? 'w-6 bg-primary' : 'bg-slate-300 hover:bg-slate-400'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                {SEPAY_GUIDE_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${guideStep === i ? 'w-8 bg-primary' : i < guideStep ? 'w-6 bg-green-500' : 'w-6 bg-slate-200'
                      }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={guideStep === 0}
                  onClick={() => {
                    setGuideStep(guideStep - 1)
                    setSubStep(0)
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-30 transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (guideStep < SEPAY_GUIDE_STEPS.length - 1) {
                      setGuideStep(guideStep + 1)
                      setSubStep(0)
                    } else {
                      setShowGuideModal(false)
                    }
                  }}
                  className="flex-2 sm:flex-none px-8 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-blue-600 transition-all shadow-md flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                >
                  {guideStep < SEPAY_GUIDE_STEPS.length - 1 ? (
                    <>
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    'Got it!'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Image Modal */}
      {showZoomModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xs cursor-zoom-out"
          onClick={() => setShowZoomModal(false)}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <button
              type="button"
              className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
              onClick={() => setShowZoomModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={zoomedImageUrl}
              alt="Zoomed document guide"
              className="max-w-full max-h-[85vh] object-contain select-none"
            />

            <p className="mt-4 text-white/50 text-xs font-medium tracking-wide">
              Click background or close button to exit zoom
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step3Sepay
