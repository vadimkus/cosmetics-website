import { render, screen } from '@testing-library/react'
import ProductPricing from '@/app/products/[id]/components/ProductPricing'
import { Product } from '@/types'

// Mock AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({ user: { id: '1', email: 'test@test.com' } })
}))

// Mock pricing hook
jest.mock('@/hooks/useProductPricing', () => ({
  useProductPricing: () => ({
    currentPrice: 100.50,
    hasVariants: false
  })
}))

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  image: '/test-image.jpg',
  price: 100,
  category: 'Test Category',
  description: 'Test Description',
  stock: 10,
  rating: 4.5,
  reviews: 10
}

describe('ProductPricing', () => {
  it('renders price correctly for authenticated user', () => {
    render(
      <ProductPricing 
        product={mockProduct}
        selectedSize="default"
        selectedColor="default"
      />
    )

    expect(screen.getByText('100.50 AED')).toBeInTheDocument()
    expect(screen.getByText('(VAT included)')).toBeInTheDocument()
  })

  it('shows login message for unauthenticated user', () => {
    // Mock unauthenticated user
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({ user: null })
    }))

    render(
      <ProductPricing 
        product={mockProduct}
        selectedSize="default"
        selectedColor="default"
      />
    )

    expect(screen.getByText('Please login to view pricing')).toBeInTheDocument()
  })
})
