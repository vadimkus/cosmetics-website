import type { Product } from '@/types'
import {
  buildBagLink,
  inferConcerns,
  parseBagItems,
  parseList,
  productOptions,
  resolveSelection,
  productUrl,
  searchProducts,
  stripHtml,
  summarizeProduct,
} from '@/lib/mcp/catalog'

const base = (over: Partial<Product>): Product => ({
  id: 'x',
  productNumber: null,
  name: 'X',
  price: 100,
  description: '',
  image: '/images/x.jpg',
  category: 'Serum',
  inStock: true,
  noDiscount: true,
  ...over,
})

const serum = base({
  id: '18',
  productNumber: '18',
  name: 'MOISTURE REPLENISHING HYALURON SERUM',
  price: 330,
  category: 'Serum',
  description: 'A coconut-water serum for skin that runs dry in the AC.',
  targetConcerns: '["hydration"]',
  skinType: 'dry',
})
const cleanser = base({
  id: 'c1',
  productNumber: '3',
  name: 'PROBLEM CONTROL CLEANSER',
  price: 120,
  category: 'Cleanser',
  description: 'Gel cleanser for oily, blemish-prone skin.',
  targetConcerns: '["acne-blemishes","pore-care"]',
  skinType: 'oily',
})
const sun = base({
  id: 's1',
  productNumber: '40',
  name: 'SNOW SUN CREAM SPF50',
  price: 150,
  category: 'Sun',
  targetConcerns: '["sun-protection"]',
  inStock: false,
})
const catalog = [serum, cleanser, sun]

describe('searchProducts', () => {
  it('finds a product by name words in any order', () => {
    expect(searchProducts(catalog, { query: 'hyaluron serum' })[0]?.id).toBe('18')
  })

  it('falls back to loose matching for natural phrases', () => {
    const ids = searchProducts(catalog, { query: 'something for my dry skin please' }).map((p) => p.id)
    expect(ids[0]).toBe('18')
  })

  it('maps shopper words to concern tags', () => {
    expect(inferConcerns('cream for wrinkles and acne')).toEqual(expect.arrayContaining(['anti-aging', 'acne-blemishes']))
    expect(searchProducts(catalog, { query: 'acne' }).map((p) => p.id)).toContain('c1')
  })

  it('applies filters', () => {
    expect(searchProducts(catalog, { category: 'cleanser' }).map((p) => p.id)).toEqual(['c1'])
    expect(searchProducts(catalog, { max_price_aed: 200 }).map((p) => p.id)).not.toContain('18')
    expect(searchProducts(catalog, { in_stock_only: true }).map((p) => p.id)).not.toContain('s1')
    expect(searchProducts(catalog, { concern: 'sun' }).map((p) => p.id)).toEqual(['s1'])
  })
})

describe('summarizeProduct', () => {
  it('quotes the VAT-inclusive price and a localized link', () => {
    const s = summarizeProduct(serum, 'ru')
    expect(s.price_aed).toBe(330)
    expect(s.price_note).toMatch(/VAT/)
    expect(s.url).toBe('https://genosys.ae/ru/products/18')
    expect(s.image).toBe('https://genosys.ae/images/x.jpg')
  })

  it('hides the price of price-on-request products', () => {
    expect(summarizeProduct(base({ isPriceOnRequest: true }), 'en').price_aed).toBeNull()
  })
})

describe('bag links', () => {
  it('round-trips items, sizes and shades', () => {
    const url = buildBagLink([
      { product_id: '68', quantity: 1, color: '#01 Bright' },
      { product_id: '18', quantity: 2 },
    ])
    expect(url.startsWith('https://genosys.ae/add-to-bag?items=')).toBe(true)
    const param = decodeURIComponent(url.split('items=')[1] ?? '')
    expect(parseBagItems(param)).toEqual([
      { product_id: '68', quantity: 1, size: null, color: '#01 Bright' },
      { product_id: '18', quantity: 2, size: null, color: null },
    ])
  })

  it('clamps quantities and drops malformed ids', () => {
    expect(parseBagItems('18|999,../etc|1,<x>|2')).toEqual([{ product_id: '18', quantity: 20, size: null, color: null }])
  })
})

describe('helpers', () => {
  it('parses list fields of strings and objects', () => {
    expect(parseList('[{"title":"Fill","description":"Water in."},"Plain"]')).toEqual(['Fill: Water in.', 'Plain'])
    expect(parseList('not json')).toEqual([])
  })

  it('strips html to readable text', () => {
    expect(stripHtml('<h2>Hi</h2><p>A &amp; B</p><script>x()</script>')).toBe('Hi\n A & B')
  })

  it('builds english urls without a prefix', () => {
    expect(productUrl(serum, 'en')).toBe('https://genosys.ae/products/18')
  })
})

describe('shades and sizes', () => {
  const kit = base({ id: '68', productNumber: '68', name: 'GLASS SKIN RITUAL KIT', price: 652.5, category: 'Beauty Boxes' })

  it('lists configured shades with the value the bag stores', () => {
    expect(productOptions(kit).map((o) => [o.color, o.label])).toEqual([
      ['Bright', '#01 Bright'],
      ['Natural', '#02 Natural'],
    ])
  })

  it('accepts a label or a value and requires a pick', () => {
    expect(resolveSelection(kit, null, '#02 Natural')).toMatchObject({ ok: true, color: 'Natural' })
    expect(resolveSelection(kit, null, 'bright')).toMatchObject({ ok: true, color: 'Bright' })
    expect(resolveSelection(kit, null, null)).toMatchObject({ ok: false })
    expect(resolveSelection(kit, null, 'Dark')).toMatchObject({ ok: false })
  })

  it('needs nothing for a single-option product', () => {
    expect(resolveSelection(serum)).toMatchObject({ ok: true, size: null, color: null, price_aed: 330 })
  })
})

describe('ranking by product type', () => {
  const oilyToner = base({ id: 't', productNumber: '15', name: 'INTENSIVE PROBLEM CONTROL TONER', category: 'Toner/Mist', skinType: 'oily', description: 'Toner for oily skin.', targetConcerns: '["pore-care"]' })
  const sunCream = base({ id: 'sc', productNumber: '40', name: 'MULTI SUN CREAM [SPF 40 PA++]', category: 'Sun', description: 'Daily sun cream.' })
  it('puts a sunscreen first for "sunscreen for oily skin"', () => {
    expect(searchProducts([oilyToner, sunCream], { query: 'sunscreen for oily skin' })[0]?.id).toBe('sc')
  })
  it('understands Russian product types', () => {
    expect(searchProducts([oilyToner, sunCream], { query: 'солнцезащитный крем' })[0]?.id).toBe('sc')
  })
})

describe('ranking', () => {
  const box = base({ id: 'b', productNumber: '62', name: 'SENSITIVE SKIN BEAUTY BOX', category: 'Beauty Boxes', description: 'A serum and a cream for dry skin.' })
  it('puts the product that is a serum above a box that mentions one', () => {
    expect(searchProducts([box, serum], { query: 'serum for dry skin' }).map((p) => p.id)).toEqual(['18', 'b'])
  })
})
