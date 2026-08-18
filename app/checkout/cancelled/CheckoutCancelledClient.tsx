'use client'

import Link from 'next/link'
import { XCircle, ShoppingCart, Home, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function CheckoutCancelledClient() {
  const { t, locale, dir } = useTranslation()
  const { isMobile, isClient } = useIsMobile()
  const { user } = useAuth()
  const router = useRouter()
  const isRTL = dir === 'rtl'

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh] ${isMobile ? '' : 'py-12'}`} dir={dir}>
      {/* Mobile Header */}
      {isClient && isMobile && (
        <div className={`sticky top-0 z-10 flex items-center justify-between border-b border-[var(--cera-line)] bg-[var(--cera-cream)] px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath('/cart', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-[var(--cera-rose-ink)]">{t('checkout.cart') || 'Cart'}</span>
          </button>
          <span className="text-base font-semibold text-[var(--cera-ink)]">
            {t('checkout.paymentCancelled') || 'Payment Cancelled'}
          </span>
          {/* Profile Icon - green dot only when logged in */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-[var(--cera-ink)]' : 'bg-[var(--cera-muted)]'}`}>
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-[var(--cera-cream)]" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className={`container mx-auto px-4 max-w-2xl ${isMobile ? 'py-6' : ''}`}>
        {/* Cancelled Header */}
        <div className="text-center mb-8">
          <div className={`${isMobile ? 'h-14 w-14' : 'h-16 w-16'} mx-auto mb-6 flex items-center justify-center rounded-full border border-red-200 bg-red-50`}>
            <XCircle className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} text-red-600`} />
          </div>
          
          <h1 className={`cera-serif ${isMobile ? 'text-[27px]' : 'text-[34px]'} leading-tight text-[var(--cera-ink)]`}>
            {t('checkout.paymentCancelled')}
          </h1>
          
          <p className={`mt-4 ${isMobile ? 'text-[15px]' : 'text-base'} leading-relaxed text-[var(--cera-body)]`}>
            {t('checkout.noCharges')}
          </p>
          
          <p className="mt-2 text-sm text-[var(--cera-muted)]">
            {t('checkout.canReturnAnytime')}
          </p>
        </div>

        {/* Information Card */}
        <div className="mb-8 rounded-[24px] border border-[var(--cera-line)] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(23,20,15,0.4)]">
          <h2 className="cera-serif mb-4 text-[21px] leading-tight text-[var(--cera-ink)]">
            {t('checkout.whatHappened')}
          </h2>
          
          <div className="space-y-3 text-[var(--cera-body)]">
            <div className="flex items-start">
              <div className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--cera-blush-deep)] mr-3"></div>
              <p>{t('checkout.cancelledExplanation1')}</p>
            </div>
            <div className="flex items-start">
              <div className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--cera-blush-deep)] mr-3"></div>
              <p>{t('checkout.cancelledExplanation2')}</p>
            </div>
            <div className="flex items-start">
              <div className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--cera-blush-deep)] mr-3"></div>
              <p>{t('checkout.cancelledExplanation3')}</p>
            </div>
          </div>
        </div>

        {/* Alternative Payment Methods */}
        <div className="ed-panel mb-8 p-6">
          <p className="cera-eyebrow">{t('checkout.alternativeOptions')}</p>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--cera-body)]">
            <p>{t('checkout.tryDifferentCard')}</p>
            <p>{t('checkout.cashOnDeliveryAvailable')}</p>
            <p>{t('checkout.contactSupportForHelp')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={getLocalizedPath('/checkout', locale)}
              className={`ed-cta flex-1 px-6 ${isMobile ? 'py-4' : 'py-3.5'} text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              {t('checkout.tryAgainCheckout')}
            </Link>

            <Link
              href={getLocalizedPath('/cart', locale)}
              className={`ed-ghost flex-1 px-6 ${isMobile ? 'py-4' : 'py-3.5'} text-[15px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ShoppingCart className="h-4 w-4" />
              {t('checkout.reviewCart')}
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className={`flex flex-col gap-3 ${isMobile ? '' : 'sm:flex-row'} justify-center items-center`}>
            <Link
              href={getLocalizedPath('/products', locale)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)]"
            >
              {t('common.continueShopping')}
            </Link>
            
            {/* Back to Home - hide on mobile (header has navigation) */}
            {!isMobile && (
              <>
                <span className="hidden text-[var(--cera-blush-deep)] sm:inline">|</span>
                <Link
                  href={getLocalizedPath('/', locale)}
                  className={`inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Home className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('common.backHome')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* WhatsApp Support - Single clean section */}
        <div className="mt-8 rounded-[24px] border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] p-5 text-center">
          <p className={`mb-3 text-sm text-[var(--cera-body)] ${isRTL ? 'text-right' : ''}`}>
            {t('checkout.needHelp')}
          </p>
          <button
            onClick={() => {
              const phoneNumber = '971585487665'
              const message = locale === 'ar' 
                ? 'مرحباً! واجهت مشكلة أثناء الدفع وأحتاج إلى المساعدة.'
                : locale === 'ru'
                  ? 'Привет! У меня возникла проблема при оплате, нужна помощь.'
                  : 'Hi! I had trouble with checkout and need assistance.'
              window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
            }}
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('common.whatsappSupport')}
          </button>
        </div>
      </div>
    </div>
  )
}