/**
 * The MESOPECIA KIT (product 70) is GENOSYS's own bundle of three products that MoySklad stocks
 * one by one, so each kit line is pushed as its three components: one 0.25 mm Microneedle Stamp,
 * one HR³ MATRIX HAIR SOLUTION α box (8 vials) and one HR³ MATRIX SCALP PEELING α.
 *
 * The kit price is split across the three in proportion to their list prices, rounded to the
 * fils, with the rounding put on the last line so the three add up to the kit exactly. The kit
 * line's own discount carries over unchanged.
 *
 * Not to be confused with 'HR³ MATRIX MESOPECIA KIT' (product 47, retired), which MoySklad still
 * maps as one item.
 */

export interface ExplodedMesopeciaKitLine {
  productName: string
  size?: string
  quantity: number
  retailPrice: number
  discountPercent: number
  sourceLabel: string
}

/** MoySklad PRODUCT_MAP names and the list prices used to weight the split. */
export const MESOPECIA_KIT_COMPONENTS = [
  { productName: 'Microneedle Stamp', size: '0.25mm', listPrice: 230 },
  { productName: 'HR³ MATRIX HAIR SOLUTION α', listPrice: 740 },
  { productName: 'HR³ MATRIX SCALP PEELING α', listPrice: 290 },
] as const

const KIT_NAMES = new Set(['MESOPECIA KIT', 'GENOSYS MESOPECIA KIT'])

function normalizeProductName(name: string): string {
  return name.trim().replace(/\s*\((?:FREE|GIFT|BONUS|SAMPLE)\)\s*$/i, '').trim().toUpperCase()
}

export function isMesopeciaKitProductName(productName: string): boolean {
  return KIT_NAMES.has(normalizeProductName(productName))
}

export function explodeMesopeciaKitItem(item: {
  productName: string
  quantity: number
  price: number
  retailPrice?: number
  discountPercent?: number
}): ExplodedMesopeciaKitLine[] {
  if (!isMesopeciaKitProductName(item.productName)) return []

  const kitRetail = item.retailPrice ?? item.price
  const listTotal = MESOPECIA_KIT_COMPONENTS.reduce((sum, c) => sum + c.listPrice, 0)
  let allocated = 0

  return MESOPECIA_KIT_COMPONENTS.map((component, i) => {
    const last = i === MESOPECIA_KIT_COMPONENTS.length - 1
    const share = last
      ? Math.round((kitRetail - allocated) * 100) / 100
      : Math.round((kitRetail * component.listPrice / listTotal) * 100) / 100
    allocated += share
    return {
      productName: component.productName,
      ...('size' in component ? { size: component.size } : {}),
      quantity: item.quantity || 1,
      retailPrice: share,
      discountPercent: item.discountPercent ?? 0,
      sourceLabel: 'MESOPECIA KIT',
    }
  })
}

/** Sum of VAT-incl. line totals after discounts (AED). */
export function sumExplodedMesopeciaKitLinesAed(lines: ExplodedMesopeciaKitLine[]): number {
  return lines.reduce((sum, line) => sum + (line.quantity * line.retailPrice * (100 - line.discountPercent)) / 100, 0)
}
