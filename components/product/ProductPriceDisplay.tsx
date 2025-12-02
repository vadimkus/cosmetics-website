'use client'

import { Product } from '@/types'
import { User } from '@/types/user'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface ProductPriceDisplayProps {
  product: Product
  basePrice: number
  user: User | null
}

export default function ProductPriceDisplay({ product, basePrice, user }: ProductPriceDisplayProps) {
  const router = useRouter()
  const { t, locale, dir } = useTranslation()

  return (
    <div className="w-full flex justify-center" dir={dir}>
      {canUserSeePrices(user) ? (
        <>
          {(() => {
            const productWithPrice = { ...product, price: basePrice }
            const pricing = calculateDiscountedPrice(productWithPrice, user)
            
            return (
              <div className="w-full text-center">
                {pricing.hasDiscount ? (
                  <div className="w-full">
                    <div className={`w-full flex items-center justify-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xl md:text-3xl font-bold text-primary-600">
                        {pricing.discountedPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                      </span>
                      <span className="text-sm md:text-lg text-gray-400 line-through">
                        {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                      </span>
                    </div>
                    <div className={`w-full flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs md:text-sm text-green-600 font-medium">
                        {pricing.discountPercentage}% {t('product.off')}
                        {pricing.isBeautyBox && ` (${t('products.bundleDiscount')})`}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">({t('product.vatIncluded')})</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <div className="text-xl md:text-3xl font-bold text-primary-600">
                      {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                    </div>
                    <div className="text-xs md:text-sm font-normal text-gray-500">({t('product.vatIncluded')})</div>
                  </div>
                )}
              </div>
            )
          })()}
        </>
      ) : user ? (
        <div className={`flex items-center justify-center text-gray-500 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <Lock className={`h-4 w-4 md:h-5 md:w-5 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
          <span className="text-base md:text-lg">{t('product.priceLocked')}</span>
        </div>
      ) : (
        <button
          onClick={() => router.push(getLocalizedPath('/login', locale))}
          className="bg-primary-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium hover:bg-primary-700 transition-colors touch-manipulation"
        >
          {t('product.loginToSeePrice')}
        </button>
      )}
    </div>
  )
}



