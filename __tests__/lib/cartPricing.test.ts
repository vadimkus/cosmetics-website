import { getCartDiscountSummary, getCartLinePayloadPricing, getCartLinePricing, getCartRetailTotal, getCartTotalPrice } from '@/lib/cartPricing'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { CartItem, Product } from '@/types'
import { ApiUser } from '@/types/user'
import { isBlackFridaySaleActive } from '@/lib/blackFridayUtils'

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
}))

jest.mock('@/lib/blackFridayUtils', () => ({
  isBlackFridaySaleActive: jest.fn(() => false),
  BLACK_FRIDAY_DISCOUNT_PERCENTAGE: 20,
}))

const mockIsBlackFridaySaleActive = isBlackFridaySaleActive as jest.MockedFunction<typeof isBlackFridaySaleActive>

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'product-1',
  productNumber: '1',
  name: 'Test Product',
  image: '/test.jpg',
  price: 100,
  category: 'Serums',
  description: 'Test description',
  inStock: true,
  rating: 5,
  ...overrides,
})

const createUser = (overrides: Partial<ApiUser> = {}): ApiUser => ({
  id: 'user-1',
  email: 'user@example.com',
  name: 'Test User',
  canSeePrices: true,
  ...overrides,
})

const createItem = (product: Product, overrides: Partial<CartItem> = {}): CartItem => ({
  product,
  quantity: 1,
  selectedColor: '',
  selectedSize: '',
  ...overrides,
})

