'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Minus, Check, Loader2, Package, RefreshCw } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { PartnerGuard } from '@/components/partners/PartnerGuard'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import type { Product } from '@/types'

function PartnerOrderInner() {
  const router = useRouter()
  const { locale, dir } = useTranslation()
  const { user } = useAuth()
  const { isPWA } = usePWAMode()
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [qty, setQty] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState<{ orderNumber: string; total: number; paymentOption: string } | null>(null)
  const [reorderLoaded, setReorderLoaded] = useState(0)

  const hasConsignment = user?.consignmentActive === true
  const [payOption, setPayOption] = useState<'consignment' | 'online' | 'cod'>('cod')
  useEffect(() => {
    if (hasConsignment) setPayOption('consignment')
  }, [hasConsignment])

  const isRTL = dir === 'rtl'
  const t = (en: string, ru: string, ar: string) => (locale === 'ru' ? ru : locale === 'ar' ? ar : en)

  useEffect(() => {
    const check = () => setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [isPWA])

  const isAppLikeMode = isPWA || isMobileWeb

  useEffect(() => {
    fetchCsrfToken().catch(() => {})
    const load = async () => {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          const list: Product[] = Array.isArray(data) ? data : data?.data || []
          const available = list.filter(p => p && !p.isHidden)
          setProducts(available)

          // Reorder prefill: only for products that still exist and are in stock.
          try {
            const raw = sessionStorage.getItem('partner_reorder')
            if (raw) {
              sessionStorage.removeItem('partner_reorder')
              const items: Array<{ id: string; quantity: number }> = JSON.parse(raw)
              const byId = new Map(available.map(p => [p.id, p]))
              const next: Record<string, number> = {}
              let loaded = 0
              for (const it of items) {
                const p = byId.get(it.id)
                if (p && p.inStock !== false && it.quantity > 0) {
                  next[it.id] = it.quantity
                  loaded += 1
                }
              }
              if (loaded > 0) {
                setQty(next)
                setReorderLoaded(loaded)
              }
            }
          } catch {
            /* ignore prefill errors */
          }
        }
      } catch (e) {
        errorLog('Partner product load failed:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      p =>
        p.name?.toLowerCase().includes(q) ||
        String(p.productNumber || '').toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [products, search])

  const setLineQty = (id: string, next: number) => {
    setQty(prev => {
      const clone = { ...prev }
      if (next <= 0) delete clone[id]
      else clone[id] = next
      return clone
    })
  }

  const { itemCount, total } = useMemo(() => {
    let count = 0
    let sum = 0
    for (const p of products) {
      const q = qty[p.id] || 0
      if (q > 0) {
        count += q
        sum += calculateDiscountedPrice(p, user).discountedPrice * q
      }
    }
    return { itemCount: count, total: Math.round(sum * 100) / 100 }
  }, [qty, products, user])

  const submit = async () => {
    if (itemCount === 0 || submitting) return
    setSubmitting(true)
    try {
      const token = await fetchCsrfToken()
      if (!token) throw new Error('No CSRF token')
      const items = Object.entries(qty)
        .filter(([, q]) => q > 0)
        .map(([id, q]) => ({ id, quantity: q }))

      const res = await fetch('/api/partners/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
        body: JSON.stringify(addCsrfToBody({ items, orderNotes: notes, locale, paymentOption: payOption })),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.paymentUrl) {
          // Online payment: hand over to Stripe hosted checkout.
          window.location.href = data.paymentUrl
          return
        }
        setPlaced({ orderNumber: data.orderNumber, total: data.total, paymentOption: data.paymentOption || payOption })
        setQty({})
        setNotes('')
      } else {
        alert(data.error || t('Could not place order', 'Не удалось оформить заказ', 'تعذر تقديم الطلب'))
      }
    } catch (e) {
      errorLog('Partner order submit failed:', e)
      alert(t('Could not place order', 'Не удалось оформить заказ', 'تعذر تقديم الطلب'))
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (placed) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center px-6" dir={dir}>
        <div className="max-w-sm w-full text-center bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-1">{t('Order sent', 'Заказ отправлен', 'تم إرسال الطلب')}</h1>
          <p className="text-sm text-gray-500 mb-1">{t('We received your order', 'Мы получили ваш заказ', 'لقد استلمنا طلبك')}</p>
          <p className="text-sm font-semibold text-gray-900 mb-1">{placed.orderNumber}</p>
          <p className="text-base font-bold text-red-600 mb-3">{placed.total.toFixed(2)} AED</p>
          {placed.paymentOption === 'consignment' && (
            <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full mb-3">
              {t('Consignment stock', 'Консигнация', 'بضاعة أمانة')}
            </span>
          )}
          <p className="text-xs text-gray-500 mb-6">
            {placed.paymentOption === 'consignment'
              ? t(
                  'Added to your consignment stock — priority same-day delivery. Settlement via your monthly sales report.',
                  'Добавлено на ваш консигнационный склад — приоритетная доставка в тот же день. Расчёт по ежемесячному отчёту о продажах.',
                  'أُضيف إلى مخزون الأمانة — توصيل في نفس اليوم. التسوية عبر تقرير المبيعات الشهري.'
                )
              : placed.paymentOption === 'online'
                ? t(
                    'Order recorded — the payment link could not be opened. We will send you a payment link shortly.',
                    'Заказ записан — не удалось открыть ссылку на оплату. Мы пришлём её вам в ближайшее время.',
                    'تم تسجيل الطلب — تعذر فتح رابط الدفع. سنرسله إليك قريبًا.'
                  )
                : t(
                    'Priority partner order — we will confirm and arrange same-day delivery. Payment on delivery.',
                    'Приоритетный партнёрский заказ — подтвердим и организуем доставку в тот же день. Оплата при получении.',
                    'طلب شريك ذو أولوية — سنؤكد ونرتب التوصيل في نفس اليوم. الدفع عند الاستلام.'
                  )}
          </p>
          <button
            onClick={() => router.push(getLocalizedPath('/partner-portal', locale))}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            {t('Back to Partner Portal', 'В портал партнёра', 'العودة إلى بوابة الشركاء')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isAppLikeMode ? 'pb-36' : 'pb-28'}`} dir={dir}>
      {/* Header */}
      <div className={`sticky top-0 z-20 bg-white border-b border-gray-100`}>
        <div className={`flex items-center justify-between px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.push(getLocalizedPath('/partner-portal', locale))}
            className={`flex items-center gap-1 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base">{t('Portal', 'Портал', 'البوابة')}</span>
          </button>
          <span className="text-base font-semibold text-gray-900">{t('New Order', 'Новый заказ', 'طلب جديد')}</span>
          <span className="min-w-[60px]" />
        </div>
        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('Search products…', 'Поиск товаров…', 'ابحث عن المنتجات…')}
              className={`w-full ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-2.5 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-200`}
            />
          </div>
        </div>
      </div>

      {/* Product list */}
      <div className={`${isAppLikeMode ? 'px-4 py-3' : 'container mx-auto px-4 py-4 max-w-3xl'}`}>
        {reorderLoaded > 0 && (
          <div className={`flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-3 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm flex-1">
              {t(
                `Loaded ${reorderLoaded} item${reorderLoaded === 1 ? '' : 's'} from a previous order — adjust and place.`,
                `Загружено ${reorderLoaded} поз. из прошлого заказа — измените и оформите.`,
                `تم تحميل ${reorderLoaded} من طلب سابق — عدّل ثم قدّم.`
              )}
            </p>
          </div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-12">{t('No products found', 'Товары не найдены', 'لم يتم العثور على منتجات')}</p>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(product => {
              const q = qty[product.id] || 0
              const info = calculateDiscountedPrice(product, user)
              const price = info.discountedPrice
              const soldOut = product.inStock === false
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 bg-white border rounded-2xl p-3 ${soldOut ? 'opacity-60' : ''} ${q > 0 ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'} ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                    {product.image ? (
                      <Image src={product.image} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-gray-300" />
                    )}
                    {soldOut && (
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold text-center uppercase py-0.5">
                        {t('Sold out', 'Нет', 'نفد')}
                      </span>
                    )}
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{product.name}</p>
                    <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-bold text-red-600">{price.toFixed(2)} AED</span>
                      {info.hasDiscount && (
                        <>
                          <span className="text-xs text-gray-400 line-through">{info.originalPrice.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">−{Math.round(info.discountPercentage)}%</span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Stepper */}
                  {soldOut ? (
                    <span className="px-3 h-8 flex items-center rounded-full bg-gray-100 text-gray-400 text-sm font-semibold flex-shrink-0">
                      {t('Sold out', 'Нет в наличии', 'نفدت')}
                    </span>
                  ) : q > 0 ? (
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => setLineQty(product.id, q - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200"
                        aria-label="decrease"
                      >
                        <Minus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-gray-900">{q}</span>
                      <button
                        onClick={() => setLineQty(product.id, q + 1)}
                        className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center active:bg-red-700"
                        aria-label="increase"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setLineQty(product.id, 1)}
                      className="px-3 h-8 rounded-full bg-red-50 text-red-600 text-sm font-semibold active:bg-red-100 flex-shrink-0"
                    >
                      {t('Add', 'Добавить', 'إضافة')}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Notes */}
        {itemCount > 0 && (
          <div className="mt-4">
            <label className={`block text-xs font-semibold text-gray-500 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
              {t('Notes (optional)', 'Примечание (необязательно)', 'ملاحظات (اختياري)')}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder={t('Delivery date, special requests…', 'Дата доставки, пожелания…', 'تاريخ التسليم، طلبات خاصة…')}
              className={`w-full rounded-xl bg-white border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 ${isRTL ? 'text-right' : ''}`}
            />
          </div>
        )}

      </div>

      {/* Sticky submit bar (settlement selector always visible here) */}
      {itemCount > 0 && (
        <div className={`fixed left-0 right-0 ${isAppLikeMode ? 'bottom-20' : 'bottom-0'} z-30 bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]`}>
          <div className="container mx-auto max-w-3xl">
            {/* Settlement pills */}
            <div className={`flex items-center gap-2 mb-1.5 overflow-x-auto scrollbar-hide ${isRTL ? 'flex-row-reverse' : ''}`}>
              {hasConsignment && (
                <button
                  onClick={() => setPayOption('consignment')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    payOption === 'consignment'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                  }`}
                >
                  {t('Consignment stock', 'Консигнация', 'مخزون أمانة')}
                </button>
              )}
              <button
                onClick={() => setPayOption('online')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  payOption === 'online'
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {t('Pay online', 'Оплатить онлайн', 'دفع أونلاين')}
              </button>
              <button
                onClick={() => setPayOption('cod')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  payOption === 'cod'
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {t('Cash on delivery', 'При получении', 'عند الاستلام')}
              </button>
            </div>
            <p className={`text-[11px] text-gray-400 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {payOption === 'consignment'
                ? t('Settle via monthly sales report — no payment now', 'Расчёт по ежемесячному отчёту — без оплаты сейчас', 'التسوية عبر التقرير الشهري — بدون دفع الآن')
                : payOption === 'online'
                  ? t('Card / Apple Pay — secure Stripe checkout', 'Карта / Apple Pay — безопасная оплата Stripe', 'بطاقة / Apple Pay — دفع آمن عبر Stripe')
                  : t('Pay when your order arrives', 'Оплатите при доставке заказа', 'ادفع عند وصول طلبك')}
            </p>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-xs text-gray-500">
                {itemCount} {itemCount === 1 ? t('item', 'товар', 'منتج') : t('items', 'товаров', 'منتجات')}
              </p>
              <p className="text-lg font-bold text-gray-900">{total.toFixed(2)} AED</p>
            </div>
            <button
              onClick={submit}
              disabled={submitting}
              className={`flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3.5 rounded-xl font-semibold hover:bg-red-700 active:bg-red-800 transition-colors disabled:opacity-60 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('Sending…', 'Отправка…', 'جارٍ الإرسال…')}
                </>
              ) : payOption === 'online' ? (
                t('Continue to payment', 'Перейти к оплате', 'المتابعة إلى الدفع')
              ) : payOption === 'consignment' ? (
                t('Add to consignment stock', 'На консигнационный склад', 'إضافة إلى مخزون الأمانة')
              ) : (
                t('Place order', 'Оформить заказ', 'تقديم الطلب')
              )}
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PartnerOrderPage() {
  return (
    <PartnerGuard>
      <PartnerOrderInner />
    </PartnerGuard>
  )
}
