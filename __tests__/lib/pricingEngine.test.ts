import { 
  calculateProductPricing, 
  generateProductBadges, 
  generateProductVariants,
  generateEnhancedProductData,
  UAE_VAT_RATE,
  BadgePriority
} from '@/lib/pricingEngine'
import { Product } from '@/types'
import { ApiUser } from '@/types/user'

// Mock dependencies
jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn()
}))

jest.mock('@/lib/discountUtils', () => ({
  calculateDiscountedPrice: jest.fn()
}))

jest.mock('@/data/productConfig', () => ({
  getProductConfig: jest.fn(),
  getProductSizes: jest.fn(() => []),
  getProductColors: jest.fn(() => []),
  // Empty/undefined defaults make the engine fall back to DB-provided
  // images/videoUrl/documentation, which is what the tests assert on.
  getProductImages: jest.fn(() => []),
  getProductVideoUrl: jest.fn(() => undefined),
  getProductDocumentation: jest.fn(() => [])
}))

import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { getProductConfig, getProductSizes, getProductColors } from '@/data/productConfig'

const mockCalculateDiscountedPrice = calculateDiscountedPrice as jest.MockedFunction<typeof calculateDiscountedPrice>
const mockGetProductConfig = getProductConfig as jest.MockedFunction<typeof getProductConfig>
const mockGetProductSizes = getProductSizes as jest.MockedFunction<typeof getProductSizes>
const mockGetProductColors = getProductColors as jest.MockedFunction<typeof getProductColors>

// Test fixtures
const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Test Product',
  image: '/test-image.jpg',
  price: 100,
  category: 'Test Category',
  description: 'Test Description',
  inStock: true,
  rating: 4.5,
  ...overrides
})

const createMockUser = (overrides: Partial<ApiUser> = {}): ApiUser => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  canSeePrices: true,
  ...overrides
})

