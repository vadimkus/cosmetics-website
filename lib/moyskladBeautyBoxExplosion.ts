/**
 * Beauty boxes on genosys.ae are web-only bundles - no 1:1 MoySklad SKU.
 * Explode each box into individual retail products for warehouse picks + accounting.
 *
 * Retail list prices match product descriptions (sum = box regular price before 15% off).
 */

export const BEAUTY_BOX_DISCOUNT_PERCENT = 15

export interface BeautyBoxComponentSpec {
  productName: string
  size?: string
  color?: string
  qty: number
  retailPriceAed: number
}

export interface ExplodedMoySkladLine {
  productName: string
  size?: string
  color?: string
  quantity: number
  retailPrice: number
  discountPercent: number
  sourceLabel: string
}

const BEAUTY_BOX_COMPONENTS: Record<string, BeautyBoxComponentSpec[]> = {
  'PROBLEM SKIN CARE BEAUTY BOX': [
    { productName: 'SNOW O₂ CLEANSER', size: '180ml', qty: 1, retailPriceAed: 330 },
    { productName: 'INTENSIVE PROBLEM CONTROL TONER', size: '200ml', qty: 1, retailPriceAed: 260 },
    { productName: 'PROBLEM CONTROL SERUM', qty: 1, retailPriceAed: 330 },
    { productName: 'INTENSIVE PROBLEM CONTROL CREAM', size: '50g', qty: 1, retailPriceAed: 290 },
    { productName: 'SOOTHING BOMB SEA ALGAE MASK', qty: 3, retailPriceAed: 36 },
  ],
  'SKIN BRIGHTENING BEAUTY BOX': [
    { productName: 'SNOW O₂ CLEANSER', size: '180ml', qty: 1, retailPriceAed: 330 },
    { productName: 'SNOW BOOSTER', size: '200ml', qty: 1, retailPriceAed: 260 },
    { productName: 'MULTI VITA RADIANCE SERUM', qty: 1, retailPriceAed: 330 },
    { productName: 'MULTI VITA RADIANCE CREAM', size: '50g', qty: 1, retailPriceAed: 290 },
    { productName: 'EPI TURNOVER BOOSTING PEELING GEL', qty: 1, retailPriceAed: 250 },
    { productName: 'SOOTHING BOMB SEA ALGAE MASK', qty: 1, retailPriceAed: 36 },
  ],
  'CHARMING LOOK BEAUTY BOX': [
    { productName: 'SNOW O₂ CLEANSER', size: '180ml', qty: 1, retailPriceAed: 330 },
    { productName: 'SNOW BOOSTER', size: '200ml', qty: 1, retailPriceAed: 260 },
    {
      productName: 'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
      color: 'ivory',
      qty: 1,
      retailPriceAed: 300,
    },
    { productName: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', qty: 1, retailPriceAed: 290 },
    { productName: 'SKIN RESCUE OVERNIGHT CREAM MASK', qty: 1, retailPriceAed: 340 },
  ],
  'ANTI-AGING BEAUTY BOX': [
    { productName: 'SNOW O₂ CLEANSER', size: '180ml', qty: 1, retailPriceAed: 330 },
    { productName: 'SNOW BOOSTER', size: '200ml', qty: 1, retailPriceAed: 260 },
    { productName: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', qty: 1, retailPriceAed: 330 },
    { productName: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM', size: '50g', qty: 1, retailPriceAed: 290 },
    { productName: 'INTENSIVE REPAIR COLLAGEN MASK', qty: 5, retailPriceAed: 36 },
  ],
  'DEEP MOISTURIZING BEAUTY BOX': [
    { productName: 'SNOW O₂ CLEANSER', size: '180ml', qty: 1, retailPriceAed: 330 },
    { productName: 'SNOW BOOSTER', size: '200ml', qty: 1, retailPriceAed: 260 },
    { productName: 'MOISTURE REPLENISHING HYALURON SERUM', qty: 1, retailPriceAed: 330 },
    { productName: 'MOISTURE REPLENISHING HYALURON CREAM', size: '50g', qty: 1, retailPriceAed: 290 },
    { productName: 'SOOTHING BOMB SEA ALGAE MASK', qty: 3, retailPriceAed: 36 },
  ],
  'SENSITIVE SKIN BEAUTY BOX': [
    { productName: 'SNOW O₂ CLEANSER', size: '180ml', qty: 1, retailPriceAed: 330 },
    { productName: 'SNOW BOOSTER', size: '200ml', qty: 1, retailPriceAed: 260 },
    { productName: 'ALL FOR SENSITIVE SERUM', qty: 1, retailPriceAed: 330 },
    { productName: 'SKIN BARRIER PROTECTING CREAM', qty: 1, retailPriceAed: 450 },
    /* Replaced EGF REPAIR OXYMASK CREAM on 17 Aug 2026. That product is
       discontinued and its record is out of stock and hidden, so this line was
       raising picking requests for a unit that no longer exists. */
    { productName: 'SKIN RESCUE OVERNIGHT CREAM MASK', qty: 1, retailPriceAed: 340 },
    { productName: 'SOOTHING BOMB SEA ALGAE MASK', qty: 1, retailPriceAed: 36 },
  ],
}

function normalizeProductName(name: string): string {
  return name.trim().replace(/\s*\((?:FREE|GIFT|BONUS|SAMPLE)\)\s*$/i, '').trim().toUpperCase()
}

export function resolveBeautyBoxKey(productName: string): string | null {
  const normalized = normalizeProductName(productName)
  for (const key of Object.keys(BEAUTY_BOX_COMPONENTS)) {
    if (normalized === key || normalized.includes(key)) return key
  }
  return null
}

export function isBeautyBoxProductName(productName: string): boolean {
  return resolveBeautyBoxKey(productName) !== null
}

export function explodeBeautyBoxItem(item: {
  productName: string
  quantity: number
  color?: string | null
  discountPercent?: number
}): ExplodedMoySkladLine[] {
  const key = resolveBeautyBoxKey(item.productName)
  if (!key) return []

  const boxQty = item.quantity || 1
  const discountPercent = item.discountPercent && item.discountPercent > 0
    ? item.discountPercent
    : BEAUTY_BOX_DISCOUNT_PERCENT

  const components = BEAUTY_BOX_COMPONENTS[key]
  if (!components) return []

  return components.map((spec) => {
    const line: ExplodedMoySkladLine = {
      productName: spec.productName,
      quantity: spec.qty * boxQty,
      retailPrice: spec.retailPriceAed,
      discountPercent,
      sourceLabel: key,
    }
    if (spec.size) line.size = spec.size
    const cushionColor = item.color && key === 'CHARMING LOOK BEAUTY BOX' ? item.color : spec.color
    if (cushionColor) line.color = cushionColor
    return line
  })
}

/** Sum of VAT-incl. line totals after discounts (AED). */
export function sumExplodedLinesAed(lines: ExplodedMoySkladLine[]): number {
  return lines.reduce((sum, line) => {
    const gross = line.quantity * line.retailPrice
    return sum + gross * (100 - line.discountPercent) / 100
  }, 0)
}
