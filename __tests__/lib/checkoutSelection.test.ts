import { checkoutSelectionError, resolveCheckoutSelection } from '@/lib/checkoutSelection'
import type { Product, ProductVariant } from '@/types'

const v = (size: string | null, color: string | null, extra: Partial<ProductVariant> = {}): ProductVariant => ({
  id: `${size}-${color}`,
  size,
  color,
  price: 100,
  available: true,
  isDefault: false,
  ...extra,
})
const product = (variants: ProductVariant[]): Product =>
  ({ id: 'p', productNumber: '28', name: 'INTENSIVE HYDRO SOOTHING CREAM', variants } as unknown as Product)

const twoSizes = product([v('50g', null, { isDefault: true }), v('250g', null)])
const shades = product([v(null, '#01 Bright'), v(null, '#02 Natural')])
const simple = product([])

describe('resolveCheckoutSelection', () => {
  it('accepts a real size and canonicalises spacing and case', () => {
    expect(resolveCheckoutSelection(twoSizes, '250g', '')).toEqual({ ok: true, selectedSize: '250g', selectedColor: '' })
    expect(resolveCheckoutSelection(twoSizes, '250 G', '')).toMatchObject({ ok: true, selectedSize: '250g' })
  })

  it('rejects a missing or unknown size on a two-size product instead of charging the default', () => {
    expect(resolveCheckoutSelection(twoSizes, '', '')).toEqual({ ok: false, code: 'OPTION_REQUIRED', dimension: 'size', options: ['50g', '250g'] })
    expect(resolveCheckoutSelection(twoSizes, '100g', '')).toMatchObject({ ok: false, code: 'OPTION_REQUIRED' })
  })

  it('drops a display-only size on a simple product (the Bundle Builder bug)', () => {
    expect(resolveCheckoutSelection(simple, '80 ml', '')).toEqual({ ok: true, selectedSize: '', selectedColor: '' })
  })

  it('requires a shade when the product has several', () => {
    expect(resolveCheckoutSelection(shades, '', '')).toMatchObject({ ok: false, dimension: 'color' })
    expect(resolveCheckoutSelection(shades, '', '#02 natural')).toMatchObject({ ok: true, selectedColor: '#02 Natural' })
  })

  it('fills the only option automatically', () => {
    expect(resolveCheckoutSelection(product([v('100g', null)]), '', '')).toMatchObject({ ok: true, selectedSize: '100g' })
  })

  it('rejects an unavailable variant', () => {
    const p = product([v('50g', null), v('250g', null, { available: false })])
    expect(resolveCheckoutSelection(p, '250g', '')).toMatchObject({ ok: false, code: 'OPTION_UNAVAILABLE' })
  })

  it('never rejects free gifts and keeps the promo marker', () => {
    expect(resolveCheckoutSelection(shades, '', '', { lenient: true })).toEqual({ ok: true, selectedSize: '', selectedColor: '' })
    expect(resolveCheckoutSelection(twoSizes, '__PROMO__', '')).toMatchObject({ ok: true, selectedSize: '__PROMO__' })
  })

  it('returns an error body both web and mobile understand', () => {
    const r = resolveCheckoutSelection(twoSizes, '', '')
    if (r.ok) throw new Error('expected rejection')
    expect(checkoutSelectionError(r, twoSizes)).toMatchObject({
      success: false,
      code: 'OPTION_REQUIRED',
      productId: 'p',
      productNumber: '28',
      dimension: 'size',
      error: 'Please choose a size for INTENSIVE HYDRO SOOTHING CREAM.',
    })
  })
})
