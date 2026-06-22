import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getSubscriptionPlans, type SubscriptionPlan } from '../../../services/subscriptionService'
import { registerOperator, getSubscriptionStatus, type RegisterOperatorData } from '../../../services/authService'
import { toast } from 'react-hot-toast'
import Step1Plan from './Step1Plan'
import Step2Profile from './Step2Profile'
import Step3Sepay from './Step3Sepay'
import Step4Payment from './Step4Payment'
import Step5Success from './Step5Success'

function RegisterOperatorPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planIdParam = searchParams.get('planId') || ''

  // Form Steps: 1 to 5
  const [currentStep, setCurrentStep] = useState(1)

  // API Lists & Selections
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)

  // Step 2 Form (Account & Operator Details)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('') // Legal Representative
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

  // Step 3 Form (Bank & SePay Settings)
  const [bankName, setBankName] = useState('')
  const [bankNumber, setBankNumber] = useState('')
  const [bankAccountName, setBankAccountName] = useState('')
  const [bankBranch, setBankBranch] = useState('')
  const [sepayVa, setSepayVa] = useState('')
  const [sepayKey, setSepayKey] = useState('')

  // Step 4 Details (API Transaction Response)
  const [transaction, setTransaction] = useState<{
    _id: string
    amount: number
    content: string
    status: string
    qrUrl: string
  } | null>(null)

  // UI States
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Polling & Countdown Ref
  const [timeLeft, setTimeLeft] = useState(900) // 15 mins
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Declare cleanup function first to avoid ESLint TDZ issues
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

  // Fetch active plans on mount
  useEffect(() => {
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

  // Pre-fill plan from URL query parameters
  useEffect(() => {
    if (planIdParam && plans.length > 0) {
      const matched = plans.find(p => p._id === planIdParam)
      if (matched) {
        setSelectedPlanId(matched._id)
        setSelectedPlan(matched)
      }
    }
  }, [planIdParam, plans])

  // Handle plan selection
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan._id)
    setSelectedPlan(plan)
    setErrors(prev => ({ ...prev, plan: '' }))
  }

  // Countdown & Polling triggers on Step 4
  useEffect(() => {
    if (currentStep === 4 && transaction) {
      // Start Countdown
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

      // Start Status Polling every 5 seconds
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await getSubscriptionStatus(transaction._id)
          if (statusRes.success && statusRes.data.status === 'SUCCESS') {
            cleanupIntervals()
            setCurrentStep(5)
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
  }, [currentStep, transaction])

  // Format countdown timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Validate Step 2 Form
  const validateStep2 = () => {
    const tempErrors: { [key: string]: string } = {}

    // --- Tab 1: Account ---
    if (!fullName.trim()) {
      tempErrors.fullName = 'Representative Name is required'
    }
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
      if (password.length < 7) {
        tempErrors.password = 'Password must be at least 7 characters'
      }
      if (!/[A-Z]/.test(password)) {
        tempErrors.password = 'Password must contain at least one uppercase letter'
      }
      if (!/\d/.test(password)) {
        tempErrors.password = 'Password must contain at least one number'
      }
      // eslint-disable-next-line no-useless-escape
      if (!/[!@#$%^&*(),.?":{}|<>_+\-=\[\]\\';]/.test(password)) {
        tempErrors.password = 'Password must contain at least one special character'
      }
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match'
    }

    // --- Tab 2: Company Info ---
    if (!operatorName.trim()) {
      tempErrors.operatorName = 'Company / Operator Name is required'
    }
    if (!operatorPhone.trim()) {
      tempErrors.operatorPhone = 'Operator contact phone is required'
    } else if (!/^0\d{9}$/.test(operatorPhone.trim())) {
      tempErrors.operatorPhone = 'Operator phone must be exactly 10 digits and start with 0'
    }
    if (!taxCode.trim()) {
      tempErrors.taxCode = 'Tax code / License ID is required'
    }
    if (!description.trim()) {
      tempErrors.description = 'Company description/introduction is required'
    }

    // --- Tab 3: Branding ---
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

    // --- Tab 4: Amenities & Policies ---
    if (amenities.length === 0) {
      tempErrors.amenities = 'Please select at least one amenity'
    }


    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  // Validate Step 3 Form
  const validateStep3 = () => {
    const tempErrors: { [key: string]: string } = {}

    if (!bankName) {
      tempErrors.bankName = 'Please select a receiving bank'
    }
    if (!bankNumber.trim()) {
      tempErrors.bankNumber = 'Bank account number is required'
    }
    if (!bankAccountName.trim()) {
      tempErrors.bankAccountName = 'Bank account holder name is required'
    }
    if (!sepayVa.trim()) {
      tempErrors.sepayVa = 'SePay Virtual Account (VA) is required'
    }
    if (!sepayKey.trim()) {
      tempErrors.sepayKey = 'SePay API Key is required'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  // Submit all operator registration data
  const handleRegisterOperator = async () => {
    setApiError('')
    setIsLoading(true)

    const payload: RegisterOperatorData = {
      email,
      password,
      fullName,
      phone,
      operatorName,
      taxCode,
      bankName,
      bankNumber,
      bankAccountName,
      bankBranch,
      sepayVa,
      sepayKey,
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
      coverImage: coverImage || undefined
    }

    try {
      const result = await registerOperator(payload)
      if (result.success && result.data.transaction) {
        setTransaction(result.data.transaction)
        setTimeLeft(900) // Reset countdown timer inside event handler rather than useEffect
        setCurrentStep(4)
        toast.success('Registration data saved! Please complete the transaction payment.')
      } else {
        const errMsg = result.message || 'Registration failed. Please try again.'
        setApiError(errMsg)
        toast.error(errMsg)
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.response && err.response.data && err.response.data.message) {
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

  const checkPaymentStatus = async () => {
    if (!transaction) return
    try {
      const statusRes = await getSubscriptionStatus(transaction._id)
      if (statusRes.success && statusRes.data.status === 'SUCCESS') {
        cleanupIntervals()
        setCurrentStep(5)
      } else if (statusRes.success && statusRes.data.status === 'FAILED') {
        cleanupIntervals()
        setApiError('Payment verification failed. Please check the amount and transfer details.')
      }
    } catch (err) {
      console.error('Error checking payment status:', err)
      throw err
    }
  }

  // Navigations between steps
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
      if (validateStep3()) {
        handleRegisterOperator()
      } else {
        toast.error('Please resolve the bank/payment credential errors.')
      }
    }
  }

  const handlePrevStep = () => {
    setApiError('')
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100/80 animate-fade-in my-4 font-primary">
      {/* Form View Wizard */}
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

        {/* Stepper Indicators */}
        {currentStep < 5 && (
          <div className="w-full flex items-center justify-between mb-8 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 font-secondary text-[12.5px] font-extrabold uppercase text-slate-400">
            <div className={`flex items-center gap-2.5 ${currentStep >= 1 ? 'text-primary' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${currentStep >= 1 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>1</span>
              Plan
            </div>
            <span className={`h-px flex-1 mx-4 transition-all duration-300 ${currentStep >= 2 ? 'bg-primary' : 'bg-slate-100'}`}></span>
            <div className={`flex items-center gap-2.5 ${currentStep >= 2 ? 'text-primary' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${currentStep >= 2 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>2</span>
              Profile
            </div>
            <span className={`h-px flex-1 mx-4 transition-all duration-300 ${currentStep >= 3 ? 'bg-primary' : 'bg-slate-100'}`}></span>
            <div className={`flex items-center gap-2.5 ${currentStep >= 3 ? 'text-primary' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${currentStep >= 3 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>3</span>
              SePay
            </div>
            <span className={`h-px flex-1 mx-4 transition-all duration-300 ${currentStep >= 4 ? 'bg-primary' : 'bg-slate-100'}`}></span>
            <div className={`flex items-center gap-2.5 ${currentStep >= 4 ? 'text-primary' : ''}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center border ${currentStep >= 4 ? 'border-primary bg-primary/10' : 'border-slate-200'}`}>4</span>
              Payment
            </div>
          </div>
        )}

        {/* API Error Messages */}
        {apiError && (
          <div className="p-4 mb-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-secondary text-left flex items-start gap-2.5">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>{apiError}</span>
          </div>
        )}

        {/* Step Views Mapping */}
        {currentStep === 1 && (
          <Step1Plan
            plans={plans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={handleSelectPlan}
            isLoading={isLoading}
            error={errors.plan}
          />
        )}

        {currentStep === 2 && (
          <Step2Profile
            operatorName={operatorName}
            setOperatorName={setOperatorName}
            fullName={fullName}
            setFullName={setFullName}
            taxCode={taxCode}
            setTaxCode={setTaxCode}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            operatorPhone={operatorPhone}
            setOperatorPhone={setOperatorPhone}
            description={description}
            setDescription={setDescription}
            amenities={amenities}
            setAmenities={setAmenities}
            cancellationPolicy={cancellationPolicy}
            setCancellationPolicy={setCancellationPolicy}
            luggagePolicy={luggagePolicy}
            setLuggagePolicy={setLuggagePolicy}
            childrenPolicy={childrenPolicy}
            setChildrenPolicy={setChildrenPolicy}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <Step3Sepay
            bankName={bankName}
            setBankName={setBankName}
            bankNumber={bankNumber}
            setBankNumber={setBankNumber}
            bankAccountName={bankAccountName}
            setBankAccountName={setBankAccountName}
            bankBranch={bankBranch}
            setBankBranch={setBankBranch}
            sepayVa={sepayVa}
            setSepayVa={setSepayVa}
            sepayKey={sepayKey}
            setSepayKey={setSepayKey}
            errors={errors}
          />
        )}

        {currentStep === 4 && transaction && (
          <Step4Payment
            transaction={transaction}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onCheckStatus={checkPaymentStatus}
          />
        )}

        {currentStep === 5 && (
          <Step5Success
            email={email}
            operatorName={operatorName}
            sepayVa={sepayVa}
            selectedPlan={selectedPlan}
          />
        )}

        {/* Stepper Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex items-center gap-3 w-full pt-6 border-t border-slate-100">
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="flex-1 rounded-full border border-slate-200 text-slate-700 py-2.5 text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                BACK
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={isLoading}
                className="flex-1 rounded-full border border-slate-200 text-slate-700 py-2.5 text-[14px] font-bold cursor-pointer hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                PREVIOUS
              </button>
            )}
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isLoading}
              className="flex-1 rounded-full btn-premium-gradient py-2.5 text-[14px] font-bold cursor-pointer shadow-md hover:shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-75"
            >
              {isLoading ? 'PROCESSING...' : currentStep === 3 ? 'SUBMIT & PAY' : 'NEXT STEP'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterOperatorPage