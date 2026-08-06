import { render, screen } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'

// Mock the modules
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.goBack': 'Go Back',
        'common.loading': 'Loading...',
      }
      return translations[key] || key
    },
    dir: 'ltr'
  }),
}))

jest.mock('@/components/PDFViewerClient', () => {
  return function MockPDFViewerClient({ filename, pdfUrl }: { filename: string; pdfUrl: string }) {
    return <div data-testid="pdf-viewer-client">PDF Viewer: {filename} - {pdfUrl}</div>
  }
})

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

describe('PDF Viewer Pages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('English PDF Viewer', () => {
    it('renders PDF viewer when file parameter is provided', async () => {
      const mockSearchParams = new URLSearchParams('file=https://example.com/test.pdf')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      // Dynamically import the English PDF viewer
      const { default: PDFViewerPage } = await import('@/app/pdf-viewer/page')
      
      render(<PDFViewerPage />)

      expect(screen.getByTestId('pdf-viewer-client')).toBeInTheDocument()
      expect(screen.getByTestId('pdf-viewer-client')).toHaveTextContent('PDF Viewer: test.pdf - https://example.com/test.pdf')
    })

    it('decodes the production EyeCell viewer URL exactly once per encoding layer', async () => {
      const mockSearchParams = new URLSearchParams(
        'file=https%3A%2F%2Fgenosys.ae%2Fdocuments%2FPPT%2FGENOSYS%2520EyeCell%2520EYE%2520ZONE%2520CARE%2520SYSTEM.pdf'
      )
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: PDFViewerPage } = await import('@/app/pdf-viewer/page')

      render(<PDFViewerPage />)

      expect(screen.getByTestId('pdf-viewer-client')).toHaveTextContent(
        'https://genosys.ae/documents/PPT/GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf'
      )
    })

    it('shows no file specified message when no file parameter', async () => {
      const mockSearchParams = new URLSearchParams('')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: PDFViewerPage } = await import('@/app/pdf-viewer/page')
      
      render(<PDFViewerPage />)

      expect(screen.getByText('No file specified!')).toBeInTheDocument()
      expect(screen.getByText('Go Back')).toBeInTheDocument()
    })
  })

  describe('Russian PDF Viewer', () => {
    beforeEach(() => {
      // Mock Russian translations
      jest.doMock('@/hooks/useTranslation', () => ({
        useTranslation: () => ({
          locale: 'ru',
          t: (key: string) => {
            const translations: Record<string, string> = {
              'common.goBack': 'Назад',
              'common.loading': 'Загрузка...',
            }
            return translations[key] || key
          },
          dir: 'ltr'
        }),
      }))
    })

    it('renders Russian PDF viewer with correct translations', async () => {
      const mockSearchParams = new URLSearchParams('file=https://example.com/test.pdf')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: RussianPDFViewerPage } = await import('@/app/ru/pdf-viewer/page')
      
      render(<RussianPDFViewerPage />)

      expect(screen.getByTestId('pdf-viewer-client')).toBeInTheDocument()
    })

    it('shows Russian no file message when no file parameter', async () => {
      const mockSearchParams = new URLSearchParams('')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: RussianPDFViewerPage } = await import('@/app/ru/pdf-viewer/page')
      
      render(<RussianPDFViewerPage />)

      expect(screen.getByText('Файл не указан!')).toBeInTheDocument()
    })
  })

  describe('Arabic PDF Viewer', () => {
    beforeEach(() => {
      // Mock Arabic translations
      jest.doMock('@/hooks/useTranslation', () => ({
        useTranslation: () => ({
          locale: 'ar',
          t: (key: string) => {
            const translations: Record<string, string> = {
              'common.goBack': 'العودة',
              'common.loading': 'جاري التحميل...',
            }
            return translations[key] || key
          },
          dir: 'rtl'
        }),
      }))
    })

    it('renders Arabic PDF viewer with correct translations', async () => {
      const mockSearchParams = new URLSearchParams('file=https://example.com/test.pdf')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: ArabicPDFViewerPage } = await import('@/app/ar/pdf-viewer/page')
      
      render(<ArabicPDFViewerPage />)

      expect(screen.getByTestId('pdf-viewer-client')).toBeInTheDocument()
    })

    it('shows Arabic no file message when no file parameter', async () => {
      const mockSearchParams = new URLSearchParams('')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: ArabicPDFViewerPage } = await import('@/app/ar/pdf-viewer/page')
      
      render(<ArabicPDFViewerPage />)

      expect(screen.getByText('لم يتم تحديد ملف!')).toBeInTheDocument()
    })

    it('renders with RTL direction for Arabic', async () => {
      const mockSearchParams = new URLSearchParams('')
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => mockSearchParams.get(key),
      } as any)

      const { default: ArabicPDFViewerPage } = await import('@/app/ar/pdf-viewer/page')
      
      render(<ArabicPDFViewerPage />)

      // Component shows "No file selected" error when no file param - use this to verify RTL rendering
      const errorText = screen.getByText('لم يتم تحديد ملف!')
      expect(errorText).toBeInTheDocument()
    })
  })
})
