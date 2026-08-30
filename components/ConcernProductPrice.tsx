'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import type { Product } from '@/types'

interface ConcernProductPriceProps {
  product: Product
  aedLabel: string
  priceOnRequestLabel: string
  inStockLabel: string
  offLabel?: string
}

/**
 * ConcernProductPrice - Client Component
 * 
 * Renders the price for a product card on concern/category landing pages.
 * Uses the auth context to apply user-specific discounts (e.g. 50% off).
 * Falls back to the base price for guests / crawlers (SSR).
 */
export default function ConcernProductPrice({
  product,
  aedLabel,
  priceOnRequestLabel,
  inStockLabel,
  offLabel = 'OFF',
}: ConcernProductPriceProps) {
  const { user } = useAuth()

  if (product.isPriceOnRequest) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--cera-body)]">{priceOnRequestLabel}</span>
        {product.inStock && (
          <span className="text-xs text-[var(--cera-ok)]">{inStockLabel}</span>
        )}
      </div>
    )
  }

  // Apply user discount if logged in
  if (canUserSeePrices(user)) {
    const pricing = getPricingDisplay(product, user)

    if (pricing.hasDiscount) {
      return (
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-[var(--cera-rose-ink)]">
              {aedLabel} {pricing.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            {pricing.originalPrice ? (
              <span className="text-xs text-[var(--cera-muted)] line-through">
                {aedLabel} {pricing.originalPrice.toLocaleString()}
              </span>
            ) : null}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-[10px] text-[var(--cera-ok)] font-medium">
              {pricing.discountPercentage}% {offLabel}
            </span>
            {product.inStock && (
              <span className="text-xs text-[var(--cera-ok)]">{inStockLabel}</span>
            )}
          </div>
        </div>
      )
    }

    // No discount, but user can see prices
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base font-bold text-[var(--cera-ink)]">
          {aedLabel} {pricing.displayPrice.toLocaleString()}
        </span>
        {product.inStock && (
          <span className="text-xs text-[var(--cera-ok)]">{inStockLabel}</span>
        )}
      </div>
    )
  }

  // Guest / not logged in - show base price
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm sm:text-base font-bold text-[var(--cera-ink)]">
        {aedLabel} {product.price.toLocaleString()}
      </span>
      {product.inStock && (
        <span className="text-xs text-[var(--cera-ok)]">{inStockLabel}</span>
      )}
    </div>
  )
}
