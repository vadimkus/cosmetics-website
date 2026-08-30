'use client'

/**
 * /success - the confirmation step, step 3 of the checkout progress.
 *
 * Reworked onto the editorial system in Aug 2026, following /cart and
 * /checkout. This is a styling and structure pass: the order fetch, the GA4
 * purchase guard, the cart clear, the confetti and haptic triggers, the
 * per-item discount inference and every total are untouched. On the page that
 * confirms a payment, a redesign that also moves the arithmetic is two changes
 * to debug instead of one.
 *
 * The page was previously a green-to-white gradient with a green headline, a
 * blue "what happens next" slab, a blue rewards card and a rose primary button
 * - four palettes fighting on the one screen a customer sees straight after
 * paying. It is now cream and rose like the two pages leading into it.
 *
 * Colour that carries meaning is kept, the same call /cart and /orders made:
 * green for savings and free shipping, WhatsApp's own green on its button, and
 * the discount badges keep distinguishable hues because box, bundle and VIP
 * are genuinely different things.
 */

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { useEffect, Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowLeft, MessageCircle, Check, Gift, Mail, MapPin, Clock, Truck, Package } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { trackPurchase } from '@/lib/analytics'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/auth/AuthProvider'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import ConfettiCelebration from '@/components/ConfettiCelebration'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  image: string
  color: string | null
  size: string | null
  bundleDiscount: number | null
}

