/**
 * EAN-13 barcodes, keyed by website product number.
 *
 * SOURCING RULE - read before adding anything here.
 *
 * Every barcode below is the Korean GS1 code printed on the physical box, taken
 * from one of two manufacturer documents:
 *
 *   1. docs/Montaji_Product_Registration_Letter_normalized.csv - the register
 *      Dubai Municipality holds. Authoritative for cosmetics.
 *   2. docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv - the current
 *      factory order form. The only source covering devices and tools, which
 *      are not cosmetics and so never appear in the Montaji register.
 *
 * MoySklad is NOT a source. Its barcodes are internally generated in-store
 * codes in the 2000000xxxxxx range, not the manufacturer EAN-13. Publishing one
 * would put a number on the page that matches nothing on the physical product.
 *
 * Korean GS1 codes start 880. Anything here that does not start 880 is wrong.
 *
 * DELIBERATELY ABSENT - do not "fill these in" without a document:
 *
 *   - #1 Microneedle Roller. The order form carries a separate barcode for each
 *     needle length and for the detachable, standard and vibrating bodies. The
 *     record says only "0.25mm", which does not identify one SKU.
 *   - #45 HR3 Matrix Hair Solution alpha. Montaji registers two near-identical
 *     entries, "Alpha (box 8 pcs)" 8809518823871 and "Alpha (8 pcs: home)"
 *     8809518824038. Both are alpha, both are eight pieces. Needs the carton
 *     checked before one is published.
 *   - #48 Hair-GENTRON and #49 GENO-LED IR II. Devices, absent from both
 *     sources.
 *   - #54 to #59 and #62. Beauty boxes and kits assembled here, so they carry
 *     the barcodes of their contents rather than one of their own.
 *
 * Where a shade or size changes the SKU it changes the barcode too, so those
 * products map variants rather than a single code. The variant key must match
 * the label used by the product's own option list.
 */

export interface ProductBarcode {
  /** The single EAN-13, for products that ship as one SKU. */
  ean?: string
  /** EAN-13 per shade or size, for products where the SKU splits. */
  variants?: Record<string, string>
}

export const PRODUCT_BARCODES: Record<string, ProductBarcode> = {
  '2': { ean: '8809392232318' },
  '3': { ean: '8809392232271' },
  '4': { ean: '8809392231823' },
  '5': { ean: '8809046298646' },
  '6': { ean: '8809046298677' },
  '7': { ean: '8809046298660' },
  '8': { ean: '8809046298653' },
  '9': { ean: '8809046298639' },
  '10': { ean: '8809205627713' },
  '11': { ean: '8809975190530' },
  '12': { ean: '8809567929142' },
  '13': { ean: '8809392231144' },
  '14': { ean: '8809579274520' },
  '15': {
    variants: {
      '200ml': '8809579274438',
      '500ml': '8809579274483',
    },
  },
  '16': { ean: '8809205628642' },
  '17': { ean: '8809046298011' },
  '18': { ean: '8809639178775' },
  '19': { ean: '8809392232035' },
  '20': { ean: '8809205624873' },
  '21': { ean: '8809639178614' },
  '22': { ean: '8809579274704' },
  '23': { ean: '8809046299964' },
  '24': { ean: '8809046298028' },
  '25': { ean: '8809046298684' },
  '26': { ean: '8809518823826' },
  '27': { ean: '8809392232066' },
  '28': { ean: '8809205624866' },
  '29': { ean: '8809639178799' },
  '30': { ean: '8809205624903' },
  '31': { ean: '8809518824212' },
  '32': { ean: '8809579274537' },
  '33': { ean: '8809579273967' },
  '34': { ean: '8809639177464' },
  '35': { ean: '8809392232011' },
  '36': { ean: '8809579273974' },
  '37': { ean: '8809139499424' },
  '38': { ean: '8809205627355' },
  '39': { ean: '8809849803436' },
  '40': { ean: '8809205627386' },
  '41': {
    variants: {
      Ivory: '8809639176351',
      Beige: '8809639176368',
      Camel: '8800250590366',
    },
  },
  '42': { ean: '8809205624880' },
  '43': { ean: '8809579273929' },
  '44': { ean: '8809954947704' },
  '46': { ean: '8809518826469' },
  '47': { ean: '8809187041125' },
  '50': { ean: '8809046298035' },
  '51': { ean: '8809575679640' },
  '52': { ean: '8809849807809' },
  '53': { ean: '8809392232042' },
  '60': { ean: '8809849808189' },
  '61': { ean: '8800065000357' },
  '63': {
    variants: {
      '#01 Bright': '8809783013113',
      '#02 Natural': '8809783013120',
    },
  },
  '64': { ean: '8809392232240' },
  '65': { ean: '8809849808110' },
  '66': {
    variants: {
      '200ml': '8809849809834',
      '600ml': '8809849809841',
    },
  },
}

/**
 * Resolves the barcode for a product, narrowing to a shade or size when one is
 * given. Falls back to the single code, then to the sole variant when a product
 * has exactly one, so a caller that does not track variants still gets an
 * answer where an unambiguous one exists.
 */
export function getProductBarcode(
  productNumber: string | null | undefined,
  variant?: string | null,
): string | null {
  if (!productNumber) return null
  const entry = PRODUCT_BARCODES[String(productNumber)]
  if (!entry) return null
  if (variant && entry.variants?.[variant]) return entry.variants[variant]
  if (entry.ean) return entry.ean
  const all = Object.values(entry.variants ?? {})
  return all.length === 1 ? all[0]! : null
}

/** Every barcode for a product, for pages that list each shade or size. */
export function getProductBarcodes(
  productNumber: string | null | undefined,
): { label: string | null; ean: string }[] {
  if (!productNumber) return []
  const entry = PRODUCT_BARCODES[String(productNumber)]
  if (!entry) return []
  if (entry.ean) return [{ label: null, ean: entry.ean }]
  return Object.entries(entry.variants ?? {}).map(([label, ean]) => ({ label, ean }))
}
