import { Product } from '@/types'
import { isBeautyBoxProduct } from '@/lib/mobileDiscountRules'

const FREE_GIFT_PRODUCT_KEYS = new Set([
  '36', // SOOTHING BOMB SEA ALGAE MASK
  '53', // INTENSIVE REPAIR COLLAGEN MASK product number
  'cmgj9ifoi00008o07p4eqmfb7', // INTENSIVE REPAIR COLLAGEN MASK db id in native promo config
])

const EXCLUDED_BUNDLE_PRODUCT_NAMES = ['SKIN RENEWAL PEELING SYSTEM']
const EXCLUDED_BUNDLE_CATEGORIES = ['beauty boxes', 'pro solution']

export function isAllowedFreeGiftProduct(product: Product): boolean {
  const keys = [
    product.id,
    product.productNumber,
  ].map((value) => String(value || '').trim()).filter(Boolean)

  return keys.some((key) => FREE_GIFT_PRODUCT_KEYS.has(key))
}

export function getBundleDiscountTier(itemCount: number): number {
  if (itemCount >= 5) return 20
  if (itemCount >= 4) return 15
  if (itemCount >= 3) return 10
  if (itemCount >= 2) return 5
  return 0
}

export function isBundleEligibleProduct(product: Product): boolean {
  const name = String(product.name || '').trim().toUpperCase()
  const category = String(product.category || '').trim().toLowerCase()

  if (isBeautyBoxProduct(product)) return false
  if (EXCLUDED_BUNDLE_CATEGORIES.includes(category)) return false
  if (EXCLUDED_BUNDLE_PRODUCT_NAMES.some((excluded) => name.includes(excluded))) return false

  return true
}

export function isSubmittedBundleLine(
  submittedDiscount: unknown,
  product: Product
): boolean {
  const pct = Number(submittedDiscount)
  return Number.isFinite(pct) && pct > 0 && isBundleEligibleProduct(product)
}

export function getValidatedBundleDiscountPercent(
  submittedDiscount: unknown,
  product: Product,
  bundleLineCount: number
): number | null {
  const submittedPct = Number(submittedDiscount)
  const expectedPct = getBundleDiscountTier(bundleLineCount)

  if (!isSubmittedBundleLine(submittedPct, product)) return null
  if (expectedPct <= 0) return null
  if (Math.round(submittedPct) !== expectedPct) return null

  return expectedPct
}
