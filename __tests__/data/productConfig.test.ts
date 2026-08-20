import {
  getProductColors,
  getProductImages,
  getProductPrice,
  getProductSizes,
  getProductVideoUrl,
} from '@/data/productConfig'

describe('productConfig media ownership', () => {
  it('keeps migrated galleries DB-only while retaining non-media config', () => {
    for (const id of ['1', '23', '28', '45', '63']) {
      expect(getProductImages(id)).toEqual([])
    }

    expect(getProductSizes('1').map(size => size.value)).toContain('0.25mm')
    expect(getProductPrice('23')).toBe(370)
    expect(getProductSizes('28').map(size => size.value)).toEqual(['50g', '250g'])
    expect(getProductVideoUrl('45')).toBe('/videos/hairs.mp4')
    expect(getProductColors('63').map(color => color.value)).toEqual(['Bright', 'Natural'])
  })
})
