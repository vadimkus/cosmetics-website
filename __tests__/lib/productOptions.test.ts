import { PRODUCT_CONFIG } from '@/data/productConfig'
import {
  extractProductOptions,
  getInitialProductSelection,
  getProductOptionKey,
  isOptionAvailable,
  isProductOptionSelectionRequired,
  isProductSelectionComplete,
} from '@/lib/productOptions'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { useCartStore } from '@/lib/cartStore'
import type { Product, ProductVariant } from '@/types'
import type { User } from '@/types/user'

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 'test-product',
    productNumber: null,
    name: 'Test Product',
    description: 'Test',
    image: '/images/test.jpg',
    category: 'Cream',
    price: 100,
    inStock: true,
    variants: [],
    ...overrides,
  }
}

function variant(
  id: string,
  overrides: Partial<ProductVariant>,
): ProductVariant {
  return {
    id,
    size: null,
    color: null,
    price: 100,
    available: true,
    isDefault: false,
    ...overrides,
  }
}

describe('product option model', () => {
  it('requires an explicit selection for every configured live option product', () => {
    const expected = ['1', '10', '15', '16', '25', '28', '29', '30', '31', '32', '41', '63', '66']
    const configBacked = Object.entries(PRODUCT_CONFIG)
      .filter(([, config]) => (config.sizes?.length || 0) > 1 || (config.colors?.length || 0) > 1)
      .map(([id]) => id)
      .sort((a, b) => Number(a) - Number(b))

    expect(configBacked).toEqual(expected.filter((id) => id !== '66'))
    expected.forEach((productNumber) => {
      const liveProduct = product({
        id: `cuid-${productNumber}`,
        productNumber,
        ...(productNumber === '66'
          ? {
              variants: [
                variant('cera-small', { size: '200ml', price: 380 }),
                variant('cera-large', { size: '600ml', price: 620 }),
              ],
            }
          : {}),
      })
      expect(
        isProductOptionSelectionRequired(liveProduct),
      ).toBe(true)
      expect(
        getInitialProductSelection(liveProduct),
      ).toEqual({ selectedSize: '', selectedColor: '' })
    })
  })

  it('keeps a single/no-option product on the one-tap path', () => {
    expect(isProductOptionSelectionRequired(product())).toBe(false)
    expect(isProductSelectionComplete(product(), { selectedSize: '', selectedColor: '' })).toBe(true)
  })

  it('disables unavailable options and requires an available choice', () => {
    const testProduct = product({
      variants: [
        variant('small', { size: '50g', price: 100, available: true }),
        variant('large', { size: '250g', price: 160, available: false }),
      ],
    })
    const model = extractProductOptions(testProduct)

    expect(isOptionAvailable(model, 'size', '50g', { selectedSize: '', selectedColor: '' })).toBe(true)
    expect(isOptionAvailable(model, 'size', '250g', { selectedSize: '', selectedColor: '' })).toBe(false)
    expect(isProductSelectionComplete(testProduct, { selectedSize: '250g', selectedColor: '' })).toBe(false)
    expect(isProductSelectionComplete(testProduct, { selectedSize: '50g', selectedColor: '' })).toBe(true)
  })

  it('uses selected variant price and preserves VIP discount display', () => {
    const testProduct = product({
      variants: [
        variant('small', { size: '200ml', price: 380, isDefault: true }),
        variant('large', { size: '600ml', price: 620 }),
      ],
    })
    const vip = {
      id: 'vip',
      email: 'vip@example.com',
      canSeePrices: true,
      discountType: 'percentage',
      discountPercentage: 10,
    } as User

    const pricing = getPricingDisplay(testProduct, vip, {
      selectedSize: '600ml',
      selectedColor: '',
    })

    expect(pricing.basePrice).toBe(620)
    expect(pricing.displayPrice).toBe(558)
    expect(pricing.originalPrice).toBe(620)
    expect(pricing.discountPercentage).toBe(10)
  })

  it('builds stable variant keys and cart merges only identical selections', () => {
    const testProduct = product({
      id: 'cerabarrier-cuid',
      productNumber: '66',
      variants: [
        variant('small', { size: '200ml', price: 380 }),
        variant('large', { size: '600ml', price: 620 }),
      ],
    })
    const small = { selectedSize: '200ml', selectedColor: '' }
    const large = { selectedSize: '600ml', selectedColor: '' }

    expect(getProductOptionKey(testProduct, small)).toBe('cerabarrier-cuid::::200ml')
    expect(getProductOptionKey(testProduct, large)).toBe('cerabarrier-cuid::::600ml')

    useCartStore.setState({ items: [] })
    useCartStore.getState().addItem(testProduct, 1, '', small.selectedSize)
    useCartStore.getState().addItem(testProduct, 2, '', large.selectedSize)
    useCartStore.getState().addItem(testProduct, 3, '', small.selectedSize)

    const items = useCartStore.getState().items
    expect(items).toHaveLength(2)
    expect(items.find((item) => item.selectedSize === '200ml')?.quantity).toBe(4)
    expect(items.find((item) => item.selectedSize === '600ml')?.quantity).toBe(2)
  })
})
