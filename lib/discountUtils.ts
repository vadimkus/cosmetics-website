import { User } from '@/types/user'
import { Product } from '@/types'
import { isBlackFridaySaleActive, BLACK_FRIDAY_DISCOUNT_PERCENTAGE } from './blackFridayUtils'

export interface DiscountedPrice {
  originalPrice: number
  discountedPrice: number
  discountAmount: number
  discountPercentage: number
  hasDiscount: boolean
  isBlackFriday?: boolean
}

/**
 * Calculate discounted price for a product based on user's discount settings and Black Friday sale
 * @param product - The product to calculate discount for
 * @param user - The user with discount settings
 * @returns DiscountedPrice object with pricing details
 */
export function calculateDiscountedPrice(product: Product, user: User | null): DiscountedPrice {
  const originalPrice = product.price
  let discountedPrice = originalPrice
  let discountAmount = 0
  let discountPercentage = 0
  let hasDiscount = false
  let isBlackFriday = false

  // Beauty box products excluded from Black Friday discounts specifically
  const BLACK_FRIDAY_EXCLUDED_PRODUCT_NUMBERS = ['55', '56', '57', '58', '59']
  
  // Check if product should be excluded from all discounts
  // Exclude if: noDiscount flag is true OR category is "Beauty Boxes"
  // Product-specific exclusions are now handled via the noDiscount database flag
  const isExcludedFromDiscount = product.noDiscount === true || 
    product.category === 'Beauty Boxes'
  
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
    isBlackFriday
  }
}

/**
 * Get display price for a product based on user's discount settings
 * @param product - The product to get price for
 * @param user - The user with discount settings
 * @returns The price to display (discounted if applicable)
 */
export function getDisplayPrice(product: Product, user: User | null): number {
  const { discountedPrice } = calculateDiscountedPrice(product, user)
  return discountedPrice
}

/**
 * Check if user can see discounted prices
 * @param user - The user to check
 * @returns boolean indicating if user can see prices
 */
export function canUserSeePrices(user: User | null): boolean {
  return user ? (user.canSeePrices ?? false) : false
}
