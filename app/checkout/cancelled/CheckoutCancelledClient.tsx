'use client'

import Link from 'next/link'
import { XCircle, ShoppingCart, Home, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function CheckoutCancelledClient() {
  const { t, locale, dir } = useTranslation()

  return (
    <div className="min-h-screen py-12" dir={dir}>
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Cancelled Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-red-900 mb-4">
            {t('checkout.paymentCancelled')}
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            {t('checkout.noCharges')}
          </p>
          
          <p className="text-gray-500">
            {t('checkout.canReturnAnytime')}
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('checkout.whatHappened')}
          </h2>
          
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>{t('checkout.cancelledExplanation1')}</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>{t('checkout.cancelledExplanation2')}</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>{t('checkout.cancelledExplanation3')}</p>
            </div>
          </div>
        </div>

        {/* Alternative Payment Methods */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">
            {t('checkout.alternativeOptions')}
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>💳 {t('checkout.tryDifferentCard')}</p>
            <p>🚚 {t('checkout.cashOnDeliveryAvailable')}</p>
            <p>💬 {t('checkout.contactSupportForHelp')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={getLocalizedPath('/cart', locale)}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('checkout.reviewCart')}
            </Link>
            
            <Link
              href={getLocalizedPath('/checkout', locale)}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {t('checkout.tryAgainCheckout')}
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={getLocalizedPath('/products', locale)}
              className="inline-flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('common.continueShopping')}
            </Link>
            
            <span className="hidden sm:inline text-gray-300">|</span>
            
            <Link
              href={getLocalizedPath('/', locale)}
              className="inline-flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className={`w-4 h-4 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
              {t('common.backHome')}
            </Link>
            
            <span className="hidden sm:inline text-gray-300">|</span>
            
            <button
              onClick={() => {
                const phoneNumber = '971585487665'
                const message = encodeURIComponent('Hi! I had trouble with checkout and need assistance.')
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
                window.open(whatsappUrl, '_blank')
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('common.contactSupport')}
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            {t('checkout.needHelp')}{' '}
            <a 
              href="https://wa.me/971585487665" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('common.whatsappSupport')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}