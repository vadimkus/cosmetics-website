'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
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
      <span className="text-xs text-primary-600 font-medium mt-1 inline-block">
        {fallbackPrice} {arrow}
      </span>
    )
  }

  const pricing = calculateDiscountedPrice(product, user)

  if (pricing.hasDiscount) {
    return (
      <span className="text-xs font-medium mt-1 inline-flex items-center gap-1.5 flex-wrap">
        <span className="text-primary-600">
          {currencyLabel} {pricing.discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {arrow}
        </span>
        <span className="text-gray-400 line-through text-[10px]">
          {pricing.originalPrice.toLocaleString()}
        </span>
      </span>
    )
  }

  return (
    <span className="text-xs text-primary-600 font-medium mt-1 inline-block">
      {currencyLabel} {pricing.originalPrice.toLocaleString()} {arrow}
    </span>
  )
}
