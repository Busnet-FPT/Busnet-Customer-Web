import React, { useState } from 'react'
import { uploadImage } from '../../../services/authService'
import { toast } from 'react-hot-toast'

interface Step2ProfileProps {
  operatorName: string
  setOperatorName: (val: string) => void
  fullName: string
  setFullName: (val: string) => void
  taxCode: string
  setTaxCode: (val: string) => void
  phone: string
  setPhone: (val: string) => void
  email: string
  setEmail: (val: string) => void
  password: string
  setPassword: (val: string) => void
  confirmPassword: string
  setConfirmPassword: (val: string) => void
  operatorPhone: string
  setOperatorPhone: (val: string) => void
  description: string
  setDescription: (val: string) => void
  amenities: string[]
  setAmenities: (val: string[] | ((prev: string[]) => string[])) => void
  cancellationPolicy: string
  setCancellationPolicy: (val: string) => void
  luggagePolicy: string
  setLuggagePolicy: (val: string) => void
  childrenPolicy: string
  setChildrenPolicy: (val: string) => void
  profilePicture: string
  setProfilePicture: (val: string) => void
  coverImage: string
  setCoverImage: (val: string) => void
  errors: { [key: string]: string }
}

type SubTab = 'account' | 'company' | 'branding' | 'amenities'

const AMENITY_OPTIONS = [
  { id: 'WiFi', label: 'Free Wi-Fi', icon: '📶' },
  { id: 'AC', label: 'Air Conditioning', icon: '❄️' },
  { id: 'USB', label: 'USB Charger Port', icon: '🔌' },
  { id: 'Water', label: 'Mineral Water', icon: '🥤' },
  { id: 'Wet Wipes', label: 'Wet Wipes', icon: '🧻' },
  { id: 'Blanket', label: 'Blanket & Pillow', icon: '🛏️' },
  { id: 'Toilet', label: 'WC Toilet', icon: '🚻' },
  { id: 'TV', label: 'LCD TV Screen', icon: '📺' },
  { id: 'Sleeper', label: 'Sleeper Cabin', icon: '💤' }
]

