import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSubscriptionPlans, type SubscriptionPlan } from '../../services/subscriptionService'

function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Billing cycle state: 'monthly' | 'annually'
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const data = await getSubscriptionPlans()
        setPlans(data)
      } catch (err: any) {
        console.error('Error fetching subscription plans:', err)
        setError('Failed to load subscription plans. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  // Format currency helper (VND)
  const formatPrice = (price: number, billing: 'monthly' | 'annually') => {
    if (price === 0) return 'Contact'

    // Apply 20% discount if billing is annual
    const finalPrice = billing === 'annually' ? Math.round(price * 0.8) : price
    return new Intl.NumberFormat('vi-VN').format(finalPrice) + 'đ'
  }

  // Feature comparison configuration to match the screenshot
  const comparisonFeatures = [
    {
      name: 'Number of bus fleet management',
      basic: '05',
      pro: '20',
    },
    {
      name: 'Smart scheduling management',
      basic: false,
      pro: true,
    },
    {
      name: 'Email notifications',
      basic: false,
      pro: true,
    },
    {
      name: 'Google Maps API Integration',
      basic: true,
      pro: true,
    },
    {
      name: 'Owner management application',
      basic: true,
      pro: true,
    },
  ]

  return (
    <div className="w-full min-h-screen py-12 px-4 md:px-8 font-primary bg-slate-50/50">

      {/* Header section with toggle switcher */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Flexible Plans for{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-600">
            Every Fleet Size
          </span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 font-secondary max-w-xl mx-auto leading-relaxed">
          Unlock powerful tools to manage schedules, vehicle capacities, route coordinates, and grow your transit business.
        </p>

        {/* Toggle Billing Selector */}
        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="inline-flex items-center p-1 rounded-full bg-slate-200/60 border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${billingCycle === 'annually'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Annually
            </button>
          </div>

          {/* Discount badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-xs font-bold text-primary animate-pulse">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Save 20% when billing annually
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-secondary animate-pulse">Loading pricing options...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-100 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-700 text-sm font-secondary font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Pricing Cards Grid (2 Columns - Centered & Compact) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full items-stretch">
          {plans.map((plan) => {
            const isPro = plan.isPopular || plan.code === 'PRO'

            return (
              <div
                key={plan._id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 border bg-white text-slate-800 hover:scale-[1.02] hover:shadow-xl ${isPro
                  ? 'border-2 border-primary shadow-[0_20px_50px_rgba(1,133,255,0.12)] z-10'
                  : 'border-slate-200 shadow-md'
                  }`}
              >
                {/* Popular Ribbon/Badge */}
                {isPro && (
                  <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] font-extrabold uppercase px-6 py-2 rounded-full tracking-wider shadow-md">
                    MOST POPULAR
                  </div>
                )}

                {/* Plan Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 text-center">
                      {plan.planName}
                    </h3>
                    <p className="text-xs mt-1.5 font-secondary text-slate-400 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="py-4 border-b border-slate-100 flex flex-col justify-end min-h-[90px]">
                    <div className="flex items-baseline">
                      <span className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {formatPrice(plan.price, billingCycle)}
                      </span>
                      <span className="text-xs font-semibold ml-1 text-slate-400 font-secondary">
                        / month
                      </span>
                    </div>
                    {billingCycle === 'annually' && (
                      <span className="text-[10px] text-emerald-500 font-bold font-secondary mt-1 block">
                        Billed annually (20% off)
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <ul className="space-y-3.5 text-xs font-secondary">
                      {plan.planFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-slate-600 font-medium leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call To Action Buttons based on plan tier */}
                <div className="mt-8 pt-4">
                  {isPro ? (
                    <Link
                      to={`/register/operator?planId=${plan._id}`}
                      className="w-full py-3 px-4 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block transition-all duration-300 active:scale-[0.98] bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20 hover:shadow-primary/35"
                    >
                      Get Started
                    </Link>
                  ) : (
                    <Link
                      to={`/register/operator?planId=${plan._id}`}
                      className="w-full py-3 px-4 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider block transition-all duration-300 active:scale-[0.98] border border-primary text-primary hover:bg-primary/5"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Feature Comparison Section ("So sánh chi tiết tính năng") */}
      {!loading && !error && (
        <div className="w-full mt-24">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-primary">
              Detailed Feature Comparison
            </h2>
            <p className="text-xs text-slate-400 font-secondary mt-1">
              Compare features and limits side by side to pick the best tier.
            </p>
          </div>

          {/* Table Container */}
          <div className="w-full bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs md:text-sm font-secondary">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 md:p-5 font-bold text-slate-500 w-[50%]">Features</th>
                  <th className="p-4 md:p-5 font-bold text-slate-600 text-center">Basic Coach</th>
                  <th className="p-4 md:p-5 font-bold text-primary text-center">Professional Fleet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors duration-200">
                    <td className="p-4 md:p-5 font-semibold text-slate-700">{row.name}</td>

                    {/* Basic Coach column */}
                    <td className="p-4 md:p-5 text-center text-slate-500 font-medium">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <svg className="w-5 h-5 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )
                      ) : (
                        row.basic
                      )}
                    </td>

                    {/* Professional Fleet column */}
                    <td className="p-4 md:p-5 text-center text-slate-900 font-extrabold">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <svg className="w-5 h-5 text-primary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-slate-300 font-normal">—</span>
                        )
                      ) : (
                        row.pro
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="w-full mt-24 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400 font-secondary mt-1">
            Answers to common queries about BusNet transit subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 font-primary">
              How do I subscribe?
            </h4>
            <p className="text-xs text-slate-500 font-secondary leading-relaxed">
              Click the select button for your target plan to go to the operator registration form. Once details and business files are verified by our support representatives, your selected package capabilities will activate.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 font-primary">
              Can I upgrade or downgrade?
            </h4>
            <p className="text-xs text-slate-500 font-secondary leading-relaxed">
              Yes, modifications to plan levels can be performed mid-cycle. Limits (maximum buses and routing allowances) expand immediately upon processing upgrades.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 font-primary">
              Are there ticket fees?
            </h4>
            <p className="text-xs text-slate-500 font-secondary leading-relaxed">
              No, there are no transaction or ticketing commissions. You retain 100% of your sales revenues, paying only the flat subscription cycle amount.
            </p>
          </div>

          <div className="space-y-2 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 font-primary">
              Can I purchase extra accounts?
            </h4>
            <p className="text-xs text-slate-500 font-secondary leading-relaxed">
              Yes, if you need extra vehicle count or staff users, we can design custom extensions. Contact our sales representatives via Enterprise enquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage
