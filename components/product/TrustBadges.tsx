'use client'

import { Truck, Shield, Star } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function TrustBadges() {
  const { t, dir } = useTranslation()
  
  return (
    <div className={`grid grid-cols-3 gap-3 py-4 border-y border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
      <div className="text-center">
        <Truck className="h-6 w-6 mx-auto text-green-600 mb-1" />
        <p className="text-xs font-medium text-gray-700">{t('trustBadges.freeShipping')}</p>
        <p className="text-xs text-gray-500">{t('trustBadges.onOrdersOver1000')}</p>
      </div>
      <div className="text-center">
        <Shield className="h-6 w-6 mx-auto text-green-600 mb-1" />
        <p className="text-xs font-medium text-gray-700">{t('trustBadges.securePayment')}</p>
        <p className="text-xs text-gray-500">{t('trustBadges.stripeCheckout')}</p>
      </div>
      <div className="text-center">
        <Star className="h-6 w-6 mx-auto text-yellow-600 mb-1" />
        <p className="text-xs font-medium text-gray-700">{t('trustBadges.uaeTaxPayer')}</p>
        <p className="text-xs text-gray-500">{t('trustBadges.supportingLocalEconomy')}</p>
      </div>
    </div>
  )
}

