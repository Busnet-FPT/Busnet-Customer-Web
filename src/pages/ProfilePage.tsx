import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getProfile, updateProfile, changePassword, type UserProfile } from '../services/profileService'
import {
  IconUser,
  IconLock,
  IconPhone,
  IconMail,
  IconGenderTransgender,
  IconCalendarEvent,
  IconLoader,
  IconCheck,
  IconAlertTriangle,
  IconKey,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react'
import axios from 'axios'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Profile data state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')

  // Edit profile form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')
  const [dob, setDob] = useState('')
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)

  // Change password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Feedback states
  const [infoError, setInfoError] = useState('')
  const [infoSuccess, setInfoSuccess] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Fetch Profile data
  const fetchProfileData = async () => {
    setIsLoading(true)
    try {
      const result = await getProfile()
      const accountData = result.data.account || result.data
      setProfile(accountData)
      setFullName(accountData.fullName || '')
      setPhone(accountData.phone || '')
      setGender(accountData.gender || 'OTHER')
      setDob(accountData.dob ? accountData.dob.split('T')[0] : '')
      setProfilePicturePreview(null)
      setProfilePictureFile(null)
    } catch (err: any) {
      console.error('Error loading profile:', err)
      setInfoError('Could not fetch profile information. Please reload.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfileData()
    }
  }, [user])

  // Handle profile update submit
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setInfoError('')
    setInfoSuccess('')

    if (!fullName.trim()) {
      setInfoError('Please enter your full name')
      return
    }

    if (phone.trim() && !/^0\d{9}$/.test(phone.trim())) {
      setInfoError('Phone must be exactly 10 digits and start with 0')
      return
    }

    setIsSaving(true)
    try {
      const result = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        gender: gender.toUpperCase(),
        dob: dob || null,
        profilePicture: profilePictureFile || undefined
      })
      const accountData = result.data.account || result.data
      setProfile(accountData)
      setProfilePictureFile(null)
      // Sync to localStorage so Header updates
      localStorage.setItem('user', JSON.stringify(accountData))
      setInfoSuccess('Profile updated successfully!')
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const detailedMsg = errorData.errors.map((e: any) => e.message).join(', ');
          setInfoError(`${errorData.message}: ${detailedMsg}`);
        } else {
          setInfoError(errorData.message || 'Failed to update profile');
        }
      } else {
        setInfoError('Network error. Please try again.');
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Handle change password submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError('')
    setPwdSuccess('')

    if (!currentPassword) {
      setPwdError('Please enter your current password')
      return
    }

    if (!newPassword) {
      setPwdError('Please enter a new password')
      return
    }

    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPwdError('Passwords do not match')
      return
    }

    setIsSaving(true)
    try {
      await changePassword({
        currentPassword,
        newPassword
      })
      setPwdSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const detailedMsg = errorData.errors.map((e: any) => e.message).join(', ');
          setPwdError(`${errorData.message}: ${detailedMsg}`);
        } else {
          setPwdError(errorData.message || 'Failed to change password');
        }
      } else {
        setPwdError('Network error. Please try again.');
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 font-primary">
        <IconLoader className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-400 text-sm font-semibold animate-pulse">Loading profile data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto w-full font-primary space-y-8 animate-fade-in my-6 text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <IconUser className="w-5.5 h-5.5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
            My Account
          </h1>
          <p className="text-xs text-slate-405 font-secondary mt-1">
            Manage your personal travel profile and security settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Avatar Card */}
        <div className="w-full md:w-[32%] bg-white rounded-3xl border border-slate-100 p-6 text-center space-y-5 shadow-sm">
          <div className="flex flex-col items-center">
            <div
              className="relative group cursor-pointer inline-block"
              onClick={() => document.getElementById('profilePictureInput')?.click()}
            >
              {profilePicturePreview || profile?.profilePicture ? (
                <img
                  src={profilePicturePreview || profile?.profilePicture || ''}
                  alt={profile?.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-md mb-4 transition-all group-hover:opacity-75"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-3xl border border-primary/5 shadow-inner mb-4 transition-all group-hover:opacity-75">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : (profile?.username?.charAt(0)?.toUpperCase() || 'U')}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-2xl mb-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold">Change</span>
              </div>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate max-w-full">
              {profile?.fullName || profile?.username}
            </h2>
            <p className="text-xs text-slate-450 truncate font-secondary max-w-full mt-0.5">
              @{profile?.username}
            </p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              {profile?.role || 'Passenger'}
            </span>
          </div>

          <div className="border-t border-slate-50 pt-4 space-y-1 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-secondary">
              <IconMail className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="truncate">{profile?.email}</span>
            </div>
            {profile?.phone && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-secondary">
                <IconPhone className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-50">
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === 'info'
                ? 'bg-primary text-white shadow-md shadow-primary/15'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <IconUser className="w-4.5 h-4.5" />
              General Details
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === 'password'
                ? 'bg-primary text-white shadow-md shadow-primary/15'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <IconLock className="w-4.5 h-4.5" />
              Change Password
            </button>
          </div>
        </div>

        {/* Right Side: Tab Forms */}
        <div className="flex-1 w-full bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
          {activeTab === 'info' ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-none">
                  General Details
                </h3>
                <p className="text-xs text-slate-450 font-secondary mt-1">
                  Keep your passenger travel profile details updated.
                </p>
              </div>

              {infoError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-650 text-xs font-secondary flex items-start gap-2 animate-fade-in" role="alert">
                  <IconAlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
                  <span>{infoError}</span>
                </div>
              )}

              {infoSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-secondary flex items-start gap-2 animate-fade-in" role="alert">
                  <IconCheck className="w-4.5 h-4.5 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{infoSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* Full Name */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="fullName" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconUser className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      required
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary opacity-60">
                    Email Address (Read-only)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-350">
                      <IconMail className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type="email"
                      value={profile?.email || ''}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/60 pl-10 pr-4 py-2.5 text-[14px] text-slate-450 outline-none cursor-not-allowed select-none font-secondary"
                      disabled
                    />
                  </div>
                </div>

                {/* Username (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary opacity-60">
                    Username (Read-only)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-350 font-bold text-[14px]">
                      @
                    </div>
                    <input
                      type="text"
                      value={profile?.username || ''}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/60 pl-10 pr-4 py-2.5 text-[14px] text-slate-450 outline-none cursor-not-allowed select-none font-secondary"
                      disabled
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconPhone className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="0912345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label htmlFor="gender" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Gender
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconGenderTransgender className="w-4.5 h-4.5" />
                    </div>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 appearance-none font-secondary"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="dob" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconCalendarEvent className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full btn-premium-gradient text-xs cursor-pointer disabled:opacity-70 shadow-md hover:shadow-lg hover:shadow-primary/25"
              >
                {isSaving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-none">
                  Change  password
                </h3>
                <p className="text-xs text-slate-450 font-secondary mt-1">
                  Change your password regularly to protect your personal account info.
                </p>
              </div>

              {pwdError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-secondary flex items-start gap-2 animate-fade-in" role="alert">
                  <IconAlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-secondary flex items-start gap-2 animate-fade-in" role="alert">
                  <IconCheck className="w-4.5 h-4.5 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              <div className="space-y-4 text-left">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label htmlFor="currentPassword" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Current Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconKey className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? (
                        <IconEyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <IconEye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label htmlFor="newPassword" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconLock className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? (
                        <IconEyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <IconEye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <IconLock className="w-4.5 h-4.5" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <IconEyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <IconEye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full btn-premium-gradient text-xs cursor-pointer disabled:opacity-70 shadow-md hover:shadow-lg hover:shadow-primary/25"
              >
                {isSaving ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage