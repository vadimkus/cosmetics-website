'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function PaymentCancelPage() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const orderNumber = searchParams.get('orderNumber')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (navigator.userAgent.includes('GenosysApp')) {
            window.location.href = `genosysapp://checkout`
          } else {
            window.location.href = '/products'
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {t('payCancel.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('payCancel.subtitle')}
        </p>

        {/* Order Info */}
        {orderNumber && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">{t('payCancel.orderNumber')}</p>
            <p className="text-xl font-bold text-gray-900 mb-4">{orderNumber}</p>
            <p className="text-sm text-gray-600">
              {t('payCancel.orderSaved')}
            </p>
          </div>
        )}

        {/* What Happened */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm font-medium mb-2">{t('payCancel.whatHappened')}</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• {t('payCancel.youCancelled')}</li>
            <li>• {t('payCancel.sessionExpired')}</li>
            <li>• {t('payCancel.noCharges')}</li>
          </ul>
        </div>

        {/* Auto-redirect Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center">
          <RefreshCw className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
          <p className="text-yellow-800 text-sm">
            {t('payCancel.redirectingIn')} <span className="font-bold">{countdown}</span> {t('payCancel.seconds')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={`genosysapp://checkout`}
            className="flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('payCancel.tryAgain')}
          </a>

          <a
            href={`genosysapp://cart`}
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            {t('payCancel.returnToCart')}
          </a>

          <Link
            href="/products"
            className="flex items-center justify-center w-full text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('payCancel.continueShopping')}
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center mb-2">
            {t('payCancel.needHelp')}
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://wa.me/971528860018" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:underline text-sm font-medium"
            >
              {t('payCancel.whatsappSupport')}
            </a>
            <span className="text-gray-300">|</span>
            <a 
              href="mailto:support@genosys.ae" 
              className="text-green-600 hover:underline text-sm font-medium"
            >
              {t('payCancel.emailUs')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
