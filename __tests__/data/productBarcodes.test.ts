import {
  PRODUCT_BARCODES,
  getProductBarcode,
  getProductBarcodes,
} from '@/data/productBarcodes'

/**
 * These barcodes are transcribed by hand from manufacturer PDFs and CSVs, and
 * they end up on the page and in Merchant Center JSON-LD as a factual claim
 * about a physical carton. The check digit catches roughly nine out of ten
 * single-digit typos, so guarding it here is the cheapest protection available.
 */
function isValidEan13(ean: string): boolean {
  if (!/^\d{13}$/.test(ean)) return false
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += Number(ean[i]) * (i % 2 === 0 ? 1 : 3)
  }
  return (10 - (sum % 10)) % 10 === Number(ean[12])
}

const allEntries = Object.entries(PRODUCT_BARCODES).flatMap(([productNumber, entry]) => {
  const codes: { productNumber: string; label: string | null; ean: string }[] = []
  if (entry.ean) codes.push({ productNumber, label: null, ean: entry.ean })
  for (const [label, ean] of Object.entries(entry.variants ?? {})) {
    codes.push({ productNumber, label, ean })
  }
  return codes
})

describe('product barcodes', () => {
  it('holds at least one code for every mapped product', () => {
    for (const [productNumber, entry] of Object.entries(PRODUCT_BARCODES)) {
      const count = (entry.ean ? 1 : 0) + Object.keys(entry.variants ?? {}).length
      expect({ productNumber, count }).toEqual({ productNumber, count: expect.any(Number) })
      expect(count).toBeGreaterThan(0)
    }
  })

  it.each(allEntries)('#$productNumber $label $ean is a valid EAN-13', ({ ean }) => {
    expect(isValidEan13(ean)).toBe(true)
  })

  it('only contains Korean GS1 prefixes', () => {
    // GENOSYS manufactures in Korea, so 880 is the only legitimate prefix. This
    // is what stops a MoySklad internal 2000000xxxxxx code being pasted in.
    const foreign = allEntries.filter(e => !e.ean.startsWith('880'))
    expect(foreign).toEqual([])
  })

  it('never assigns the same barcode to two different products', () => {
    const owners = new Map<string, string[]>()
    for (const { productNumber, ean } of allEntries) {
      owners.set(ean, [...(owners.get(ean) ?? []), productNumber])
    }
    const shared = [...owners.entries()]
      .filter(([, products]) => new Set(products).size > 1)
      .map(([ean, products]) => `${ean} -> ${products.join(', ')}`)
    expect(shared).toEqual([])
  })
})

describe('getProductBarcode', () => {
  it('returns the single code for a one-SKU product', () => {
    expect(getProductBarcode('65')).toBe('8809849808110')
  })

  it('narrows to the requested variant', () => {
    expect(getProductBarcode('63', '#01 Bright')).toBe('8809783013113')
    expect(getProductBarcode('63', '#02 Natural')).toBe('8809783013120')
    expect(getProductBarcode('66', '600ml')).toBe('8809849809841')
  })

  it('refuses to guess when a product splits into several SKUs', () => {
    // A single Product node cannot honestly claim one GTIN across two shades,
    // so schema.org output has to omit it rather than pick a shade.
    expect(getProductBarcode('63')).toBeNull()
    expect(getProductBarcode('66')).toBeNull()
  })

  it('returns null for products we hold no document for', () => {
    expect(getProductBarcode('1')).toBeNull()
    expect(getProductBarcode('45')).toBeNull()
    expect(getProductBarcode('49')).toBeNull()
    expect(getProductBarcode('54')).toBeNull()
    expect(getProductBarcode(null)).toBeNull()
    expect(getProductBarcode(undefined)).toBeNull()
  })

  it('falls back to an unknown variant label rather than returning nothing', () => {
    expect(getProductBarcode('65', 'not-a-real-size')).toBe('8809849808110')
  })
})

describe('getProductBarcodes', () => {
  it('lists every shade for a multi-SKU product', () => {
    expect(getProductBarcodes('63')).toEqual([
      { label: '#01 Bright', ean: '8809783013113' },
      { label: '#02 Natural', ean: '8809783013120' },
    ])
  })

  it('returns an unlabelled single entry for a one-SKU product', () => {
    expect(getProductBarcodes('64')).toEqual([{ label: null, ean: '8809392232240' }])
  })

  it('returns nothing for an unmapped product, so no empty row renders', () => {
    expect(getProductBarcodes('49')).toEqual([])
    expect(getProductBarcodes(null)).toEqual([])
  })
})
