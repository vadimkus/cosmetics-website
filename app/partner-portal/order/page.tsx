'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Minus, Check, Loader2, Package, RefreshCw, Trash2, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { PartnerGuard } from '@/components/partners/PartnerGuard'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { classifyPartnerLine, isValidCreditDays, partnerGroupKey, PARTNER_CATEGORY_GROUPS } from '@/lib/partnerCatalog'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import BottomSheet from '@/components/ui/BottomSheet'
import StripeProvider from '@/components/stripe/StripeProvider'
import PaymentForm from '@/components/stripe/PaymentForm'
import type { Product } from '@/types'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

// Order lines are keyed by product id, or `id||size` when a size variant is
// selected - one product can have several lines (e.g. 200ml and 600ml).
const keyOf = (id: string, size?: string | null) => (size ? `${id}||${size}` : id)
const parseKey = (key: string): { id: string; size?: string } => {
  const i = key.indexOf('||')
  return i === -1 ? { id: key } : { id: key.slice(0, i), size: key.slice(i + 2) }
}

// Real size variants only (ignore size-less "default" price records).
const sizesOf = (product: Product) =>
  (product.variants || []).filter(v => v.size && v.size !== 'default')

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
  const [placed, setPlaced] = useState<{ orderNumber: string; total: number; paymentOption: string; paid?: boolean } | null>(null)
  const [reorderLoaded, setReorderLoaded] = useState(0)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  // Collapsible category sections (Creams, Serums, Masks…). Collapsed by
  // default; searching shows a flat filtered list instead.
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  // Embedded Stripe payment (bottom sheet on this page - no redirect).
  const [paySheet, setPaySheet] = useState<{ clientSecret: string; orderNumber: string; total: number } | null>(null)
  const [availableClinicPoints, setAvailableClinicPoints] = useState(0)
  const [useClinicPoints, setUseClinicPoints] = useState(false)

  const hasConsignment = user?.consignmentActive === true
  const creditDays = Number(user?.creditDays || 0)
  const hasCredit = user?.creditActive === true && isValidCreditDays(creditDays)
  const [payOption, setPayOption] = useState<'consignment' | 'credit' | 'online' | 'cod'>('cod')
  useEffect(() => {
    if (hasConsignment) setPayOption('consignment')
    else if (hasCredit) setPayOption('credit')
  }, [hasConsignment, hasCredit])

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
        const [res, pointsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/partner/homecare-scripts'),
        ])
        if (pointsRes.ok) {
          const pointsData = await pointsRes.json()
          setAvailableClinicPoints(Math.max(0, Number(pointsData?.points?.available) || 0))
        }
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
              const items: Array<{ id: string; quantity: number; size?: string }> = JSON.parse(raw)
              const byId = new Map(available.map(p => [p.id, p]))
              const next: Record<string, number> = {}
              let loaded = 0
              for (const it of items) {
                const p = byId.get(it.id)
                if (p && p.inStock !== false && it.quantity > 0) {
                  const productSizes = sizesOf(p)
                  let size = it.size && productSizes.some(v => v.size === it.size) ? it.size : undefined
                  // Multi-size product without a stored size (old order) → default size,
                  // so the line stays visible and editable in the size selector.
                  if (!size && productSizes.length >= 2) {
                    const def = productSizes.find(v => v.isDefault) || productSizes[0]
                    size = def?.size || undefined
                  }
                  next[keyOf(it.id, size)] = it.quantity
                  loaded += 1
                }
              }
              if (loaded > 0) {
                setQty(next)
                setReorderLoaded(loaded)
                // Open the sections that contain the prefilled items so the
                // reorder is immediately visible.
                const groups = new Set<string>()
                for (const key of Object.keys(next)) {
                  const p = byId.get(parseKey(key).id)
                  if (p) groups.add(partnerGroupKey(p.category))
                }
                setOpenGroups(groups)
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

  const setLineQty = (key: string, next: number) => {
    setQty(prev => {
      const clone = { ...prev }
      if (next <= 0) delete clone[key]
      else clone[key] = next
      return clone
    })
  }

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => {
      const n = new Set(prev)
      if (n.has(key)) n.delete(key)
      else n.add(key)
      return n
    })
  }

  // Products bucketed into ordered category sections (empty groups hidden).
  const groupedProducts = useMemo(() => {
    const byKey = new Map<string, Product[]>()
    for (const p of products) {
      const k = partnerGroupKey(p.category)
      const arr = byKey.get(k) || []
      arr.push(p)
      byKey.set(k, arr)
    }
    return PARTNER_CATEGORY_GROUPS
      .map(group => ({
        group,
        items: (byKey.get(group.key) || []).sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .filter(g => g.items.length > 0)
  }, [products])

  // Partner price for a line: size variant price (if selected) with the
  // account discount applied on top - mirrors the server calculation.
  const linePricing = useMemo(() => {
    return (product: Product, size?: string | null) => {
      if (size) {
        const v = sizesOf(product).find(vv => vv.size === size)
        if (v) return calculateDiscountedPrice({ ...product, price: v.price } as Product, user)
      }
      return calculateDiscountedPrice(product, user)
    }
  }, [user])

  const productById = useMemo(() => new Map(products.map(p => [p.id, p])), [products])

  // Consignment stock is retail-only: professional sizes, PRO Solutions and
  // equipment must be ordered on credit terms or paid. Names of cart lines
  // that cannot go to consignment (used to block the pill / submit).
  const nonConsignableInCart = useMemo(() => {
    const names: string[] = []
    for (const [key, q] of Object.entries(qty)) {
      if (q <= 0) continue
      const { id, size } = parseKey(key)
      const p = productById.get(id)
      if (!p) continue
      if (classifyPartnerLine(p, size) !== 'retail') {
        names.push(size ? `${p.name} (${size})` : p.name)
      }
    }
    return names
  }, [qty, productById])

  const { itemCount, total } = useMemo(() => {
    let count = 0
    let sum = 0
    for (const [key, q] of Object.entries(qty)) {
      if (q <= 0) continue
      const { id, size } = parseKey(key)
      const p = productById.get(id)
      if (!p) continue
      count += q
      sum += linePricing(p, size).discountedPrice * q
    }
    return { itemCount: count, total: Math.round(sum * 100) / 100 }
  }, [qty, productById, linePricing])
  const clinicPointsToRedeem = useClinicPoints && payOption !== 'consignment'
    ? Math.min(availableClinicPoints, total)
    : 0
  const payableTotal = Math.max(0, Math.round((total - clinicPointsToRedeem) * 100) / 100)

  const submit = async () => {
    if (itemCount === 0 || submitting) return
    if (payOption === 'consignment' && nonConsignableInCart.length > 0) {
      alert(
        t(
          'These items are professional/equipment and cannot go to consignment stock:\n\n',
          'Эти позиции - профессиональные/оборудование, их нельзя добавить на консигнацию:\n\n',
          'هذه المنتجات مهنية/أجهزة ولا يمكن إضافتها إلى مخزون الأمانة:\n\n'
        ) + nonConsignableInCart.join('\n')
      )
      return
    }
    setSubmitting(true)
    try {
      const token = await fetchCsrfToken()
      if (!token) throw new Error('No CSRF token')
      const items = Object.entries(qty)
        .filter(([, q]) => q > 0)
        .map(([key, q]) => {
          const { id, size } = parseKey(key)
          return { id, quantity: q, ...(size ? { size } : {}) }
        })

      const res = await fetch('/api/partners/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getCsrfHeaders() },
        body: JSON.stringify(addCsrfToBody({
          items,
          orderNotes: notes,
          locale,
          paymentOption: payOption,
          redeemClinicPoints: clinicPointsToRedeem,
        })),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.clientSecret) {
          // Online payment: open the embedded Stripe sheet on this page.
          setPaySheet({ clientSecret: data.clientSecret, orderNumber: data.orderNumber, total: data.total })
          setAvailableClinicPoints(points => Math.max(0, points - (Number(data.clinicPointsRedeemed) || 0)))
          setUseClinicPoints(false)
          return
        }
        setPlaced({ orderNumber: data.orderNumber, total: data.total, paymentOption: data.paymentOption || payOption })
        setQty({})
        setNotes('')
        setAvailableClinicPoints(points => Math.max(0, points - (Number(data.clinicPointsRedeemed) || 0)))
        setUseClinicPoints(false)
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

  const clearAll = () => {
    if (itemCount === 0) return
    if (window.confirm(t('Remove all items from this order?', 'Убрать все позиции из заказа?', 'إزالة جميع العناصر من هذا الطلب؟'))) {
      setQty({})
    }
  }

  // Embedded payment finished (paid) or sheet dismissed (order stays pending).
  const finishPayment = (paid: boolean) => {
    if (!paySheet) return
    setPlaced({ orderNumber: paySheet.orderNumber, total: paySheet.total, paymentOption: 'online', paid })
    setPaySheet(null)
    setQty({})
    setNotes('')
  }

  // Success screen
  if (placed) {
    return (
      <div className="min-h-[100dvh] bg-white flex items-center justify-center px-6" dir={dir}>
        <div className="max-w-sm w-full text-center bg-white border border-[var(--cera-line)] rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="cera-serif text-lg text-[var(--cera-ink)] mb-1">{t('Order sent', 'Заказ отправлен', 'تم إرسال الطلب')}</h1>
          <p className="text-sm text-[var(--cera-muted)] mb-1">{t('We received your order', 'Мы получили ваш заказ', 'لقد استلمنا طلبك')}</p>
          <p className="text-sm font-semibold text-[var(--cera-ink)] mb-1">{placed.orderNumber}</p>
          <p className="text-base font-bold text-[var(--cera-rose-ink)] mb-3">{placed.total.toFixed(2)} AED</p>
          {placed.paymentOption === 'consignment' && (
            <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full mb-3">
              {t('Consignment stock', 'Консигнация', 'بضاعة أمانة')}
            </span>
          )}
          {placed.paymentOption === 'credit' && (
            <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full mb-3">
              {t(`Credit ${creditDays} days`, `Кредит ${creditDays} дней`, `أجل ${creditDays} يومًا`)}
            </span>
          )}
          {placed.paymentOption === 'online' && placed.paid && (
            <span className="inline-block text-[11px] font-bold uppercase tracking-wide bg-[var(--cera-ok-bg)] text-[var(--cera-ok)] px-2.5 py-1 rounded-full mb-3">
              {t('Paid', 'Оплачено', 'مدفوع')}
            </span>
          )}
          <p className="text-xs text-[var(--cera-muted)] mb-6">
            {placed.paymentOption === 'consignment'
              ? t(
                  'Added to your consignment stock - priority same-day delivery. Settlement via your monthly sales report.',
                  'Добавлено на ваш консигнационный склад - приоритетная доставка в тот же день. Расчёт по ежемесячному отчёту о продажах.',
                  'أُضيف إلى مخزون الأمانة - توصيل في نفس اليوم. التسوية عبر تقرير المبيعات الشهري.'
                )
              : placed.paymentOption === 'credit'
              ? t(
                  `Professional order on ${creditDays}-day credit terms - priority same-day delivery. Payment due within ${creditDays} days of delivery.`,
                  `Профессиональный заказ с отсрочкой ${creditDays} дней - приоритетная доставка в тот же день. Оплата в течение ${creditDays} дней после доставки.`,
                  `طلب مهني بأجل ${creditDays} يومًا - توصيل في نفس اليوم. الدفع خلال ${creditDays} يومًا من التسليم.`
                )
              : placed.paymentOption === 'online'
                ? placed.paid
                  ? t(
                      'Payment received - we will confirm and arrange same-day delivery.',
                      'Оплата получена - подтвердим и организуем доставку в тот же день.',
                      'تم استلام الدفعة - سنؤكد ونرتب التوصيل في نفس اليوم.'
                    )
                  : t(
                      'Order recorded - payment not completed. Reopen it any time from your orders to pay, or we will send you a payment link.',
                      'Заказ записан - оплата не завершена. Откройте его в своих заказах, чтобы оплатить, или мы пришлём ссылку на оплату.',
                      'تم تسجيل الطلب - لم يكتمل الدفع. افتحه من طلباتك للدفع، أو سنرسل لك رابط دفع.'
                    )
                : t(
                    'Priority partner order - we will confirm and arrange same-day delivery. Payment on delivery.',
                    'Приоритетный партнёрский заказ - подтвердим и организуем доставку в тот же день. Оплата при получении.',
                    'طلب شريك ذو أولوية - سنؤكد ونرتب التوصيل في نفس اليوم. الدفع عند الاستلام.'
                  )}
          </p>
          <button
            onClick={() => router.push(getLocalizedPath('/partner-portal', locale))}
            className="w-full bg-[var(--cera-cta)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--cera-rose-ink)] transition-colors"
          >
            {t('Back to Partner Portal', 'В портал партнёра', 'العودة إلى بوابة الشركاء')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`cera-page genosys-page min-h-screen bg-[var(--cera-cream-deep)] ${isAppLikeMode ? 'pb-36' : 'pb-28'}`} dir={dir}>
      {/* Header (content constrained to the same column as the list) */}
      <div className={`sticky top-0 z-20 bg-white border-b border-[var(--cera-line)]`}>
        <div className={isAppLikeMode ? '' : 'container mx-auto max-w-3xl'}>
          <div className={`flex items-center justify-between px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push(getLocalizedPath('/partner-portal', locale))}
              className={`flex items-center gap-1 text-[var(--cera-rose-ink)] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-base">{t('Portal', 'Портал', 'البوابة')}</span>
            </button>
            <span className="text-base font-semibold text-[var(--cera-ink)]">{t('New Order', 'Новый заказ', 'طلب جديد')}</span>
            <span className="min-w-[60px]" />
          </div>
          {/* Search */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cera-muted)] ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('Search products…', 'Поиск товаров…', 'ابحث عن المنتجات…')}
                className={`w-full ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-2.5 rounded-xl bg-[var(--cera-cream-deep)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cera-blush-deep)]`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product list */}
      <div className={`${isAppLikeMode ? 'px-4 py-3' : 'container mx-auto px-4 py-4 max-w-3xl'}`}>
        {reorderLoaded > 0 && (
          <div className={`flex items-center gap-2 bg-[var(--cera-cta)] text-white rounded-xl px-4 py-3 mb-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm flex-1">
              {t(
                `Loaded ${reorderLoaded} item${reorderLoaded === 1 ? '' : 's'} from a previous order - adjust and place.`,
                `Загружено ${reorderLoaded} поз. из прошлого заказа - измените и оформите.`,
                `تم تحميل ${reorderLoaded} من طلب سابق - عدّل ثم قدّم.`
              )}
            </p>
          </div>
        )}
        {!loading && itemCount > 0 && (
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--cera-muted)]">
              {itemCount} {itemCount === 1 ? t('item selected', 'товар выбран', 'منتج محدد') : t('items selected', 'товаров выбрано', 'منتجات محددة')}
            </p>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)] transition-colors py-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('Clear all', 'Очистить всё', 'مسح الكل')}
            </button>
          </div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-[var(--cera-line)]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-[var(--cera-muted)] py-12">{t('No products found', 'Товары не найдены', 'لم يتم العثور على منتجات')}</p>
        ) : (() => {
            const renderProductCard = (product: Product) => {
              const sizes = sizesOf(product)
              const multiSize = sizes.length >= 2
              const isOpen = expandedCards.has(product.id)
              const soldOut = product.inStock === false
              const baseKey = keyOf(product.id)
              const q = qty[baseKey] || 0
              const info = linePricing(product)
              const price = info.discountedPrice
              // Whole-product tier (professional sizes of dual-size products
              // are classified per size row below).
              const productClass = classifyPartnerLine(product)
              const productBlocked = payOption === 'consignment' && productClass !== 'retail'
              const productQty = Object.entries(qty).reduce(
                (s, [k, n]) => (parseKey(k).id === product.id ? s + n : s), 0
              )
              const description =
                ((locale === 'ru' ? product.descriptionRu : locale === 'ar' ? product.descriptionAr : null) ||
                  product.description || '').trim()
              return (
                <div
                  key={product.id}
                  className={`bg-white border rounded-2xl ${soldOut ? 'opacity-60' : ''} ${productQty > 0 ? 'border-[var(--cera-blush-deep)] ring-1 ring-[var(--cera-blush)]' : 'border-[var(--cera-line)]'}`}
                >
                  <div className={`flex items-center gap-3 p-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Tapping the image/name expands the card (description + sizes) */}
                    <button
                      onClick={() => toggleCard(product.id)}
                      className={`flex items-center gap-3 flex-1 min-w-0 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <div className="w-14 h-14 rounded-xl bg-[var(--cera-cream-deep)] overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-[var(--cera-blush-deep)]" />
                        )}
                        {soldOut && (
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold text-center uppercase py-0.5">
                            {t('Sold out', 'Нет', 'نفد')}
                          </span>
                        )}
                      </div>
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                        <p className="text-sm font-semibold text-[var(--cera-ink)] leading-tight line-clamp-2">{product.name}</p>
                        <div className={`flex items-center gap-2 mt-1 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {multiSize ? (
                            <>
                              <span className="text-sm font-bold text-[var(--cera-rose-ink)]">
                                {t('from', 'от', 'من')}{' '}
                                {Math.min(...sizes.map(v => linePricing(product, v.size).discountedPrice)).toFixed(2)} AED
                              </span>
                              <span className="text-[10px] font-bold text-[var(--cera-muted)] bg-[var(--cera-cream-deep)] px-1.5 py-0.5 rounded">
                                {sizes.length} {t('sizes', 'объёма', 'أحجام')}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-bold text-[var(--cera-rose-ink)]">{price.toFixed(2)} AED</span>
                              {info.hasDiscount && (
                                <>
                                  <span className="text-xs text-[var(--cera-muted)] line-through">{info.originalPrice.toFixed(2)}</span>
                                  <span className="text-[10px] font-bold text-[var(--cera-ok)] bg-[var(--cera-ok-bg)] px-1.5 py-0.5 rounded">−{Math.round(info.discountPercentage)}%</span>
                                </>
                              )}
                            </>
                          )}
                          {productClass === 'professional' && (
                            <span className="text-[9px] font-bold text-white bg-[var(--cera-cta)] px-1.5 py-0.5 rounded uppercase tracking-wide">PRO</span>
                          )}
                          {productClass === 'equipment' && (
                            <span className="text-[9px] font-bold text-white bg-[var(--cera-cta)] px-1.5 py-0.5 rounded uppercase tracking-wide">
                              {t('Equipment', 'Оборудование', 'أجهزة')}
                            </span>
                          )}
                          <ChevronDown className={`w-3.5 h-3.5 text-[var(--cera-blush-deep)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </button>
                    {/* Right-side control */}
                    {soldOut ? (
                      <span className="px-3 h-8 flex items-center rounded-full bg-[var(--cera-cream-deep)] text-[var(--cera-muted)] text-sm font-semibold flex-shrink-0">
                        {t('Sold out', 'Нет в наличии', 'نفدت')}
                      </span>
                    ) : multiSize ? (
                      productQty > 0 ? (
                        <button
                          onClick={() => toggleCard(product.id)}
                          className="px-3 h-8 rounded-full bg-[var(--cera-cta)] text-white text-sm font-bold flex-shrink-0"
                        >
                          ×{productQty}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleCard(product.id)}
                          className="px-3 h-8 rounded-full bg-[var(--cera-blush)] text-[var(--cera-rose-ink)] text-sm font-semibold active:bg-[var(--cera-blush)] flex-shrink-0"
                        >
                          {t('Select size', 'Выбрать объём', 'اختر الحجم')}
                        </button>
                      )
                    ) : q > 0 ? (
                      <div className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={() => setLineQty(baseKey, q - 1)}
                          className="w-8 h-8 rounded-full bg-[var(--cera-cream-deep)] flex items-center justify-center active:bg-[var(--cera-cream-deep)]"
                          aria-label="decrease"
                        >
                          <Minus className="w-4 h-4 text-[var(--cera-body)]" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[var(--cera-ink)]">{q}</span>
                        <button
                          onClick={() => setLineQty(baseKey, q + 1)}
                          className="w-8 h-8 rounded-full bg-[var(--cera-cta)] flex items-center justify-center active:bg-[var(--cera-rose-ink)]"
                          aria-label="increase"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : productBlocked ? (
                      <span
                        className="px-3 h-8 flex items-center rounded-full bg-[var(--cera-cream-deep)] text-[var(--cera-muted)] text-xs font-semibold flex-shrink-0"
                        title={t('Not available for consignment stock', 'Недоступно для консигнации', 'غير متاح لمخزون الأمانة')}
                      >
                        {t('Not for consignment', 'Не для консигнации', 'ليس للأمانة')}
                      </span>
                    ) : (
                      <button
                        onClick={() => setLineQty(baseKey, 1)}
                        className="px-3 h-8 rounded-full bg-[var(--cera-blush)] text-[var(--cera-rose-ink)] text-sm font-semibold active:bg-[var(--cera-blush)] flex-shrink-0"
                      >
                        {t('Add', 'Добавить', 'إضافة')}
                      </button>
                    )}
                  </div>

                  {/* Expanded: description + size lines */}
                  {isOpen && (
                    <div className={`px-3 pb-3 border-t border-[var(--cera-line)] pt-2.5 ${isRTL ? 'text-right' : ''}`}>
                      {description && (
                        <p className="text-xs text-[var(--cera-muted)] leading-relaxed line-clamp-4 mb-2.5">{description}</p>
                      )}
                      {sizes.length > 0 && (
                        <div className="space-y-2">
                          {sizes.map(v => {
                            const lineKey = keyOf(product.id, v.size)
                            const lq = qty[lineKey] || 0
                            const vInfo = linePricing(product, v.size)
                            const unavailable = v.available === false
                            const rowClass = classifyPartnerLine(product, v.size)
                            const rowBlocked = payOption === 'consignment' && rowClass !== 'retail'
                            return (
                              <div
                                key={lineKey}
                                className={`flex items-center gap-3 rounded-xl bg-[var(--cera-cream-deep)] px-3 py-2 ${unavailable ? 'opacity-50' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                                  <span className="text-sm font-semibold text-[var(--cera-ink)]">{v.size}</span>
                                  {rowClass === 'professional' && (
                                    <span className={`text-[9px] font-bold text-white bg-[var(--cera-cta)] px-1.5 py-0.5 rounded uppercase tracking-wide ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}>PRO</span>
                                  )}
                                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-sm font-bold text-[var(--cera-rose-ink)]">{vInfo.discountedPrice.toFixed(2)} AED</span>
                                    {vInfo.hasDiscount && (
                                      <span className="text-xs text-[var(--cera-muted)] line-through">{vInfo.originalPrice.toFixed(2)}</span>
                                    )}
                                  </div>
                                </div>
                                {unavailable ? (
                                  <span className="text-xs font-semibold text-[var(--cera-muted)]">{t('Unavailable', 'Недоступно', 'غير متاح')}</span>
                                ) : rowBlocked && lq === 0 ? (
                                  <span
                                    className="px-3 h-7 flex items-center rounded-full bg-[var(--cera-cream-deep)] text-[var(--cera-muted)] text-[11px] font-semibold flex-shrink-0"
                                    title={t('Not available for consignment stock', 'Недоступно для консигнации', 'غير متاح لمخزون الأمانة')}
                                  >
                                    {t('Not for consignment', 'Не для консигнации', 'ليس للأمانة')}
                                  </span>
                                ) : lq > 0 ? (
                                  <div className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <button
                                      onClick={() => setLineQty(lineKey, lq - 1)}
                                      className="w-7 h-7 rounded-full bg-white border border-[var(--cera-line)] flex items-center justify-center active:bg-[var(--cera-cream-deep)]"
                                      aria-label="decrease"
                                    >
                                      <Minus className="w-3.5 h-3.5 text-[var(--cera-body)]" />
                                    </button>
                                    <span className="w-5 text-center text-sm font-bold text-[var(--cera-ink)]">{lq}</span>
                                    <button
                                      onClick={() => setLineQty(lineKey, lq + 1)}
                                      className="w-7 h-7 rounded-full bg-[var(--cera-cta)] flex items-center justify-center active:bg-[var(--cera-rose-ink)]"
                                      aria-label="increase"
                                    >
                                      <Plus className="w-3.5 h-3.5 text-white" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setLineQty(lineKey, 1)}
                                    className="px-3 h-7 rounded-full bg-[var(--cera-blush)] text-[var(--cera-rose-ink)] text-xs font-semibold active:bg-[var(--cera-blush)] flex-shrink-0"
                                  >
                                    {t('Add', 'Добавить', 'إضافة')}
                                  </button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            }

            // Searching → flat filtered list (all categories at once)
            if (search.trim()) {
              return <div className="space-y-2.5">{filtered.map(p => renderProductCard(p))}</div>
            }

            // Default → collapsible category sections
            return (
              <div className="space-y-3">
                {groupedProducts.map(({ group, items }) => {
                  const isOpenGroup = openGroups.has(group.key)
                  const label = locale === 'ru' ? group.ru : locale === 'ar' ? group.ar : group.en
                  const selectedInGroup = items.reduce(
                    (sum, p) =>
                      sum + Object.entries(qty).reduce((s, [k, n]) => (parseKey(k).id === p.id ? s + n : s), 0),
                    0
                  )
                  return (
                    <div key={group.key} className={`bg-white border rounded-2xl ${selectedInGroup > 0 ? 'border-[var(--cera-blush-deep)]' : 'border-[var(--cera-line)]'}`}>
                      <button
                        onClick={() => toggleGroup(group.key)}
                        className={`w-full flex items-center justify-between px-4 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-bold text-[var(--cera-ink)]">{label}</span>
                          <span className="text-[11px] font-semibold text-[var(--cera-muted)] bg-[var(--cera-cream-deep)] px-2 py-0.5 rounded-full">{items.length}</span>
                          {selectedInGroup > 0 && (
                            <span className="text-[11px] font-bold text-white bg-[var(--cera-cta)] px-2 py-0.5 rounded-full">×{selectedInGroup}</span>
                          )}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[var(--cera-muted)] transition-transform ${isOpenGroup ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpenGroup && (
                        <div className="px-2.5 pb-2.5 space-y-2.5">
                          {items.map(p => renderProductCard(p))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })()}

        {/* Notes */}
        {itemCount > 0 && (
          <div className="mt-4">
            <label className={`block text-xs font-semibold text-[var(--cera-muted)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
              {t('Notes (optional)', 'Примечание (необязательно)', 'ملاحظات (اختياري)')}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              maxLength={1000}
              placeholder={t('Delivery date, special requests…', 'Дата доставки, пожелания…', 'تاريخ التسليم، طلبات خاصة…')}
              className={`w-full rounded-xl bg-white border border-[var(--cera-line)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cera-blush-deep)] ${isRTL ? 'text-right' : ''}`}
            />
          </div>
        )}

      </div>

      {/* Sticky submit bar (settlement selector always visible here) */}
      {itemCount > 0 && (
        <div className={`fixed left-0 right-0 ${isAppLikeMode ? 'bottom-20' : 'bottom-0'} z-30 bg-white border-t border-[var(--cera-line)] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]`}>
          <div className="container mx-auto max-w-3xl">
            {availableClinicPoints > 0 && (
              <label className={`mb-2 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-xs ${payOption === 'consignment' ? 'opacity-50' : ''}`}>
                <span>
                  <span className="font-semibold text-amber-950">
                    {t('Use Clinic Points', 'Использовать баллы клиники', 'استخدم نقاط العيادة')}
                  </span>
                  <span className="ml-2 text-amber-700">
                    {availableClinicPoints.toFixed(2)} {t('available', 'доступно', 'متاحة')}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={useClinicPoints && payOption !== 'consignment'}
                  disabled={payOption === 'consignment'}
                  onChange={event => setUseClinicPoints(event.target.checked)}
                  className="h-4 w-4 accent-amber-700"
                />
              </label>
            )}
            {/* Settlement pills */}
            <div className={`flex items-center gap-2 mb-1.5 overflow-x-auto scrollbar-hide ${isRTL ? 'flex-row-reverse' : ''}`}>
              {hasConsignment && (
                <button
                  onClick={() => {
                    if (nonConsignableInCart.length > 0) {
                      alert(
                        t(
                          'Remove professional/equipment items first - consignment stock is retail products only:\n\n',
                          'Сначала уберите профессиональные позиции/оборудование - на консигнацию идут только розничные продукты:\n\n',
                          'أزل المنتجات المهنية/الأجهزة أولًا - مخزون الأمانة للمنتجات التجزئة فقط:\n\n'
                        ) + nonConsignableInCart.join('\n')
                      )
                      return
                    }
                    setPayOption('consignment')
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    payOption === 'consignment'
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-white border-[var(--cera-line)] text-[var(--cera-body)] hover:border-amber-300'
                  }`}
                >
                  {t('Consignment stock', 'Консигнация', 'مخزون أمانة')}
                </button>
              )}
              {hasCredit && (
                <button
                  onClick={() => setPayOption('credit')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    payOption === 'credit'
                      ? 'bg-[var(--cera-cta)] border-[var(--cera-cta)] text-white'
                      : 'bg-white border-[var(--cera-line)] text-[var(--cera-body)] hover:border-[var(--cera-blush-deep)]'
                  }`}
                >
                  {t(`Credit ${creditDays} days`, `Кредит ${creditDays} дн.`, `أجل ${creditDays} يومًا`)}
                </button>
              )}
              <button
                onClick={() => setPayOption('online')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  payOption === 'online'
                    ? 'bg-[var(--cera-cta)] border-[var(--cera-cta)] text-white'
                    : 'bg-white border-[var(--cera-line)] text-[var(--cera-body)] hover:border-[var(--cera-blush-deep)]'
                }`}
              >
                {t('Pay online', 'Оплатить онлайн', 'دفع أونلاين')}
              </button>
              <button
                onClick={() => setPayOption('cod')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  payOption === 'cod'
                    ? 'bg-[var(--cera-cta)] border-[var(--cera-cta)] text-white'
                    : 'bg-white border-[var(--cera-line)] text-[var(--cera-body)] hover:border-[var(--cera-blush-deep)]'
                }`}
              >
                {t('Cash on delivery', 'При получении', 'عند الاستلام')}
              </button>
            </div>
            <p className={`text-[11px] text-[var(--cera-muted)] mb-2 ${isRTL ? 'text-right' : ''}`}>
              {payOption === 'consignment'
                ? t('Retail products only - settle via monthly sales report, no payment now', 'Только розничные продукты - расчёт по ежемесячному отчёту, без оплаты сейчас', 'منتجات التجزئة فقط - التسوية عبر التقرير الشهري، بدون دفع الآن')
                : payOption === 'credit'
                  ? t(`Professional order - payment due within ${creditDays} days of delivery`, `Профессиональный заказ - оплата в течение ${creditDays} дней после доставки`, `طلب مهني - الدفع خلال ${creditDays} يومًا من التسليم`)
                : payOption === 'online'
                  ? t('Card / Apple Pay - secure Stripe checkout', 'Карта / Apple Pay - безопасная оплата Stripe', 'بطاقة / Apple Pay - دفع آمن عبر Stripe')
                  : t('Pay when your order arrives', 'Оплатите при доставке заказа', 'ادفع عند وصول طلبك')}
            </p>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-xs text-[var(--cera-muted)]">
                {itemCount} {itemCount === 1 ? t('item', 'товар', 'منتج') : t('items', 'товаров', 'منتجات')}
              </p>
              {clinicPointsToRedeem > 0 && (
                <p className="text-[11px] text-amber-700">−{clinicPointsToRedeem.toFixed(2)} Clinic Points</p>
              )}
              <p className="text-lg font-bold text-[var(--cera-ink)]">{payableTotal.toFixed(2)} AED</p>
            </div>
            <button
              onClick={submit}
              disabled={submitting}
              className={`flex-1 flex items-center justify-center gap-2 bg-[var(--cera-cta)] text-white py-3.5 rounded-xl font-semibold hover:bg-[var(--cera-rose-ink)] active:bg-[var(--cera-rose-ink)] transition-colors disabled:opacity-60 ${isRTL ? 'flex-row-reverse' : ''}`}
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
              ) : payOption === 'credit' ? (
                t(`Place order - ${creditDays} day credit`, `Оформить с отсрочкой ${creditDays} дн.`, `تقديم الطلب - أجل ${creditDays} يومًا`)
              ) : (
                t('Place order', 'Оформить заказ', 'تقديم الطلب')
              )}
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Stripe payment - slides up from below, stays on this page */}
      <BottomSheet
        isOpen={paySheet !== null}
        onClose={() => finishPayment(false)}
        title={t('Secure payment', 'Безопасная оплата', 'دفع آمن')}
        height="large"
      >
        {paySheet && (
          <StripeProvider clientSecret={paySheet.clientSecret} locale={locale}>
            <PaymentForm
              total={paySheet.total}
              orderId={paySheet.orderNumber}
              locale={locale}
              returnUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/pay/success?orderNumber=${paySheet.orderNumber}`}
              onSuccess={() => finishPayment(true)}
              onError={() => {
                /* keep the sheet open - the form shows the error inline */
              }}
            />
          </StripeProvider>
        )}
      </BottomSheet>
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
