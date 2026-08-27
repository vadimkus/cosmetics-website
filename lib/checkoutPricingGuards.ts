import { Product } from '@/types'
import { isBeautyBoxProduct } from '@/lib/mobileDiscountRules'

const FREE_GIFT_PRODUCT_KEYS = new Set([
  '36', // SOOTHING BOMB SEA ALGAE MASK
  '53', // INTENSIVE REPAIR COLLAGEN MASK product number
  'cmgj9ifoi00008o07p4eqmfb7', // INTENSIVE REPAIR COLLAGEN MASK db id in native promo config
])

// No name-level exclusions currently - SRS was re-admitted to the bundle
// builder on 2026-07-06. Category-level exclusions below still apply.
const EXCLUDED_BUNDLE_PRODUCT_NAMES: string[] = []
const EXCLUDED_BUNDLE_CATEGORIES = ['beauty boxes', 'pro solution']

export function isAllowedFreeGiftProduct(product: Product): boolean {
  const keys = [
    product.id,
    product.productNumber,
  ].map((value) => String(value || '').trim()).filter(Boolean)

  return keys.some((key) => FREE_GIFT_PRODUCT_KEYS.has(key))
}

// Which free-gift mask a product is, if any. Keeps the threshold logic
// (below) able to enforce "collagen at >=500, + sea algae at >=700".
const SEA_ALGAE_GIFT_KEYS = new Set(['36'])
const COLLAGEN_GIFT_KEYS = new Set(['53', 'cmgj9ifoi00008o07p4eqmfb7'])

export function freeGiftKind(product: Product): 'collagen' | 'sea_algae' | null {
  const keys = [product.id, product.productNumber]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
  if (keys.some((key) => SEA_ALGAE_GIFT_KEYS.has(key))) return 'sea_algae'
  if (keys.some((key) => COLLAGEN_GIFT_KEYS.has(key))) return 'collagen'
  return null
}

/**
 * Server-side free-gift threshold enforcement (mirrors the checkout UI):
 *   paid subtotal >= 700 → 1 collagen mask + 1 sea algae mask
 *   paid subtotal >= 500 → 1 collagen mask
 *   otherwise            → none
 *
 * Prevents a crafted request from claiming free masks (or extra quantities)
 * without meeting the spend threshold. `paidSubtotal` is the server-computed
 * subtotal of the non-free items only.
 */
export function allowedFreeGiftUnits(paidSubtotal: number): { collagen: number; seaAlgae: number } {
  if (paidSubtotal >= 700) return { collagen: 1, seaAlgae: 1 }
  if (paidSubtotal >= 500) return { collagen: 1, seaAlgae: 0 }
  return { collagen: 0, seaAlgae: 0 }
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

  return expectedPct
}
