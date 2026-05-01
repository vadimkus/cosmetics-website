import { renderHook } from '@testing-library/react'
import { useProductPricing } from '@/hooks/useProductPricing'
import { Product } from '@/types'

// Mock the product config
jest.mock('@/data/productConfig', () => ({
  getProductSizes: jest.fn(() => [
    { value: '50g', label: '50g', price: 100 },
    { value: '100g', label: '100g', price: 150 }
  ]),
  getProductColors: jest.fn(() => [
    { value: 'Beige', label: 'Beige', hex: '#F5F5DC' },
    { value: 'Natural', label: 'Natural', hex: '#F5DEB3' }
  ]),
  getProductPrice: jest.fn((_id, size, color) => {
    if (size === '100g') return 150
    if (color === 'Natural') return 120
    return 100
  })
}))

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  image: '/test-image.jpg',
  price: 100,
  category: 'Test Category',
  description: 'Test Description',
  inStock: true,
  rating: 4.5
}

describe('useProductPricing', () => {
  it('returns base price when no variants selected', () => {
    const { result } = renderHook(() => 
      useProductPricing(mockProduct)
    )

    expect(result.current.basePrice).toBe(100)
    expect(result.current.currentPrice).toBe(100)
    expect(result.current.hasVariants).toBe(true)
  })

  it('returns correct price for selected size', () => {
    const { result } = renderHook(() => 
      useProductPricing(mockProduct, '100g')
    )

    expect(result.current.currentPrice).toBe(150)
  })

  it('returns correct price for selected color', () => {
    const { result } = renderHook(() => 
      useProductPricing(mockProduct, undefined, 'Natural')
    )

    expect(result.current.currentPrice).toBe(120)
  })

  it('returns available sizes and colors', () => {
    const { result } = renderHook(() => 
      useProductPricing(mockProduct)
    )

    expect(result.current.availableSizes).toHaveLength(2)
    expect(result.current.availableColors).toHaveLength(2)
  })

  it('calculates price for specific size', () => {
    const { result } = renderHook(() => 
      useProductPricing(mockProduct)
    )

    const price = result.current.getPriceForSize('100g')
    expect(price).toBe(150)
  })

  it('calculates price for specific color', () => {
    const { result } = renderHook(() => 
      useProductPricing(mockProduct)
    )

    const price = result.current.getPriceForColor('Natural')
    expect(price).toBe(120)
  })
})
