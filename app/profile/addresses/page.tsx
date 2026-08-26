'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Plus, Home, Briefcase, MoreHorizontal, Trash2, Edit, Check, ArrowLeft, Loader2, X, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

// UAE phone display formatter. Accepts raw user input (with or without
// country code, with or without spaces) and outputs canonical "+971 XX XXX XXXX".
// If input doesn't parse as a UAE number, returns it unchanged so we never mangle
// international numbers a user might have entered.
function formatUAEPhoneForDisplay(raw: string): string {
  if (!raw) return ''
  const digits = raw.replace(/[^\d]/g, '')
  let local = digits
  if (local.startsWith('00971')) local = local.slice(5)
  else if (local.startsWith('971')) local = local.slice(3)
  else if (local.startsWith('0')) local = local.slice(1)
  if (local.length !== 9) return raw
  return `+971 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`
}

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

interface AddressesPageProps {
  embedded?: boolean
}

export function AddressesContent({ embedded = false }: AddressesPageProps) {
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

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showOptionsFor, setShowOptionsFor] = useState<string | null>(null)
  const [confirmingDeleteFor, setConfirmingDeleteFor] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)

  // Dismiss the inline action menu when the user taps anywhere outside a
  // card, or presses Escape — prevents the "trapped open" state where the
  // only way to close it is re-tapping the ••• icon.
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!showOptionsFor && !confirmingDeleteFor) return
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.closest('[data-address-card]')) return
      setShowOptionsFor(null)
      setConfirmingDeleteFor(null)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowOptionsFor(null)
        setConfirmingDeleteFor(null)
      }
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer, { passive: true })
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [showOptionsFor, confirmingDeleteFor])

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
    router.push(
      embedded
        ? `${getLocalizedPath('/profile', locale)}?tab=addresses&mode=add`
        : getLocalizedPath('/profile/addresses/add', locale) + '?from=profile'
    )
  }

  const handleEditAddress = (addressId: string) => {
    router.push(
      embedded
        ? `${getLocalizedPath('/profile', locale)}?tab=addresses&edit=${encodeURIComponent(addressId)}`
        : getLocalizedPath('/profile/addresses/add', locale) + `?edit=${addressId}&from=profile`
    )
  }

  const handleRequestDelete = (addressId: string) => {
    setConfirmingDeleteFor(addressId)
    setShowOptionsFor(null)
  }

  const handleConfirmDelete = async (addressId: string) => {
    setDeletingId(addressId)
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setAddresses(prev => prev.filter(a => a.id !== addressId))
        setConfirmingDeleteFor(null)
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
        return <Briefcase className="w-5 h-5 text-[var(--cera-rose-ink)]" />
      case 'other':
        return <MapPin className="w-5 h-5 text-[var(--cera-rose-ink)]" />
      default:
        return <Home className="w-5 h-5 text-[var(--cera-rose-ink)]" />
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
    deleting: locale === 'ar' ? 'جارٍ الحذف...' : locale === 'ru' ? 'Удаление...' : 'Deleting...',
    setting: locale === 'ar' ? 'جارٍ التعيين...' : locale === 'ru' ? 'Настройка...' : 'Setting...',
    removeThisAddress: locale === 'ar' ? 'حذف هذا العنوان؟' : locale === 'ru' ? 'Удалить этот адрес?' : 'Remove this address?',
    keep: locale === 'ar' ? 'إلغاء' : locale === 'ru' ? 'Отмена' : 'Cancel',
    removeOptions: locale === 'ar' ? 'الخيارات' : locale === 'ru' ? 'Параметры' : 'Options',
    closeMenu: locale === 'ar' ? 'إغلاق القائمة' : locale === 'ru' ? 'Закрыть меню' : 'Close menu',
  }

  if (!user) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen flex items-center justify-center`}>
        <p className="text-[var(--cera-muted)]">{locale === 'ar' ? 'يرجى تسجيل الدخول' : locale === 'ru' ? 'Пожалуйста, войдите' : 'Please sign in'}</p>
      </div>
    )
  }

  return (
    <div
      className={
        embedded
          ? 'overflow-hidden rounded-3xl border border-[var(--cera-line)] bg-white shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)]'
          : `cera-page genosys-page ${ceraSerif.variable} min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`
      }
      dir={dir}
    >
      {/* Unified nav header */}
      {!embedded && (
        <div className={`mweb-float-sticky-top sticky top-0 z-10 bg-[var(--cera-cream)]/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-[var(--cera-line)] ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={handleBack}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-[var(--cera-rose-ink)]">{t.back}</span>
          </button>
          <h1 className="text-base font-semibold text-[var(--cera-ink)]">{t.title}</h1>
          <div className="min-w-[80px] flex justify-end">
            <button onClick={handleAddAddress} className="p-1" aria-label="Add address">
              <Plus className="w-6 h-6 text-[var(--cera-rose-ink)]" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="overflow-y-auto" ref={listRef}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[var(--cera-rose-ink)] animate-spin" />
            <p className="text-[var(--cera-muted)] mt-3">{t.loading}</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="px-5 pt-5 pb-2 space-y-4">
            {addresses.map((address) => {
              const isMenuOpen = showOptionsFor === address.id
              const isConfirmingDelete = confirmingDeleteFor === address.id
              const isDeleting = deletingId === address.id
              return (
              <div
                key={address.id}
                data-address-card
                className="bg-[var(--cera-cream-deep)] rounded-xl p-4 transition-colors active:bg-[var(--cera-cream-deep)]"
              >
                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {getTypeIcon(address.type)}
                    <span className="text-base font-semibold text-[var(--cera-ink)]">{getTypeLabel(address.type)}</span>
                    {address.isDefault && (
                      <span className={`px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        {t.default}
                      </span>
                    )}
                  </div>
                  {/* 40×40 tap target — previously 28×28 which sat below the
                      44px iOS HIG minimum. -mr-2 keeps the icon optically
                      aligned to the card edge. */}
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingDeleteFor(null)
                      setShowOptionsFor(isMenuOpen ? null : address.id)
                    }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--cera-cream-deep)] active:bg-[var(--cera-cream-deep)] transition-colors ${isRTL ? '-ml-2' : '-mr-2'}`}
                    aria-label={isMenuOpen ? t.closeMenu : t.removeOptions}
                    aria-expanded={isMenuOpen}
                  >
                    {isMenuOpen ? (
                      <X className="w-5 h-5 text-[var(--cera-muted)]" />
                    ) : (
                      <MoreHorizontal className="w-5 h-5 text-[var(--cera-muted)]" />
                    )}
                  </button>
                </div>
                <div className={`space-y-1 ${isRTL ? 'text-right pr-7' : 'pl-7'}`}>
                  <p className="text-base font-medium text-[var(--cera-ink)]">{address.name}</p>
                  <p className="text-sm text-[var(--cera-muted)]">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-sm text-[var(--cera-muted)]">{address.addressLine2}</p>
                  )}
                  <p className="text-sm text-[var(--cera-muted)]">{address.city}, {formatEmirate(address.emirate)}</p>
                  <p className="text-sm text-[var(--cera-muted)]">{t.country}</p>
                  <p className="text-sm text-[var(--cera-muted)] mt-1" dir="ltr">{formatUAEPhoneForDisplay(address.phone)}</p>
                </div>

                {/* Inline delete confirmation — replaces native confirm()
                    dialog which looked like a Safari error popup on mobile. */}
                {isConfirmingDelete && (
                  <div className="mt-4 pt-4 border-t border-[var(--cera-line)]">
                    <div className={`flex items-start gap-2 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <AlertTriangle className="w-5 h-5 text-[var(--cera-rose-ink)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm font-medium text-[var(--cera-ink)]">{t.removeThisAddress}</p>
                    </div>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        type="button"
                        onClick={() => setConfirmingDeleteFor(null)}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 bg-white rounded-lg text-sm font-medium text-[var(--cera-body)] border border-[var(--cera-line)] active:bg-[var(--cera-cream-deep)]"
                      >
                        {t.keep}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(address.id)}
                        disabled={isDeleting}
                        className={`flex-1 py-2.5 bg-[var(--cera-rose)] rounded-lg text-sm font-semibold text-white active:bg-[var(--cera-rose-ink)] inline-flex items-center justify-center gap-1.5 ${isDeleting ? 'opacity-60' : ''}`}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t.deleting}
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            {t.delete}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Action menu — inline iOS-style action list. Previously
                    a cramped 3-button horizontal row that wrapped on small
                    screens; now each action is full-width with a 44px tap
                    target and dividers between them. */}
                {isMenuOpen && !isConfirmingDelete && (
                  <div className="mt-4 pt-2 border-t border-[var(--cera-line)] bg-white rounded-lg overflow-hidden -mx-1">
                    <button
                      type="button"
                      onClick={() => handleEditAddress(address.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--cera-ink)] active:bg-[var(--cera-cream-deep)] ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <Edit className="w-4 h-4 text-[var(--cera-muted)] flex-shrink-0" />
                      <span className="flex-1 text-start">{t.edit}</span>
                    </button>
                    {!address.isDefault && (
                      <>
                        <div className={`border-t border-[var(--cera-line)] ${isRTL ? 'mr-11' : 'ml-11'}`} />
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={settingDefaultId === address.id}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--cera-ink)] active:bg-[var(--cera-cream-deep)] ${isRTL ? 'flex-row-reverse text-right' : ''} ${settingDefaultId === address.id ? 'opacity-60' : ''}`}
                        >
                          {settingDefaultId === address.id ? (
                            <Loader2 className="w-4 h-4 text-[var(--cera-muted)] animate-spin flex-shrink-0" />
                          ) : (
                            <Check className="w-4 h-4 text-[var(--cera-muted)] flex-shrink-0" />
                          )}
                          <span className="flex-1 text-start">{settingDefaultId === address.id ? t.setting : t.setAsDefault}</span>
                        </button>
                      </>
                    )}
                    <div className={`border-t border-[var(--cera-line)] ${isRTL ? 'mr-11' : 'ml-11'}`} />
                    <button
                      type="button"
                      onClick={() => handleRequestDelete(address.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--cera-rose-ink)] active:bg-[var(--cera-blush)] ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <Trash2 className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-start">{t.delete}</span>
                    </button>
                  </div>
                )}
              </div>
              )
            })}
          </div>
        ) : (
          <div className="px-5 py-8">
            <div className="bg-[var(--cera-cream-deep)] rounded-xl p-6 text-center">
              <MapPin className="w-12 h-12 text-[var(--cera-blush-deep)] mx-auto mb-3" />
              <h3 className={`text-base font-semibold text-[var(--cera-ink)] mb-1 ${isRTL ? 'text-right' : ''}`}>
                {t.emptyTitle}
              </h3>
              <p className={`text-sm text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}>
                {t.emptySubtitle}
              </p>
            </div>
          </div>
        )}

        {/* Add New Address Button */}
        <div className="px-5 py-4">
          <button 
            onClick={handleAddAddress}
            className="w-full bg-[var(--cera-cream-deep)] border-2 border-dashed border-[var(--cera-line)] rounded-xl py-5"
          >
            <div className={`flex items-center justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Plus className="w-6 h-6 text-[var(--cera-rose-ink)]" />
              </div>
              <span className="text-base font-medium text-[var(--cera-rose-ink)]">{t.addNew}</span>
            </div>
          </button>
        </div>

        {/* Tips Section */}
        <div className="px-5 py-6 bg-[var(--cera-cream-deep)] mt-4">
          <h3 className={`text-lg font-semibold text-[var(--cera-ink)] mb-3 ${isRTL ? 'text-right' : ''}`}>
            {t.deliveryTips}
          </h3>
          <div className="space-y-2">
            {[t.tipDefault, t.tipApt, t.tipPhone].map((tip, index) => (
              <div key={index} className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className={`text-sm text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AddressesPage() {
  return <AddressesContent />
}
