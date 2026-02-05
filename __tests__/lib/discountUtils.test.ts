import { calculateDiscountedPrice, getDisplayPrice, canUserSeePrices } from '@/lib/discountUtils'
import { Product } from '@/types'
import { ApiUser } from '@/types/user'

// Mock Black Friday utilities
jest.mock('@/lib/blackFridayUtils', () => ({
  isBlackFridaySaleActive: jest.fn(() => false),
  BLACK_FRIDAY_DISCOUNT_PERCENTAGE: 20
}))

import { isBlackFridaySaleActive } from '@/lib/blackFridayUtils'

const mockIsBlackFridaySaleActive = isBlackFridaySaleActive as jest.MockedFunction<typeof isBlackFridaySaleActive>

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

describe('discountUtils', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockIsBlackFridaySaleActive.mockReturnValue(false)
  })

  describe('calculateDiscountedPrice', () => {
    describe('when no discounts apply', () => {
      it('returns original price when user is null', () => {
        const product = createMockProduct({ price: 100 })
        
        const result = calculateDiscountedPrice(product, null)
        
        expect(result.originalPrice).toBe(100)
        expect(result.discountedPrice).toBe(100)
        expect(result.discountAmount).toBe(0)
        expect(result.discountPercentage).toBe(0)
        expect(result.hasDiscount).toBe(false)
        expect(result.isBlackFriday).toBe(false)
        expect(result.isBeautyBox).toBe(false)
      })

      it('returns original price when user has no discount settings', () => {
        const product = createMockProduct({ price: 150 })
        const user = createMockUser()
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.originalPrice).toBe(150)
        expect(result.discountedPrice).toBe(150)
        expect(result.hasDiscount).toBe(false)
      })
    })

    describe('user-specific discounts', () => {
      it('applies user discount percentage correctly', () => {
        const product = createMockProduct({ price: 100 })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 10
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.originalPrice).toBe(100)
        expect(result.discountedPrice).toBe(90)
        expect(result.discountAmount).toBe(10)
        expect(result.discountPercentage).toBe(10)
        expect(result.hasDiscount).toBe(true)
        expect(result.isBlackFriday).toBe(false)
      })

      it('rounds discounted price to 2 decimal places', () => {
        const product = createMockProduct({ price: 99.99 })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 15
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        // 99.99 * 0.15 = 14.9985
        // 99.99 - 14.9985 = 84.9915 → 84.99
        expect(result.discountedPrice).toBe(84.99)
        expect(result.discountAmount).toBe(15)
      })

      it('does not apply discount when discountPercentage is 0', () => {
        const product = createMockProduct({ price: 100 })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 0
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.hasDiscount).toBe(false)
        expect(result.discountedPrice).toBe(100)
      })
    })

    describe('Black Friday discounts', () => {
      it('applies Black Friday discount when sale is active and user is logged in', () => {
        mockIsBlackFridaySaleActive.mockReturnValue(true)
        const product = createMockProduct({ price: 100 })
        const user = createMockUser()
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.discountedPrice).toBe(80) // 20% off
        expect(result.discountPercentage).toBe(20)
        expect(result.hasDiscount).toBe(true)
        expect(result.isBlackFriday).toBe(true)
      })

      it('does not apply Black Friday discount when user is null (guest)', () => {
        mockIsBlackFridaySaleActive.mockReturnValue(true)
        const product = createMockProduct({ price: 100 })
        
        const result = calculateDiscountedPrice(product, null)
        
        expect(result.discountedPrice).toBe(100)
        expect(result.hasDiscount).toBe(false)
        expect(result.isBlackFriday).toBe(false)
      })

      it('Black Friday takes priority over user discount', () => {
        mockIsBlackFridaySaleActive.mockReturnValue(true)
        const product = createMockProduct({ price: 100 })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 10 // User has 10% discount
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        // Black Friday 20% should override user's 10%
        expect(result.discountedPrice).toBe(80)
        expect(result.discountPercentage).toBe(20)
        expect(result.isBlackFriday).toBe(true)
      })
    })

    describe('Beauty Box products', () => {
      it('shows built-in 15% bundle discount for Beauty Box products', () => {
        const beautyBoxProduct = createMockProduct({
          productNumber: '55', // PROBLEM SKIN CARE BEAUTY BOX
          category: 'Beauty Boxes',
          price: 1120 // Already discounted price stored in DB
        })
        
        const result = calculateDiscountedPrice(beautyBoxProduct, null)
        
        expect(result.originalPrice).toBe(1318) // Regular price
        expect(result.discountedPrice).toBe(1120) // Bundle price
        expect(result.discountPercentage).toBe(15)
        expect(result.hasDiscount).toBe(true)
        expect(result.isBeautyBox).toBe(true)
        expect(result.isBlackFriday).toBe(false)
      })

      it('excludes Beauty Box from Black Friday discounts', () => {
        mockIsBlackFridaySaleActive.mockReturnValue(true)
        const beautyBoxProduct = createMockProduct({
          productNumber: '56', // SKIN BRIGHTENING BEAUTY BOX
          category: 'Beauty Boxes',
          price: 1272 // Already discounted price
        })
        const user = createMockUser()
        
        const result = calculateDiscountedPrice(beautyBoxProduct, user)
        
        // Should show bundle discount, NOT Black Friday
        expect(result.isBeautyBox).toBe(true)
        expect(result.isBlackFriday).toBe(false)
        expect(result.discountPercentage).toBe(15)
      })
    })

    describe('excluded products', () => {
      it('does not apply any discount when noDiscount flag is true', () => {
        const product = createMockProduct({
          price: 100,
          noDiscount: true
        })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 15
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.hasDiscount).toBe(false)
        expect(result.discountedPrice).toBe(100)
      })

      it('does not apply Black Friday discount when noDiscount flag is true', () => {
        mockIsBlackFridaySaleActive.mockReturnValue(true)
        const product = createMockProduct({
          price: 100,
          noDiscount: true
        })
        const user = createMockUser()
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.hasDiscount).toBe(false)
        expect(result.isBlackFriday).toBe(false)
        expect(result.discountedPrice).toBe(100)
      })

      it('does not apply discount to Beauty Boxes category even without noDiscount flag', () => {
        const product = createMockProduct({
          price: 100,
          category: 'Beauty Boxes'
        })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 15
        })
        
        // Without productNumber, no bundle price is available
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.hasDiscount).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('handles zero price products', () => {
        const product = createMockProduct({ price: 0 })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 10
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.originalPrice).toBe(0)
        expect(result.discountedPrice).toBe(0)
        expect(result.discountAmount).toBe(0)
      })

      it('handles very large discount percentages gracefully', () => {
        const product = createMockProduct({ price: 100 })
        const user = createMockUser({
          discountType: 'percentage',
          discountPercentage: 100
        })
        
        const result = calculateDiscountedPrice(product, user)
        
        expect(result.discountedPrice).toBe(0)
        expect(result.discountAmount).toBe(100)
      })
    })
  })

  describe('getDisplayPrice', () => {
    it('returns discounted price when discount applies', () => {
      const product = createMockProduct({ price: 100 })
      const user = createMockUser({
        discountType: 'percentage',
        discountPercentage: 10
      })
      
      const price = getDisplayPrice(product, user)
      
      expect(price).toBe(90)
    })

    it('returns original price when no discount applies', () => {
      const product = createMockProduct({ price: 100 })
      
      const price = getDisplayPrice(product, null)
      
      expect(price).toBe(100)
    })
  })

  describe('canUserSeePrices', () => {
    it('returns true when user.canSeePrices is true', () => {
      const user = createMockUser({ canSeePrices: true })
      
      expect(canUserSeePrices(user)).toBe(true)
    })

    it('returns false when user.canSeePrices is false', () => {
      const user = createMockUser({ canSeePrices: false })
      
      expect(canUserSeePrices(user)).toBe(false)
    })

    it('returns false when user is null', () => {
      expect(canUserSeePrices(null)).toBe(false)
    })

    it('returns false when canSeePrices is undefined', () => {
      const user = createMockUser()
      delete (user as { canSeePrices?: boolean }).canSeePrices
      
      expect(canUserSeePrices(user)).toBe(false)
    })
  })
})
