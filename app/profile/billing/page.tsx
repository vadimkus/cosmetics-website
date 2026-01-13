'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, ArrowLeft, Save, Loader2, FileText, Building } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'

export default function BillingPage() {
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

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [billingAddress, setBillingAddress] = useState('')
  const [vatNumber, setVatNumber] = useState('')

  // Fetch billing data
  useEffect(() => {
    const fetchBilling = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      try {
        const response = await fetch('/api/user/billing')
        if (response.ok) {
          const data = await response.json()
          setBillingAddress(data?.billingAddress || '')
          setVatNumber(data?.vatNumber || '')
        }
      } catch (error) {
        errorLog('Error fetching billing:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBilling()
  }, [user])

  const handleBack = () => {
    if (fromPage === 'profile') {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.back()
    }
  }

  const handleSave = async () => {
    if (!user || saving) return
    setSaving(true)
    try {
      const response = await fetch('/api/user/billing', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billingAddress: billingAddress.trim() || null,
          vatNumber: vatNumber.trim() || null,
        }),
      })
      
      if (response.ok) {
        alert(translations.saved)
        handleBack()
      } else {
        alert(translations.saveFailed)
      }
    } catch (error) {
      alert(translations.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  // Translations
  const translations = {
    title: locale === 'ar' ? 'الدفع والفواتير' : locale === 'ru' ? 'Оплата и счета' : 'Payment & Billing',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
    save: locale === 'ar' ? 'حفظ' : locale === 'ru' ? 'Сохранить' : 'Save',
    saving: locale === 'ar' ? 'جارٍ الحفظ...' : locale === 'ru' ? 'Сохранение...' : 'Saving...',
    billingAddress: locale === 'ar' ? 'عنوان الفواتير' : locale === 'ru' ? 'Адрес для счетов' : 'Billing Address',
    billingAddressPlaceholder: locale === 'ar' ? 'أدخل عنوان الفواتير الخاص بك...' : locale === 'ru' ? 'Введите адрес для счетов...' : 'Enter your billing address...',
    billingAddressHint: locale === 'ar' ? 'يستخدم للفواتير والإيصالات الضريبية' : locale === 'ru' ? 'Используется для счетов и налоговых документов' : 'Used for invoices and tax receipts',
    vatNumber: locale === 'ar' ? 'رقم ضريبة القيمة المضافة (TRN)' : locale === 'ru' ? 'Номер НДС (TRN)' : 'VAT Number (TRN)',
    vatNumberPlaceholder: locale === 'ar' ? 'أدخل رقم TRN الخاص بك...' : locale === 'ru' ? 'Введите ваш TRN...' : 'Enter your TRN...',
    vatNumberHint: locale === 'ar' ? 'رقم التسجيل الضريبي للفواتير الضريبية' : locale === 'ru' ? 'Налоговый регистрационный номер для счетов' : 'Tax Registration Number for tax invoices',
    saved: locale === 'ar' ? 'تم الحفظ بنجاح' : locale === 'ru' ? 'Сохранено успешно' : 'Saved successfully',
    saveFailed: locale === 'ar' ? 'فشل الحفظ' : locale === 'ru' ? 'Ошибка сохранения' : 'Failed to save',
    loading: locale === 'ar' ? 'جارٍ التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...',
    paymentMethods: locale === 'ar' ? 'طرق الدفع' : locale === 'ru' ? 'Способы оплаты' : 'Payment Methods',
    paymentMethodsHint: locale === 'ar' ? 'يتم معالجة المدفوعات بشكل آمن عبر Stripe' : locale === 'ru' ? 'Платежи безопасно обрабатываются через Stripe' : 'Payments are securely processed via Stripe',
    supportedCards: locale === 'ar' ? 'البطاقات المدعومة:' : locale === 'ru' ? 'Поддерживаемые карты:' : 'Supported cards:',
    cashOnDelivery: locale === 'ar' ? 'الدفع عند الاستلام متاح أيضًا' : locale === 'ru' ? 'Наложенный платеж также доступен' : 'Cash on Delivery is also available',
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
        <div className="w-16" /> {/* Spacer */}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <p className="text-gray-500 mt-3">{translations.loading}</p>
        </div>
      ) : (
        <div className="p-5 space-y-6">
          {/* Billing Address Section */}
          <div>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <Building className="w-4 h-4 text-red-600" />
              </div>
              <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.billingAddress}</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <textarea
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder={translations.billingAddressPlaceholder}
                rows={4}
                className={`w-full bg-transparent text-base text-gray-900 outline-none resize-none ${isRTL ? 'text-right' : ''}`}
              />
              <p className={`text-xs text-gray-500 mt-2 ${isRTL ? 'text-right' : ''}`}>
                {translations.billingAddressHint}
              </p>
            </div>
          </div>

          {/* VAT Number Section */}
          <div>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
              <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.vatNumber}</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value.toUpperCase())}
                placeholder={translations.vatNumberPlaceholder}
                className={`w-full bg-transparent text-base text-gray-900 outline-none ${isRTL ? 'text-right' : ''}`}
                dir="ltr"
              />
              <p className={`text-xs text-gray-500 mt-2 ${isRTL ? 'text-right' : ''}`}>
                {translations.vatNumberHint}
              </p>
            </div>
          </div>

          {/* Payment Methods Info */}
          <div>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-red-600" />
              </div>
              <h2 className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : ''}`}>{translations.paymentMethods}</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : ''}`}>
                {translations.paymentMethodsHint}
              </p>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>{translations.supportedCards}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 border border-gray-200">Visa</span>
                  <span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700 border border-gray-200">Mastercard</span>
                </div>
              </div>
              <p className={`text-sm text-green-600 font-medium ${isRTL ? 'text-right' : ''}`}>
                ✓ {translations.cashOnDelivery}
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-colors ${
              saving ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {saving ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {translations.saving}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {translations.save}
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

