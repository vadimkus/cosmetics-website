'use client'

import { Product } from '@/types'
import { User } from '@/types/user'
import { Lock, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface ProductPriceDisplayProps {
  product: Product
  basePrice: number
  user: User | null
  // `| undefined` required: callers pass explicit undefined under
  // exactOptionalPropertyTypes (see ProductPageClientRefactored).
  selectedSize?: string | undefined
  selectedColor?: string | undefined
}

export default function ProductPriceDisplay({ product, basePrice, user, selectedSize, selectedColor }: ProductPriceDisplayProps) {
  const router = useRouter()
  const { t, locale, dir } = useTranslation()

  // Handle price on request products
  if (product.isPriceOnRequest) {
    return (
      <div className="w-full flex flex-col items-center justify-center" dir={dir}>
        <div className={`flex items-center gap-2 text-[var(--status-orange)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <MessageCircle className="h-5 w-5" />
          <span className="text-lg md:text-xl font-semibold">{t('products.priceOnRequest')}</span>
        </div>
        <span className="text-xs md:text-sm text-[var(--color-text-tertiary)] mt-1">{t('products.contactForPricing')}</span>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center" dir={dir}>
      {canUserSeePrices(user) ? (
        <>
          {(() => {
            // Pass the selected variant through — buildPricingContract falls
            // back to the DEFAULT DB variant's price when no size/color is
            // given, which silently overrides basePrice (bug: size switch
            // didn't change the displayed price).
            const productWithPrice = { ...product, price: basePrice }
            const pricing = getPricingDisplay(productWithPrice, user, { selectedSize, selectedColor })
            
            return (
              <div className="w-full text-center">
                {pricing.hasDiscount ? (
                  <div className="w-full">
                    <div className={`w-full flex items-center justify-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xl md:text-3xl font-bold text-primary-600">
                        {pricing.displayPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                      </span>
                      {pricing.originalPrice ? (
                        <span className="text-sm md:text-lg text-[var(--color-text-quaternary)] line-through">
                          {pricing.originalPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                        </span>
                      ) : null}
                    </div>
                    <div className={`w-full flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs md:text-sm text-[var(--status-green-deep)] font-medium">
                        {pricing.discountPercentage}% {t('product.off')}
                        {pricing.discountLabel && ` (${pricing.discountLabel})`}
                      </span>
                      <span className="text-xs md:text-sm text-[var(--color-text-tertiary)]">({t('product.vatIncluded')})</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <div className="text-xl md:text-3xl font-bold text-primary-600">
                      {pricing.displayPrice.toFixed(2)} {dir === 'rtl' ? 'درهم' : 'AED'}
                    </div>
                    <div className="text-xs md:text-sm font-normal text-[var(--color-text-tertiary)]">({t('product.vatIncluded')})</div>
                  </div>
                )}
              </div>
            )
          })()}
        </>
      ) : user ? (
        <div className={`flex items-center justify-center text-[var(--color-text-tertiary)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
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



