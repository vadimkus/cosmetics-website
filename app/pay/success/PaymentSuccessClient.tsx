'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { useTranslation } from '@/hooks/useTranslation'

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const orderNumber = searchParams.get('orderNumber')
  const [orderDetails, setOrderDetails] = useState<{
    customerName?: string
    customerEmail?: string
    total?: number
    paymentStatus?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetch(`/api/orders?orderNumber=${orderNumber}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.orders?.length > 0) {
            setOrderDetails(data.orders[0])
          }
        })
        .catch(err => errorLog('Failed to fetch order:', err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderNumber])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          {t('paySuccess.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('paySuccess.subtitle')}
        </p>

        {/* Order Details */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">{t('paySuccess.loadingDetails')}</p>
          </div>
        ) : orderNumber ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Package className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600">{t('paySuccess.orderNumber')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-4">{orderNumber}</p>
            
            {orderDetails && (
              <>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('paySuccess.customer')}</span>
                    <span className="font-medium text-gray-900">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('paySuccess.email')}</span>
                    <span className="font-medium text-gray-900">{orderDetails.customerEmail}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('paySuccess.total')}</span>
                    <span className="font-bold text-green-600">{orderDetails.total} AED</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('paySuccess.status')}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {orderDetails.paymentStatus === 'paid' ? t('paySuccess.paid') : t('paySuccess.processing')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              {t('paySuccess.orderNotFound')}
            </p>
          </div>
        )}

        {/* Confirmation Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            📧 {t('paySuccess.confirmationEmail')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Deep link to mobile app (if opened from mobile) */}
          <a
            href={`genosysapp://order-success?orderNumber=${orderNumber}`}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
          >
            {t('paySuccess.returnToApp')}
          </a>

          {/* Web navigation */}
          <Link
            href="/products"
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {t('paySuccess.continueShopping')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <Link
            href="/profile"
            className="block w-full text-center text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
          >
            {t('paySuccess.viewOrderHistory')}
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {t('paySuccess.needHelp')}{' '}
            <a href="mailto:support@genosys.ae" className="text-green-600 hover:underline">
              support@genosys.ae
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
