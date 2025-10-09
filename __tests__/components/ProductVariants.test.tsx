import { render, screen, fireEvent } from '@testing-library/react'
import ProductVariants from '@/app/products/[id]/components/ProductVariants'
import { Product } from '@/types'

// Mock variants hook
jest.mock('@/hooks/useProductVariants', () => ({
  useProductVariants: () => ({
    selectedSize: '50g',
    selectedColor: 'Beige',
    availableSizes: [
      { value: '50g', label: '50g', price: 100 },
      { value: '100g', label: '100g', price: 150 }
    ],
    availableColors: [
      { value: 'Beige', label: 'Beige', hex: '#F5F5DC' },
      { value: 'Natural', label: 'Natural', hex: '#F5DEB3' }
    ],
    hasSizeVariants: true,
    hasColorVariants: true,
    setSelectedSize: jest.fn(),
    setSelectedColor: jest.fn()
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

describe('ProductVariants', () => {
  it('renders size variants when available', () => {
    render(
      <ProductVariants 
        product={mockProduct}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    )

    expect(screen.getByText('Size: 50g')).toBeInTheDocument()
    expect(screen.getByText('50g')).toBeInTheDocument()
    expect(screen.getByText('100g')).toBeInTheDocument()
  })

  it('renders color variants when available', () => {
    render(
      <ProductVariants 
        product={mockProduct}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    )

    expect(screen.getByText('Color: Beige')).toBeInTheDocument()
  })

  it('calls onSizeChange when size is selected', () => {
    const mockOnSizeChange = jest.fn()
    
    render(
      <ProductVariants 
        product={mockProduct}
        onSizeChange={mockOnSizeChange}
        onColorChange={jest.fn()}
      />
    )

    const sizeButton = screen.getByText('100g')
    fireEvent.click(sizeButton)

    expect(mockOnSizeChange).toHaveBeenCalledWith('100g')
  })

  it('calls onColorChange when color is selected', () => {
    const mockOnColorChange = jest.fn()
    
    render(
      <ProductVariants 
        product={mockProduct}
        onSizeChange={jest.fn()}
        onColorChange={mockOnColorChange}
      />
    )

    const colorButton = screen.getByTitle('Natural')
    fireEvent.click(colorButton)

    expect(mockOnColorChange).toHaveBeenCalledWith('Natural')
  })

  it('highlights selected size', () => {
    render(
      <ProductVariants 
        product={mockProduct}
        onSizeChange={jest.fn()}
        onColorChange={jest.fn()}
      />
    )

    const selectedSizeButton = screen.getByText('50g')
    expect(selectedSizeButton).toHaveClass('border-primary-600')
  })
})
