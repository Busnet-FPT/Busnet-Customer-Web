import React from 'react'
import { type SubscriptionPlan } from '../../../services/subscriptionService'

interface Step1PlanProps {
  plans: SubscriptionPlan[]
  selectedPlanId: string
  onSelectPlan: (plan: SubscriptionPlan) => void
  isLoading: boolean
  error?: string
}

const Step1Plan: React.FC<Step1PlanProps> = ({
  plans,
  selectedPlanId,
  onSelectPlan,
  isLoading,
  error
}) => {
  return (
    <div className="w-full max-w-full mx-auto space-y-6 my-auto">
      <div className="text-center space-y-1">
        <h1 className="text-[18px] text-slate-900 font-extrabold uppercase tracking-wider">
          Choose Subscription Plan
        </h1>
        <p className="text-slate-400 text-[13px] font-secondary">
          Select the most suitable tier for your business
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400 font-secondary text-[14px]">
          Loading available plans...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {plans.map((plan) => (
            <div
              key={plan._id}
              onClick={() => onSelectPlan(plan)}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col bg-slate-50/20 hover:bg-slate-50/50 hover:shadow-xl ${
                selectedPlanId === plan._id
                  ? 'border-primary ring-4 ring-primary/10 bg-white'
                  : 'border-slate-100 bg-white'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-6 rounded-full bg-linear-to-r from-primary to-blue-600 px-3.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                  Popular Choice
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-extrabold text-slate-900">{plan.planName}</h3>
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                    {selectedPlanId === plan._id && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-scale-up"></span>
                    )}
                  </div>
                </div>
                <p className="text-slate-400 text-[12.5px] font-secondary leading-relaxed min-h-[50px]">
                  {plan.description}
                </p>
                <div className="pt-2">
                  <span className="text-[26px] font-black text-slate-900">
                    {plan.price.toLocaleString()}{' '}
                    <span className="text-[14px] font-medium text-slate-400">VND / month</span>
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 my-4"></div>

              <ul className="space-y-2.5 text-left text-[13px] text-slate-600 font-secondary">
                {plan.planFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-emerald-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-[13px] text-center font-secondary">{error}</p>}
    </div>
  )
}

export default Step1Plan
