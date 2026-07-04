import { render, screen } from '@testing-library/react'
import ProductImageGallery from '@/components/product/ProductImageGallery'
import { Product } from '@/types'
import { getProductImages as getConfigImages, getProductVideoUrl } from '@/data/productConfig'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, priority, ...props }: any) {
    const imgProps = { ...props }
    if (priority !== undefined) {
      imgProps.priority = priority.toString()
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...imgProps} />
  }
})

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({ t: (key: string) => key, dir: 'ltr', locale: 'en' }),
}))

// Isolate from the real productConfig catalog
jest.mock('@/data/productConfig', () => ({
  getProductImages: jest.fn(() => []),
  getProductVideoUrl: jest.fn(() => undefined),
}))

const mockGetConfigImages = getConfigImages as jest.Mock
const mockGetVideoUrl = getProductVideoUrl as jest.Mock

const baseProduct: Product = {
  id: 'cmk449na90077e9k5anpfqz4o', // CUID id (like real DB products)
  productNumber: '60',
  name: 'Test Product',
  image: '/test-main.jpg',
  images: null,
  price: 100,
  category: 'Test Category',
  description: 'Test Description',
  inStock: true,
  rating: 4.5,
}

beforeEach(() => {
  mockGetConfigImages.mockReset().mockReturnValue([])
  mockGetVideoUrl.mockReset().mockReturnValue(undefined)
})

describe('ProductImageGallery (components/product)', () => {
  it('resolves productConfig by productNumber, not CUID id (regression)', () => {
    mockGetConfigImages.mockReturnValue(['/test-main.jpg', '/cfg-1.jpg', '/cfg-2.jpg'])

    render(<ProductImageGallery product={baseProduct} />)

    // Config lookups must use the productNumber so CUID products match config
    expect(mockGetConfigImages).toHaveBeenCalledWith('60')
    expect(mockGetVideoUrl).toHaveBeenCalledWith('60')

    // All 3 config images render as thumbnails
    expect(
      screen.getByAltText(/Test Product - GENOSYS product thumbnail 1 of 3/i)
    ).toBeInTheDocument()
    expect(
      screen.getByAltText(/Test Product - GENOSYS product thumbnail 3 of 3/i)
    ).toBeInTheDocument()
  })

  it('falls back to id as config key when productNumber is absent', () => {
    render(<ProductImageGallery product={{ ...baseProduct, productNumber: null }} />)

    expect(mockGetConfigImages).toHaveBeenCalledWith(baseProduct.id)
  })

  it('falls back to DB images and prepends the main image', () => {
    const product = {
      ...baseProduct,
      images: JSON.stringify(['/db-1.jpg', '/db-2.jpg']),
    }

    render(<ProductImageGallery product={product} />)

    // main + 2 gallery images = 3 thumbnails
    expect(
      screen.getByAltText(/Test Product - GENOSYS product thumbnail 1 of 3/i)
    ).toBeInTheDocument()
    expect(
      screen.getByAltText(/Test Product - GENOSYS product thumbnail 3 of 3/i)
    ).toBeInTheDocument()
  })

  it('renders only the main image (no thumbnails) for single-image products', () => {
    render(<ProductImageGallery product={baseProduct} />)

    expect(
      screen.getByAltText(/Test Product - GENOSYS Korean dermacosmetics product image 1 of 1/i)
    ).toBeInTheDocument()
    expect(screen.queryByAltText(/product thumbnail/i)).not.toBeInTheDocument()
  })
})
