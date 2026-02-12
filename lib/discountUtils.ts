import { User, ApiUser } from '@/types/user'
import { Product } from '@/types'
import { isBlackFridaySaleActive, BLACK_FRIDAY_DISCOUNT_PERCENTAGE } from './blackFridayUtils'
import { isUserDiscountExcludedProduct } from './mobileDiscountRules'

export interface DiscountedPrice {
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  discountPercentage: number
  hasDiscount: boolean
  isBlackFriday?: boolean
  isBeautyBox?: boolean
}

// Beauty box regular prices (before 15% bundle discount)
// These are the prices displayed in the product descriptions
const BEAUTY_BOX_REGULAR_PRICES: { [key: string]: number } = {
  '55': 1318,    // PROBLEM SKIN CARE BEAUTY BOX
  '56': 1496,    // SKIN BRIGHTENING BEAUTY BOX
  '57': 1520,    // CHARMING LOOK BEAUTY BOX (1519 rounded)
  '58': 1390,    // ANTI-AGING BEAUTY BOX (1390 rounded)
  '59': 1318,    // DEEP MOISTURIZING BEAUTY BOX
}

const BEAUTY_BOX_DISCOUNT_PERCENTAGE = 15

/**
 * Calculates discounted price for a product based on multiple discount sources.
 * 
 * Discount priority (only one applies):
 * 1. Beauty Box bundle discount (15% built-in)
 * 2. Black Friday sale (if active and product not excluded)
 * 3. User-specific discount (based on user.discountType/discountPercentage)
 * 
 * @param product - The product to calculate discount for
 * @param user - The user with discount settings (null for guest pricing)
 * @returns DiscountedPrice object with original/discounted prices and discount details
 * 
 * @example
 * ```ts
 * const pricing = calculateDiscountedPrice(product, user)
 * if (pricing.hasDiscount) {
 *   console.log(`Save ${pricing.discountPercentage}%!`)
 * }
 * ```
 */
export function calculateDiscountedPrice(product: Product, user: ApiUser | User | null): DiscountedPrice {
  const originalPrice = product.price
  let discountedPrice = originalPrice
  let discountAmount = 0
  let discountPercentage = 0
  let hasDiscount = false
  let isBlackFriday = false
    const isBeautyBox = false

  // Beauty box products excluded from Black Friday discounts specifically
  const BLACK_FRIDAY_EXCLUDED_PRODUCT_NUMBERS = ['55', '56', '57', '58', '59']
  
  // Check if this is a beauty box product
  const isBeautyBoxProduct = product.category === 'Beauty Boxes' || 
    (product.productNumber && BLACK_FRIDAY_EXCLUDED_PRODUCT_NUMBERS.includes(product.productNumber))
  
  // If it's a beauty box, show the built-in 15% discount
  if (isBeautyBoxProduct && product.productNumber) {
    const regularPrice = BEAUTY_BOX_REGULAR_PRICES[product.productNumber]
    if (regularPrice !== undefined) {
      return {
        originalPrice: regularPrice,
        discountedPrice: product.price, // The stored price is already the bundle price
        discountAmount: Math.round((regularPrice - product.price) * 100) / 100,
        discountPercentage: BEAUTY_BOX_DISCOUNT_PERCENTAGE,
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: true
      }
    }
  }
  
  // Check if product should be excluded from all discounts
  // Single source of truth: uses isUserDiscountExcludedProduct from mobileDiscountRules.ts
  // Excludes: noDiscount=true, Beauty Boxes, Devices (GenoLED, Gentron, HairGen), Hydro Cool Mask
  const isExcludedFromDiscount = isUserDiscountExcludedProduct(product)
  
  // Check if product should be excluded from Black Friday discounts specifically
  const isExcludedFromBlackFriday = isExcludedFromDiscount ||
    (product.productNumber && BLACK_FRIDAY_EXCLUDED_PRODUCT_NUMBERS.includes(product.productNumber))

  // Check if Black Friday sale is active (only applies to registered/logged-in users)
  const blackFridayActive = isBlackFridaySaleActive()
  
  if (blackFridayActive && user && !isExcludedFromBlackFriday) {
    // Black Friday discount applies only to registered/logged-in users
    discountPercentage = BLACK_FRIDAY_DISCOUNT_PERCENTAGE
    discountAmount = (originalPrice * discountPercentage) / 100
    discountedPrice = originalPrice - discountAmount
    hasDiscount = true
    isBlackFriday = true
  } else if (user && user.discountType && user.discountPercentage && user.discountPercentage > 0 && !isExcludedFromDiscount) {
    // User-specific discount (only if Black Friday is not active)
    discountPercentage = user.discountPercentage
    discountAmount = (originalPrice * discountPercentage) / 100
    discountedPrice = originalPrice - discountAmount
    hasDiscount = true
  }

  return {
    originalPrice,
    discountedPrice: Math.round(discountedPrice * 100) / 100, // Round to 2 decimal places
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountPercentage,
    hasDiscount,
    isBlackFriday,
    isBeautyBox
  }
}

/**
 * Get display price for a product based on user's discount settings
 * @param product - The product to get price for
 * @param user - The user with discount settings
 * @returns The price to display (discounted if applicable)
 */
export function getDisplayPrice(product: Product, user: ApiUser | User | null): number {
  const { discountedPrice } = calculateDiscountedPrice(product, user)
  return discountedPrice
}

/**
 * Check if user can see discounted prices
 * @param user - The user to check
 * @returns boolean indicating if user can see prices
 */
export function canUserSeePrices(user: ApiUser | User | null): boolean {
  return user ? (user.canSeePrices ?? false) : false
}