interface OrderData {
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  paidAt: string | null
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerEmirate: string
  subtotal: number
  shipping: number
  vat: number
  total: number
  // User discount
  discountPercentage: number | null
  discountAmount: number
  // Bundle discount
  bundleDiscountPercentage: number | null
  bundleDiscountAmount: number
  loyaltyPointsRedeemed: number
  loyaltyDiscountAmount: number
  loyaltyPointsExpected: number
  items: OrderItem[]
  deliveryEstimate: {
    time: string
    type: 'hours' | 'days'
  }
  itemCount: number
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  useAuth() // Keep auth context for potential future use
  const haptic = useHapticFeedback()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')
  const paymentMethod = searchParams.get('payment')
  const [showConfetti, setShowConfetti] = useState(false)
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  const isRtl = dir === 'rtl'

  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])

  // App-like mode: PWA or mobile web
  const isAppLikeMode = (isPWAClient && isPWA) || isMobileWeb

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders/success/${orderId}`)
        const result = await response.json()

        if (result.success && result.data) {
          setOrderData(result.data)
          // GA4 purchase event - fire once per order (COD + card both land here;
          // previously only Stripe-hosted-checkout tracked purchases). Guarded
          // by sessionStorage so a reload/back-nav doesn't double-count.
          try {
            const key = `ga_purchase_${result.data.orderNumber}`
            if (typeof window !== 'undefined' && !sessionStorage.getItem(key)) {
              sessionStorage.setItem(key, '1')
              trackPurchase({
                id: result.data.orderNumber,
                total: result.data.total,
                items: (result.data.items || []).map((it: OrderItem) => ({
                  id: it.productId,
                  name: it.productName,
                  category: 'Cosmetics',
                  price: it.price,
                  quantity: it.quantity,
                })),
              })
            }
          } catch { /* analytics is best-effort */ }
        }
      } catch (error) {
        errorLog('Failed to fetch order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  // Trigger celebration haptic on order success
  useEffect(() => {
    haptic.celebration()
  }, [haptic])

  // Trigger confetti animation on order success
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined

    if (paymentMethod === 'cod' || paymentMethod === 'card' || sessionId) {
      setShowConfetti(true)
      timer = setTimeout(() => {
        setShowConfetti(false)
      }, 4000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [paymentMethod, sessionId])

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined

    if (paymentMethod === 'cod' || paymentMethod === 'card') {
      clearCart()
    } else if (sessionId) {
      clearCart()
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [sessionId, paymentMethod, clearCart])

  const DeliveryIcon = orderData?.customerEmirate?.toLowerCase() === 'dubai' ? Clock : Truck

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh]`} dir={dir}>
      {/* Confetti, retuned from the old green/orange mix to the page palette. */}
      <ConfettiCelebration
        trigger={showConfetti}
        duration={3000}
        particleCount={60}
        colors={['#97281f', '#c0392f', '#e8c9c5', '#d8a24a', '#ffffff']}
      />

      {!isAppLikeMode && (
        <PageBreadcrumb
          items={[
            { name: t('common.home'), href: getLocalizedPath('/', locale) },
            { name: t('success.title') || 'Confirmation' },
          ]}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 md:pb-16 md:pt-8">
        <CheckoutProgress currentStep="confirmed" locale={locale} className="mb-6 md:mb-9" />

        {/* ─────────────────────────── Header ──────────────────────────── */}
        <header className="mb-8 text-center md:mb-10">
          <span
            className="ed-mark ed-mark--tactile ed-mark--round mx-auto h-14 w-14 md:h-16 md:w-16"
            aria-hidden="true"
          >
            <Check className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2} />
          </span>
          <h1 className="cera-serif mt-5 text-[30px] leading-[1.1] text-[var(--cera-ink)] md:text-[42px]">
            {paymentMethod === 'cod'
              ? (t('success.orderSuccess') || 'Order Confirmed!')
              : (t('success.paymentSuccessful') || 'Payment Successful!')}
          </h1>
          <p className="mx-auto mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-[var(--cera-muted)] md:text-[15.5px]">
            {t('success.orderBeingProcessed') || 'Your order has been confirmed and is being processed.'}
          </p>
          {orderId && (
            <p className="mt-5 inline-flex items-baseline gap-2 rounded-full border border-[var(--cera-line)] bg-white px-4 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--cera-muted)]">
                {t('success.orderNumber') || 'Order'}
              </span>
              <span dir="ltr" className="cera-numeral text-[15px] text-[var(--cera-ink)]">
                {orderId}
              </span>
            </p>
          )}
        </header>

        {loading ? (
          <div className="cera-card mb-4 animate-pulse p-6">
            <div className="mb-4 h-6 w-1/3 rounded bg-[var(--cera-cream-deep)]" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-[var(--cera-cream-deep)]" />
              <div className="h-4 w-2/3 rounded bg-[var(--cera-cream-deep)]" />
            </div>
          </div>
        ) : orderData ? (
          <div className="space-y-4">
            {/* ───────────────────── Items ───────────────────── */}
            <section className="cera-card p-4 md:p-6">
              <h2 className={`cera-serif flex items-center gap-2.5 text-[20px] text-[var(--cera-ink)] md:text-[24px] ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Package className="h-[18px] w-[18px] text-[var(--cera-rose)]" aria-hidden="true" />
                {t('orders.orderItems') || 'Order Items'}
                <span className="text-[14px] font-normal text-[var(--cera-muted)]">
                  ({orderData.itemCount} {orderData.itemCount === 1 ? (t('cart.item') || 'item') : (t('orders.items') || 'items')})
                </span>
              </h2>

              {(() => {
                const userDiscountPct = orderData.discountPercentage || 0
                const orderBundleDiscountPct = orderData.bundleDiscountPercentage || 0
                const hasUserDiscount = userDiscountPct > 0
                const hasOrderBundleDiscount = orderBundleDiscountPct > 0
                const isExcludedFromUserDiscount = (name: string): boolean => {
                  const n = (name || '').trim().toLowerCase()
                  if (!n) return false
                  if (n.includes('beauty box') || n.includes('beautybox')) return true
                  if (n.includes('hydro') && n.includes('cool') && n.includes('mask')) return true
                  if (n.includes('genoled') || n.includes('gentron') || n.includes('hairgen')) return true
                  return false
                }

                const BEAUTY_BOX_ORIGINAL_PRICES: Record<string, number> = {
                  'problem skin care beauty box': 1318,
                  'skin brightening beauty box': 1496,
                  'charming look beauty box': 1520,
                  'anti-aging beauty box': 1390,
                  'deep moisturizing beauty box': 1318,
                  'sensitive skin beauty box': 1696,
                }
                const BEAUTY_BOX_DISCOUNT_PCT = 15

                const getBeautyBoxOriginalPrice = (name: string): number | null => {
                  const n = (name || '').trim().toLowerCase()
                  for (const [key, price] of Object.entries(BEAUTY_BOX_ORIGINAL_PRICES)) {
                    if (n.includes(key)) return price
                  }
                  return null
                }

                return (
                  <ul className="mt-4 divide-y divide-[var(--cera-line)]">
                    {orderData.items.map((item) => {
                      const isFreeItem = item.price === 0 || item.productName.toLowerCase().includes('(free)')
                      const excludedFromUserDiscount = isExcludedFromUserDiscount(item.productName)

                      const beautyBoxOriginal = getBeautyBoxOriginalPrice(item.productName)
                      const isBeautyBox = beautyBoxOriginal !== null

                      // Per-item bundle discount (new field) takes priority over order-level inference
                      const itemBundlePct = item.bundleDiscount ?? null
                      const isItemBundle = itemBundlePct !== null && itemBundlePct > 0

                      let originalPrice = item.price
                      let itemDiscountPct = 0
                      let showDiscount = false
                      let discountType: 'beauty_box' | 'bundle' | 'vip' | null = null

                      if (isBeautyBox && beautyBoxOriginal) {
                        originalPrice = beautyBoxOriginal
                        itemDiscountPct = BEAUTY_BOX_DISCOUNT_PCT
                        showDiscount = true
                        discountType = 'beauty_box'
                      } else if (!excludedFromUserDiscount && !isFreeItem) {
                        if (isItemBundle) {
                          originalPrice = originalPrice / (1 - itemBundlePct / 100)
                          showDiscount = true
                          itemDiscountPct = itemBundlePct
                          discountType = 'bundle'
                        } else if (hasOrderBundleDiscount && !isItemBundle && itemBundlePct === null) {
                          // Legacy order (no per-item bundleDiscount stored): fall back to order-level
                          originalPrice = originalPrice / (1 - orderBundleDiscountPct / 100)
                          showDiscount = true
                          itemDiscountPct = orderBundleDiscountPct
                          discountType = 'bundle'
                        } else if (hasUserDiscount) {
                          originalPrice = originalPrice / (1 - userDiscountPct / 100)
                          showDiscount = true
                          itemDiscountPct = userDiscountPct
                          discountType = 'vip'
                        }
                      }

                      const itemTotal = item.price * item.quantity
                      const originalTotal = originalPrice * item.quantity

                      return (
                        <li key={item.id} className={`flex gap-3.5 py-4 first:pt-0 last:pb-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--cera-line)] bg-white">
                            <Image
                              src={item.image || '/images/genosys-logo-transparent.png'}
                              alt={item.productName}
                              fill
                              className="object-contain p-1.5"
                              sizes="64px"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className={`flex justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                              <p className="flex-1 text-[13.5px] font-semibold uppercase leading-snug tracking-wide text-[var(--cera-ink)]">
                                {item.productName}
                              </p>
                              <div dir="ltr" className={`whitespace-nowrap ${isRtl ? 'text-left' : 'text-right'}`}>
                                {isFreeItem ? (
                                  <span className="text-[13.5px] font-semibold text-[var(--cera-ok)]">
                                    {t('cart.free') || 'FREE'}
                                  </span>
                                ) : showDiscount ? (
                                  <>
                                    <span className="block text-[11.5px] tabular-nums text-[var(--cera-muted)] line-through">
                                      AED {originalTotal.toFixed(2)}
                                    </span>
                                    <span className="text-[14px] font-semibold tabular-nums text-[var(--cera-ok)]">
                                      AED {itemTotal.toFixed(2)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-[14px] font-semibold tabular-nums text-[var(--cera-ink)]">
                                    AED {itemTotal.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className={`mt-1 flex flex-wrap gap-x-2 text-[12px] text-[var(--cera-muted)] ${isRtl ? 'justify-end' : ''}`}>
                              <span>{t('checkout.quantity') || 'Qty'}: {item.quantity}</span>
                              {item.size && <span>· {item.size}</span>}
                              {item.color && <span>· {item.color}</span>}
                            </div>

                            {showDiscount && !isFreeItem && (
                              <div className={`mt-1.5 flex flex-wrap gap-1.5 ${isRtl ? 'justify-end' : ''}`}>
                                {discountType === 'beauty_box' ? (
                                  <span dir="ltr" className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                                    −{BEAUTY_BOX_DISCOUNT_PCT}% Box
                                  </span>
                                ) : discountType === 'bundle' ? (
                                  <span dir="ltr" className="inline-block rounded-full bg-[var(--cera-ok-bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--cera-ok)]">
                                    −{itemDiscountPct}% Bundle
                                  </span>
                                ) : discountType === 'vip' ? (
                                  <span dir="ltr" className="inline-block rounded-full bg-[var(--cera-blush)] px-2 py-0.5 text-[10px] font-semibold text-[var(--cera-rose-ink)]">
                                    −{userDiscountPct}% VIP
                                  </span>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )
              })()}
            </section>

            {/* ─────────────────── Price breakdown ─────────────────── */}
            <section className="cera-card p-4 md:p-6">
              <h2 className="ed-label">{t('success.orderSummary') || 'Order Summary'}</h2>

              {(() => {
                const hasUserDiscount = orderData.discountAmount > 0
                const hasBundleDiscount = orderData.bundleDiscountAmount > 0
                const hasLoyaltyDiscount = orderData.loyaltyDiscountAmount > 0 && orderData.loyaltyPointsRedeemed > 0
                const hasAnyDiscount = hasUserDiscount || hasBundleDiscount
                const hasAnySavings = hasAnyDiscount || hasLoyaltyDiscount
                const totalSaved =
                  (orderData.discountAmount || 0) +
                  (orderData.bundleDiscountAmount || 0) +
                  (orderData.loyaltyDiscountAmount || 0)

                // Show the waterfall (Retail → Discount → Net) ONLY when there
                // is a bundle discount. For VIP-only discounts the per-item
                // strikethrough + badge already communicates the discount, so we
                // just show the net subtotal to avoid duplication.
                const showWaterfall = hasBundleDiscount
                const retailTotal = orderData.subtotal + (orderData.discountAmount || 0) + (orderData.bundleDiscountAmount || 0)
                const afterVipSubtotal = retailTotal - (orderData.discountAmount || 0)

                const row = isRtl ? 'flex-row-reverse' : ''

                return (
                  <div className="mt-4 space-y-2.5 text-[14px]">
                    {showWaterfall ? (
                      <>
                        <div className={`flex justify-between ${row}`}>
                          <span className="text-[var(--cera-muted)]">
                            {t('cart.retailPrice') || 'Retail Price'} ({orderData.itemCount} {orderData.itemCount === 1 ? 'item' : 'items'})
                          </span>
                          <span dir="ltr" className="tabular-nums text-[var(--cera-muted)] line-through">
                            {retailTotal.toFixed(2)} AED
                          </span>
                        </div>
                        {hasUserDiscount && (
                          <div className={`flex justify-between text-[var(--cera-rose-ink)] ${row}`}>
                            <span>{t('cart.userDiscount') || 'Your Discount'} {orderData.discountPercentage ? `(${orderData.discountPercentage}%)` : ''}</span>
                            <span dir="ltr" className="tabular-nums">−{orderData.discountAmount.toFixed(2)} AED</span>
                          </div>
                        )}
                        {hasUserDiscount && hasBundleDiscount && (
                          <div className={`flex justify-between text-[12px] text-[var(--cera-muted)] ${row}`}>
                            <span>{t('cart.subtotal') || 'Subtotal'}</span>
                            <span dir="ltr" className="tabular-nums">{afterVipSubtotal.toFixed(2)} AED</span>
                          </div>
                        )}
                        <div className={`flex justify-between text-[var(--cera-ok)] ${row}`}>
                          <span>{t('cart.bundleDiscount') || 'Bundle Discount'} {orderData.bundleDiscountPercentage ? `(${orderData.bundleDiscountPercentage}%)` : ''}</span>
                          <span dir="ltr" className="tabular-nums">−{orderData.bundleDiscountAmount.toFixed(2)} AED</span>
                        </div>
                        <div className="border-t border-[var(--cera-line)]" />
                        <div className={`flex justify-between ${row}`}>
                          <span className="font-semibold text-[var(--cera-ink)]">{t('cart.netSubtotal') || 'Net Subtotal'}</span>
                          <span dir="ltr" className="font-semibold tabular-nums text-[var(--cera-ink)]">{orderData.subtotal.toFixed(2)} AED</span>
                        </div>
                      </>
                    ) : (
                      <div className={`flex justify-between ${row}`}>
                        <span className="text-[var(--cera-muted)]">{t('cart.netSubtotal') || 'Net Subtotal'}</span>
                        <span dir="ltr" className="font-semibold tabular-nums text-[var(--cera-ink)]">{orderData.subtotal.toFixed(2)} AED</span>
                      </div>
                    )}

                    <div className={`flex justify-between ${row}`}>
                      <span className={`flex items-center gap-1.5 text-[var(--cera-muted)] ${row}`}>
                        <Truck className="h-4 w-4" aria-hidden="true" />
                        {t('cart.shipping') || 'Shipping'} ({orderData.customerEmirate})
                      </span>
                      <span dir="ltr" className={`tabular-nums ${orderData.shipping > 0 ? 'text-[var(--cera-ink)]' : 'font-semibold text-[var(--cera-ok)]'}`}>
                        {orderData.shipping > 0 ? `${orderData.shipping.toFixed(2)} AED` : (t('cart.free') || 'Free')}
                      </span>
                    </div>

                    {hasLoyaltyDiscount && (
                      <div className={`flex justify-between text-[var(--cera-rose-ink)] ${row}`}>
                        <span>★ GENOSYS Rewards ({orderData.loyaltyPointsRedeemed.toLocaleString()} {t('rewards.points')})</span>
                        <span dir="ltr" className="tabular-nums">−{orderData.loyaltyDiscountAmount.toFixed(2)} AED</span>
                      </div>
                    )}

                    <div className={`flex justify-between ${row}`}>
                      <span className="text-[var(--cera-muted)]">{t('cart.vat') || 'VAT (5%)'}</span>
                      <span dir="ltr" className="tabular-nums text-[var(--cera-ink)]">{orderData.vat.toFixed(2)} AED</span>
                    </div>

                    <div className="border-t border-[var(--cera-line)] pt-3">
                      <div className={`flex items-baseline justify-between ${row}`}>
                        <span className="cera-serif text-[20px] text-[var(--cera-ink)]">{t('cart.total') || 'Total'}</span>
                        <span dir="ltr" className="cera-serif cera-numeral text-[26px] text-[var(--cera-ink)]">
                          {orderData.total.toFixed(2)}
                          <span className="ms-1.5 text-[14px] text-[var(--cera-muted)]">AED</span>
                        </span>
                      </div>
                    </div>

                    {hasAnySavings && (
                      <p dir="ltr" className="rounded-xl bg-[var(--cera-ok-bg)] px-3 py-2 text-center text-[13.5px] font-semibold text-[var(--cera-ok)]">
                        {t('cart.youSaved') || 'You saved'}: {totalSaved.toFixed(2)} AED
                      </p>
                    )}
                  </div>
                )
              })()}
            </section>

            {/* ─────────────── Delivering to ─────────────── */}
            <section className="cera-card p-4 md:p-6">
              <h2 className="ed-label">{t('checkout.deliveryAddress') || 'Delivery Address'}</h2>
              <div className={`mt-3.5 flex gap-3.5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <MapPin className="mt-0.5 h-[18px] w-[18px] flex-none text-[var(--cera-rose)]" aria-hidden="true" />
                <div className="min-w-0 text-[14px] leading-relaxed">
                  <p className="font-semibold text-[var(--cera-ink)]">{orderData.customerName}</p>
                  <p className="text-[var(--cera-body)]">{orderData.customerAddress}</p>
                  <p className="text-[var(--cera-muted)]">{orderData.customerEmirate}, UAE</p>
                  <p className={`mt-2 flex items-center gap-1.5 text-[13px] text-[var(--cera-muted)] ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    <span dir="ltr">{orderData.customerEmail}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* ─────────────── Rewards pending, COD only ─────────────── */}
            {String(orderData.paymentMethod || '').toLowerCase().includes('cod') &&
              orderData.loyaltyPointsExpected > 0 && (
                <section className="cera-card p-4 md:p-6">
                  <div className={`flex items-start gap-3.5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                    <span className="ed-mark ed-mark--tactile ed-mark--round h-10 w-10 flex-none" aria-hidden="true">
                      <Gift className="h-[18px] w-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="cera-serif text-[19px] leading-tight text-[var(--cera-ink)]">
                        {(t('success.rewardsPendingTitle') || 'You’ll earn {points} GENOSYS Rewards points')
                          .replace('{points}', orderData.loyaltyPointsExpected.toLocaleString(locale))}
                      </h2>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--cera-body)]">
                        {t('success.rewardsCodTiming') || 'Points will be credited after your Cash on Delivery payment is collected and the order is marked delivered. Shipping does not earn points.'}
                      </p>
                    </div>
                  </div>
                </section>
              )}
          </div>
        ) : null}

        {/* ─────────────────────── What happens next ─────────────────────── */}
        <section className="cera-card mt-4 p-4 md:p-6">
          <h2 className="cera-serif text-[20px] text-[var(--cera-ink)] md:text-[24px]">
            {t('success.whatsNext') || 'What happens next?'}
          </h2>

          <ol className={`mt-4 space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            {[
              t('success.emailConfirmationSent') || 'Order confirmation email sent',
              t('success.orderBeingPrepared') || 'Your order is being prepared for delivery',
              t('success.trackingInfoSoon') || 'Tracking information will be sent shortly via email/WhatsApp',
            ].map((step, i) => (
              <li key={i} className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="mt-[2px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[var(--cera-blush)]" aria-hidden="true">
                  <Check className="h-[11px] w-[11px] text-[var(--cera-rose-ink)]" strokeWidth={3} />
                </span>
                <span className="text-[14px] leading-relaxed text-[var(--cera-body)]">{step}</span>
              </li>
            ))}
          </ol>

          {orderData && (
            <div className={`mt-5 flex items-center gap-2.5 border-t border-[var(--cera-line)] pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <DeliveryIcon className="h-[18px] w-[18px] flex-none text-[var(--cera-rose)]" aria-hidden="true" />
              <p className="text-[14px] text-[var(--cera-body)]">
                {t('success.estimatedDelivery') || 'Estimated delivery'}:{' '}
                <span className="font-semibold text-[var(--cera-ink)]">
                  {orderData.customerEmirate?.toLowerCase() === 'dubai'
                    ? (t('success.deliveryDubai') || '1-2 hours')
                    : (t('success.deliveryOther') || '1-2 business days')}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* ──────────────────────────── Actions ──────────────────────────── */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`ed-cta w-full py-3.5 text-[15px] touch-manipulation md:py-4 ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
            {t('success.continueShopping') || 'Continue Shopping'}
          </Link>

          {/* WhatsApp keeps its own green: it is a brand mark, not decoration. */}
          <a
            href={`https://wa.me/971585487665?text=Hi! I just placed order ${orderId || 'request'}. Can you help me with delivery updates?`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-[15px] font-semibold text-white transition-colors hover:bg-[#1eb855] active:scale-[0.99] ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
            {t('success.contactWhatsApp') || 'Get Updates via WhatsApp'}
          </a>

          {!isAppLikeMode && (
            <Link
              href={getLocalizedPath('/orders', locale)}
              className={`inline-flex items-center justify-center gap-1.5 pt-1 text-[13.5px] text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-rose-ink)] ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              {t('orders.title') || 'My orders'}
            </Link>
          )}
        </div>

        {sessionId && (
          <p className="mt-8 break-all text-center text-[10px] text-[var(--cera-muted)]/70">
            {t('success.sessionId') || 'Session ID'}: {sessionId}
          </p>
        )}
      </div>
    </div>
  )
}

export default function SuccessClient() {
  const { t } = useTranslation()
  return (
    <Suspense
      fallback={
        <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh]`}>
          <p className="px-4 py-16 text-center text-[14px] text-[var(--cera-muted)]">{t('common.loading')}</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
