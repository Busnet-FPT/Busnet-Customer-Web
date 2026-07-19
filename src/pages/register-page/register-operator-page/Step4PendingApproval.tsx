import React from 'react'
import { Link } from 'react-router-dom'

interface Step4PendingApprovalProps {
  email: string
  operatorName: string
}

const Step4PendingApproval: React.FC<Step4PendingApprovalProps> = ({ email, operatorName }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-4 flex flex-col items-center text-center space-y-8 animate-fade-in">
      {/* Animated Clock Icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-amber-100/60 animate-ping opacity-75"></div>
        <div className="relative w-24 h-24 rounded-full bg-linear-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 border-4 border-white">
          <svg className="w-12 h-12 stroke-white stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Headline & Description */}
      <div className="space-y-3">
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 font-primary">
          Registration Submitted!
        </h1>
        <p className="text-[14px] text-slate-500 font-secondary max-w-md mx-auto leading-relaxed">
          Thank you, <span className="text-slate-900 font-semibold">{operatorName}</span>! Your registration has been submitted successfully.
          A confirmation email has been sent to{' '}
          <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{email}</span>.
        </p>
      </div>

      {/* Status Card */}
      <div className="w-full bg-linear-to-b from-white to-slate-50/50 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-100/50 p-6 md:p-8 text-left space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-400 font-primary">
            Review Status
          </span>
          <span className="bg-amber-50 text-amber-700 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-100 uppercase tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-[13px] text-slate-700 font-bold font-secondary block">Business License Under Review</span>
              <span className="text-[12.5px] text-slate-500 font-secondary leading-relaxed block">
                Our admin team is reviewing your business license. This process typically takes up to <strong className="text-slate-700">48 hours</strong>.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-[13px] text-slate-700 font-bold font-secondary block">Email Notification</span>
              <span className="text-[12.5px] text-slate-500 font-secondary leading-relaxed block">
                You will receive an email at <strong className="text-slate-700">{email}</strong> once your license has been reviewed.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-[13px] text-slate-700 font-bold font-secondary block">Continue Registration</span>
              <span className="text-[12.5px] text-slate-500 font-secondary leading-relaxed block">
                After approval, return to this page and use <strong className="text-slate-700">"Continue Registration"</strong> to complete the payment setup.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md font-primary pt-2 text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            to="/"
            className="flex-1 rounded-full btn-premium-gradient py-3 text-[14px] font-extrabold text-white text-center shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            RETURN HOME
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Step4PendingApproval
