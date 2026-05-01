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
  inStock: true,
  rating: 4.5
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

    // Component now uses enhanced SEO alt text format
    expect(screen.getByAltText(/Test Product - GENOSYS professional/i)).toBeInTheDocument()
  })

  it('renders thumbnail images when multiple images exist', () => {
    render(
      <ProductImageGallery 
        product={mockProduct}
        selectedImage={0}
        onImageSelect={jest.fn()}
      />
    )

    // Thumbnails use format: "Product Name - GENOSYS product thumbnail view N"
    expect(screen.getByAltText(/Test Product - GENOSYS product thumbnail view 1/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Test Product - GENOSYS product thumbnail view 2/i)).toBeInTheDocument()
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

    const thumbnail = screen.getByAltText(/Test Product - GENOSYS product thumbnail view 2/i)
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

    const selectedThumbnail = screen.getByAltText(/Test Product - GENOSYS product thumbnail view 2/i).closest('button')
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
