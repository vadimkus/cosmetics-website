import {
  getBundleDiscountTier,
  getValidatedBundleDiscountPercent,
  isAllowedFreeGiftProduct,
} from '@/lib/checkoutPricingGuards'
import { Product } from '@/types'

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'product-1',
  productNumber: '1',
  name: 'Server Serum',
  image: '/server.jpg',
  price: 200,
  category: 'Serum',
  description: 'Server product',
  inStock: true,
  rating: 5,
  ...overrides,
})

describe('checkout pricing guards', () => {
  it('allowlists only configured free gift products', () => {
    expect(isAllowedFreeGiftProduct(createProduct({ id: '36', productNumber: '36' }))).toBe(true)
    expect(isAllowedFreeGiftProduct(createProduct({ id: 'cmgj9ifoi00008o07p4eqmfb7', productNumber: '53' }))).toBe(true)
    expect(isAllowedFreeGiftProduct(createProduct())).toBe(false)
  })

  it('derives bundle discount tiers from item count', () => {
    expect(getBundleDiscountTier(1)).toBe(0)
    expect(getBundleDiscountTier(2)).toBe(5)
    expect(getBundleDiscountTier(3)).toBe(10)
    expect(getBundleDiscountTier(4)).toBe(15)
    expect(getBundleDiscountTier(5)).toBe(20)
  })

  it('uses submitted bundle markers but computes the tier on the server', () => {
    const product = createProduct()

    expect(getValidatedBundleDiscountPercent(5, product, 2)).toBe(5)
    expect(getValidatedBundleDiscountPercent(20, product, 4)).toBe(15)
    expect(getValidatedBundleDiscountPercent(90, product, 2)).toBe(5)
    expect(getValidatedBundleDiscountPercent(20, product, 1)).toBeNull()
    expect(getValidatedBundleDiscountPercent(5, createProduct({ category: 'Beauty Boxes' }), 2)).toBeNull()
  })
})