describe('cart pricing helper', () => {
  beforeEach(() => {
    mockIsBlackFridaySaleActive.mockReturnValue(false)
  })

  it('matches legacy regular cart subtotal for retail products', () => {
    const product = createProduct({ price: 125 })
    const item = createItem(product, { quantity: 2 })

    expect(getCartLinePricing(item, null).lineTotal).toBe(250)
    expect(getCartTotalPrice([item], null)).toBe(250)
  })

  it('matches legacy user discount behavior for regular products', () => {
    const product = createProduct({ price: 200 })
    const user = createUser({ discountType: 'percentage', discountPercentage: 10 })
    const item = createItem(product, { quantity: 2 })
    const legacy = calculateDiscountedPrice(product, user)

    const pricing = getCartLinePricing(item, user)

    expect(pricing.unitPrice).toBe(legacy.discountedPrice)
    expect(pricing.lineTotal).toBe(360)
    expect(pricing.discountAmount).toBe(40)
    expect(getCartTotalPrice([item], user)).toBe(360)
  })

  it('keeps bundle-builder items on bundle discount only', () => {
    const product = createProduct({ price: 100 })
    const user = createUser({ discountType: 'percentage', discountPercentage: 20 })
    const item = createItem(product, {
      quantity: 2,
      fromBundle: true,
      bundleDiscountPercent: 15,
    })

    const pricing = getCartLinePricing(item, user)

    expect(pricing.discountType).toBe('bundle')
    expect(pricing.unitPrice).toBe(85)
    expect(pricing.lineTotal).toBe(170)
    expect(pricing.discountAmount).toBe(30)
  })

  it('preserves Beauty Box built-in bundle pricing', () => {
    const product = createProduct({
      productNumber: '55',
      category: 'Beauty Boxes',
      price: 1120,
    })
    const item = createItem(product)

    const pricing = getCartLinePricing(item, null)

    expect(pricing.discountType).toBe('beauty_box')
    expect(pricing.unitPrice).toBe(1120)
    expect(pricing.retailUnitPrice).toBe(1318)
    expect(pricing.discountAmount).toBe(198)
  })

  it('uses selected variant pricing when cart carries a selected size', () => {
    const product = createProduct({
      price: 100,
      variants: [
        {
          id: 'variant-1',
          size: '50ml',
          color: null,
          price: 150,
          available: true,
          isDefault: true,
          stockQuantity: 10,
        },
        {
          id: 'variant-2',
          size: '100ml',
          color: null,
          price: 250,
          available: true,
          isDefault: false,
          stockQuantity: 5,
        },
      ],
    })
    const user = createUser({ discountType: 'percentage', discountPercentage: 10 })
    const item = createItem(product, { selectedSize: '100ml' })

    const pricing = getCartLinePricing(item, user)

    expect(pricing.retailUnitPrice).toBe(250)
    expect(pricing.unitPrice).toBe(225)
    expect(pricing.discountAmount).toBe(25)
  })

  it('keeps Black Friday priority over user discounts', () => {
    mockIsBlackFridaySaleActive.mockReturnValue(true)
    const product = createProduct({ price: 100 })
    const user = createUser({ discountType: 'percentage', discountPercentage: 10 })
    const item = createItem(product)

    const pricing = getCartLinePricing(item, user)

    expect(pricing.discountType).toBe('black_friday')
    expect(pricing.unitPrice).toBe(80)
    expect(pricing.discountPercentage).toBe(20)
  })

  it('exposes retail total for cart strikethrough/savings display', () => {
    const regular = createItem(createProduct({ id: 'regular', price: 200 }), { quantity: 2 })
    const bundle = createItem(createProduct({ id: 'bundle', price: 100 }), {
      quantity: 1,
      fromBundle: true,
      bundleDiscountPercent: 15,
    })
    const user = createUser({ discountType: 'percentage', discountPercentage: 10 })

    expect(getCartTotalPrice([regular, bundle], user)).toBe(445)
    expect(getCartRetailTotal([regular, bundle], user)).toBe(500)
  })

  it('exposes COD payload price and total from contract-backed cart pricing', () => {
    const product = createProduct({
      price: 100,
      variants: [
        {
          id: 'variant-1',
          size: '50ml',
          color: null,
          price: 150,
          available: true,
          isDefault: true,
          stockQuantity: 10,
        },
        {
          id: 'variant-2',
          size: '100ml',
          color: null,
          price: 250,
          available: true,
          isDefault: false,
          stockQuantity: 5,
        },
      ],
    })
    const user = createUser({ discountType: 'percentage', discountPercentage: 10 })
    const item = createItem(product, { quantity: 2, selectedSize: '100ml' })

    expect(getCartLinePayloadPricing(item, user)).toEqual({
      price: 225,
      total: 450,
    })
  })

  it('preserves bundle discount metadata in COD payload pricing', () => {
    const product = createProduct({ price: 100 })
    const item = createItem(product, {
      quantity: 3,
      fromBundle: true,
      bundleDiscountPercent: 15,
    })

    expect(getCartLinePayloadPricing(item, null)).toEqual({
      price: 85,
      total: 255,
      bundleDiscount: 15,
    })
  })

  it('does not expose Beauty Box built-in discount as bundle payload metadata', () => {
    const product = createProduct({
      productNumber: '55',
      category: 'Beauty Boxes',
      price: 1120,
    })
    const item = createItem(product)

    expect(getCartLinePayloadPricing(item, null)).toEqual({
      price: 1120,
      total: 1120,
    })
  })

  it('summarizes checkout waterfall discounts from cart line pricing', () => {
    const userItem = createItem(createProduct({ id: 'user-discount', price: 200 }), { quantity: 2 })
    const bundleItem = createItem(createProduct({ id: 'bundle-item', price: 100 }), {
      quantity: 3,
      fromBundle: true,
      bundleDiscountPercent: 15,
    })
    const user = createUser({ discountType: 'percentage', discountPercentage: 10 })

    expect(getCartDiscountSummary([userItem, bundleItem], user)).toEqual({
      retailTotal: 700,
      userDiscountTotal: 40,
      bundleDiscountTotal: 45,
      afterVipSubtotal: 660,
      userDiscountPct: 10,
      bundleDiscountPct: 15,
      totalSaved: 85,
      hasUserDiscount: true,
      hasBundleDiscount: true,
      hasAnyDiscount: true,
    })
  })

  it('keeps Beauty Box built-in savings out of checkout cart-level waterfall', () => {
    const beautyBox = createItem(createProduct({
      productNumber: '55',
      category: 'Beauty Boxes',
      price: 1120,
    }))

    expect(getCartDiscountSummary([beautyBox], null)).toEqual({
      retailTotal: 1120,
      userDiscountTotal: 0,
      bundleDiscountTotal: 0,
      afterVipSubtotal: 1120,
      userDiscountPct: 0,
      bundleDiscountPct: 0,
      totalSaved: 0,
      hasUserDiscount: false,
      hasBundleDiscount: false,
      hasAnyDiscount: false,
    })
  })
})
