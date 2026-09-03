'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CreditCard, ArrowLeft, Save, Loader2, FileText, Building, Check, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { errorLog } from '@/lib/logger'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface BillingPageProps {
  embedded?: boolean
}

export function BillingContent({ embedded = false }: BillingPageProps) {
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
  const [originalBillingAddress, setOriginalBillingAddress] = useState('')
  const [originalVatNumber, setOriginalVatNumber] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
          const addr = data?.billingAddress || ''
          const vat = data?.vatNumber || ''
          setBillingAddress(addr)
          setVatNumber(vat)
          setOriginalBillingAddress(addr)
          setOriginalVatNumber(vat)
        }
      } catch (error) {
        errorLog('Error fetching billing:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBilling()
  }, [user])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const isDirty =
    billingAddress.trim() !== originalBillingAddress.trim() ||
    vatNumber.trim() !== originalVatNumber.trim()

  const vatDigits = vatNumber.replace(/\D/g, '')
  const vatInvalid = vatNumber.trim().length > 0 && vatDigits.length !== 15

  const handleBack = () => {
    if (fromPage === 'profile') {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.back()
    }
  }

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!user || saving || !isDirty || vatInvalid) return
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
        setOriginalBillingAddress(billingAddress.trim())
        setOriginalVatNumber(vatNumber.trim())
        setToast({ type: 'success', message: translations.saved })
        if (!embedded) {
          setTimeout(() => handleBack(), 900)
        }
      } else {
        setToast({ type: 'error', message: translations.saveFailed })
      }
    } catch {
      setToast({ type: 'error', message: translations.saveFailed })
    } finally {
      setSaving(false)
    }
  }

  const translations = {
    title: locale === 'ar' ? 'الدفع والفواتير' : locale === 'ru' ? 'Оплата и счета' : 'Payment & Billing',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
    save: locale === 'ar' ? 'حفظ' : locale === 'ru' ? 'Сохранить' : 'Save',
    saving: locale === 'ar' ? 'جارٍ الحفظ...' : locale === 'ru' ? 'Сохранение...' : 'Saving...',
    optional: locale === 'ar' ? '(اختياري)' : locale === 'ru' ? '(необязательно)' : '(optional)',
    billingAddress: locale === 'ar' ? 'عنوان الفواتير' : locale === 'ru' ? 'Адрес для счетов' : 'Billing Address',
    billingAddressPlaceholder: locale === 'ar' ? 'اسم الشركة، الشارع، المدينة، الإمارة' : locale === 'ru' ? 'Название компании, улица, город, эмират' : 'Company name, street, city, emirate',
    billingAddressHint: locale === 'ar' ? 'يظهر على فواتيرك وإيصالاتك الضريبية' : locale === 'ru' ? 'Отображается в счетах и налоговых документах' : 'Shown on invoices and tax receipts',
    vatNumber: locale === 'ar' ? 'رقم ضريبة القيمة المضافة (TRN)' : locale === 'ru' ? 'Номер НДС (TRN)' : 'VAT Number (TRN)',
    vatNumberPlaceholder: '100000000000000',
    vatNumberHint: locale === 'ar' ? '15 رقمًا - للفواتير الضريبية في الإمارات' : locale === 'ru' ? '15 цифр - для налоговых счетов ОАЭ' : '15 digits - for UAE tax invoices',
    vatInvalid: locale === 'ar' ? 'يجب أن يتكون من 15 رقمًا' : locale === 'ru' ? 'Должно быть 15 цифр' : 'Must be exactly 15 digits',
    saved: locale === 'ar' ? 'تم الحفظ' : locale === 'ru' ? 'Сохранено' : 'Saved',
    saveFailed: locale === 'ar' ? 'فشل الحفظ' : locale === 'ru' ? 'Ошибка сохранения' : 'Failed to save',
    loading: locale === 'ar' ? 'جارٍ التحميل...' : locale === 'ru' ? 'Загрузка...' : 'Loading...',
    paymentMethods: locale === 'ar' ? 'طرق الدفع المقبولة' : locale === 'ru' ? 'Доступные способы оплаты' : 'Accepted Payment Methods',
    secureByStripe: locale === 'ar' ? 'معالجة آمنة عبر Stripe' : locale === 'ru' ? 'Безопасная оплата через Stripe' : 'Secure checkout powered by Stripe',
    cashOnDelivery: locale === 'ar' ? 'الدفع عند الاستلام متاح أيضًا' : locale === 'ru' ? 'Наложенный платёж также доступен' : 'Cash on Delivery also available',
  }

  if (!user) {
    return (
      <div className={`cera-page genosys-page min-h-screen flex items-center justify-center`}>
        <p className="text-[var(--cera-muted)]">{locale === 'ar' ? 'يرجى تسجيل الدخول' : locale === 'ru' ? 'Пожалуйста, войдите' : 'Please sign in'}</p>
      </div>
    )
  }

  return (
    <div
      className={
        embedded
          ? 'overflow-hidden rounded-3xl border border-[var(--cera-line)] bg-white shadow-[0_14px_40px_-28px_rgba(23,20,15,0.26)]'
          : `cera-page genosys-page min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`
      }
      dir={dir}
    >
      {/* Unified nav header */}
      {!embedded && (
        <div className={`mweb-float-sticky-top sticky top-0 z-10 bg-[var(--cera-cream)]/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-[var(--cera-line)] ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-1 min-w-[80px] px-1 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-[15px] text-[var(--cera-rose-ink)]">{translations.back}</span>
          </button>
          <h1 className="text-[17px] font-semibold text-[var(--cera-ink)]">{translations.title}</h1>
          <div className="min-w-[80px]" />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-[var(--cera-rose-ink)] animate-spin" />
          <p className="text-[var(--cera-muted)] mt-3">{translations.loading}</p>
        </div>
      ) : (
        <form onSubmit={handleSave} noValidate className="max-w-xl mx-auto p-5 space-y-6">
          <div>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[var(--cera-blush)] border border-[var(--cera-blush-deep)] flex items-center justify-center">
                <Building className="w-4 h-4 text-[var(--cera-rose-ink)]" />
              </div>
              <label htmlFor="billingAddress" className={`text-[17px] font-semibold text-[var(--cera-ink)] ${isRTL ? 'text-right' : ''}`}>
                {translations.billingAddress}{' '}
                <span className="text-[var(--cera-muted)] font-normal">{translations.optional}</span>
              </label>
            </div>
            <div className="bg-[var(--cera-cream-deep)] rounded-xl p-4 border border-[var(--cera-line)] focus-within:bg-white focus-within:ring-1 focus-within:ring-[var(--cera-rose)] transition-colors">
              <textarea
                id="billingAddress"
                name="billingAddress"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder={translations.billingAddressPlaceholder}
                rows={4}
                autoComplete="street-address"
                className={`w-full bg-transparent text-base text-[var(--cera-ink)] placeholder:text-[var(--cera-muted)] outline-none resize-none ${isRTL ? 'text-right' : ''}`}
              />
            </div>
            <p className={`text-xs text-[var(--cera-muted)] mt-2 ${isRTL ? 'text-right' : ''}`}>
              {translations.billingAddressHint}
            </p>
          </div>

          <div>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[var(--cera-blush)] border border-[var(--cera-blush-deep)] flex items-center justify-center">
                <FileText className="w-4 h-4 text-[var(--cera-rose-ink)]" />
              </div>
              <label htmlFor="vatNumber" className={`text-base font-semibold text-[var(--cera-ink)] ${isRTL ? 'text-right' : ''}`}>
                {translations.vatNumber}{' '}
                <span className="text-[var(--cera-muted)] font-normal">{translations.optional}</span>
              </label>
            </div>
            <div className={`bg-[var(--cera-cream-deep)] rounded-xl p-4 border transition-colors focus-within:bg-white focus-within:ring-1 ${vatInvalid ? 'border-red-300 focus-within:ring-red-400' : 'border-[var(--cera-line)] focus-within:ring-[var(--cera-rose)]'}`}>
              <input
                id="vatNumber"
                name="vatNumber"
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
                placeholder={translations.vatNumberPlaceholder}
                inputMode="numeric"
                pattern="\d{15}"
                maxLength={15}
                autoComplete="off"
                aria-invalid={vatInvalid}
                aria-describedby="vatNumber-hint"
                className="w-full bg-transparent text-base text-[var(--cera-ink)] placeholder:text-[var(--cera-muted)] outline-none tracking-wider"
                dir="ltr"
              />
            </div>
            <p
              id="vatNumber-hint"
              className={`text-xs mt-2 flex items-center gap-1 ${vatInvalid ? 'text-red-600' : 'text-[var(--cera-muted)]'} ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              {vatInvalid && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
              {vatInvalid ? translations.vatInvalid : translations.vatNumberHint}
            </p>
          </div>

          <div>
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-[var(--cera-cream-deep)] border border-[var(--cera-line)] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[var(--cera-body)]" />
              </div>
              <h2 className={`text-base font-semibold text-[var(--cera-ink)] ${isRTL ? 'text-right' : ''}`}>{translations.paymentMethods}</h2>
            </div>
            <div className="bg-[var(--cera-cream-deep)] rounded-xl p-4 border border-[var(--cera-line)] space-y-3">
              <div className={`flex items-center gap-2 text-sm text-[var(--cera-body)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Lock className="w-3.5 h-3.5 text-[var(--cera-muted)] flex-shrink-0" />
                <span>{translations.secureByStripe}</span>
              </div>
              <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs font-semibold text-[var(--cera-body)] border border-[var(--cera-line)]">Visa</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs font-semibold text-[var(--cera-body)] border border-[var(--cera-line)]">Mastercard</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs font-semibold text-[var(--cera-body)] border border-[var(--cera-line)]">Apple Pay</span>
                <span className="px-2.5 py-1 bg-white rounded-md text-xs font-semibold text-[var(--cera-body)] border border-[var(--cera-line)]">Google Pay</span>
              </div>
              <div className={`flex items-center gap-2 text-sm text-[var(--cera-body)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Check className="w-4 h-4 text-[var(--cera-ok)] flex-shrink-0" />
                <span>{translations.cashOnDelivery}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !isDirty || vatInvalid}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2 ${
              saving || !isDirty || vatInvalid ? 'bg-[var(--cera-blush-deep)] cursor-not-allowed' : 'bg-[var(--cera-rose)] hover:bg-[var(--cera-rose-ink)] active:scale-[0.99]'
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
        </form>
      )}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 pointer-events-none"
        >
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-sm font-medium text-white ${
              toast.type === 'success' ? 'bg-[var(--cera-ink)]' : 'bg-[var(--status-red)]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BillingPage() {
  return <BillingContent />
}