const Step2Profile: React.FC<Step2ProfileProps> = ({
  operatorName,
  setOperatorName,
  fullName,
  setFullName,
  taxCode,
  setTaxCode,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  operatorPhone,
  setOperatorPhone,
  description,
  setDescription,
  amenities,
  setAmenities,
  cancellationPolicy,
  setCancellationPolicy,
  luggagePolicy,
  setLuggagePolicy,
  childrenPolicy,
  setChildrenPolicy,
  profilePicture,
  setProfilePicture,
  coverImage,
  setCoverImage,
  errors
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('account')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploadingLogo(true)
    try {
      const res = await uploadImage(file, 'busnet_branding/logos')
      setProfilePicture(res.url)
      toast.success('Logo uploaded successfully!')
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to upload logo. Please try again.')
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setIsUploadingCover(true)
    try {
      const res = await uploadImage(file, 'busnet_branding/covers')
      setCoverImage(res.url)
      toast.success('Cover banner uploaded successfully!')
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to upload cover banner. Please try again.')
    } finally {
      setIsUploadingCover(false)
    }
  }

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Helper to check if a tab contains any validation errors
  const hasTabErrors = (tab: SubTab): boolean => {
    if (tab === 'account') {
      return !!(errors.fullName || errors.phone || errors.email || errors.password || errors.confirmPassword)
    }
    if (tab === 'company') {
      return !!(errors.operatorName || errors.taxCode || errors.operatorPhone || errors.description)
    }
    if (tab === 'branding') {
      return !!(errors.profilePicture || errors.coverImage)
    }
    if (tab === 'amenities') {
      return !!(errors.amenities || errors.cancellationPolicy || errors.luggagePolicy || errors.childrenPolicy)
    }
    return false
  }

  return (
    <div className="w-full max-w-full mx-auto my-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-[18px] text-slate-900 font-extrabold uppercase tracking-wide">
          Enter Operator Profile
        </h1>
        <p className="text-slate-400 text-[13px] font-secondary">
          Configure account details, business profile, branding & amenities
        </p>
      </div>

      {/* Internal Sub-Tab Switcher */}
      <div className="flex justify-center border-b border-slate-100 font-primary text-[12px] font-bold text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === 'account'
            ? 'border-primary text-primary'
            : 'border-transparent hover:text-slate-600'
            } ${hasTabErrors('account') ? 'text-red-500 border-red-500' : ''}`}
        >
          1. ACCOUNT
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === 'company'
            ? 'border-primary text-primary'
            : 'border-transparent hover:text-slate-600'
            } ${hasTabErrors('company') ? 'text-red-500 border-red-500' : ''}`}
        >
          2. COMPANY INFO
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === 'branding'
            ? 'border-primary text-primary'
            : 'border-transparent hover:text-slate-600'
            }`}
        >
          3. BRANDING
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('amenities')}
          className={`pb-2 px-3 border-b-2 transition-all cursor-pointer ${activeTab === 'amenities'
            ? 'border-primary text-primary'
            : 'border-transparent hover:text-slate-600'
            }`}
        >
          4. AMENITIES & POLICIES
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[360px] flex flex-col justify-start">
        {/* Tab 1: Account Credentials */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left animate-fade-in">
            {/* Legal Representative Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Representative Name
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.fullName ? 'border-red-500 focus:ring-red-500/10' : ''
                  }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.fullName}</p>
              )}
            </div>

            {/* Account phone */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Account Phone
              </label>
              <input
                type="tel"
                placeholder="e.g. 0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.phone ? 'border-red-500 focus:ring-red-500/10' : ''
                  }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.phone}</p>
              )}
            </div>

            {/* Account Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Account Email
              </label>
              <input
                type="email"
                placeholder="e.g. rep@operator.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.email ? 'border-red-500 focus:ring-red-500/10' : ''
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.password ? 'border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
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
              {errors.password && (
                <p className="text-red-500 text-[12px] pl-2 font-secondary mt-0.5">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/10' : ''
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-[12px] pl-2 font-secondary mt-0.5">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Operator Details */}
        {activeTab === 'company' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left animate-fade-in">
            {/* Operator Name */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Operator Name (Company)
              </label>
              <input
                type="text"
                placeholder="e.g. BusNet Transit Ltd"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.operatorName ? 'border-red-500 focus:ring-red-500/10' : ''
                  }`}
              />
              {errors.operatorName && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.operatorName}</p>
              )}
            </div>

            {/* Operator Phone */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Operator Phone (Contact)
              </label>
              <input
                type="tel"
                placeholder="e.g. 0243123456"
                value={operatorPhone}
                onChange={(e) => setOperatorPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.operatorPhone ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.operatorPhone && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.operatorPhone}</p>
              )}
            </div>

            {/* Tax Code */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Tax Code / ID
              </label>
              <input
                type="text"
                placeholder="e.g. 0102030405"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.taxCode ? 'border-red-500 focus:ring-red-500/10' : ''
                  }`}
              />
              {errors.taxCode && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.taxCode}</p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Description / Introduction
              </label>
              <textarea
                rows={3}
                placeholder="Tell passengers about your transit services, quality commitments and history..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 resize-none ${errors.description ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.description && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Branding */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 gap-4 text-left animate-fade-in">
            {/* Profile Picture */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Profile Logo
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-primary text-slate-600 hover:text-primary transition-all duration-300 cursor-pointer text-[13.5px] font-semibold active:scale-[0.98] shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {isUploadingLogo ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={isUploadingLogo}
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste image URL (e.g. https://example.com/logo.jpg)"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.profilePicture ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                />
              </div>
              {errors.profilePicture && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.profilePicture}</p>
              )}
              {profilePicture && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={profilePicture}
                    alt="Logo Preview"
                    className="w-12 h-12 object-cover rounded-xl border border-slate-100 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Logo'
                    }}
                  />
                  <span className="text-[12px] text-slate-400 font-secondary">Logo Preview</span>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Cover Banner
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-primary text-slate-600 hover:text-primary transition-all duration-300 cursor-pointer text-[13.5px] font-semibold active:scale-[0.98] shrink-0">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {isUploadingCover ? 'Uploading...' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={isUploadingCover}
                  />
                </label>
                <input
                  type="url"
                  placeholder="Or paste image URL (e.g. https://example.com/cover.jpg)"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.coverImage ? 'border-red-500 focus:ring-red-500/10' : ''}`}
                />
              </div>
              {errors.coverImage && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.coverImage}</p>
              )}
              {coverImage && (
                <div className="mt-2">
                  <img
                    src={coverImage}
                    alt="Cover Preview"
                    className="w-full h-24 object-cover rounded-xl border border-slate-100 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x200?text=Cover+Banner'
                    }}
                  />
                  <span className="text-[12px] text-slate-400 font-secondary mt-1 block">Cover Banner Preview</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Amenities & Policies */}
        {activeTab === 'amenities' && (
          <div className="grid grid-cols-1 gap-4 text-left animate-fade-in">
            {/* Amenities Grid Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Select Amenities Offered
              </label>
              <div className={`grid grid-cols-3 gap-2 p-1.5 rounded-2xl border ${errors.amenities ? 'border-red-500 bg-red-50/10' : 'border-transparent'}`}>
                {AMENITY_OPTIONS.map((opt) => {
                  const isSelected = amenities.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleAmenity(opt.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer select-none gap-1 ${isSelected
                        ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                        }`}
                    >
                      <span className="text-[18px]">{opt.icon}</span>
                      <span className="text-[10px] font-bold font-secondary uppercase tracking-tight leading-none">
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.amenities && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.amenities}</p>
              )}
            </div>

            {/* Cancellation Policy */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Cancellation Policy
              </label>
              <input
                type="text"
                placeholder="e.g. Free cancellation up to 24 hours before departure."
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.cancellationPolicy ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.cancellationPolicy && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.cancellationPolicy}</p>
              )}
            </div>

            {/* Luggage Policy */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Luggage Policy
              </label>
              <input
                type="text"
                placeholder="e.g. Maximum 20kg luggage per passenger."
                value={luggagePolicy}
                onChange={(e) => setLuggagePolicy(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.luggagePolicy ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.luggagePolicy && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.luggagePolicy}</p>
              )}
            </div>

            {/* Child Policy */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                Children Policy
              </label>
              <input
                type="text"
                placeholder="e.g. Children under 5 sit with parents for free."
                value={childrenPolicy}
                onChange={(e) => setChildrenPolicy(e.target.value)}
                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.childrenPolicy ? 'border-red-500 focus:ring-red-500/10' : ''}`}
              />
              {errors.childrenPolicy && (
                <p className="text-red-500 text-[13px] pl-2 font-secondary mt-0.5">{errors.childrenPolicy}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Step2Profile
