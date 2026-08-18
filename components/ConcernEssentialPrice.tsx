'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import type { Product } from '@/types'

interface ConcernEssentialPriceProps {
  product: Product | null
  fallbackPrice: string
  currencyLabel?: string
  arrow?: string
}

export default function ConcernEssentialPrice({
  product,
  fallbackPrice,
  currencyLabel = 'AED',
  arrow = '\u2192',
}: ConcernEssentialPriceProps) {
  const { user } = useAuth()

  if (!canUserSeePrices(user)) return null

  if (!product || product.isPriceOnRequest) {
    return (
      <span className="text-xs text-[var(--cera-rose-ink)] font-medium mt-1 inline-block">
        {fallbackPrice} {arrow}
      </span>
    )
  }

  const pricing = getPricingDisplay(product, user)

  if (pricing.hasDiscount) {
    return (
      <span className="text-xs font-medium mt-1 inline-flex items-center gap-1.5 flex-wrap">
        <span className="text-[var(--cera-rose-ink)]">
          {currencyLabel} {pricing.displayPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {arrow}
        </span>
        {pricing.originalPrice ? (
          <span className="text-[var(--cera-muted)] line-through text-[10px]">
            {pricing.originalPrice.toLocaleString()}
          </span>
        ) : null}
      </span>
    )
  }

  return (
    <span className="text-xs text-[var(--cera-rose-ink)] font-medium mt-1 inline-block">
      {currencyLabel} {pricing.displayPrice.toLocaleString()} {arrow}
    </span>
  )
}
