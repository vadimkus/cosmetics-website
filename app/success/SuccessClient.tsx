'use client'

import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { useEffect, Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowLeft, MessageCircle, CheckCircle2, Mail, MapPin, Clock, Truck, Package } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/auth/AuthProvider'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import ConfettiCelebration from '@/components/ConfettiCelebration'

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  image: string
  color: string | null
  size: string | null
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
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error)
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
    
    if (paymentMethod === 'cod' || paymentMethod === 'support-link' || sessionId) {
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

    if (paymentMethod === 'cod') {
      clearCart()
    } else if (paymentMethod === 'support-link') {
      timeout = setTimeout(() => {
        clearCart()
      }, 2000)
    } else if (sessionId) {
      clearCart()
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [sessionId, paymentMethod, clearCart])

  // Get delivery time text based on emirate
  const getDeliveryTimeText = () => {
    if (orderData?.customerEmirate?.toLowerCase() === 'dubai') {
      return {
        time: '1-2 hours',
        icon: Clock,
        description: 'Express delivery in Dubai'
      }
    }
    return {
      time: '1-2 business days',
      icon: Truck,
      description: 'Standard delivery'
    }
  }

  const deliveryInfo = getDeliveryTimeText()
  const DeliveryIcon = deliveryInfo.icon

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-[100dvh]" dir={dir}>
      {/* Confetti Celebration */}
      <ConfettiCelebration 
        trigger={showConfetti}
        duration={3000}
        particleCount={60}
        colors={['#dc2626', '#ffffff', '#fbbf24', '#f97316', '#10b981']}
      />

      {/* PWA/Mobile Web Light Header - Hidden for cleaner success page experience */}
      {/* Header removed per user request - success page should be clean without navigation */}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 lg:py-12 pb-24 md:pb-16">
        {/* Navigation Breadcrumb - Hide in PWA/Mobile Web */}
        {!isAppLikeMode && (
          <div className={`${dir === 'rtl' ? 'flex justify-end' : ''}`}>
            <nav className={`text-xs md:text-base text-gray-600 mb-1.5 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
                {t('common.home')}
              </Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">{t('success.title') || 'Success'}</span>
            </nav>
          </div>
        )}
        
        {/* Back to Products - Hide in PWA/Mobile Web */}
        {!isAppLikeMode && (
          <div className={`mb-4 md:mb-6 ${dir === 'rtl' ? 'flex justify-end' : ''}`}>
            <Link 
              href={getLocalizedPath('/products', locale)} 
              className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{t('success.backToProducts') || 'Back to Products'}</span>
            </Link>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* Success Header with Animation */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mb-2">
              {paymentMethod === 'support-link' 
                ? (t('success.orderRequestSubmitted') || 'Order Request Submitted!')
                : (t('success.paymentSuccessful') || 'Payment Successful!')}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {t('success.orderBeingProcessed') || 'Your order has been confirmed and is being processed.'}
            </p>
            {orderId && (
              <div className="mt-3 inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-mono">
                Order #: <span className="font-semibold">{orderId}</span>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : orderData ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              {/* Order Summary Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h2 className={`text-base font-semibold text-gray-800 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <Package className="w-5 h-5 text-gray-600" />
                  {t('success.orderSummary') || 'Order Summary'}
                </h2>
              </div>

              {/* Customer Info */}
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t('checkout.customerInfo') || 'Customer Information'}</h3>
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium text-gray-900">{orderData.customerName}</p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {orderData.customerEmail}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-4 py-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-3">{t('cart.items') || 'Items'}</h3>
                <div className="space-y-3">
                  {orderData.items.map((item) => (
                    <div key={item.id} className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || '/images/placeholder-product.png'}
                          alt={item.productName}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      </div>
                      {/* Product Details */}
                      <div className={`flex-1 min-w-0 ${dir === 'rtl' ? 'text-right' : ''}`}>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.productName}</p>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>• {item.size}</span>}
                          {item.color && <span>• {item.color}</span>}
                        </div>
                      </div>
                      {/* Price */}
                      <div className={`text-sm font-semibold text-gray-900 whitespace-nowrap ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                        {item.price.toFixed(2)} AED
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown - Waterfall Discount */}
              <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                {(() => {
                  const hasUserDiscount = orderData.discountAmount > 0
                  const hasBundleDiscount = orderData.bundleDiscountAmount > 0
                  const hasAnyDiscount = hasUserDiscount || hasBundleDiscount
                  const retailTotal = orderData.subtotal + (orderData.discountAmount || 0) + (orderData.bundleDiscountAmount || 0)
                  const afterVipSubtotal = retailTotal - (orderData.discountAmount || 0)
                  const totalSaved = (orderData.discountAmount || 0) + (orderData.bundleDiscountAmount || 0)
                  
                  return (
                    <div className="space-y-2 text-sm">
                      {/* Retail Price or Subtotal */}
                      {hasAnyDiscount ? (
                        <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600">{t('cart.retailPrice') || 'Retail Price'} ({orderData.itemCount} {orderData.itemCount === 1 ? 'item' : 'items'})</span>
                          <span className="text-gray-400 line-through">{retailTotal.toFixed(2)} AED</span>
                        </div>
                      ) : (
                        <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600">{t('cart.subtotal') || 'Subtotal'} ({orderData.itemCount} {orderData.itemCount === 1 ? 'item' : 'items'})</span>
                          <span className="text-gray-900">{orderData.subtotal.toFixed(2)} AED</span>
                        </div>
                      )}
                      {/* VIP Discount */}
                      {hasUserDiscount && (
                        <div className={`flex justify-between text-purple-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span>{t('cart.userDiscount') || 'Your Discount'} {orderData.discountPercentage ? `(${orderData.discountPercentage}%)` : ''}</span>
                          <span>-{orderData.discountAmount.toFixed(2)} AED</span>
                        </div>
                      )}
                      {/* Intermediate Subtotal (when both discounts) */}
                      {hasUserDiscount && hasBundleDiscount && (
                        <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-400 text-xs">{t('cart.subtotal') || 'Subtotal'}</span>
                          <span className="text-gray-400 text-xs">{afterVipSubtotal.toFixed(2)} AED</span>
                        </div>
                      )}
                      {/* Bundle Discount */}
                      {hasBundleDiscount && (
                        <div className={`flex justify-between text-green-600 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span>{t('cart.bundleDiscount') || 'Bundle Discount'} {orderData.bundleDiscountPercentage ? `(${orderData.bundleDiscountPercentage}%)` : ''}</span>
                          <span>-{orderData.bundleDiscountAmount.toFixed(2)} AED</span>
                        </div>
                      )}
                      {/* Net Subtotal (when discounts exist) */}
                      {hasAnyDiscount && (
                        <>
                          <div className="border-t border-gray-200" />
                          <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-gray-900 font-semibold">{t('cart.netSubtotal') || 'Net Subtotal'}</span>
                            <span className="text-gray-900 font-semibold">{orderData.subtotal.toFixed(2)} AED</span>
                          </div>
                        </>
                      )}
                      <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-600 flex items-center gap-1">
                          <Truck className="w-4 h-4" />
                          {t('cart.shipping') || 'Shipping'} ({orderData.customerEmirate})
                        </span>
                        <span className="text-gray-900">{orderData.shipping > 0 ? `${orderData.shipping.toFixed(2)} AED` : 'Free'}</span>
                      </div>
                      <div className={`flex justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-600">{t('cart.vat') || 'VAT (5%)'}</span>
                        <span className="text-gray-900">{orderData.vat.toFixed(2)} AED</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className={`flex justify-between text-base font-bold ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-900">{t('cart.total') || 'Total'}</span>
                          <span className="text-green-600">{orderData.total.toFixed(2)} AED</span>
                        </div>
                      </div>
                      {/* You Saved */}
                      {hasAnyDiscount && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center mt-1">
                          <span className="text-sm text-green-700 font-semibold">
                            {t('cart.youSaved') || 'You saved'}: {totalSaved.toFixed(2)} AED
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Delivery Address */}
              <div className="px-4 py-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('checkout.deliveryAddress') || 'Delivery Address'}
                </h3>
                <p className="text-sm text-gray-900">{orderData.customerAddress}</p>
                <p className="text-sm text-gray-600">{orderData.customerEmirate}, UAE</p>
              </div>
            </div>
          ) : null}

          {/* What Happens Next Card */}
          <div className="bg-blue-50 rounded-2xl p-4 md:p-5 mb-4 border border-blue-100">
            <h2 className={`text-base md:text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Mail className="w-5 h-5" />
              {t('success.whatsNext') || "What happens next?"}
            </h2>
            <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {paymentMethod === 'support-link' ? (
                <>
                  <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <span className="text-sm text-blue-800">{t('success.step1SupportLink') || 'Our support team will contact you via phone/WhatsApp'}</span>
                  </div>
                  <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <span className="text-sm text-blue-800">{t('success.step2SupportLink') || "You'll receive a secure Stripe payment link"}</span>
                  </div>
                  <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <span className="text-sm text-blue-800">{t('success.step3SupportLink') || 'Complete payment and your order will be processed'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <span className="text-sm text-blue-800">{t('success.emailConfirmationSent') || 'Order confirmation email sent'}</span>
                  </div>
                  <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <span className="text-sm text-blue-800">{t('success.orderBeingPrepared') || 'Your order is being prepared for delivery'}</span>
                  </div>
                  <div className={`flex items-start gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
                    <span className="text-sm text-blue-800">{t('success.trackingInfoSoon') || 'Tracking information will be sent shortly via email/WhatsApp'}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Delivery Estimate */}
            {orderData && (
              <div className={`mt-4 pt-4 border-t border-blue-200 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <DeliveryIcon className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-semibold text-blue-900">
                  {t('success.estimatedDelivery') || 'Estimated delivery'}: {' '}
                  <span className="text-blue-700">
                    {orderData.customerEmirate?.toLowerCase() === 'dubai' 
                      ? '1-2 hours' 
                      : '1-2 business days'}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-4">
            <Link 
              href={getLocalizedPath('/products', locale)}
              className={`flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all active:scale-[0.98] shadow-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {t('success.continueShopping') || 'Continue Shopping'}
            </Link>
            <a 
              href={`https://wa.me/971585487665?text=Hi! I just placed order ${orderId || 'request'}. Can you help me with delivery updates?`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all active:scale-[0.98] shadow-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <MessageCircle className="h-5 w-5" />
              {t('success.contactWhatsApp') || 'Get Updates via WhatsApp'}
            </a>
          </div>

          {sessionId && (
            <div className="mt-6 text-center">
              <p className="text-[10px] text-gray-400">
                {t('success.sessionId') || 'Session ID'}: {sessionId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SuccessClient() {
  const { t } = useTranslation()
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">{t('common.loading')}</div>}>
      <SuccessContent />
    </Suspense>
  )
}
