import { Product } from '@/types'
import { User, ApiUser } from '@/types/user'
import { calculateProductPricing, UAE_VAT_RATE } from '@/lib/pricingEngine'
import { isUserDiscountExcludedProduct } from '@/lib/mobileDiscountRules'

export type PricingDiscountType = 'none' | 'black_friday' | 'beauty_box' | 'user'

export interface PricingSelectedVariant {
  id: string | null
  size: string | null
  color: string | null
  price: number
}

export interface PricingContract {
  basePrice: number
  unitPrice: number
  displayPrice: number
  originalPrice: number | null
  discountAmount: number
  discountPercentage: number
  discountType: PricingDiscountType
  discountLabel: string | null
  vatRate: number
  vatIncluded: boolean
  vatAmountIncluded: number
  canSeePrice: boolean
  isPriceOnRequest: boolean
  exclusions: {
    noDiscount: boolean
    userDiscount: boolean
    priceOnRequest: boolean
  }
  selectedVariant: PricingSelectedVariant | null
  source: 'server'
}

type PricingUser = ApiUser | User | null

type VariantCandidate = {
  id?: string | null
  size?: string | null
  color?: string | null
  price: number
  isDefault: boolean
}

interface PricingContractOptions {
  selectedSize?: string
  selectedColor?: string
}

const roundMoney = (value: number) => Math.round(value * 100) / 100

function resolveSelectedVariant(
  product: Product,
  selectedSize?: string,
  selectedColor?: string
): VariantCandidate | null {
  const variants = product.variants?.filter((variant) => variant.size || variant.color) || []
  if (variants.length === 0) return null

  if (selectedSize || selectedColor) {
    const requestedVariant = variants.find((variant) => {
      const sizeMatches = selectedSize ? variant.size === selectedSize : true
      const colorMatches = selectedColor ? variant.color === selectedColor : true
      return sizeMatches && colorMatches
    })

    if (requestedVariant) return requestedVariant
  }

  return variants.find((variant) => variant.isDefault) || variants[0] || null
}

function resolveDiscountType(pricing: ReturnType<typeof calculateProductPricing>): PricingDiscountType {
  if (!pricing.hasDiscount) return 'none'
  if (pricing.isBlackFriday) return 'black_friday'
  if (pricing.isBeautyBox) return 'beauty_box'
  return 'user'
}

/**
 * Server-authoritative pricing contract adapter.
 *
 * This intentionally wraps the existing pricing engine instead of replacing it,
 * so mobile API clients can receive a stable contract while legacy fields remain
 * untouched during the migration.
 */
export function buildPricingContract(
  product: Product,
  user: PricingUser = null,
  options: PricingContractOptions = {}
): PricingContract {
  const selectedVariant = resolveSelectedVariant(product, options.selectedSize, options.selectedColor)
  const pricingSourceProduct = selectedVariant
    ? ({ ...product, price: selectedVariant.price } as Product)
    : product
  const pricing = calculateProductPricing(
    pricingSourceProduct,
    user,
    selectedVariant ? undefined : options.selectedSize,
    selectedVariant ? undefined : options.selectedColor
  )
  const isPriceOnRequest = product.isPriceOnRequest === true
  const noDiscount = product.noDiscount === true
  const userDiscountExcluded = isUserDiscountExcludedProduct(product)
  const unitPrice = pricing.displayPrice

  return {
    basePrice: pricing.basePrice,
    unitPrice,
    displayPrice: pricing.displayPrice,
    originalPrice: pricing.originalPrice ?? null,
    discountAmount: pricing.discountAmount ?? 0,
    discountPercentage: pricing.discountPercentage ?? 0,
    discountType: resolveDiscountType(pricing),
    discountLabel: pricing.discountLabel ?? null,
    vatRate: UAE_VAT_RATE,
    vatIncluded: true,
    vatAmountIncluded: roundMoney(unitPrice - unitPrice / (1 + UAE_VAT_RATE)),
    canSeePrice: Boolean(user?.canSeePrices) && !isPriceOnRequest,
    isPriceOnRequest,
    exclusions: {
      noDiscount,
      userDiscount: userDiscountExcluded,
      priceOnRequest: isPriceOnRequest,
    },
    selectedVariant: selectedVariant
      ? {
          id: selectedVariant.id ?? null,
          size: selectedVariant.size ?? null,
          color: selectedVariant.color ?? null,
          price: selectedVariant.price,
        }
      : null,
    source: 'server',
  }
}
