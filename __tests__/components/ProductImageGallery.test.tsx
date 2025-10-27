import { render, screen, fireEvent } from '@testing-library/react'
import ProductImageGallery from '@/app/products/[id]/components/ProductImageGallery'
import { Product } from '@/types'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, priority, ...props }: any) {
    // Convert priority boolean to string to avoid React warning
    const imgProps = { ...props }
    if (priority !== undefined) {
      imgProps.priority = priority.toString()
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...imgProps} />
  }
})

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  image: '/test-image.jpg',
  images: JSON.stringify(['/test-image-1.jpg', '/test-image-2.jpg']),
  price: 100,
  category: 'Test Category',
  description: 'Test Description',
  stock: 10,
  rating: 4.5,
  reviews: 10
}

describe('ProductImageGallery', () => {
  it('renders main image correctly', () => {
    render(
      <ProductImageGallery 
        product={mockProduct}
        selectedImage={0}
        onImageSelect={jest.fn()}
      />
    )

    expect(screen.getByAltText('Test Product')).toBeInTheDocument()
  })

  it('renders thumbnail images when multiple images exist', () => {
    render(
      <ProductImageGallery 
        product={mockProduct}
        selectedImage={0}
        onImageSelect={jest.fn()}
      />
    )

    expect(screen.getByAltText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByAltText('Test Product 2')).toBeInTheDocument()
  })

  it('calls onImageSelect when thumbnail is clicked', () => {
    const mockOnImageSelect = jest.fn()
    
    render(
      <ProductImageGallery 
        product={mockProduct}
        selectedImage={0}
        onImageSelect={mockOnImageSelect}
      />
    )

    const thumbnail = screen.getByAltText('Test Product 2')
    fireEvent.click(thumbnail)

    expect(mockOnImageSelect).toHaveBeenCalledWith(1)
  })

  it('highlights selected thumbnail', () => {
    render(
      <ProductImageGallery 
        product={mockProduct}
        selectedImage={1}
        onImageSelect={jest.fn()}
      />
    )

    const selectedThumbnail = screen.getByAltText('Test Product 2').closest('button')
    expect(selectedThumbnail).toHaveClass('border-primary-600')
  })

  it('renders video iframe for product with video', () => {
    const productWithVideo = { ...mockProduct, id: '3' }
    
    render(
      <ProductImageGallery 
        product={productWithVideo}
        selectedImage={2}
        onImageSelect={jest.fn()}
      />
    )

    expect(screen.getByTitle('Test Product Video')).toBeInTheDocument()
  })
})
