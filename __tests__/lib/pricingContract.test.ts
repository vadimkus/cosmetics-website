import { Product } from '@/types'
import { ApiUser } from '@/types/user'
import { generateEnhancedProductData } from '@/lib/pricingEngine'
import { buildPricingContract } from '@/lib/pricingContract'
import { getPricingDisplay } from '@/lib/pricingDisplay'
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

function expectContractToMatchLegacy(product: Product, user: ApiUser | null) {
  const enhanced = generateEnhancedProductData(product, user)
  const contract = buildPricingContract(product, user)

  expect(contract.source).toBe('server')
  expect(contract.basePrice).toBe(enhanced.price)
  expect(contract.unitPrice).toBe(enhanced.displayPrice)
  expect(contract.displayPrice).toBe(enhanced.displayPrice)
  expect(contract.originalPrice).toBe(enhanced.originalPrice ?? null)
  expect(contract.discountLabel).toBe(enhanced.discountLabel ?? null)
}

describe('pricing contract parity', () => {
  beforeEach(() => {
    mockIsBlackFridaySaleActive.mockReturnValue(false)
  })

  it('freezes normal retail pricing for guests', () => {
    const product = createProduct({ price: 125 })

    expectContractToMatchLegacy(product, null)

    const contract = buildPricingContract(product, null)
    expect(contract.canSeePrice).toBe(false)
    expect(contract.discountType).toBe('none')
  })

  it('freezes user percentage discount behavior', () => {
    const product = createProduct({ price: 200 })
    const user = createUser({
      discountType: 'percentage',
      discountPercentage: 10,
    })

    expectContractToMatchLegacy(product, user)

    const contract = buildPricingContract(product, user)
    expect(contract.displayPrice).toBe(180)
    expect(contract.discountAmount).toBe(20)
    expect(contract.discountPercentage).toBe(10)
    expect(contract.discountType).toBe('user')
    expect(contract.canSeePrice).toBe(true)
  })

  it('preserves calculated pricing when canSeePrices is false but marks visibility false', () => {
    const product = createProduct({ price: 200 })
    const user = createUser({
      canSeePrices: false,
      discountType: 'percentage',
      discountPercentage: 10,
    })

    expectContractToMatchLegacy(product, user)

    const contract = buildPricingContract(product, user)
    expect(contract.displayPrice).toBe(180)
    expect(contract.canSeePrice).toBe(false)
  })

  it('freezes Beauty Box built-in bundle discount behavior', () => {
    const product = createProduct({
      productNumber: '55',
      category: 'Beauty Boxes',
      price: 1120,
    })

    expectContractToMatchLegacy(product, null)

    const contract = buildPricingContract(product, null)
    expect(contract.discountType).toBe('beauty_box')
    expect(contract.discountPercentage).toBe(15)
    expect(contract.exclusions.userDiscount).toBe(true)
  })

  it('keeps Black Friday priority over user percentage discounts', () => {
    mockIsBlackFridaySaleActive.mockReturnValue(true)
    const product = createProduct({ price: 100 })
    const user = createUser({
      discountType: 'percentage',
      discountPercentage: 10,
    })

    expectContractToMatchLegacy(product, user)

    const contract = buildPricingContract(product, user)
    expect(contract.displayPrice).toBe(80)
    expect(contract.discountType).toBe('black_friday')
    expect(contract.discountPercentage).toBe(20)
  })

  it('does not stack user discounts onto no-discount products', () => {
    const product = createProduct({
      price: 100,
      noDiscount: true,
    })
    const user = createUser({
      discountType: 'percentage',
      discountPercentage: 25,
    })

    expectContractToMatchLegacy(product, user)

    const contract = buildPricingContract(product, user)
    expect(contract.displayPrice).toBe(100)
    expect(contract.discountType).toBe('none')
    expect(contract.exclusions.noDiscount).toBe(true)
    expect(contract.exclusions.userDiscount).toBe(true)
  })

  it('uses the default database variant as the product-level contract price', () => {
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

    expectContractToMatchLegacy(product, null)

    const contract = buildPricingContract(product, null)
    expect(contract.basePrice).toBe(150)
    expect(contract.selectedVariant).toMatchObject({
      id: 'variant-1',
      size: '50ml',
      price: 150,
    })
  })

  it('can build a selected size variant contract without changing legacy product fields', () => {
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

    const contract = buildPricingContract(product, null, { selectedSize: '100ml' })

    expect(contract.basePrice).toBe(250)
    expect(contract.displayPrice).toBe(250)
    expect(contract.selectedVariant).toMatchObject({
      id: 'variant-2',
      size: '100ml',
      price: 250,
    })
  })

  it('exposes a compact display shape for web UI surfaces', () => {
    const product = createProduct({ price: 200 })
    const user = createUser({
      discountType: 'percentage',
      discountPercentage: 10,
    })

    const display = getPricingDisplay(product, user)

    expect(display.displayPrice).toBe(180)
    expect(display.originalPrice).toBe(200)
    expect(display.hasDiscount).toBe(true)
    expect(display.discountPercentage).toBe(10)
    expect(display.canSeePrice).toBe(true)
  })

  it('keeps web display visibility false for guests while preserving retail value', () => {
    const product = createProduct({ price: 125 })

    const display = getPricingDisplay(product, null)

    expect(display.displayPrice).toBe(125)
    expect(display.originalPrice).toBeNull()
    expect(display.hasDiscount).toBe(false)
    expect(display.canSeePrice).toBe(false)
  })
})
