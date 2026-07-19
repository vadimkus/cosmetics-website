'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Home, Briefcase, MapPin, Loader2, Info } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

const EMIRATES = [
  { value: 'Dubai', key: 'dubai' },
  { value: 'Abu Dhabi', key: 'abuDhabi' },
  { value: 'Sharjah', key: 'sharjah' },
  { value: 'Ajman', key: 'ajman' },
  { value: 'Umm Al Quwain', key: 'ummAlQuwain' },
  { value: 'Ras Al Khaimah', key: 'rasAlKhaimah' },
  { value: 'Fujairah', key: 'fujairah' },
]

interface AddressEditorContentProps {
  embedded?: boolean
  editIdOverride?: string | null
  onDone?: () => void
}

export function AddressEditorContent({
  embedded = false,
  editIdOverride,
  onDone,
}: AddressEditorContentProps) {
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

  const editId = editIdOverride === undefined ? searchParams?.get('edit') : editIdOverride
  const isEditing = !!editId

  const [formData, setFormData] = useState({
    type: 'home',
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Dubai',
    emirate: 'Dubai',
    country: 'United Arab Emirates',
    isDefault: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [error, setError] = useState('')

  // Load address data if editing
  useEffect(() => {
    if (editId) {
      fetch(`/api/addresses/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.address) {
            setFormData({
              type: data.address.type || 'home',
              name: data.address.name || '',
              phone: data.address.phone || '',
              addressLine1: data.address.addressLine1 || '',
              addressLine2: data.address.addressLine2 || '',
              city: data.address.city || 'Dubai',
              emirate: data.address.emirate || 'Dubai',
              country: data.address.country || 'United Arab Emirates',
              isDefault: data.address.isDefault || false,
            })
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [editId])

  // Update name/phone when user data loads
  useEffect(() => {
    if (user && !isEditing) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user, isEditing])

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError(t.validationName)
      return
    }
    if (!formData.phone.trim()) {
      setError(t.validationPhone)
      return
    }
    if (!formData.addressLine1.trim()) {
      setError(t.validationAddress)
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const url = isEditing ? `/api/addresses/${editId}` : '/api/addresses'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        if (embedded && onDone) {
          onDone()
        } else {
          router.push(getLocalizedPath('/profile/addresses', locale) + '?from=profile')
        }
      } else {
        setError(data.error || t.saveFailed)
      }
    } catch {
      setError(t.saveFailed)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (embedded && onDone) {
      onDone()
    } else {
      router.push(getLocalizedPath('/profile/addresses', locale) + '?from=profile')
    }
  }

  // Translations
  const t = {
    title: isEditing 
      ? (locale === 'ar' ? 'تعديل العنوان' : locale === 'ru' ? 'Редактировать адрес' : 'Edit Address')
      : (locale === 'ar' ? 'إضافة عنوان' : locale === 'ru' ? 'Добавить адрес' : 'Add Address'),
    cancel: locale === 'ar' ? 'إلغاء' : locale === 'ru' ? 'Отмена' : 'Cancel',
    save: locale === 'ar' ? 'حفظ' : locale === 'ru' ? 'Сохранить' : 'Save',
    saving: locale === 'ar' ? 'جارٍ الحفظ...' : locale === 'ru' ? 'Сохранение...' : 'Saving...',
    addressType: locale === 'ar' ? 'نوع العنوان' : locale === 'ru' ? 'Тип адреса' : 'Address Type',
    home: locale === 'ar' ? 'المنزل' : locale === 'ru' ? 'Дом' : 'Home',
    work: locale === 'ar' ? 'العمل' : locale === 'ru' ? 'Работа' : 'Work',
    other: locale === 'ar' ? 'آخر' : locale === 'ru' ? 'Другой' : 'Other',
    contactInfo: locale === 'ar' ? 'معلومات الاتصال' : locale === 'ru' ? 'Контактная информация' : 'Contact Information',
    fullName: locale === 'ar' ? 'الاسم الكامل' : locale === 'ru' ? 'Полное имя' : 'Full Name',
    phoneNumber: locale === 'ar' ? 'رقم الهاتف' : locale === 'ru' ? 'Телефон' : 'Phone Number',
    addressDetails: locale === 'ar' ? 'تفاصيل العنوان' : locale === 'ru' ? 'Детали адреса' : 'Address Details',
    streetAddress: locale === 'ar' ? 'عنوان الشارع' : locale === 'ru' ? 'Улица' : 'Street Address',
    streetPlaceholder: locale === 'ar' ? 'رقم المبنى، اسم الشارع' : locale === 'ru' ? 'Номер дома, название улицы' : 'Building number, street name',
    aptUnit: locale === 'ar' ? 'شقة / وحدة (اختياري)' : locale === 'ru' ? 'Квартира (опционально)' : 'Apt / Unit (optional)',
    aptPlaceholder: locale === 'ar' ? 'رقم الشقة، الطابق' : locale === 'ru' ? 'Номер квартиры, этаж' : 'Apartment number, floor',
    city: locale === 'ar' ? 'المدينة' : locale === 'ru' ? 'Город' : 'City',
    emirate: locale === 'ar' ? 'الإمارة' : locale === 'ru' ? 'Эмират' : 'Emirate',
    country: locale === 'ar' ? 'الدولة' : locale === 'ru' ? 'Страна' : 'Country',
    preferences: locale === 'ar' ? 'التفضيلات' : locale === 'ru' ? 'Настройки' : 'Preferences',
    setAsDefault: locale === 'ar' ? 'تعيين كعنوان افتراضي' : locale === 'ru' ? 'Сделать основным' : 'Set as default address',
    defaultHint: locale === 'ar' ? 'سيتم استخدامه تلقائياً عند الدفع' : locale === 'ru' ? 'Будет использоваться при оформлении заказа' : 'Will be used automatically at checkout',
    deliveryNote: locale === 'ar' ? 'يرجى التأكد من صحة العنوان لضمان التسليم السريع' : locale === 'ru' ? 'Пожалуйста, убедитесь в правильности адреса для быстрой доставки' : 'Please ensure your address is correct for fast delivery',
    required: '*',
    validationName: locale === 'ar' ? 'الاسم مطلوب' : locale === 'ru' ? 'Введите имя' : 'Name is required',
    validationPhone: locale === 'ar' ? 'رقم الهاتف مطلوب' : locale === 'ru' ? 'Введите телефон' : 'Phone number is required',
    validationAddress: locale === 'ar' ? 'العنوان مطلوب' : locale === 'ru' ? 'Введите адрес' : 'Street address is required',
    saveFailed: locale === 'ar' ? 'فشل الحفظ' : locale === 'ru' ? 'Ошибка сохранения' : 'Failed to save',
    loading: locale === 'ar' ? 'جارٍ التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...',
  }

  const emirateLabels: Record<string, string> = locale === 'ar' ? {
    'Dubai': 'دبي',
    'Abu Dhabi': 'أبوظبي',
    'Sharjah': 'الشارقة',
    'Ajman': 'عجمان',
    'Umm Al Quwain': 'أم القيوين',
    'Ras Al Khaimah': 'رأس الخيمة',
    'Fujairah': 'الفجيرة',
  } : locale === 'ru' ? {
    'Dubai': 'Дубай',
    'Abu Dhabi': 'Абу-Даби',
    'Sharjah': 'Шарджа',
    'Ajman': 'Аджман',
    'Umm Al Quwain': 'Умм-эль-Кайвайн',
    'Ras Al Khaimah': 'Рас-эль-Хайма',
    'Fujairah': 'Фуджейра',
  } : {}

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">{locale === 'ar' ? 'يرجى تسجيل الدخول' : locale === 'ru' ? 'Пожалуйста, войдите' : 'Please sign in'}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`${embedded ? 'min-h-64 rounded-3xl border border-gray-200 bg-white' : 'min-h-screen bg-white'} flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    )
  }

  return (
    <div
      className={
        embedded
          ? 'overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_14px_40px_rgba(17,24,39,0.04)]'
          : `min-h-screen bg-white ${isAppLikeMode ? 'pb-32' : ''}`
      }
      dir={dir}
    >
      {/* Unified nav header */}
      <div className={`sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="min-w-[80px]">
          <button onClick={handleCancel} className="text-base text-red-600">
            {t.cancel}
          </button>
        </div>
        <h1 className="text-base font-semibold text-gray-900">{t.title}</h1>
        <div className="min-w-[80px] flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`text-base font-semibold ${isSaving ? 'text-gray-400' : 'text-red-600'}`}
          >
            {isSaving ? t.saving : t.save}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className={`text-sm text-red-600 ${isRTL ? 'text-right' : ''}`}>{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="overflow-y-auto">
        {/* Address Type */}
        <div className="py-6 border-b border-gray-100">
          <h2 className={`text-lg font-bold text-gray-900 mb-4 px-5 ${isRTL ? 'text-right' : ''}`}>{t.addressType}</h2>
          <div className={`flex gap-3 px-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {(['home', 'work', 'other'] as const).map(type => (
              <button
                key={type}
                onClick={() => updateField('type', type)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-colors ${
                  formData.type === type 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-700'
                } ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {type === 'home' ? <Home className="w-5 h-5" /> : type === 'work' ? <Briefcase className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                <span className="font-medium">{type === 'home' ? t.home : type === 'work' ? t.work : t.other}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-6 border-b border-gray-100">
          <h2 className={`text-lg font-bold text-gray-900 mb-4 px-5 ${isRTL ? 'text-right' : ''}`}>{t.contactInfo}</h2>
          <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.fullName}<span className="text-red-600"> {t.required}</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full text-base text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 ${isRTL ? 'text-right' : ''}`}
                placeholder={t.fullName}
              />
            </div>
            <div className="px-4 py-3">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.phoneNumber}<span className="text-red-600"> {t.required}</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full text-base text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-500"
                placeholder="+971 XX XXX XXXX"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="py-6 border-b border-gray-100">
          <h2 className={`text-lg font-bold text-gray-900 mb-4 px-5 ${isRTL ? 'text-right' : ''}`}>{t.addressDetails}</h2>
          <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.streetAddress}<span className="text-red-600"> {t.required}</span>
              </label>
              <textarea
                value={formData.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                rows={2}
                className={`w-full text-base text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 resize-none ${isRTL ? 'text-right' : ''}`}
                placeholder={t.streetPlaceholder}
              />
            </div>
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.aptUnit}
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
                className={`w-full text-base text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 ${isRTL ? 'text-right' : ''}`}
                placeholder={t.aptPlaceholder}
              />
            </div>
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.city}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={`w-full text-base text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 ${isRTL ? 'text-right' : ''}`}
              />
            </div>
            <div className="px-4 py-3 border-b border-gray-200">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.emirate}
              </label>
              <div className={`flex flex-wrap gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {EMIRATES.map(emirate => (
                  <button
                    key={emirate.value}
                    onClick={() => updateField('emirate', emirate.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.emirate === emirate.value
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    {emirateLabels[emirate.value] || emirate.value}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3">
              <label className={`text-sm font-medium text-gray-900 mb-1 block ${isRTL ? 'text-right' : ''}`}>
                {t.country}
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                className={`w-full text-base text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 ${isRTL ? 'text-right' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="py-6 border-b border-gray-100">
          <h2 className={`text-lg font-bold text-gray-900 mb-4 px-5 ${isRTL ? 'text-right' : ''}`}>{t.preferences}</h2>
          <div className="mx-5 bg-gray-50 rounded-xl overflow-hidden">
            <div className={`flex items-center justify-between px-4 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-base font-medium text-gray-900">{t.setAsDefault}</p>
                <p className="text-sm text-gray-500 mt-0.5">{t.defaultHint}</p>
              </div>
              <button
                onClick={() => updateField('isDefault', !formData.isDefault)}
                className={`relative w-12 h-7 rounded-full transition-colors ${formData.isDefault ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${formData.isDefault ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Note */}
        <div className="px-5 py-6">
          <div className={`flex items-start gap-2 p-4 bg-gray-50 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>{t.deliveryNote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AddAddressPage() {
  return <AddressEditorContent />
}

