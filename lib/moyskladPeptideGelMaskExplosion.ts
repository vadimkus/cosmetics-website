/**
 * Website PEPTIDE GEL MASK is sold as a 5-mask pack.
 * MoySklad tracks stock as single pcs (`00012`); box SKU `00016` is usually empty.
 * Explode each pack line into individual masks on admin push (same idea as Power Solutions).
 *
 * Clinic pack 190 AED → 5 × 38 AED. Retail pack 380 AED → 5 × 76 AED.
 */

export const PEPTIDE_GEL_MASKS_PER_PACK = 5

/** MoySklad PRODUCT_MAP key for the single-piece SKU (00012). */
export const PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME = 'PEPTIDE GEL MASK 39G SINGLE'

export interface ExplodedPeptideGelMaskLine {
  productName: string
  quantity: number
  retailPrice: number
  discountPercent: number
  sourceLabel: string
}

function normalizeProductName(name: string): string {
  return name.trim().replace(/\s*\((?:FREE|GIFT|BONUS|SAMPLE)\)\s*$/i, '').trim().toUpperCase()
}

export function isPeptideGelMaskPackProductName(productName: string): boolean {
  const normalized = normalizeProductName(productName)
  // Pack only - not the exploded single-piece alias, not eye peptide patch
  if (normalized.includes('EYE') || normalized.includes('PATCH')) return false
  if (normalized.includes('39G SINGLE')) return false
  return (
    normalized === 'PEPTIDE GEL MASK' ||
    normalized.startsWith('PEPTIDE GEL MASK ') ||
    normalized === 'GENOSYS PEPTIDE GEL MASK'
  )
}

export function explodePeptideGelMaskItem(item: {
  productName: string
  quantity: number
  price: number
  retailPrice?: number
  discountPercent?: number
}): ExplodedPeptideGelMaskLine[] {
  if (!isPeptideGelMaskPackProductName(item.productName)) return []

  const packQty = item.quantity || 1
  const packRetail = item.retailPrice ?? item.price
  const pieceRetail = Math.round((packRetail / PEPTIDE_GEL_MASKS_PER_PACK) * 100) / 100

  return [
    {
      productName: PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME,
      quantity: packQty * PEPTIDE_GEL_MASKS_PER_PACK,
      retailPrice: pieceRetail,
      discountPercent: item.discountPercent ?? 0,
      sourceLabel: 'PEPTIDE GEL MASK',
    },
  ]
}

export function sumExplodedPeptideGelMaskLinesAed(lines: ExplodedPeptideGelMaskLine[]): number {
  return lines.reduce((sum, line) => {
    const gross = line.quantity * line.retailPrice
    return sum + (gross * (100 - line.discountPercent)) / 100
  }, 0)
}
