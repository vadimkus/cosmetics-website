import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'
import type { CartItem, Product } from '@/types'

const product: Product = {
  id: 'cleanser',
  name: 'Cerabarrier Biome Gel Cleanser',
  image: '/cleanser.jpg',
  price: 380,
  category: 'Cleanser',
  description: 'Test product',
  inStock: true,
}

const line = (selectedSize: string, quantity: number, extra: Partial<CartItem> = {}): CartItem => ({
  product,
  quantity,
  selectedColor: '',
  selectedSize,
  ...extra,
})

describe('findSelectedStandardCartLine', () => {
  it('returns only the exact selected size', () => {
    const items = [line('600ml', 2), line('200ml', 3)]

    expect(findSelectedStandardCartLine(items, product.id, '', '600ml')?.quantity).toBe(2)
    expect(findSelectedStandardCartLine(items, product.id, '', '200ml')?.quantity).toBe(3)
  })

  it('returns no line for a size that has not been added', () => {
    const items = [line('600ml', 2)]

    expect(findSelectedStandardCartLine(items, product.id, '', '200ml')).toBeUndefined()
  })

  it('does not treat bundle or homecare lines as the selected retail line', () => {
    const items = [
      line('600ml', 2, { fromBundle: true }),
      line('600ml', 1, {
        homecare: {
          scriptId: 'script',
          versionId: 'version',
          scriptItemId: 'item',
          token: 'token',
          addedAt: '2026-07-21T00:00:00.000Z',
        },
      }),
    ]

    expect(findSelectedStandardCartLine(items, product.id, '', '600ml')).toBeUndefined()
  })
})
