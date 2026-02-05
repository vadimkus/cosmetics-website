'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Camera, Mail, Calendar, ChevronDown, ArrowLeft, X, AlertTriangle, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'
import { isApplePrivateRelayEmail } from '@/lib/emailHelpers'

const GENDER_VALUES = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  NA: 'na',
}

export default function EditProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768
      const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsMobileWeb(isMobile && !isPWAMode)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const isAppLikeMode = isPWA || isMobileWeb
  
  const fromPage = searchParams?.get('from')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactEmail: '',
    phone: '',
    birthday: '',
    gender: GENDER_VALUES.NA,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showGenderModal, setShowGenderModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [initialSnapshot, setInitialSnapshot] = useState<typeof formData | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gender options with translations
  const genderOptions = [
    { value: GENDER_VALUES.MALE, label: locale === 'ar' ? 'ذكر' : locale === 'ru' ? 'Мужской' : 'Male' },
    { value: GENDER_VALUES.FEMALE, label: locale === 'ar' ? 'أنثى' : locale === 'ru' ? 'Женский' : 'Female' },
    { value: GENDER_VALUES.OTHER, label: locale === 'ar' ? 'آخر' : locale === 'ru' ? 'Другой' : 'Other' },
    { value: GENDER_VALUES.NA, label: locale === 'ar' ? 'أفضل عدم القول' : locale === 'ru' ? 'Предпочитаю не говорить' : 'Prefer not to say' },
  ]

  const getGenderLabel = (value: string) => {
    const option = genderOptions.find(o => o.value === value)
    const defaultOption = genderOptions.find(o => o.value === GENDER_VALUES.NA)
    return option?.label || defaultOption?.label || 'Prefer not to say'
  }

  // Populate form with user data
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', '']
      const authEmail = String(user.email || '').trim()
      const isAppleRelay = authEmail.includes('@privaterelay.appleid.com')
      const derivedContactEmail = String(user.contactEmail || '').trim() || (!isAppleRelay ? authEmail : '')

      const nextForm = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: authEmail,
        contactEmail: derivedContactEmail,
        phone: user.phone || '',
        birthday: user.birthday || '',
        gender: user.gender || GENDER_VALUES.NA,
      }
      setFormData(nextForm)
      setInitialSnapshot(nextForm)
      setProfilePicture(user.profilePicture || null)
    }
  }, [user])

  // Handle profile photo selection
  const handlePhotoClick = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(locale === 'ar' ? 'يرجى اختيار صورة صالحة' : locale === 'ru' ? 'Пожалуйста, выберите изображение' : 'Please select a valid image')
      return
    }

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      alert(locale === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 2 ميجابايت)' : locale === 'ru' ? 'Изображение слишком большое (макс. 2 МБ)' : 'Image is too large (max 2MB)')
      return
    }

    setIsUploadingPhoto(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setProfilePicture(base64)
        setIsUploadingPhoto(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      errorLog('Error reading photo:', error)
      setIsUploadingPhoto(false)
    }

    // Reset input
    e.target.value = ''
  }

  const isDirty = useCallback(() => {
    if (!initialSnapshot) return false
    try {
      // Check form data changes
      const formChanged = JSON.stringify(formData) !== JSON.stringify(initialSnapshot)
      // Check profile picture changes
      const pictureChanged = profilePicture !== (user?.profilePicture || null)
      return formChanged || pictureChanged
    } catch {
      return true
    }
  }, [formData, initialSnapshot, profilePicture, user?.profilePicture])

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.contactEmail.trim() || !formData.phone.trim()) {
      alert(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : locale === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.contactEmail)) {
      alert(locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : locale === 'ru' ? 'Пожалуйста, введите действительный email' : 'Please enter a valid email address')
      return
    }

    try {
      setIsSaving(true)
      const profileData: Record<string, unknown> = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim(),
        birthday: formData.birthday,
        gender: formData.gender,
        contactEmail: formData.contactEmail.trim(),
      }
      
      // Include profile picture if it was changed
      if (profilePicture !== (user?.profilePicture || null)) {
        profileData.profilePicture = profilePicture
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData),
      })
      
      if (response.ok) {
        setInitialSnapshot(formData)
        alert(locale === 'ar' ? 'تم حفظ الملف الشخصي بنجاح' : locale === 'ru' ? 'Профиль успешно сохранен' : 'Profile saved successfully')
      } else {
        const data = await response.json()
        alert(data?.error || (locale === 'ar' ? 'فشل التحديث' : locale === 'ru' ? 'Ошибка обновления' : 'Update failed'))
      }
    } catch (error) {
      alert(locale === 'ar' ? 'حدث خطأ' : locale === 'ru' ? 'Произошла ошибка' : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    if (fromPage === 'profile') {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.back()
    }
  }

  // Helper to get CSRF token from cookie
  const getCsrfToken = (): string | null => {
    if (typeof document === 'undefined') return null
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'csrf-token' && value) {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      
      // Get CSRF token from cookie
      const csrfToken = getCsrfToken()
      
      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
      }
      
      // Add CSRF token if available
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken
      }
      
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers,
        credentials: 'include',
      })
      
      if (response.ok) {
        setShowDeleteModal(false)
        alert(locale === 'ar' ? 'تم حذف حسابك بنجاح.' : locale === 'ru' ? 'Ваш аккаунт успешно удален.' : 'Your account has been deleted successfully.')
        // Redirect to login page
        router.push(getLocalizedPath('/login', locale))
      } else {
        const data = await response.json()
        alert(data?.error || (locale === 'ar' ? 'فشل حذف الحساب. يرجى المحاولة مرة أخرى.' : locale === 'ru' ? 'Не удалось удалить аккаунт. Попробуйте ещё раз.' : 'Failed to delete account. Please try again.'))
      }
    } catch (error) {
      alert(locale === 'ar' ? 'حدث خطأ أثناء حذف الحساب.' : locale === 'ru' ? 'Произошла ошибка при удалении аккаунта.' : 'An error occurred while deleting your account.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Translations
  const translations = {
    title: locale === 'ar' ? 'المعلومات الشخصية' : locale === 'ru' ? 'Личная информация' : 'Personal Information',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
    save: locale === 'ar' ? 'حفظ' : locale === 'ru' ? 'Сохранить' : 'Save',
    saving: locale === 'ar' ? 'جارٍ الحفظ...' : locale === 'ru' ? 'Сохранение...' : 'Saving...',
    profilePicture: locale === 'ar' ? 'صورة الملف الشخصي' : locale === 'ru' ? 'Фото профиля' : 'Profile Picture',
    tapToChange: locale === 'ar' ? 'اضغط لتغيير الصورة' : locale === 'ru' ? 'Нажмите для изменения' : 'Tap to change photo',
    personalInfo: locale === 'ar' ? 'المعلومات الشخصية' : locale === 'ru' ? 'Личные данные' : 'Personal Information',
    firstName: locale === 'ar' ? 'الاسم الأول' : locale === 'ru' ? 'Имя' : 'First Name',
    lastName: locale === 'ar' ? 'اسم العائلة' : locale === 'ru' ? 'Фамилия' : 'Last Name',
    email: locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email Address',
    contactEmail: locale === 'ar' ? 'بريد التواصل' : locale === 'ru' ? 'Контактный email' : 'Contact Email',
    contactEmailHint: locale === 'ar' ? 'يستخدم للإشعارات وتحديثات الطلبات' : locale === 'ru' ? 'Для уведомлений и обновлений заказов' : 'Used for notifications and order updates',
    phone: locale === 'ar' ? 'رقم الهاتف' : locale === 'ru' ? 'Телефон' : 'Phone Number',
    additionalInfo: locale === 'ar' ? 'معلومات إضافية' : locale === 'ru' ? 'Дополнительная информация' : 'Additional Information',
    dateOfBirth: locale === 'ar' ? 'تاريخ الميلاد' : locale === 'ru' ? 'Дата рождения' : 'Date of Birth',
    selectDate: locale === 'ar' ? 'اختر التاريخ' : locale === 'ru' ? 'Выберите дату' : 'Select date',
    gender: locale === 'ar' ? 'الجنس' : locale === 'ru' ? 'Пол' : 'Gender',
    selectGender: locale === 'ar' ? 'اختر الجنس' : locale === 'ru' ? 'Выберите пол' : 'Select gender',
    required: '*',
    hidden: locale === 'ar' ? 'مخفي' : locale === 'ru' ? 'Скрыто' : 'Hidden',
    privacyNote: locale === 'ar' ? 'معلوماتك محمية ولن تتم مشاركتها' : locale === 'ru' ? 'Ваша информация защищена и не будет передана' : 'Your information is protected and will not be shared',
    // Delete account translations
    deleteAccount: locale === 'ar' ? 'حذف الحساب' : locale === 'ru' ? 'Удалить аккаунт' : 'Delete Account',
    deleteAccountTitle: locale === 'ar' ? 'حذف الحساب؟' : locale === 'ru' ? 'Удалить аккаунт?' : 'Delete Account?',
    deleteAccountMessage: locale === 'ar' 
      ? 'سيتم حذف حسابك من التطبيق. قد تفقد الوصول إلى السجل والبيانات المحفوظة. لا يمكن التراجع عن هذا الإجراء.'
      : locale === 'ru' 
        ? 'Аккаунт будет удалён из приложения. Вы можете потерять доступ к истории и сохранённым данным. Это действие нельзя отменить.'
        : 'This will delete your account from the app. You may lose access to your order history and saved data. This action cannot be undone.',
    deleteAccountConfirm: locale === 'ar' ? 'حذف' : locale === 'ru' ? 'Удалить' : 'Delete',
    cancel: locale === 'ar' ? 'إلغاء' : locale === 'ru' ? 'Отмена' : 'Cancel',
    deleting: locale === 'ar' ? 'جارٍ الحذف...' : locale === 'ru' ? 'Удаление...' : 'Deleting...',
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">{locale === 'ar' ? 'يرجى تسجيل الدخول' : locale === 'ru' ? 'Пожалуйста, войдите' : 'Please sign in'}</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={handleBack}
          className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-6 h-6 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-sm font-semibold text-red-600">{translations.back}</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{translations.title}</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving || !isDirty()}
          className={`text-sm font-semibold ${isSaving || !isDirty() ? 'text-gray-400' : 'text-red-600'}`}
        >
          {isSaving ? translations.saving : translations.save}
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto">
        {/* Profile Picture Section */}
        <div className="py-6 border-b border-gray-100">
          <div className={`px-5 flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <Camera className="w-4 h-4 text-red-600" />
            </div>
            <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.profilePicture}</h2>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <button
            onClick={handlePhotoClick}
            disabled={isUploadingPhoto}
            className="w-full flex flex-col items-center py-4 mx-5 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors disabled:opacity-50"
            style={{ width: 'calc(100% - 40px)', marginLeft: '20px', marginRight: '20px' }}
          >
            <div className="relative mb-3">
              {isUploadingPhoto ? (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
                </div>
              ) : profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center border-2 border-white">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <span className="text-sm text-red-600 font-medium">
              {isUploadingPhoto 
                ? (locale === 'ar' ? 'جارٍ الرفع...' : locale === 'ru' ? 'Загрузка...' : 'Uploading...') 
                : translations.tapToChange}
            </span>
          </button>
        </div>

        {/* Personal Information Section */}
        <div className="py-6 border-b border-gray-100">
          <div className={`px-5 flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <User className="w-4 h-4 text-red-600" />
            </div>
            <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.personalInfo}</h2>
          </div>
          <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
            {/* First Name */}
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.firstName}<span className="text-red-600"> {translations.required}</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={`w-full text-base text-gray-900 bg-transparent outline-none ${isRTL ? 'text-right' : ''}`}
                placeholder={translations.firstName}
              />
            </div>
            {/* Last Name */}
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.lastName}<span className="text-red-600"> {translations.required}</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={`w-full text-base text-gray-900 bg-transparent outline-none ${isRTL ? 'text-right' : ''}`}
                placeholder={translations.lastName}
              />
            </div>
            {/* Email (read-only) */}
            <div className="px-4 py-3 border-b border-gray-200 opacity-75">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.email}<span className="text-red-600"> {translations.required}</span>
              </label>
              <input
                type="text"
                value={isApplePrivateRelayEmail(formData.email) ? translations.hidden : formData.email}
                readOnly
                className="w-full text-base text-gray-500 bg-transparent outline-none"
                dir="ltr"
              />
            </div>
            {/* Contact Email */}
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.contactEmail}<span className="text-red-600"> {translations.required}</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                className="w-full text-base text-gray-900 bg-transparent outline-none"
                placeholder={translations.contactEmail}
                dir="ltr"
              />
              <p className={`text-xs text-amber-700 mt-2 bg-amber-50 px-3 py-2 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                <Mail className="w-3 h-3 inline mr-1" />
                {translations.contactEmailHint}
              </p>
            </div>
            {/* Phone */}
            <div className="px-4 py-3">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.phone}<span className="text-red-600"> {translations.required}</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full text-base text-gray-900 bg-transparent outline-none"
                placeholder="+971 XX XXX XXXX"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="py-6 border-b border-gray-100">
          <div className={`px-5 flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-red-600" />
            </div>
            <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.additionalInfo}</h2>
          </div>
          <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
            {/* Date of Birth */}
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.dateOfBirth}
              </label>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => updateField('birthday', e.target.value)}
                  className={`flex-1 text-base text-gray-900 bg-transparent outline-none ${isRTL ? 'text-right' : ''}`}
                />
              </div>
            </div>
            {/* Gender */}
            <div className="px-4 py-3">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {translations.gender}
              </label>
              <button
                onClick={() => setShowGenderModal(true)}
                className={`w-full flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <span className="text-base text-gray-900">{getGenderLabel(formData.gender)}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="px-5 py-6">
          <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className={`text-sm text-gray-500 text-center flex-1 ${isRTL ? 'text-right' : ''}`}>
              {translations.privacyNote}
            </p>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="px-5 pb-8">
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Trash2 className="w-5 h-5" />
            <span>{translations.deleteAccount}</span>
          </button>
        </div>
      </div>

      {/* Gender Modal */}
      {showGenderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className={`flex items-center justify-between p-5 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-900">{translations.selectGender}</h3>
              <button onClick={() => setShowGenderModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="py-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateField('gender', option.value)
                    setShowGenderModal(false)
                  }}
                  className={`w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 ${
                    formData.gender === option.value ? 'bg-red-50' : ''
                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`text-base ${formData.gender === option.value ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {option.label}
                  </span>
                  {formData.gender === option.value && (
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              {/* Title */}
              <h3 className={`text-xl font-bold text-gray-900 text-center mb-3 ${isRTL ? 'text-right' : ''}`}>
                {translations.deleteAccountTitle}
              </h3>
              
              {/* Message */}
              <p className={`text-gray-600 text-center mb-6 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                {translations.deleteAccountMessage}
              </p>
              
              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-colors ${
                    isDeleting 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-600 text-white active:bg-red-700'
                  }`}
                >
                  {isDeleting ? translations.deleting : translations.deleteAccountConfirm}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="w-full py-3.5 rounded-xl font-semibold bg-gray-100 text-gray-700 active:bg-gray-200 transition-colors"
                >
                  {translations.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

