'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight, Home, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useCartStore } from '@/lib/cartStore'
import { debugLog, errorLog } from '@/lib/logger'
import ConfettiCelebration from '@/components/ConfettiCelebration'

// Helper to safely call gtag (avoids type conflicts with global Window declarations)
function trackGtagEvent(eventName: string, params: Record<string, unknown>) {
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag
  if (gtag) {
    gtag('event', eventName, params)
  }
}

interface OrderDetails {
  sessionId: string
  orderId: string
  paymentStatus: string
  orderStatus: string
  session: {
    payment_status: string
    customer_email: string
    amount_total: number
    currency: string
  }
  order: {
    orderNumber: string
    customerName: string
    customerEmail: string
    total: number
    items: Array<{
      productName: string
      quantity: number
      price: number
      color?: string
      size?: string
    }>
  }
}

export default function StripeSuccessClient() {
  const { t, locale, dir } = useTranslation()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const paymentIntentId = searchParams.get('payment_intent')
  const orderId = searchParams.get('order_id')
  const { clearCart } = useCartStore()
  
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    async function verifyPayment() {
      // Support both session_id (hosted checkout) and payment_intent (embedded checkout)
      if (!sessionId && !paymentIntentId) {
        setError('Missing payment information')
        setLoading(false)
        return
      }

      try {
        // Build the API URL based on available parameters
        let apiUrl = '/api/stripe/payment-status?'
        if (sessionId) {
          apiUrl += `session_id=${sessionId}`
        } else if (paymentIntentId) {
          apiUrl += `payment_intent=${paymentIntentId}`
          if (orderId) {
            apiUrl += `&order_id=${orderId}`
          }
        }

        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('Failed to verify payment')
        }

        const data: OrderDetails = await response.json()
        setOrderDetails(data)

        // Clear cart if payment was successful
        if (data.paymentStatus === 'paid') {
          clearCart()
          debugLog('✅ Cart cleared after successful payment')
          
          // Trigger confetti celebration
          setShowConfetti(true)
          setTimeout(() => {
            setShowConfetti(false)
          }, 4000)
        }

        // Track successful payment in Google Analytics
        if (typeof window !== 'undefined') {
          trackGtagEvent('purchase', {
            transaction_id: data.order.orderNumber,
            value: data.order.total,
            currency: 'AED',
            items: data.order.items.map((item, index) => ({
              item_id: `item-${index}`,
              item_name: item.productName,
              category: 'Cosmetics',
              quantity: item.quantity,
              price: item.price
            }))
          })
        }

      } catch (error) {
        errorLog('Payment verification error:', error)
        setError('Failed to verify payment status')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, paymentIntentId, orderId, clearCart])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={dir}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('checkout.verifyingPayment')}
          </h2>
          <p className="text-gray-600">
            {t('checkout.pleaseWait')}
          </p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={dir}>
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t('checkout.verificationFailed')}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || t('checkout.verificationError')}
          </p>
          <div className="space-y-3">
            <Link
              href={getLocalizedPath('/checkout', locale)}
              className="block w-full px-6 py-3 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('common.tryAgain')}
            </Link>
            <Link
              href={getLocalizedPath('/', locale)}
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.backHome')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isPaymentSuccessful = orderDetails.paymentStatus === 'paid'

  return (
    <div className="min-h-screen py-12" dir={dir}>
      {/* Confetti Celebration */}
      <ConfettiCelebration 
        trigger={showConfetti}
        duration={3000}
        particleCount={60}
        colors={['#dc2626', '#ffffff', '#fbbf24', '#f97316', '#10b981']}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isPaymentSuccessful ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {isPaymentSuccessful ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <RefreshCw className="w-12 h-12 text-yellow-600" />
            )}
          </div>
          
          <h1 className={`text-3xl font-bold mb-4 ${
            isPaymentSuccessful ? 'text-green-900' : 'text-yellow-900'
          }`}>
            {isPaymentSuccessful 
              ? t('checkout.paymentSuccessful') 
              : t('checkout.paymentProcessing')
            }
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            {isPaymentSuccessful 
              ? t('checkout.orderConfirmed')
              : t('checkout.processingPayment')
            }
          </p>
          
          <p className="text-sm text-gray-500">
            {t('checkout.orderNumber')}: <span className="font-mono font-semibold">{orderDetails.order.orderNumber}</span>
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              {t('checkout.orderSummary')}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{t('checkout.customerInfo')}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>{t('checkout.name')}:</strong> {orderDetails.order.customerName}</p>
                <p><strong>{t('checkout.email')}:</strong> {orderDetails.order.customerEmail}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">{t('checkout.items')}</h3>
              <div className="space-y-3">
                {orderDetails.order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <div className="text-sm text-gray-500 space-x-4">
                        <span>{t('checkout.quantity')}: {item.quantity}</span>
                        {item.color && <span>{t('checkout.color')}: {item.color}</span>}
                        {item.size && <span>{t('checkout.size')}: {item.size}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{item.price} {t('common.aed')}</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {item.price} = {item.quantity * item.price} {t('common.aed')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">{t('checkout.total')}</span>
                <span className="text-lg font-bold text-primary-600">
                  {orderDetails.order.total} {t('common.aed')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            {t('checkout.nextSteps')}
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>✅ {t('checkout.confirmationEmailSent')}</p>
            <p>✅ {t('checkout.orderBeingProcessed')}</p>
            <p>✅ {t('checkout.trackingInfoSent')}</p>
            <p className="font-medium">{t('checkout.deliveryTime')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={getLocalizedPath('/products', locale)}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.continueShopping')}
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'mr-2 rotate-180' : 'ml-2'}`} />
          </Link>
          
          <Link
            href={getLocalizedPath('/', locale)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}