describe('pricingEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockCalculateDiscountedPrice.mockReturnValue({
      originalPrice: 100,
      discountedPrice: 100,
      discountAmount: 0,
      discountPercentage: 0,
      hasDiscount: false,
      isBlackFriday: false,
      isBeautyBox: false
    })
    
    mockGetProductConfig.mockReturnValue(null)
    mockGetProductSizes.mockReturnValue([])
    mockGetProductColors.mockReturnValue([])
  })

  describe('UAE_VAT_RATE', () => {
    it('should be 5%', () => {
      expect(UAE_VAT_RATE).toBe(0.05)
    })
  })

  describe('calculateProductPricing', () => {
    it('calculates pricing with no discounts', () => {
      const product = createMockProduct({ price: 100 })
      
      const result = calculateProductPricing(product, null)
      
      expect(result.basePrice).toBe(100)
      expect(result.displayPrice).toBe(100)
      expect(result.originalPrice).toBeUndefined()
      expect(result.vatAmount).toBe(5) // 5% of 100
      expect(result.priceIncludingVat).toBe(105)
      expect(result.hasDiscount).toBe(false)
    })

    it('calculates pricing with discount applied', () => {
      const product = createMockProduct({ price: 100 })
      const user = createMockUser()
      
      mockCalculateDiscountedPrice.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 80,
        discountAmount: 20,
        discountPercentage: 20,
        hasDiscount: true,
        isBlackFriday: true,
        isBeautyBox: false
      })
      
      const result = calculateProductPricing(product, user)
      
      expect(result.basePrice).toBe(100)
      expect(result.displayPrice).toBe(80)
      expect(result.originalPrice).toBe(100)
      expect(result.vatAmount).toBe(4) // 5% of 80
      expect(result.priceIncludingVat).toBe(84)
      expect(result.hasDiscount).toBe(true)
      expect(result.discountLabel).toBe('Black Friday 20% off')
    })

    it('calculates pricing with bundle discount', () => {
      const product = createMockProduct({ price: 100 })
      
      mockCalculateDiscountedPrice.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 85,
        discountAmount: 15,
        discountPercentage: 15,
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: true
      })
      
      const result = calculateProductPricing(product, null)
      
      expect(result.discountLabel).toBe('Bundle 15% off')
      expect(result.isBeautyBox).toBe(true)
    })

    it('calculates pricing with regular discount', () => {
      const product = createMockProduct({ price: 100 })
      
      mockCalculateDiscountedPrice.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 90,
        discountAmount: 10,
        discountPercentage: 10,
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: false
      })
      
      const result = calculateProductPricing(product, null)
      
      expect(result.discountLabel).toBe('10% off')
    })

    it('applies size variant pricing when config exists', () => {
      const product = createMockProduct({ price: 100 })
      
      mockGetProductConfig.mockReturnValue({
        id: '1',
        pricing: {
          basePrice: 100,
          sizeVariants: {
            '100ml': 150,
            '200ml': 250
          }
        }
      })
      
      const result = calculateProductPricing(product, null, '100ml')
      
      expect(result.basePrice).toBe(150)
    })

    it('rounds VAT to 2 decimal places', () => {
      const product = createMockProduct({ price: 99.99 })
      
      mockCalculateDiscountedPrice.mockReturnValue({
        originalPrice: 99.99,
        discountedPrice: 99.99,
        discountAmount: 0,
        discountPercentage: 0,
        hasDiscount: false
      })
      
      const result = calculateProductPricing(product, null)
      
      // 99.99 * 0.05 = 4.9995 → 5
      expect(result.vatAmount).toBe(5)
      expect(result.priceIncludingVat).toBe(104.99)
    })
  })

  describe('generateProductBadges', () => {
    it('generates Black Friday badge when isBlackFriday is true', () => {
      const product = createMockProduct()
      const pricingData = {
        basePrice: 100,
        displayPrice: 80,
        originalPrice: 100,
        vatAmount: 4,
        priceIncludingVat: 84,
        discountAmount: 20,
        discountPercentage: 20,
        discountLabel: 'Black Friday 20% off',
        hasDiscount: true,
        isBlackFriday: true,
        isBeautyBox: false
      }
      
      const badges = generateProductBadges(product, null, pricingData)
      
      expect(badges).toContainEqual(expect.objectContaining({
        text: 'BLACK FRIDAY',
        type: 'sale',
        priority: BadgePriority.BLACK_FRIDAY
      }))
    })

    it('generates BUNDLE OFFER badge when isBeautyBox is true', () => {
      const product = createMockProduct()
      const pricingData = {
        basePrice: 100,
        displayPrice: 85,
        originalPrice: 100,
        vatAmount: 4.25,
        priceIncludingVat: 89.25,
        discountAmount: 15,
        discountPercentage: 15,
        discountLabel: 'Bundle 15% off',
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: true
      }
      
      const badges = generateProductBadges(product, null, pricingData)
      
      expect(badges).toContainEqual(expect.objectContaining({
        text: 'BUNDLE OFFER',
        type: 'sale'
      }))
    })

    it('generates discount percentage badge for regular discounts', () => {
      const product = createMockProduct()
      const pricingData = {
        basePrice: 100,
        displayPrice: 90,
        originalPrice: 100,
        vatAmount: 4.5,
        priceIncludingVat: 94.5,
        discountAmount: 10,
        discountPercentage: 10,
        discountLabel: '10% off',
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: false
      }
      
      const badges = generateProductBadges(product, null, pricingData)
      
      expect(badges).toContainEqual(expect.objectContaining({
        text: '10% OFF',
        type: 'discount'
      }))
    })

    it('generates PROFESSIONAL badge for professional products', () => {
      const product = createMockProduct({ id: '47' }) // Professional product ID
      
      const badges = generateProductBadges(product, null)
      
      expect(badges).toContainEqual(expect.objectContaining({
        text: 'PROFESSIONAL',
        type: 'professional'
      }))
    })

    it('generates BEST SELLER badge for best seller products', () => {
      const product = createMockProduct({ id: '1' }) // Best seller ID
      
      const badges = generateProductBadges(product, null)
      
      expect(badges).toContainEqual(expect.objectContaining({
        text: 'BEST SELLER',
        type: 'best_seller'
      }))
    })

    it('limits badges to top 2 by priority', () => {
      // Product with multiple badge qualifiers
      const product = createMockProduct({ 
        id: '47', // Professional (limited edition too)
        category: 'Professional Treatments'
      })
      const pricingData = {
        basePrice: 100,
        displayPrice: 80,
        originalPrice: 100,
        vatAmount: 4,
        priceIncludingVat: 84,
        discountAmount: 20,
        discountPercentage: 20,
        discountLabel: '20% off',
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: false
      }
      
      const badges = generateProductBadges(product, null, pricingData)
      
      expect(badges.length).toBeLessThanOrEqual(2)
    })

    it('sorts badges by priority', () => {
      const product = createMockProduct({ id: '1' }) // Best seller
      const pricingData = {
        basePrice: 100,
        displayPrice: 80,
        originalPrice: 100,
        vatAmount: 4,
        priceIncludingVat: 84,
        discountAmount: 20,
        discountPercentage: 20,
        discountLabel: '20% off',
        hasDiscount: true,
        isBlackFriday: false,
        isBeautyBox: false
      }
      
      const badges = generateProductBadges(product, null, pricingData)
      
      // Badges should be sorted by priority (lower number = higher priority)
      for (let i = 1; i < badges.length; i++) {
        expect(badges[i]!.priority).toBeGreaterThanOrEqual(badges[i - 1]!.priority)
      }
    })
  })

  describe('generateProductVariants', () => {
    it('returns default variant when no size variants exist', () => {
      const product = createMockProduct({ inStock: true })
      mockGetProductSizes.mockReturnValue([])
      
      const variants = generateProductVariants(product, null)
      
      expect(variants).toHaveLength(1)
      expect(variants[0]).toEqual(expect.objectContaining({
        size: 'default',
        isDefault: true,
        available: true
      }))
    })

    it('generates variants for each size from config', () => {
      const product = createMockProduct({ price: 100, inStock: true })
      mockGetProductSizes.mockReturnValue([
        { value: '50ml', label: '50ml', available: true },
        { value: '100ml', label: '100ml', available: true }
      ])
      
      const variants = generateProductVariants(product, null)
      
      expect(variants).toHaveLength(2)
      expect(variants[0]).toEqual(expect.objectContaining({
        size: '50ml',
        isDefault: true
      }))
      expect(variants[1]).toEqual(expect.objectContaining({
        size: '100ml',
        isDefault: false
      }))
    })

    it('uses database variants when available', () => {
      const product = createMockProduct({
        inStock: true,
        variants: [
          { id: 'v1', size: '30ml', color: null, price: 80, isDefault: true, available: true, productId: '1' },
          { id: 'v2', size: '60ml', color: null, price: 120, isDefault: false, available: true, productId: '1' }
        ]
      })
      
      const variants = generateProductVariants(product, null)
      
      expect(variants).toHaveLength(2)
      expect(variants[0]).toEqual(expect.objectContaining({
        size: '30ml',
        isDefault: true
      }))
    })

    it('filters out database variants without size or color', () => {
      const product = createMockProduct({
        inStock: true,
        variants: [
          { id: 'v1', size: null, color: null, price: 100, isDefault: true, available: true, productId: '1' },
          { id: 'v2', size: '60ml', color: null, price: 120, isDefault: false, available: true, productId: '1' }
        ]
      })
      
      const variants = generateProductVariants(product, null)
      
      // Only the variant with size should be included
      expect(variants).toHaveLength(1)
      expect(variants[0]?.size).toBe('60ml')
    })

    it('marks variants unavailable when product is out of stock', () => {
      const product = createMockProduct({ inStock: false })
      mockGetProductSizes.mockReturnValue([
        { value: '50ml', label: '50ml', available: true }
      ])
      
      const variants = generateProductVariants(product, null)
      
      expect(variants[0]?.available).toBe(false)
    })
  })

  describe('generateEnhancedProductData', () => {
    beforeEach(() => {
      mockCalculateDiscountedPrice.mockReturnValue({
        originalPrice: 100,
        discountedPrice: 100,
        discountAmount: 0,
        discountPercentage: 0,
        hasDiscount: false
      })
    })

    it('generates complete enhanced product data', () => {
      const product = createMockProduct({
        id: '1',
        name: 'Test Serum',
        description: 'A test serum description',
        price: 100,
        category: 'Serum',
        inStock: true,
        rating: 4.5
      })
      
      const result = generateEnhancedProductData(product, null)
      
      expect(result).toMatchObject({
        id: '1',
        name: 'Test Serum',
        description: 'A test serum description',
        category: 'Serum',
        price: 100,
        stock: true,
        rating: 4.5,
        hasVariants: false
      })
    })

    it('derives formulation from category', () => {
      const serum = createMockProduct({ category: 'Serums', description: '' })
      const cream = createMockProduct({ category: 'Creams', description: '' })
      const cleanser = createMockProduct({ category: 'Cleansers', description: '' })
      
      expect(generateEnhancedProductData(serum, null).formulation).toBe('Serum')
      expect(generateEnhancedProductData(cream, null).formulation).toBe('Cream')
      expect(generateEnhancedProductData(cleanser, null).formulation).toBe('Cleanser')
    })

    it('derives formulation from description if not in category', () => {
      const product = createMockProduct({ 
        category: 'Skincare',
        description: 'This is a hydrating toner for daily use'
      })
      
      expect(generateEnhancedProductData(product, null).formulation).toBe('Toner')
    })

    it('defaults origin to South Korea', () => {
      const product = createMockProduct({ description: 'Regular product' })
      
      expect(generateEnhancedProductData(product, null).origin).toBe('South Korea')
    })

    it('detects Korean origin from description', () => {
      const product = createMockProduct({ 
        description: 'Made in Korea with premium ingredients'
      })
      
      expect(generateEnhancedProductData(product, null).origin).toBe('South Korea')
    })

    it('sets hasVariants true when multiple variants exist', () => {
      const product = createMockProduct()
      mockGetProductSizes.mockReturnValue([
        { value: '50ml', label: '50ml', available: true },
        { value: '100ml', label: '100ml', available: true }
      ])
      
      const result = generateEnhancedProductData(product, null)
      
      expect(result.hasVariants).toBe(true)
    })

    it('sets hasVariants true when color variants exist', () => {
      const product = createMockProduct()
      mockGetProductColors.mockReturnValue([
        { value: 'Beige', label: 'Beige', available: true },
        { value: 'Ivory', label: 'Ivory', available: true }
      ])
      
      const result = generateEnhancedProductData(product, null)
      
      expect(result.hasVariants).toBe(true)
    })

    it('sets isNewProduct and isBestSeller based on badges', () => {
      const bestSeller = createMockProduct({ id: '1' }) // Best seller ID
      const newProduct = createMockProduct({ id: '63' }) // Current new-launch ID
      
      const bestSellerResult = generateEnhancedProductData(bestSeller, null)
      const newProductResult = generateEnhancedProductData(newProduct, null)
      
      expect(bestSellerResult.isBestSeller).toBe(true)
      expect(newProductResult.isNewProduct).toBe(true)
    })

    it('uses default DB variant price for display when DB variants exist', () => {
      const product = createMockProduct({
        price: 100,
        variants: [
          { id: 'v1', size: '30ml', color: null, price: 80, isDefault: true, available: true, productId: '1' },
          { id: 'v2', size: '60ml', color: null, price: 120, isDefault: false, available: true, productId: '1' }
        ]
      })
      
      mockCalculateDiscountedPrice.mockImplementation((prod) => ({
        originalPrice: prod.price,
        discountedPrice: prod.price,
        discountAmount: 0,
        discountPercentage: 0,
        hasDiscount: false
      }))
      
      const result = generateEnhancedProductData(product, null)
      
      // Should use the default variant price (80) not the base product price (100)
      expect(result.displayPrice).toBe(80)
    })

    it('includes color variants with hex codes', () => {
      const product = createMockProduct()
      mockGetProductColors.mockReturnValue([
        { value: 'Beige', label: 'Beige', available: true },
        { value: 'Ivory', label: 'Ivory', available: true },
        { value: 'Camel', label: 'Camel', available: true }
      ])
      
      const result = generateEnhancedProductData(product, null)
      
      expect(result.colorVariants).toContainEqual(expect.objectContaining({
        value: 'Beige',
        hex: '#E6D5B8'
      }))
      expect(result.colorVariants).toContainEqual(expect.objectContaining({
        value: 'Ivory',
        hex: '#F5E6D3'
      }))
      expect(result.colorVariants).toContainEqual(expect.objectContaining({
        value: 'Camel',
        hex: '#A67C52'
      }))
    })

    it('excludes default-only variants from output', () => {
      const product = createMockProduct()
      mockGetProductSizes.mockReturnValue([]) // No sizes = default variant only
      
      const result = generateEnhancedProductData(product, null)
      
      // Default-only variants should be filtered out
      expect(result.variants).not.toContainEqual(expect.objectContaining({
        size: 'default'
      }))
    })
  })
})
