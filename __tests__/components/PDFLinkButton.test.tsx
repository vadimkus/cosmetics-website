import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import PDFLinkButton from '@/components/PDFLinkButton'

// Mock the hooks and modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    t: (key: string) => key,
    dir: 'ltr'
  }),
}))

jest.mock('@/lib/pdfTracking', () => ({
  usePDFTracking: () => ({
    trackDownload: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/lib/analytics', () => ({
  trackPDFDownload: jest.fn(),
}))

jest.mock('@/lib/logger', () => ({
  errorLog: jest.fn(),
}))

const mockPush = jest.fn()
const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('PDFLinkButton', () => {
  beforeEach(() => {
    mockRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any)
    
    // Mock window.matchMedia for PWA detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders PDF link button correctly', () => {
    render(
      <PDFLinkButton
        href="/documents/test.pdf"
        filename="test.pdf"
        className="test-class"
      >
        View PDF
      </PDFLinkButton>
    )

    const button = screen.getByRole('link')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('View PDF')
    expect(button).toHaveClass('test-class')
  })

  it('navigates to correct localized PDF viewer route for Russian', async () => {
    // Mock Russian locale
    jest.doMock('@/hooks/useTranslation', () => ({
      useTranslation: () => ({
        locale: 'ru',
        t: (key: string) => key,
        dir: 'ltr'
      }),
    }))

    // Re-import component with new mock
    const { default: PDFLinkButtonRu } = await import('@/components/PDFLinkButton')

    render(
      <PDFLinkButtonRu
        href="/documents/test.pdf"
        filename="test.pdf"
      >
        Просмотреть PDF
      </PDFLinkButtonRu>
    )

    // Mock PWA mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const button = screen.getByRole('link')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ru/pdf-viewer?file=%2Fdocuments%2Ftest.pdf')
    })
  })

  it('navigates to correct localized PDF viewer route for Arabic', async () => {
    // Mock Arabic locale
    jest.doMock('@/hooks/useTranslation', () => ({
      useTranslation: () => ({
        locale: 'ar',
        t: (key: string) => key,
        dir: 'rtl'
      }),
    }))

    // Re-import component with new mock
    const { default: PDFLinkButtonAr } = await import('@/components/PDFLinkButton')

    render(
      <PDFLinkButtonAr
        href="/documents/test.pdf"
        filename="test.pdf"
      >
        عرض PDF
      </PDFLinkButtonAr>
    )

    // Mock PWA mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const button = screen.getByRole('link')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ar/pdf-viewer?file=%2Fdocuments%2Ftest.pdf')
    })
  })

  it('uses default English route for English locale', async () => {
    render(
      <PDFLinkButton
        href="/documents/test.pdf"
        filename="test.pdf"
      >
        View PDF
      </PDFLinkButton>
    )

    // Mock PWA mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const button = screen.getByRole('link')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/pdf-viewer?file=%2Fdocuments%2Ftest.pdf')
    })
  })
})
