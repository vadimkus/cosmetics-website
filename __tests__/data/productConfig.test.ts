import { getProductColors, getProductImages } from '@/data/productConfig'

describe('productConfig media ownership', () => {
  it('keeps Revita Glow gallery DB-only while retaining its shade variants', () => {
    expect(getProductImages('63')).toEqual([])
    expect(getProductColors('63').map(color => color.value)).toEqual(['Bright', 'Natural'])
  })
})
