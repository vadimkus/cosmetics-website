'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Camera, Mail, Lock, Calendar, ChevronDown, ArrowLeft, X, AlertTriangle, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'
import { isApplePrivateRelayEmail } from '@/lib/emailHelpers'

// Toast notification type
type ToastType = 'success' | 'error'
type Toast = {
  id: number
  message: string
  type: ToastType
}

const GENDER_VALUES = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  NA: 'na',
}

export default function EditProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()
  const { locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [isFormLoaded, setIsFormLoaded] = useState(false)
  
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
  const profileEventTimerRef = useRef<NodeJS.Timeout | null>(null)
  const deleteRedirectTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Clean up timers on unmount
  useEffect(() => () => {
    if (profileEventTimerRef.current) clearTimeout(profileEventTimerRef.current)
    if (deleteRedirectTimerRef.current) clearTimeout(deleteRedirectTimerRef.current)
  }, [])
  
  // Toast notification state
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdCounter = useRef(0)
  
  // Add toast notification
  const showToast = (message: string, type: ToastType = 'success') => {
    const id = toastIdCounter.current++
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }
  
  // Remove toast manually
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

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
      setIsFormLoaded(true)
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
      showToast(locale === 'ar' ? 'يرجى اختيار صورة صالحة' : locale === 'ru' ? 'Пожалуйста, выберите изображение' : 'Please select a valid image', 'error')
      return
    }

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      showToast(locale === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 2 ميجابايت)' : locale === 'ru' ? 'Изображение слишком большое (макс. 2 МБ)' : 'Image is too large (max 2MB)', 'error')
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
      showToast(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : locale === 'ru' ? 'Пожалуйста, заполните все обязательные поля' : 'Please fill in all required fields', 'error')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.contactEmail)) {
      showToast(locale === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : locale === 'ru' ? 'Пожалуйста, введите действительный email' : 'Please enter a valid email address', 'error')
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
        showToast(locale === 'ar' ? 'تم حفظ الملف الشخصي بنجاح' : locale === 'ru' ? 'Профиль успешно сохранен' : 'Profile saved successfully', 'success')
        // Also refresh user data in auth context
        if (window.location) {
          // Give a moment for the toast to show, then refresh auth state
          profileEventTimerRef.current = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('profile-updated'))
          }, 500)
        }
      } else {
        const data = await response.json()
        showToast(data?.error || (locale === 'ar' ? 'فشل التحديث' : locale === 'ru' ? 'Ошибка обновления' : 'Update failed'), 'error')
      }
    } catch (error) {
      errorLog('Profile save error:', error)
      showToast(locale === 'ar' ? 'حدث خطأ' : locale === 'ru' ? 'Произошла ошибка' : 'An error occurred', 'error')
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
        showToast(locale === 'ar' ? 'تم حذف حسابك بنجاح.' : locale === 'ru' ? 'Ваш аккаунт успешно удален.' : 'Your account has been deleted successfully.', 'success')
        // Redirect to login page after a short delay
        deleteRedirectTimerRef.current = setTimeout(() => {
          router.push(getLocalizedPath('/login', locale))
        }, 1000)
      } else {
        const data = await response.json()
        showToast(data?.error || (locale === 'ar' ? 'فشل حذف الحساب. يرجى المحاولة مرة أخرى.' : locale === 'ru' ? 'Не удалось удалить аккаунт. Попробуйте ещё раз.' : 'Failed to delete account. Please try again.'), 'error')
      }
    } catch (error) {
      errorLog('Delete account error:', error)
      showToast(locale === 'ar' ? 'حدث خطأ أثناء حذف الحساب.' : locale === 'ru' ? 'Произошла ошибка при удалении аккаунта.' : 'An error occurred while deleting your account.', 'error')
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
    profilePicture: locale === 'ar' ? 'الصورة' : locale === 'ru' ? 'Фото' : 'Photo',
    tapToChange: locale === 'ar' ? 'اضغط لتغيير الصورة' : locale === 'ru' ? 'Нажмите для изменения' : 'Tap to change photo',
    // Section heading below h1 — renamed from "Personal Information" to
    // avoid duplicating the page title (a11y: two identical headings).
    personalInfo: locale === 'ar' ? 'الاسم والتواصل' : locale === 'ru' ? 'Имя и контакты' : 'Name & Contact',
    firstName: locale === 'ar' ? 'الاسم الأول' : locale === 'ru' ? 'Имя' : 'First Name',
    lastName: locale === 'ar' ? 'اسم العائلة' : locale === 'ru' ? 'Фамилия' : 'Last Name',
    email: locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email Address',
    emailHint: locale === 'ar' ? 'يستخدم لتسجيل الدخول إلى حسابك' : locale === 'ru' ? 'Используется для входа в аккаунт' : 'Used to sign in to your account',
    contactEmail: locale === 'ar' ? 'بريد التواصل' : locale === 'ru' ? 'Контактный email' : 'Contact Email',
    contactEmailHint: locale === 'ar' ? 'يستخدم للإشعارات وتحديثات الطلبات' : locale === 'ru' ? 'Для уведомлений и обновлений заказов' : 'Used for notifications and order updates',
    phone: locale === 'ar' ? 'رقم الهاتف' : locale === 'ru' ? 'Телефон' : 'Phone Number',
    additionalInfo: locale === 'ar' ? 'معلوماتك' : locale === 'ru' ? 'О вас' : 'About You',
    dateOfBirth: locale === 'ar' ? 'تاريخ الميلاد' : locale === 'ru' ? 'Дата рождения' : 'Date of Birth',
    selectDate: locale === 'ar' ? 'اختر التاريخ' : locale === 'ru' ? 'Выберите дату' : 'Select date',
    gender: locale === 'ar' ? 'الجنس' : locale === 'ru' ? 'Пол' : 'Gender',
    selectGender: locale === 'ar' ? 'اختر الجنس' : locale === 'ru' ? 'Выберите пол' : 'Select gender',
    optional: locale === 'ar' ? '(اختياري)' : locale === 'ru' ? '(необязательно)' : '(optional)',
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

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm">
          {locale === 'ar' ? 'جارٍ التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...'}
        </p>
      </div>
    )
  }

  // Show sign in message if not authenticated
  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">{locale === 'ar' ? 'يرجى تسجيل الدخول' : locale === 'ru' ? 'Пожалуйста, войдите' : 'Please sign in'}</p>
        <button
          onClick={() => router.push(getLocalizedPath('/login', locale))}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium active:opacity-80"
        >
          {locale === 'ar' ? 'تسجيل الدخول' : locale === 'ru' ? 'Войти' : 'Sign In'}
        </button>
      </div>
    )
  }

  // Show loading state while form data is loading
  if (!isFormLoaded) {
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mb-3" />
        <p className="text-gray-500 text-sm">
          {locale === 'ar' ? 'جارٍ تحميل الملف الشخصي...' : locale === 'ru' ? 'Загрузка профиля...' : 'Loading profile...'}
        </p>
      </div>
    )
  }

  return (
    <div className={`min-h-[100dvh] bg-white ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* Toast Notifications */}
      <div className="fixed top-4 left-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none safe-area-top">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg
              transform transition-all duration-300 animate-spring-in
              ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
            `}
            onClick={() => removeToast(toast.id)}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      {/* Unified nav header (matches Account) */}
      <div className={`sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center justify-between px-5 py-4 safe-area-top ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handleBack}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-base text-red-600">{translations.back}</span>
        </button>
        <h1 className="text-base font-semibold text-gray-900">{translations.title}</h1>
        <div className="min-w-[80px] flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty()}
            className={`text-base font-semibold ${isSaving || !isDirty() ? 'text-gray-400' : 'text-red-600 active:opacity-70'}`}
          >
            {isSaving ? translations.saving : translations.save}
          </button>
        </div>
      </div>

      {/* Content - max-w-xl constrains the form on desktop/tablet so inputs
           don't stretch to an uncomfortable line length. */}
      <div className="max-w-xl mx-auto">
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
            type="button"
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

        {/* Real <form> enables Enter-to-submit on mobile keyboards and gives
             the browser a chance to offer autofill. The header Save button
             still calls handleSave directly; onSubmit here covers Enter-key. */}
        <form
          id="profileForm"
          onSubmit={(e) => {
            e.preventDefault()
            if (!isSaving && isDirty()) handleSave()
          }}
          noValidate
        >
          {/* Name & Contact Section */}
          <div className="py-6 border-b border-gray-100">
            <div className={`px-5 flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <User className="w-4 h-4 text-red-600" />
              </div>
              <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.personalInfo}</h2>
            </div>
            <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
              {/* First Name */}
              <div className="px-4 py-3 border-b border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-300 transition-colors">
                <label htmlFor="firstName" className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                  {translations.firstName}
                </label>
                <input
                  id="firstName"
                  name="given-name"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className={`w-full text-base text-gray-900 bg-transparent outline-none ${isRTL ? 'text-right' : ''}`}
                  placeholder={translations.firstName}
                />
              </div>
              {/* Last Name */}
              <div className="px-4 py-3 border-b border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-300 transition-colors">
                <label htmlFor="lastName" className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                  {translations.lastName}
                </label>
                <input
                  id="lastName"
                  name="family-name"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className={`w-full text-base text-gray-900 bg-transparent outline-none ${isRTL ? 'text-right' : ''}`}
                  placeholder={translations.lastName}
                />
              </div>
              {/* Email (read-only) — lock icon + hint tells users why it's
                   shown but not editable, clarifying the two-email UX. */}
              <div className="px-4 py-3 border-b border-gray-200">
                <label htmlFor="email" className={`text-sm font-medium text-gray-600 mb-1 flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Lock className="w-3 h-3" aria-hidden="true" />
                  {translations.email}
                </label>
                <input
                  id="email"
                  type="text"
                  value={isApplePrivateRelayEmail(formData.email) ? translations.hidden : formData.email}
                  readOnly
                  aria-readonly="true"
                  tabIndex={-1}
                  className="w-full text-base text-gray-500 bg-transparent outline-none cursor-default"
                  dir="ltr"
                />
                <p className={`text-xs text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`}>
                  {translations.emailHint}
                </p>
              </div>
              {/* Contact Email */}
              <div className="px-4 py-3 border-b border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-300 transition-colors">
                <label htmlFor="contactEmail" className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                  {translations.contactEmail}
                </label>
                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className="w-full text-base text-gray-900 bg-transparent outline-none"
                  placeholder={translations.contactEmail}
                  dir="ltr"
                />
                {/* Neutral gray hint — previous amber pill read as a warning
                     when it's just informational. */}
                <p className={`text-xs text-gray-500 mt-1 flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Mail className="w-3 h-3" aria-hidden="true" />
                  {translations.contactEmailHint}
                </p>
              </div>
              {/* Phone */}
              <div className="px-4 py-3 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-300 transition-colors">
                <label htmlFor="phone" className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                  {translations.phone}
                </label>
                <input
                  id="phone"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full text-base text-gray-900 bg-transparent outline-none"
                  placeholder="+971 XX XXX XXXX"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* About You Section */}
          <div className="py-6 border-b border-gray-100">
            <div className={`px-5 flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-red-600" />
              </div>
              <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.additionalInfo}</h2>
            </div>
            <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
              {/* Date of Birth */}
              <div className="px-4 py-3 border-b border-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-red-300 transition-colors">
                <label htmlFor="birthday" className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                  {translations.dateOfBirth} <span className="text-gray-400 font-normal">{translations.optional}</span>
                </label>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input
                    id="birthday"
                    name="bday"
                    type="date"
                    autoComplete="bday"
                    value={formData.birthday}
                    onChange={(e) => updateField('birthday', e.target.value)}
                    className={`flex-1 text-base text-gray-900 bg-transparent outline-none ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
              </div>
              {/* Gender */}
              <div className="px-4 py-3">
                <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                  {translations.gender} <span className="text-gray-400 font-normal">{translations.optional}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowGenderModal(true)}
                  className={`w-full flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className="text-base text-gray-900">{getGenderLabel(formData.gender)}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </form>

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
            type="button"
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

