import { Product } from '@/types'
import { User, ApiUser } from '@/types/user'
import { buildPricingContract } from '@/lib/pricingContract'

export interface PricingDisplay {
  basePrice: number
  displayPrice: number
  unitPrice: number
  originalPrice: number | null
  discountPercentage: number
  discountLabel: string | null
  hasDiscount: boolean
  canSeePrice: boolean
  isPriceOnRequest: boolean
}

export function getPricingDisplay(
  product: Product,
  user: User | ApiUser | null = null,
  options: { selectedSize?: string | undefined; selectedColor?: string | undefined } = {}
): PricingDisplay {
  const contract = buildPricingContract(product, user, options)
  const originalPrice = contract.originalPrice && contract.originalPrice > contract.displayPrice
    ? contract.originalPrice
    : null

  return {
    basePrice: contract.basePrice,
    displayPrice: contract.displayPrice,
    unitPrice: contract.unitPrice,
    originalPrice,
    discountPercentage: contract.discountPercentage,
    discountLabel: contract.discountLabel,
    hasDiscount: Boolean(originalPrice && originalPrice > contract.displayPrice),
    canSeePrice: contract.canSeePrice,
    isPriceOnRequest: contract.isPriceOnRequest,
  }
}

export function formatAed(value: number, currency = 'AED') {
  return `${Number(value || 0).toFixed(2)} ${currency}`
}
