/**
 * Power Solution boxes on genosys.ae are sold as 10-vial kits.
 * MoySklad often has vial stock but no box stock - explode each box line
 * into individual vials (1 box = 10 vials) on admin push.
 *
 * Retail: box price ÷ 10 per vial (e.g. 580 AED box → 10 × 58 AED vials).
 */

export const POWER_SOLUTION_VIALS_PER_BOX = 10

export interface ExplodedPowerSolutionLine {
  productName: string
  quantity: number
  retailPrice: number
  discountPercent: number
  sourceLabel: string
}

/** Web product name → MoySklad vial SKU name (PRODUCT_MAP key). */
const POWER_SOLUTION_BOX_TO_VIAL: Record<string, string> = {
  'POWER SOLUTION AWS': 'POWER SOLUTION AWS 1 VIAL 2ML',
  'POWER SOLUTION SWS': 'POWER SOLUTION SWS 1 VIAL 2ML',
  'POWER SOLUTION CVS': 'POWER SOLUTION CVS 1 VIAL 2ML',
  'POWER SOLUTION HES': 'POWER SOLUTION HES 1 VIAL 2ML',
  'POWER SOLUTION PCS': 'POWER SOLUTION PCS 1 VIAL 2ML',
  'POWER SOLUTION CTS': 'POWER SOLUTION CTS 1 VIAL 2ML',
}

function normalizeProductName(name: string): string {
  return name.trim().replace(/\s*\((?:FREE|GIFT|BONUS|SAMPLE)\)\s*$/i, '').trim().toUpperCase()
}

export function resolvePowerSolutionBoxKey(productName: string): string | null {
  const normalized = normalizeProductName(productName)
  for (const key of Object.keys(POWER_SOLUTION_BOX_TO_VIAL)) {
    if (normalized === key || normalized.startsWith(`${key} `)) return key
  }
  return null
}

export function isPowerSolutionBoxProductName(productName: string): boolean {
  return resolvePowerSolutionBoxKey(productName) !== null
}

export function explodePowerSolutionBoxItem(item: {
  productName: string
  quantity: number
  price: number
  retailPrice?: number
  discountPercent?: number
}): ExplodedPowerSolutionLine[] {
  const key = resolvePowerSolutionBoxKey(item.productName)
  if (!key) return []

  const vialName = POWER_SOLUTION_BOX_TO_VIAL[key]
  if (!vialName) return []

  const boxQty = item.quantity || 1
  const boxRetail = item.retailPrice ?? item.price
  const vialRetail = Math.round((boxRetail / POWER_SOLUTION_VIALS_PER_BOX) * 100) / 100

  return [{
    productName: vialName,
    quantity: boxQty * POWER_SOLUTION_VIALS_PER_BOX,
    retailPrice: vialRetail,
    discountPercent: item.discountPercent ?? 0,
    sourceLabel: key,
  }]
}

/** Sum of VAT-incl. line totals after discounts (AED). */
export function sumExplodedPowerSolutionLinesAed(lines: ExplodedPowerSolutionLine[]): number {
  return lines.reduce((sum, line) => {
    const gross = line.quantity * line.retailPrice
    return sum + gross * (100 - line.discountPercent) / 100
  }, 0)
}
