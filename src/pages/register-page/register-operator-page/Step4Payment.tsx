import React, { useState } from 'react'

interface Step4PaymentProps {
  transaction: {
    _id: string
    amount: number
    content: string
    status: string
    qrUrl: string
    adminBank?: string
    adminVa?: string
  }
  timeLeft: number
  formatTime: (seconds: number) => string
  onCheckStatus: () => Promise<void>
}

const Step4Payment: React.FC<Step4PaymentProps> = ({ transaction, timeLeft, formatTime, onCheckStatus }) => {
  const [isChecking, setIsChecking] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleManualCheck = async () => {
    setIsChecking(true)
    setStatusMessage('')
    try {
      await onCheckStatus()
      // If it doesn't transition (meaning still pending)
      setStatusMessage('We have not received your payment yet. If you just transferred, please wait 1-2 minutes for the system to process.')
      // Auto clear message after 6 seconds
      setTimeout(() => setStatusMessage(''), 6000)
    } catch (err) {
      setStatusMessage('Failed to check status. Please check your network connection.')
    } finally {
      setIsChecking(false)
    }
  }
  return (
    <div className="w-full max-w-full mx-auto my-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-[18px] text-slate-900 font-extrabold uppercase tracking-wide">
          Complete Subscription Activation
        </h1>
        <p className="text-slate-400 text-[13px] font-secondary">
          Transfer subscription fee to activate your bus operator workspace
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 justify-center pt-2">
        {/* Dynamic VietQR Image */}
        <div className="relative group p-2 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-pulse-slow">
          <img src={transaction.qrUrl} alt="VietQR Payment Code" className="w-[200px] h-[200px] object-contain" />
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl"></div>
        </div>

        {/* Transfer specifications */}
        <div className="flex-1 text-left space-y-3.5 font-secondary text-[13.5px] text-slate-700">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">Amount to Transfer</span>
            <p className="text-[24px] font-black text-slate-900">
              {transaction.amount.toLocaleString()} <span className="text-[14px] font-bold text-slate-500">VND</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
              Transfer Content (Must be exact)
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-900 font-extrabold border border-slate-200 select-all uppercase">
                {transaction.content}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">Receiver Info</span>
            <p className="font-medium text-slate-900">BusNet System (Admin account)</p>
            <p className="text-slate-500">
              Bank: {transaction.adminBank === 'BIDV'
                ? 'BIDV (Ngân hàng TMCP Đầu tư và Phát triển Việt Nam)'
                : (transaction.adminBank || 'MBBank (Military Commercial Joint Stock Bank)')}
            </p>
            <p className="text-slate-500">Account: {transaction.adminVa || '1023456789'}</p>
          </div>
        </div>
      </div>

      {/* Polling / Waiting Indicator */}
      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-5.5 h-5.5 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[14px] font-semibold text-primary">Waiting for payment confirmation...</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-[12px] font-secondary">
          <span>Your QR code is valid for:</span>
          <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="pt-2 w-full max-w-xs flex flex-col items-center">
          <button
            type="button"
            disabled={isChecking}
            onClick={handleManualCheck}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[13px] tracking-wide active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isChecking ? 'CHECKING STATUS...' : 'I HAVE TRANSFERRED - CHECK STATUS'}
          </button>
          
          {statusMessage && (
            <p className="mt-2.5 text-[12px] text-amber-600 font-medium text-center leading-relaxed animate-fade-in">
              ⚠️ {statusMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step4Payment
