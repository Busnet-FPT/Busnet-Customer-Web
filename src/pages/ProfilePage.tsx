import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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

function ProfilePage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('OTHER')
  const [dob, setDob] = useState('')
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [infoError, setInfoError] = useState('')
  const [infoSuccess, setInfoSuccess] = useState('')
  const [pwdError, setPwdError] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

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
    } catch (err) {
      console.error('Error loading profile:', err)
      setInfoError('Could not fetch profile information. Please reload.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchProfileData()
  }, [user])

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError(err) && err.response?.data) {
      const errorData = err.response.data
      if (errorData.errors && Array.isArray(errorData.errors)) {
        return `${errorData.message}: ${errorData.errors.map((e: any) => e.message).join(', ')}`
      }
      return errorData.message || fallback
    }
    return 'Network error. Please try again.'
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setInfoError('')
    setInfoSuccess('')
    const reader = new FileReader()
    reader.onloadend = () => setProfilePicturePreview(reader.result as string)
    reader.readAsDataURL(file)

    setIsUploadingAvatar(true)
    try {
      const result = await updateProfile({ profilePicture: file })
      const accountData = result.data.account || result.data
      setProfile(accountData)
      setUser(accountData as any)
      setProfilePicturePreview(null)
      setInfoSuccess('Profile picture updated successfully!')
    } catch (err) {
      setProfilePicturePreview(null)
      setInfoError(getErrorMessage(err, 'Failed to update profile picture'))
    } finally {
      setIsUploadingAvatar(false)
      e.target.value = ''
    }
  }

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
        dob: dob || null
      })
      const accountData = result.data.account || result.data
      setProfile(accountData)
      setUser(accountData as any)
      setInfoSuccess('Profile information updated successfully!')
    } catch (err) {
      setInfoError(getErrorMessage(err, 'Failed to update profile'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError('')
    setPwdSuccess('')

    if (!currentPassword) return setPwdError('Please enter your current password')
    if (!newPassword) return setPwdError('Please enter a new password')
    if (newPassword.length < 6) return setPwdError('New password must be at least 6 characters')
    if (newPassword !== confirmPassword) return setPwdError('Passwords do not match')

    setIsSaving(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setPwdSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPwdError(getErrorMessage(err, 'Failed to change password'))
    } finally {
      setIsSaving(false)
    }
  }

  const avatarSrc = profilePicturePreview || profile?.profilePicture || ''
  const initials = profile?.fullName?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || 'U'

  return (
    <section className="min-h-screen bg-slate-50/50 py-10 font-secondary pb-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-primary font-primary">Account Settings</p>
          <h1 className="text-2xl font-bold text-slate-900 font-primary mt-1">My Account</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your personal travel profile and security settings</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xs">
            <IconLoader className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-semibold animate-pulse mt-4 font-primary">Loading profile data...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start font-primary animate-fade-in text-left">
            <div className="w-full md:w-[32%] bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-5 shadow-xs">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={isUploadingAvatar}
                  className="relative group cursor-pointer inline-block disabled:cursor-wait"
                  onClick={() => document.getElementById('profilePictureInput')?.click()}
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={profile?.fullName} className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-md mb-4 transition-all group-hover:opacity-75" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-3xl border border-primary/5 shadow-inner mb-4 transition-all group-hover:opacity-75">
                      {initials}
                    </div>
                  )}
                  <span className="absolute inset-0 bg-black/40 rounded-2xl mb-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    {isUploadingAvatar ? 'Uploading...' : 'Change'}
                  </span>
                </button>
                <input id="profilePictureInput" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                <h2 className="text-base font-bold text-slate-900 truncate max-w-full">{profile?.fullName || profile?.username}</h2>
                <p className="text-xs text-slate-450 truncate font-secondary max-w-full mt-0.5">@{profile?.username}</p>
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

              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-50">
                <button type="button" onClick={() => setActiveTab('info')} className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === 'info' ? 'bg-primary text-white shadow-md shadow-primary/15' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <IconUser className="w-4.5 h-4.5" />
                  General Details
                </button>
                <button type="button" onClick={() => setActiveTab('password')} className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === 'password' ? 'bg-primary text-white shadow-md shadow-primary/15' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <IconLock className="w-4.5 h-4.5" />
                  Change Password
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
              {activeTab === 'info' ? (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-none">General Details</h3>
                    <p className="text-xs text-slate-450 font-secondary mt-1">Keep your passenger travel profile details updated.</p>
                  </div>

                  {infoError && <Alert type="error" message={infoError} />}
                  {infoSuccess && <Alert type="success" message={infoSuccess} />}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <Field label="Full Name" className="sm:col-span-2">
                      <TextInput id="fullName" value={fullName} onChange={(value) => setFullName(value)} icon={<IconUser className="w-4.5 h-4.5" />} required />
                    </Field>
                    <Field label="Email Address (Read-only)" muted>
                      <TextInput value={profile?.email || ''} icon={<IconMail className="w-4.5 h-4.5" />} disabled />
                    </Field>
                    <Field label="Username (Read-only)" muted>
                      <TextInput value={profile?.username || ''} icon={<span className="font-bold text-[14px]">@</span>} disabled />
                    </Field>
                    <Field label="Phone Number">
                      <TextInput id="phone" value={phone} onChange={(value) => setPhone(value.replace(/[^0-9]/g, '').slice(0, 10))} icon={<IconPhone className="w-4.5 h-4.5" />} />
                    </Field>
                    <Field label="Gender">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                          <IconGenderTransgender className="w-4.5 h-4.5" />
                        </div>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 appearance-none font-secondary">
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </Field>
                    <Field label="Date of Birth" className="sm:col-span-2">
                      <TextInput id="dob" type="date" value={dob} onChange={(value) => setDob(value)} icon={<IconCalendarEvent className="w-4.5 h-4.5" />} />
                    </Field>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-6 py-2.5 rounded-full btn-premium-gradient text-xs cursor-pointer disabled:opacity-70 shadow-md hover:shadow-lg hover:shadow-primary/25">
                    {isSaving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-none">Change Password</h3>
                    <p className="text-xs text-slate-450 font-secondary mt-1">Change your password regularly to protect your personal account info.</p>
                  </div>

                  {pwdError && <Alert type="error" message={pwdError} />}
                  {pwdSuccess && <Alert type="success" message={pwdSuccess} />}

                  <div className="space-y-4 text-left">
                    <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} visible={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} />
                    <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} visible={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} />
                    <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-6 py-2.5 rounded-full btn-premium-gradient text-xs cursor-pointer disabled:opacity-70 shadow-md hover:shadow-lg hover:shadow-primary/25">
                    {isSaving ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Alert({ type, message }: { type: 'error' | 'success'; message: string }) {
  const isError = type === 'error'
  return (
    <div className={`p-3 rounded-xl border text-xs font-secondary flex items-start gap-2 animate-fade-in ${isError ? 'bg-red-50 border-red-100 text-red-650' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`} role="alert">
      {isError ? <IconAlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" /> : <IconCheck className="w-4.5 h-4.5 shrink-0 text-emerald-500 mt-0.5" />}
      <span>{message}</span>
    </div>
  )
}

function Field({ label, children, className = '', muted = false }: { label: string; children: React.ReactNode; className?: string; muted?: boolean }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={`text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-primary ${muted ? 'opacity-60' : ''}`}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ id, type = 'text', value, onChange, icon, disabled = false, required = false }: { id?: string; type?: string; value: string; onChange?: (value: string) => void; icon: React.ReactNode; disabled?: boolean; required?: boolean }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${disabled ? 'text-slate-350' : 'text-slate-400 group-focus-within:text-primary'} transition-colors`}>
        {icon}
      </div>
      <input id={id} type={type} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} required={required} className={`w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-[14px] outline-none font-secondary ${disabled ? 'bg-slate-100/60 text-slate-450 cursor-not-allowed select-none' : 'bg-slate-50/50 text-slate-800 transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`} />
    </div>
  )
}

function PasswordField({ label, value, onChange, visible, onToggle }: { label: string; value: string; onChange: (value: string) => void; visible: boolean; onToggle: () => void }) {
  return (
    <Field label={label}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          {label === 'Current Password' ? <IconKey className="w-4.5 h-4.5" /> : <IconLock className="w-4.5 h-4.5" />}
        </div>
        <input type={visible ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-[14px] text-slate-800 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" required />
        <button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer" aria-label={visible ? 'Hide password' : 'Show password'}>
          {visible ? <IconEyeOff className="w-4.5 h-4.5" /> : <IconEye className="w-4.5 h-4.5" />}
        </button>
      </div>
    </Field>
  )
}

export default ProfilePage
