'use client'

import { memo } from 'react'
import { MessageCircle, Lock } from 'lucide-react'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import type { ProductPriceProps } from './types'

/**
 * ProductPrice Component
 * 
 * Renders product pricing with multiple states:
 * - Price on request (WhatsApp contact)
 * - Authenticated user with discounts
 * - Authenticated user without discounts  
 * - Beauty Box pricing (special case)
 * - Unauthenticated user (login prompt)
 * - Price locked (user without permission)
 * 
 * All prices include VAT and display appropriately.
 */

const ProductPrice = memo(function ProductPrice({
  product,
  user,
  priceId,
  t,
}: ProductPriceProps) {
  
  // Price on request state
  if (product.isPriceOnRequest) {
    return (
      <div className="mb-3" id={priceId}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-amber-600">
            <MessageCircle className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
            <span className="text-xs md:text-sm font-semibold">
              {t('products.priceOnRequest')}
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  // User can see prices
  if (canUserSeePrices(user)) {
    const pricing = getPricingDisplay(product, user)
    
    return (
      <div className="mb-3" id={priceId}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            {pricing.hasDiscount ? (
              // Discounted price display
              <PriceWithDiscount pricing={pricing} t={t} />
            ) : product.category === 'Beauty Boxes' ? (
              // Beauty Box special pricing
              <BeautyBoxPrice pricing={pricing} t={t} />
            ) : (
              // Regular price without discount
              <RegularPrice pricing={pricing} t={t} />
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Authenticated user without price permission
  if (user) {
    return (
      <div className="mb-3" id={priceId}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-500">
            <Lock className="h-4 w-4 mr-1" aria-hidden="true" />
            <span className="text-sm">{t('product.priceLocked')}</span>
          </div>
        </div>
      </div>
    )
  }
  
  // Unauthenticated user - show login prompt (desktop only)
  return (
    <div className="mb-3" id={priceId}>
      <div className="flex items-center justify-between mb-2">
        <span className="hidden md:inline text-xs md:text-base font-bold text-gray-500">
          {t('product.loginToSeePrice')}
        </span>
      </div>
    </div>
  )
})

// ============================================================================
// Sub-components for different price displays
// ============================================================================

interface PricingDisplayProps {
  pricing: {
    originalPrice: number | null
    displayPrice: number
    discountPercentage: number
    discountLabel?: string | null
    hasDiscount: boolean
  }
  t: (key: string) => string
}

/**
 * Price display with discount
 */
function PriceWithDiscount({ pricing, t }: PricingDisplayProps) {
  return (
    <div>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <span className="text-xs md:text-base font-bold text-primary-600">
          {pricing.displayPrice.toFixed(2)} AED
        </span>
        {pricing.originalPrice ? (
          <span className="text-[10px] md:text-sm text-gray-500 line-through">
            {pricing.originalPrice.toFixed(2)} AED
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[10px] md:text-xs text-green-600 font-medium">
          {pricing.discountPercentage}% {t('product.off')}
        </span>
        <span className="text-[10px] md:text-xs text-gray-500">
          {t('product.vatIncluded')}
        </span>
      </div>
    </div>
  )
}

/**
 * Beauty Box special pricing (always shows discount even without user discount)
 */
function BeautyBoxPrice({ pricing, t }: PricingDisplayProps) {
  const originalBeforeDiscount = pricing.originalPrice || pricing.displayPrice / 0.85
  
  return (
    <div>
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <span className="text-xs md:text-base font-bold text-primary-600">
          {pricing.displayPrice.toFixed(2)} AED
        </span>
        <span className="text-[10px] md:text-sm text-gray-500 line-through">
          {originalBeforeDiscount.toFixed(2)} AED
        </span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[10px] md:text-xs text-green-600 font-medium">
          {pricing.discountPercentage}% {t('product.off')}
          {pricing.discountLabel && ` (${pricing.discountLabel})`}
        </span>
        <span className="text-[10px] md:text-xs text-gray-500">
          {t('product.vatIncluded')}
        </span>
      </div>
    </div>
  )
}

/**
 * Regular price without any discounts
 */
function RegularPrice({ pricing, t }: PricingDisplayProps) {
  return (
    <div>
      <span className="text-xs md:text-base font-bold text-primary-600">
        {pricing.displayPrice.toFixed(2)} AED
      </span>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[10px] md:text-xs text-gray-500">
          {t('product.vatIncluded')}
        </span>
      </div>
    </div>
  )
}

export default ProductPrice
