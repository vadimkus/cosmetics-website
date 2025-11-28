'use client'

import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const { t, locale, dir } = useTranslation()
  const sessionId = searchParams.get('session_id')
  const orderId = searchParams.get('order_id')
  const paymentMethod = searchParams.get('payment')

  useEffect(() => {
    // Clear the cart after successful payment
    let timeout: NodeJS.Timeout | undefined

    if (paymentMethod === 'cod') {
      // Clear immediately for COD orders
      clearCart()
    } else if (paymentMethod === 'support-link') {
      // Clear cart after 2 seconds for support-link orders
      timeout = setTimeout(() => {
        clearCart()
      }, 2000)
    } else if (sessionId) {
      // Clear immediately for payment gateway orders
      clearCart()
    }

    // Cleanup function - always return (even if undefined)
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [sessionId, paymentMethod, clearCart])

  return (
    <div className="bg-white" dir={dir}>
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-8 lg:py-16 pb-6 md:pb-16">
        {/* Navigation Breadcrumb */}
        <div className={`${dir === 'rtl' ? 'flex justify-end' : ''}`}>
          <nav className={`text-xs md:text-base text-gray-600 mb-1.5 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
              {t('common.home')}
            </Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">
              {t('success.title') || 'Success'}
            </span>
          </nav>
        </div>
        
        {/* Back to Products */}
        <div className={`mb-4 md:mb-8 ${dir === 'rtl' ? 'flex justify-end' : ''}`}>
          <Link 
            href={getLocalizedPath('/products', locale)} 
            className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('success.backToProducts') || 'Back to Products'}</span>
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
              {paymentMethod === 'support-link' 
                ? (t('success.orderRequestSubmitted') || 'Order Request Submitted!')
                : (t('success.orderSuccess') || 'Order Confirmed!')}
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              {paymentMethod === 'support-link' 
                ? (t('success.supportLinkMessage') || 'Our support team will share a secure payment link.')
                : (t('success.orderConfirmedMessage') || 'Your order has been confirmed.')}
            </p>
            {(orderId || paymentMethod === 'support-link') && (
              <div className="mt-3 md:mt-4 inline-block bg-blue-50 text-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold">
                {t('success.orderNumber') || 'Order'} #{orderId || 'Submitted'}
              </div>
            )}
          </div>

          {/* What's Next Card */}
          <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 mb-4 md:mb-8 border border-gray-100">
            <h2 className={`text-sm md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('success.whatsNext') || "What's Next?"}
            </h2>
            <div className={`space-y-2.5 md:space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {paymentMethod === 'support-link' ? (
                <>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step1SupportLink') || 'Our support team will contact you via phone/WhatsApp'}</span>
                  </div>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step2SupportLink') || "You'll receive a secure Stripe payment link"}</span>
                  </div>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step3SupportLink') || 'Complete payment and your order will be processed'}</span>
                  </div>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step4SupportLink') || "You'll receive tracking information once your order ships"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step1') || "You'll receive an email confirmation with your order details"}</span>
                  </div>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step2') || "We'll process and ship your order ASAP"}</span>
                  </div>
                  <div className={`flex items-start gap-2.5 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <span className="text-xs md:text-base text-gray-700">{t('success.step3') || "You'll receive tracking information once your order ships"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 md:gap-4">
            <Link 
              href={getLocalizedPath('/products', locale)}
              className={`flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 md:px-6 md:py-3.5 rounded-lg text-sm md:text-base font-semibold hover:bg-primary-700 transition-colors shadow-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
              {t('success.continueShopping') || 'Continue Shopping'}
            </Link>
            <a 
              href={`https://wa.me/971585487665?text=Hi! I need help with my order ${orderId || 'request'}. Can you assist me?`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-green-50 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
              {t('success.contactWhatsApp') || 'Contact Support via WhatsApp'}
            </a>
          </div>

          {sessionId && (
            <div className="mt-6 md:mt-8 text-center">
              <p className="text-[10px] md:text-xs text-gray-400">
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
