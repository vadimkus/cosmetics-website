/**
 * Integration tests for PDF link functionality across different locales
 * Tests the complete flow from product page to PDF viewer
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProductContentDisplay from '@/components/product/ProductContentDisplay'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: (key: string) => {
      const translations: Record<string, string> = {
        'product.productDocumentation': 'Product Documentation',
        'product.documentationDescription': 'Download complete product guide and usage instructions for professional application.',
        'product.viewPdf': 'View PDF',
        'product.download': 'Download',
      }
      return translations[key] || key
    },
    dir: 'ltr'
  }),
}))

jest.mock('@/data/productConfig', () => ({
  getProductDocumentation: jest.fn().mockReturnValue([
    {
      title: 'Test Product Guide',
      url: 'https://example.com/test-product-guide.pdf',
      type: 'pdf'
    }
  ])
}))

const mockPush = jest.fn()
const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('PDF Links Integration Tests', () => {
  beforeEach(() => {
    mockRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any)

    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000'
      },
      writable: true
    })

    jest.clearAllMocks()
  })

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test product description',
    price: 100,
    image: '/test-image.jpg',
    category: 'test',
    inStock: true,
    productDetails: 'Test details',
    keyFeatures: [],
    benefits: 'Test benefits',
    ingredients: 'Test ingredients',
    howToUse: 'Test usage',
    directions: 'Test directions',
    skinType: 'All skin types',
    targetConcerns: 'Test concerns',
    usage: 'Daily',
    ageGroup: 'Adult',
    rating: 5,
    productNumber: 'TEST001',
    size: 'Standard',
    createdAt: new Date(),
    updatedAt: new Date(),
    images: null,
    noDiscount: false,
    isHidden: false
  }

  describe('English Locale PDF Links', () => {
    it('generates correct English PDF viewer URL', async () => {
      render(<ProductContentDisplay product={mockProduct} />)

      const viewPdfButton = screen.getByText('View PDF')
      fireEvent.click(viewPdfButton)

      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith(
          'http://localhost:3000/pdf-viewer?file=https%3A%2F%2Fexample.com%2Ftest-product-guide.pdf',
          '_blank',
          'noopener,noreferrer'
        )
      })
    })
  })

  describe('Russian Locale PDF Links', () => {
    beforeEach(() => {
      jest.doMock('@/hooks/useTranslation', () => ({
        useTranslation: () => ({
          locale: 'ru',
          t: (key: string) => {
            const translations: Record<string, string> = {
              'product.productDocumentation': 'Документация по продукту',
              'product.documentationDescription': 'Скачайте полное руководство по продукту и руководство по использованию для профессионального применения.',
              'product.viewPdf': 'Просмотреть PDF',
              'product.download': 'Скачать',
            }
            return translations[key] || key
          },
          dir: 'ltr'
        }),
      }))
    })

    it('generates correct Russian PDF viewer URL', async () => {
      // Re-import component with Russian locale mock
      const { default: ProductContentDisplayRu } = await import('@/components/product/ProductContentDisplay')
      
      render(<ProductContentDisplayRu product={mockProduct} />)

      const viewPdfButton = screen.getByText('Просмотреть PDF')
      fireEvent.click(viewPdfButton)

      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith(
          'http://localhost:3000/ru/pdf-viewer?file=https%3A%2F%2Fexample.com%2Ftest-product-guide.pdf',
          '_blank',
          'noopener,noreferrer'
        )
      })
    })
  })

  describe('Arabic Locale PDF Links', () => {
    beforeEach(() => {
      jest.doMock('@/hooks/useTranslation', () => ({
        useTranslation: () => ({
          locale: 'ar',
          t: (key: string) => {
            const translations: Record<string, string> = {
              'product.productDocumentation': 'وثائق المنتج',
              'product.documentationDescription': 'قم بتنزيل دليل المنتج الكامل ودليل الاستخدام للتطبيق المهني.',
              'product.viewPdf': 'عرض PDF',
              'product.download': 'تحميل',
            }
            return translations[key] || key
          },
          dir: 'rtl'
        }),
      }))
    })

    it('generates correct Arabic PDF viewer URL', async () => {
      // Re-import component with Arabic locale mock
      const { default: ProductContentDisplayAr } = await import('@/components/product/ProductContentDisplay')
      
      render(<ProductContentDisplayAr product={mockProduct} />)

      const viewPdfButton = screen.getByText('عرض PDF')
      fireEvent.click(viewPdfButton)

      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith(
          'http://localhost:3000/ar/pdf-viewer?file=https%3A%2F%2Fexample.com%2Ftest-product-guide.pdf',
          '_blank',
          'noopener,noreferrer'
        )
      })
    })
  })

  describe('URL Encoding', () => {
    it('properly encodes PDF URLs with special characters', async () => {
      // Mock product documentation with special characters
      jest.doMock('@/data/productConfig', () => ({
        getProductDocumentation: jest.fn().mockReturnValue([
          {
            title: 'Test Product Guide',
            url: 'https://example.com/GENOSYS SKIN REBOOT PDRN MASK PACK.pdf',
            type: 'pdf'
          }
        ])
      }))

      const { default: ProductContentDisplayEncoding } = await import('@/components/product/ProductContentDisplay')
      
      render(<ProductContentDisplayEncoding product={mockProduct} />)

      const viewPdfButton = screen.getByText('View PDF')
      fireEvent.click(viewPdfButton)

      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith(
          expect.stringContaining('GENOSYS%2520SKIN%2520REBOOT%2520PDRN%2520MASK%2520PACK.pdf'),
          '_blank',
          'noopener,noreferrer'
        )
      })
    })
  })
})

// Mock window.open for testing
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
})
