import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getSubscriptionPlans, type SubscriptionPlan } from '../../../services/subscriptionService'
import {
  submitOperatorRegistration,
  continueOperatorRegistration,
  completeOperatorPayment,
  resubmitLicense,
  getSubscriptionStatus,
  type RegisterOperatorData,
  type CompletePaymentData
} from '../../../services/authService'
import { toast } from 'react-hot-toast'
import Step1Plan from './Step1Plan'
import Step2Profile from './Step2Profile'
import Step3License from './Step3License'
import Step3Sepay from './Step3Sepay'
import Step4Payment from './Step4Payment'
import Step4PendingApproval from './Step4PendingApproval'
import Step5Success from './Step5Success'

type FlowMode = 'new' | 'continue'

function RegisterOperatorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planIdParam = searchParams.get('planId') || ''

  // Flow mode: 'new' = fresh registration, 'continue' = returning partner
  const [flowMode, setFlowMode] = useState<FlowMode>('new')

  // ========== NEW REGISTRATION FLOW ==========
  // Steps: 1=Plan, 2=Profile, 3=License, 4=PendingApproval
  const [currentStep, setCurrentStep] = useState(1)

  // API Lists & Selections
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  // Step 2 Form (Account & Operator Details)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [operatorPhone, setOperatorPhone] = useState('')
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [cancellationPolicy, setCancellationPolicy] = useState('')
  const [luggagePolicy, setLuggagePolicy] = useState('')
  const [childrenPolicy, setChildrenPolicy] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [coverImage, setCoverImage] = useState('')

  // Step 3: Business License
  const [businessLicense, setBusinessLicense] = useState('')

  // ========== CONTINUE REGISTRATION FLOW ==========
  // Steps: 1=SePay, 2=Payment, 3=Success
  const [continueStep, setContinueStep] = useState(0) // 0=login form, 1=sepay, 2=payment, 3=success

  // Continue login form
  const [continueEmail, setContinueEmail] = useState('')
  const [continuePassword, setContinuePassword] = useState('')
  const [licenseStatus, setLicenseStatus] = useState<string>('')
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [continueOperatorName, setContinueOperatorName] = useState('')

  // SePay Form (for continue flow)
  const [bankName, setBankName] = useState('')
  const [bankNumber, setBankNumber] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [sepayVa, setSepayVa] = useState('')
  const [sepayKey, setSepayKey] = useState('')

  // Step Payment (for continue flow)
  const [transaction, setTransaction] = useState<{
    _id: string
    amount: number
    content: string
    status: string
    qrUrl: string
  } | null>(null)

  // Resubmit license
  const [resubmitLicenseUrl, setResubmitLicenseUrl] = useState('')

  // UI States
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Polling & Countdown
  const [timeLeft, setTimeLeft] = useState(900)
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cleanupIntervals = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }

  // Fetch plans on mount
  useEffect(() => {
    if (licenseStatus) {
      console.log('Current license status:', licenseStatus)
    }
    const fetchPlans = async () => {
      try {
        setIsLoading(true)
        const data = await getSubscriptionPlans()
        setPlans(data.filter(p => p.status === 'ACTIVE'))
        setIsLoading(false)
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setIsLoading(false)
        setApiError('Failed to fetch subscription plans. Please try again.')
      }
    }
    fetchPlans()
  }, [])

  // Pre-fill plan from URL
  useEffect(() => {
    if (planIdParam && plans.length > 0) {
      const matched = plans.find(p => p._id === planIdParam)
      if (matched) {
        setSelectedPlanId(matched._id)
        setSelectedPlan(matched)
      }
    }
  }, [planIdParam, plans])

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan._id)
    setSelectedPlan(plan)
    setErrors(prev => ({ ...prev, plan: '' }))
  }

  // Countdown & Polling for Payment step
  useEffect(() => {
    if (continueStep === 2 && transaction) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!)
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await getSubscriptionStatus(transaction._id)
          if (statusRes.success && statusRes.data.status === 'SUCCESS') {
            cleanupIntervals()
            setContinueStep(3)
          } else if (statusRes.success && statusRes.data.status === 'FAILED') {
            cleanupIntervals()
            setApiError('Payment verification failed. Please check the amount and transfer details.')
          }
        } catch (err) {
          console.error('Error polling payment status:', err)
        }
      }, 5000)
    }

    return () => cleanupIntervals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continueStep, transaction])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // ========== VALIDATION ==========
  const validateStep2 = () => {
    const tempErrors: { [key: string]: string } = {}

    if (!fullName.trim()) tempErrors.fullName = 'Representative Name is required'
    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required'
    } else if (!/^0\d{9}$/.test(phone.trim())) {
      tempErrors.phone = 'Phone number must be exactly 10 digits and start with 0'
    }
    if (!email.trim()) {
      tempErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email address'
    }
    if (!password) {
      tempErrors.password = 'Password is required'
    } else {
      if (password.length < 7) tempErrors.password = 'Password must be at least 7 characters'
      if (!/[A-Z]/.test(password)) tempErrors.password = 'Password must contain at least one uppercase letter'
      if (!/\d/.test(password)) tempErrors.password = 'Password must contain at least one number'
      // eslint-disable-next-line no-useless-escape
      if (!/[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\';]/.test(password)) tempErrors.password = 'Password must contain at least one special character'
    }
    if (password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match'

    if (!operatorName.trim()) tempErrors.operatorName = 'Company / Operator Name is required'
    if (!operatorPhone.trim()) {
      tempErrors.operatorPhone = 'Operator contact phone is required'
    } else if (!/^0\d{9}$/.test(operatorPhone.trim())) {
      tempErrors.operatorPhone = 'Operator phone must be exactly 10 digits and start with 0'
    }
    if (!taxCode.trim()) tempErrors.taxCode = 'Tax code / License ID is required'
    if (!description.trim()) tempErrors.description = 'Company description/introduction is required'

    if (!profilePicture.trim()) {
      tempErrors.profilePicture = 'Profile logo URL is required'
    } else if (!/^https?:\/\/.+/.test(profilePicture.trim())) {
      tempErrors.profilePicture = 'Logo URL must start with http:// or https://'
    }
    if (!coverImage.trim()) {
      tempErrors.coverImage = 'Cover banner URL is required'
    } else if (!/^https?:\/\/.+/.test(coverImage.trim())) {
      tempErrors.coverImage = 'Cover URL must start with http:// or https://'
    }

    if (amenities.length === 0) tempErrors.amenities = 'Please select at least one amenity'

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const validateStep3License = () => {
    const tempErrors: { [key: string]: string } = {}
    if (!businessLicense.trim()) {
      tempErrors.businessLicense = 'Business license is required'
    } else if (!/^https?:\/\/.+/.test(businessLicense.trim())) {
      tempErrors.businessLicense = 'Business license URL must start with http:// or https://'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const validateSepay = () => {
    const tempErrors: { [key: string]: string } = {}
    if (!bankName) tempErrors.bankName = 'Please select a receiving bank'
    if (!bankNumber.trim()) tempErrors.bankNumber = 'Bank account number is required'
    if (!bankAccountName.trim()) tempErrors.bankAccountName = 'Bank account holder name is required'
    if (!sepayVa.trim()) tempErrors.sepayVa = 'SePay Virtual Account (VA) is required'
    if (!sepayKey.trim()) tempErrors.sepayKey = 'SePay API Key is required'
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  // ========== NEW REGISTRATION ACTIONS ==========
  const handleSubmitRegistration = async () => {
    setApiError('')
    setIsLoading(true)

    const payload: RegisterOperatorData = {
      email,
      password,
      fullName,
      phone,
      operatorName,
      taxCode,
      planId: selectedPlanId,
      operatorPhone: operatorPhone || undefined,
      description: description || undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
      policies: (cancellationPolicy || luggagePolicy || childrenPolicy) ? {
        cancellation: cancellationPolicy || undefined,
        luggage: luggagePolicy || undefined,
        children: childrenPolicy || undefined
      } : undefined,
      profilePicture: profilePicture || undefined,
      coverImage: coverImage || undefined,
      businessLicense: businessLicense || undefined
    }

    try {
      const result = await submitOperatorRegistration(payload)
      if (result.success) {
        setCurrentStep(4) // Go to Pending Approval
        toast.success('Registration submitted! Your license is under review.')
      } else {
        const errMsg = result.message || 'Registration failed. Please try again.'
        setApiError(errMsg)
        toast.error(errMsg)
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.response?.data?.message) {
        setApiError(err.response.data.message)
        toast.error(err.response.data.message)
      } else {
        const errMsg = 'An error occurred during registration. Please check your credentials.'
        setApiError(errMsg)
        toast.error(errMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ========== CONTINUE REGISTRATION ACTIONS ==========
  const handleContinueLogin = async () => {
    setApiError('')
    if (!continueEmail.trim() || !continuePassword.trim()) {
      setApiError('Please enter both email and password.')
      return
    }
    setIsLoading(true)
    try {
      const result = await continueOperatorRegistration(continueEmail, continuePassword)
      if (result.success) {
        setLicenseStatus(result.data.licenseStatus)
        setRejectionReason(result.data.rejectionReason || '')
        setContinueOperatorName(result.data.partnerInfo.operatorName)

        if (result.data.licenseStatus === 'APPROVED') {
          setContinueStep(1) // Go to SePay step
          toast.success('License approved! Complete your payment setup.')
        } else if (result.data.licenseStatus === 'REJECTED') {
          setContinueStep(-1) // Show rejection + resubmit
          toast.error('Your license was not approved.')
        } else {
          setContinueStep(-2) // Still pending
          toast('Your license is still under review.', { icon: '⏳' })
        }
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errMsg = err.response?.data?.message || 'Failed to check registration status.'
      setApiError(errMsg)
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompletePayment = async () => {
    setApiError('')
    setIsLoading(true)

    const payload: CompletePaymentData = {
      email: continueEmail,
      password: continuePassword,
      bankName,
      bankNumber,
      bankAccountName,
      bankBranch,
      sepayVa,
      sepayKey
    }

    try {
      const result = await completeOperatorPayment(payload)
      if (result.success && result.data.transaction) {
        setTransaction(result.data.transaction)
        setTimeLeft(900)
        setContinueStep(2) // Go to Payment
        toast.success('Payment transaction created! Complete the payment.')
      } else {
        const errMsg = result.message || 'Failed to create payment.'
        setApiError(errMsg)
        toast.error(errMsg)
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errMsg = err.response?.data?.message || 'An error occurred.'
      setApiError(errMsg)
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResubmitLicense = async () => {
    setApiError('')
    if (!resubmitLicenseUrl.trim()) {
      setApiError('Please upload or paste a new business license URL.')
      return
    }
    setIsLoading(true)
    try {
      const result = await resubmitLicense(continueEmail, continuePassword, resubmitLicenseUrl)
      if (result.success) {
        setContinueStep(-2) // Back to pending status
        setLicenseStatus('PENDING')
        setResubmitLicenseUrl('')
        toast.success('License resubmitted! It will be reviewed again.')
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errMsg = err.response?.data?.message || 'Failed to resubmit license.'
      setApiError(errMsg)
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = async () => {
    if (!transaction) return
    try {
      const statusRes = await getSubscriptionStatus(transaction._id)
      if (statusRes.success && statusRes.data.status === 'SUCCESS') {
        cleanupIntervals()
        setContinueStep(3)
      } else if (statusRes.success && statusRes.data.status === 'FAILED') {
        cleanupIntervals()
        setApiError('Payment verification failed.')
      }
    } catch (err) {
      console.error('Error checking payment status:', err)
    }
  }

  // ========== STEP NAVIGATION (New Registration) ==========
  const handleNextStep = () => {
    setApiError('')
    if (currentStep === 1) {
      if (!selectedPlanId) {
        setErrors({ plan: 'Please select a subscription plan' })
        toast.error('Please select a subscription plan')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3)
      } else {
        toast.error('Please resolve the profile verification errors.')
      }
    } else if (currentStep === 3) {
      if (validateStep3License()) {
        handleSubmitRegistration()
      } else {
        toast.error('Please upload your business license.')
      }
    }
  }

  const handlePrevStep = () => {
    setApiError('')
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1)
    }
  }

  // ========== STEPPER LABELS ==========
  const newStepLabels = ['Plan', 'Profile', 'License', 'Review']
  const continueStepLabels = ['SePay', 'Payment', 'Success']

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
      <div className="w-full pt-8 md:pt-10 pb-6 md:pb-8 px-6 md:px-8 flex flex-col justify-between bg-white relative transition-all duration-500">

        {/* Top Brand Logo */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex shrink-0">
            <img src="/images/logo.jpg" alt="BusNet Logo" className="w-9 h-9 object-cover rounded-xl shadow-md border border-slate-100" />
          </div>
          <span className="brand-logo text-slate-800 font-extrabold tracking-tight">
            Bus<span className="text-primary">Net</span>
          </span>
        </div>

        {/* Flow Mode Toggle (only show at beginning) */}
        {flowMode === 'new' && currentStep < 4 && continueStep === 0 && (
          <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100/80 rounded-2xl w-fit font-secondary">
            <button
              onClick={() => { setFlowMode('new'); setApiError('') }}
              className="px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 bg-white text-primary shadow-sm"
            >
              New Registration
            </button>
            <button
              onClick={() => { setFlowMode('continue'); setApiError('') }}
              className="px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 text-slate-500 hover:text-slate-700"
            >
              Continue Registration
            </button>
          </div>
        )}
        {flowMode === 'continue' && continueStep <= 0 && (
          <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100/80 rounded-2xl w-fit font-secondary">
            <button
              onClick={() => { setFlowMode('new'); setApiError(''); setContinueStep(0); setLicenseStatus('') }}
              className="px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 text-slate-500 hover:text-slate-700"
            >
              New Registration
            </button>
            <button
              onClick={() => { setFlowMode('continue'); setApiError('') }}
              className="px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 bg-white text-primary shadow-sm"
            >
              Continue Registration
            </button>
          </div>
        )}

        {/* Stepper for NEW registration */}
        {flowMode === 'new' && currentStep < 4 && (
          <div className="w-full flex items-center justify-between mb-8 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 font-secondary text-[12.5px] font-extrabold uppercase text-slate-400">
            {newStepLabels.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2.5 ${currentStep >= idx + 1 ? 'text-primary' : ''}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${currentStep >= idx + 1 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>{idx + 1}</span>
                  {label}
                </div>
                {idx < newStepLabels.length - 1 && (
                  <span className={`h-px w-8 md:w-16 mx-2 md:mx-4 transition-all duration-300 ${currentStep >= idx + 2 ? 'bg-primary' : 'bg-slate-100'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stepper for CONTINUE registration */}
        {flowMode === 'continue' && continueStep >= 1 && continueStep < 3 && (
          <div className="w-full flex items-center justify-between mb-8 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 font-secondary text-[12.5px] font-extrabold uppercase text-slate-400">
            {continueStepLabels.map((label, idx) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center gap-2.5 ${continueStep >= idx + 1 ? 'text-primary' : ''}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${continueStep >= idx + 1 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>{idx + 1}</span>
                  {label}
                </div>
                {idx < continueStepLabels.length - 1 && (
                  <span className={`h-px w-8 md:w-16 mx-2 md:mx-4 transition-all duration-300 ${continueStep >= idx + 2 ? 'bg-primary' : 'bg-slate-100'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* API Error Messages */}
        {apiError && (
          <div className="p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-secondary text-left flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{apiError}</span>
          </div>
        )}

        {/* ========== NEW REGISTRATION VIEWS ========== */}
        {flowMode === 'new' && (
          <>
            {currentStep === 1 && (
              <Step1Plan plans={plans} selectedPlanId={selectedPlanId} onSelectPlan={handleSelectPlan} isLoading={isLoading} error={errors.plan} />
            )}
            {currentStep === 2 && (
              <Step2Profile
                operatorName={operatorName} setOperatorName={setOperatorName}
                fullName={fullName} setFullName={setFullName}
                taxCode={taxCode} setTaxCode={setTaxCode}
                phone={phone} setPhone={setPhone}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                operatorPhone={operatorPhone} setOperatorPhone={setOperatorPhone}
                description={description} setDescription={setDescription}
                amenities={amenities} setAmenities={setAmenities}
                cancellationPolicy={cancellationPolicy} setCancellationPolicy={setCancellationPolicy}
                luggagePolicy={luggagePolicy} setLuggagePolicy={setLuggagePolicy}
                childrenPolicy={childrenPolicy} setChildrenPolicy={setChildrenPolicy}
                profilePicture={profilePicture} setProfilePicture={setProfilePicture}
                coverImage={coverImage} setCoverImage={setCoverImage}
                errors={errors}
              />
            )}
            {currentStep === 3 && (
              <Step3License businessLicense={businessLicense} setBusinessLicense={setBusinessLicense} errors={errors} />
            )}
            {currentStep === 4 && (
              <Step4PendingApproval email={email} operatorName={operatorName} />
            )}

            {/* Navigation Buttons (New Registration) */}
            {currentStep < 4 && (
              <div className="flex items-center gap-3 w-full pt-6 border-t border-slate-100">
                {currentStep === 1 ? (
                  <button type="button" onClick={() => navigate(-1)} disabled={isLoading}
                    className="flex-1 rounded-full border border-slate-200 text-slate-700 py-2.5 text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50">
                    BACK
                  </button>
                ) : (
                  <button type="button" onClick={handlePrevStep} disabled={isLoading}
                    className="flex-1 rounded-full border border-slate-200 text-slate-700 py-2.5 text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50">
                    PREVIOUS
                  </button>
                )}
                <button type="button" onClick={handleNextStep} disabled={isLoading}
                  className="flex-1 rounded-full btn-premium-gradient py-2.5 text-[14px] font-bold cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-75">
                  {isLoading ? 'PROCESSING...' : currentStep === 3 ? 'SUBMIT REGISTRATION' : 'NEXT STEP'}
                </button>
              </div>
            )}
          </>
        )}

        {/* ========== CONTINUE REGISTRATION VIEWS ========== */}
        {flowMode === 'continue' && (
          <>
            {/* Login Form */}
            {continueStep === 0 && (
              <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-[22px] font-extrabold text-slate-900 font-primary tracking-tight">Continue Registration</h2>
                  <p className="text-[13.5px] text-slate-500 font-secondary">Enter your registered email and password to continue.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">Email</label>
                    <input type="email" placeholder="your@email.com" value={continueEmail} onChange={(e) => setContinueEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">Password</label>
                    <input type="password" placeholder="••••••••" value={continuePassword} onChange={(e) => setContinuePassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
                  </div>
                  <button type="button" onClick={handleContinueLogin} disabled={isLoading}
                    className="w-full rounded-full btn-premium-gradient py-2.5 text-[14px] font-bold cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-75">
                    {isLoading ? 'CHECKING...' : 'CONTINUE'}
                  </button>
                </div>
              </div>
            )}

            {/* Status: Still Pending */}
            {continueStep === -2 && (
              <Step4PendingApproval email={continueEmail} operatorName={continueOperatorName} />
            )}

            {/* Status: Rejected - Resubmit */}
            {continueStep === -1 && (
              <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/20 border-2 border-white">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-[22px] font-extrabold text-slate-900 font-primary tracking-tight">License Not Approved</h2>
                  <p className="text-[13.5px] text-slate-500 font-secondary max-w-md mx-auto">Your business license was not approved. Please review the reason below and resubmit a valid document.</p>
                </div>

                {rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <p className="text-[14px] text-red-700 font-semibold font-secondary">
                      📋 <strong>Reason:</strong> {rejectionReason}
                    </p>
                  </div>
                )}

                <Step3License businessLicense={resubmitLicenseUrl} setBusinessLicense={setResubmitLicenseUrl} errors={errors} />

                <div className="flex items-center gap-3 w-full pt-4">
                  <button type="button" onClick={() => { setContinueStep(0); setLicenseStatus(''); setApiError('') }}
                    className="flex-1 rounded-full border border-slate-200 text-slate-700 py-2.5 text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98]">
                    BACK
                  </button>
                  <button type="button" onClick={handleResubmitLicense} disabled={isLoading}
                    className="flex-1 rounded-full btn-premium-gradient py-2.5 text-[14px] font-bold cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-75">
                    {isLoading ? 'RESUBMITTING...' : 'RESUBMIT LICENSE'}
                  </button>
                </div>
              </div>
            )}

            {/* Continue Step 1: SePay Config */}
            {continueStep === 1 && (
              <>
                <Step3Sepay
                  bankName={bankName} setBankName={setBankName}
                  bankNumber={bankNumber} setBankNumber={setBankNumber}
                  bankAccountName={bankAccountName} setBankAccountName={setBankAccountName}
                  bankBranch={bankBranch} setBankBranch={setBankBranch}
                  sepayVa={sepayVa} setSepayVa={setSepayVa}
                  sepayKey={sepayKey} setSepayKey={setSepayKey}
                  errors={errors}
                />
                <div className="flex items-center gap-3 w-full pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => { setContinueStep(0); setApiError('') }}
                    className="flex-1 rounded-full border border-slate-200 text-slate-700 py-2.5 text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98]">
                    BACK
                  </button>
                  <button type="button" onClick={() => {
                    if (validateSepay()) handleCompletePayment()
                    else toast.error('Please resolve the bank/payment credential errors.')
                  }} disabled={isLoading}
                    className="flex-1 rounded-full btn-premium-gradient py-2.5 text-[14px] font-bold cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-75">
                    {isLoading ? 'PROCESSING...' : 'SUBMIT & PAY'}
                  </button>
                </div>
              </>
            )}

            {/* Continue Step 2: Payment */}
            {continueStep === 2 && transaction && (
              <Step4Payment transaction={transaction} timeLeft={timeLeft} formatTime={formatTime} onCheckStatus={checkPaymentStatus} />
            )}

            {/* Continue Step 3: Success */}
            {continueStep === 3 && (
              <Step5Success email={continueEmail} operatorName={continueOperatorName} sepayVa={sepayVa} selectedPlan={selectedPlan} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterOperatorPage