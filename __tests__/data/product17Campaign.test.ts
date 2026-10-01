import { products } from '@/lib/products'
import { localizeProductImage } from '@/lib/localizedProductImages'

describe('product 17 EyeCell serum "Tired has a shape." campaign', () => {
  it('keeps the clean main and ships twelve campaign slides in the fallback record', () => {
    const product = products.find(p => p.id === '17')
    expect(product?.image).toBe('/images/eye_serum/main-v2.jpg')
    const gallery: string[] = JSON.parse(product?.images ?? '[]')
    expect(gallery).toHaveLength(12)
    expect(gallery.every(src => src.startsWith('/images/eyeserum_shape/s'))).toBe(true)
  })

  it('swaps every slide to its Russian and Arabic render, and leaves the main alone', () => {
    for (const locale of ['ru', 'ar']) {
      for (let n = 1; n <= 12; n++) {
        expect(localizeProductImage(`/images/eyeserum_shape/s${n}.jpg`, locale)).toBe(
          `/images/eyeserum_shape/${locale}/s${n}.jpg`
        )
      }
      expect(localizeProductImage('/images/eye_serum/main-v2.jpg', locale)).toBe('/images/eye_serum/main-v2.jpg')
    }
    expect(localizeProductImage('/images/eyeserum_shape/s1.jpg', 'en')).toBe('/images/eyeserum_shape/s1.jpg')
  })
})
