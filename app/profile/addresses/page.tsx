'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Plus, Home, Briefcase, MoreHorizontal, Trash2, Edit, Check, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'

interface Address {
  id: string
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  emirate: string
  country: string
  phone: string
  type: string
  isDefault: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  
  const fromPage = searchParams?.get('from')

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  // Fetch addresses from API
  const fetchAddresses = useCallback(async () => {
    try {
      const response = await fetch('/api/addresses')
      const data = await response.json()
      if (data.addresses) {
        setAddresses(data.addresses)
      }
    } catch (error) {
      errorLog('Failed to fetch addresses:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchAddresses()
    } else {
      setLoading(false)
    }
  }, [user, fetchAddresses])

  const handleBack = () => {
    if (fromPage === 'profile') {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.back()
    }
  }

  const handleAddAddress = () => {
    router.push(getLocalizedPath('/profile/addresses/add', locale) + '?from=profile')
  }

  const handleEditAddress = (addressId: string) => {
    router.push(getLocalizedPath('/profile/addresses/add', locale) + `?edit=${addressId}&from=profile`)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm(t.deleteConfirm)) return
    
    setDeletingId(addressId)
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setAddresses(prev => prev.filter(a => a.id !== addressId))
        setShowOptionsFor(null)
      }
    } catch (error) {
      errorLog('Failed to delete address:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    setSettingDefaultId(addressId)
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true })
      })
      const data = await response.json()
      if (data.success) {
        setAddresses(prev => prev.map(a => ({
          ...a,
          isDefault: a.id === addressId
        })))
        setShowOptionsFor(null)
      }
    } catch (error) {
      errorLog('Failed to set default:', error)
    } finally {
      setSettingDefaultId(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'work':
      case 'office':
        return <Briefcase className="w-5 h-5 text-red-600" />
      default:
        return <Home className="w-5 h-5 text-red-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    const key = type?.toLowerCase() || 'home'
    if (key === 'work' || key === 'office') {
      return locale === 'ar' ? 'العمل' : locale === 'ru' ? 'Работа' : 'Work'
    }
    if (key === 'other') {
      return locale === 'ar' ? 'آخر' : locale === 'ru' ? 'Другой' : 'Other'
    }
    return locale === 'ar' ? 'المنزل' : locale === 'ru' ? 'Дом' : 'Home'
  }

  const formatEmirate = (emirate: string) => {
    if (!emirate) return ''
    if (locale === 'ar') {
      const arabicNames: Record<string, string> = {
        'Dubai': 'دبي',
        'Abu Dhabi': 'أبوظبي',
        'Sharjah': 'الشارقة',
        'Ajman': 'عجمان',
        'Ras Al Khaimah': 'رأس الخيمة',
        'Fujairah': 'الفجيرة',
        'Umm Al Quwain': 'أم القيوين',
      }
      return arabicNames[emirate] || emirate
    }
    return emirate
  }

  // Translations
  const t = {
    title: locale === 'ar' ? 'العناوين' : locale === 'ru' ? 'Адреса' : 'Addresses',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
    manageHint: locale === 'ar' ? 'إدارة عناوين التسليم الخاصة بك' : locale === 'ru' ? 'Управляйте адресами доставки' : 'Manage your delivery addresses',
    addNew: locale === 'ar' ? 'إضافة عنوان جديد' : locale === 'ru' ? 'Добавить новый адрес' : 'Add New Address',
    default: locale === 'ar' ? 'افتراضي' : locale === 'ru' ? 'По умолчанию' : 'Default',
    edit: locale === 'ar' ? 'تعديل' : locale === 'ru' ? 'Редактировать' : 'Edit',
    delete: locale === 'ar' ? 'حذف' : locale === 'ru' ? 'Удалить' : 'Delete',
    setAsDefault: locale === 'ar' ? 'تعيين كافتراضي' : locale === 'ru' ? 'Сделать основным' : 'Set as Default',
    emptyTitle: locale === 'ar' ? 'لا توجد عناوين' : locale === 'ru' ? 'Нет адресов' : 'No addresses yet',
    emptySubtitle: locale === 'ar' ? 'أضف عنوان التسليم الأول الخاص بك' : locale === 'ru' ? 'Добавьте свой первый адрес доставки' : 'Add your first delivery address',
    loading: locale === 'ar' ? 'جارٍ التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...',
    deliveryTips: locale === 'ar' ? 'نصائح التسليم' : locale === 'ru' ? 'Советы по доставке' : 'Delivery Tips',
    tipDefault: locale === 'ar' ? 'قم بتعيين عنوان افتراضي للدفع بشكل أسرع' : locale === 'ru' ? 'Установите адрес по умолчанию для быстрой оплаты' : 'Set a default address for faster checkout',
    tipApt: locale === 'ar' ? 'تضمين رقم الشقة/الطابق للتسليم الدقيق' : locale === 'ru' ? 'Укажите номер квартиры/этажа для точной доставки' : 'Include apartment/floor number for accurate delivery',
    tipPhone: locale === 'ar' ? 'أضف رقم هاتف صالح للتواصل بشأن التسليم' : locale === 'ru' ? 'Укажите действительный телефон для связи по доставке' : 'Add a valid phone number for delivery contact',
    country: locale === 'ar' ? 'الإمارات العربية المتحدة' : locale === 'ru' ? 'ОАЭ' : 'United Arab Emirates',
    deleteConfirm: locale === 'ar' ? 'هل أنت متأكد من حذف هذا العنوان؟' : locale === 'ru' ? 'Удалить этот адрес?' : 'Are you sure you want to delete this address?',
    deleting: locale === 'ar' ? 'جارٍ الحذف...' : locale === 'ru' ? 'Удаление...' : 'Deleting...',
    setting: locale === 'ar' ? 'جارٍ التعيين...' : locale === 'ru' ? 'Настройка...' : 'Setting...',
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">{locale === 'ar' ? 'يرجى تسجيل الدخول' : locale === 'ru' ? 'Пожалуйста, войдите' : 'Please sign in'}</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white ${isPWA ? 'pb-32' : ''}`} dir={dir}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={handleBack}
          className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-6 h-6 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-sm font-semibold text-red-600">{t.back}</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t.title}</h1>
        <button onClick={handleAddAddress} className="p-1">
          <Plus className="w-6 h-6 text-red-600" />
        </button>
      </div>

      {/* Info Section */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
        <p className={`text-sm text-gray-500 text-center ${isRTL ? 'text-right' : ''}`}>
          {t.manageHint}
        </p>
      </div>

      {/* Content */}
      <div className="overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            <p className="text-gray-500 mt-3">{t.loading}</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="px-5 py-5 space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-gray-50 rounded-xl p-4">
                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {getTypeIcon(address.type)}
                    <span className="text-base font-semibold text-gray-900">{getTypeLabel(address.type)}</span>
                    {address.isDefault && (
                      <span className={`px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        {t.default}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowOptionsFor(showOptionsFor === address.id ? null : address.id)}
                    className="p-1"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className={`space-y-1 ${isRTL ? 'text-right pr-7' : 'pl-7'}`}>
                  <p className="text-base font-medium text-gray-900">{address.name}</p>
                  <p className="text-sm text-gray-500">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-sm text-gray-500">{address.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-500">{address.city}, {formatEmirate(address.emirate)}</p>
                  <p className="text-sm text-gray-500">{t.country}</p>
                  <p className="text-sm text-gray-500 mt-1" dir="ltr">{address.phone}</p>
                </div>

                {/* Options Dropdown */}
                {showOptionsFor === address.id && (
                  <div className={`mt-3 pt-3 border-t border-gray-200 flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button 
                      onClick={() => handleEditAddress(address.id)}
                      className={`flex items-center gap-1 px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Edit className="w-4 h-4" />
                      {t.edit}
                    </button>
                    {!address.isDefault && (
                      <button 
                        onClick={() => handleSetDefault(address.id)}
                        disabled={settingDefaultId === address.id}
                        className={`flex items-center gap-1 px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 ${isRTL ? 'flex-row-reverse' : ''} ${settingDefaultId === address.id ? 'opacity-50' : ''}`}
                      >
                        {settingDefaultId === address.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {settingDefaultId === address.id ? t.setting : t.setAsDefault}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={deletingId === address.id}
                      className={`flex items-center gap-1 px-3 py-2 bg-red-50 rounded-lg text-sm font-medium text-red-600 border border-red-200 ${isRTL ? 'flex-row-reverse' : ''} ${deletingId === address.id ? 'opacity-50' : ''}`}
                    >
                      {deletingId === address.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      {deletingId === address.id ? t.deleting : t.delete}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className={`text-base font-semibold text-gray-900 mb-1 ${isRTL ? 'text-right' : ''}`}>
                {t.emptyTitle}
              </h3>
              <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
                {t.emptySubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Add New Address Button */}
        <div className="px-5 py-4">
          <button 
            onClick={handleAddAddress}
            className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-5"
          >
            <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Plus className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-base font-medium text-red-600">{t.addNew}</span>
            </div>
          </button>
        </div>

        {/* Tips Section */}
        <div className="px-5 py-6 bg-gray-50 mt-4">
          <h3 className={`text-lg font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : ''}`}>
            {t.deliveryTips}
          </h3>
          <div className="space-y-2">
            {[t.tipDefault, t.tipApt, t.tipPhone].map((tip, index) => (
              <div key={index} className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
