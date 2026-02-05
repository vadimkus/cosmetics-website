import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import PDFLinkButton from '@/components/PDFLinkButton'

// Mutable locale for tests
let mockLocale = 'en'

// Mock the hooks and modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: mockLocale,
    t: (key: string) => key,
    dir: mockLocale === 'ar' ? 'rtl' : 'ltr'
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
    // Reset locale to default
    mockLocale = 'en'
    
    mockRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any)
    
    // Mock window.matchMedia for PWA detection - default to non-PWA
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
    // Set Russian locale
    mockLocale = 'ru'
    
    // Mock PWA mode - requires mobile user agent + standalone mode
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
    
    // Mock mobile user agent (required for isPWA() to return true)
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    })

    render(
      <PDFLinkButton
        href="/documents/test.pdf"
        filename="test.pdf"
      >
        Просмотреть PDF
      </PDFLinkButton>
    )

    const button = screen.getByRole('link')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ru/pdf-viewer?file=%2Fdocuments%2Ftest.pdf')
    })
  })

  it('navigates to correct localized PDF viewer route for Arabic', async () => {
    // Set Arabic locale
    mockLocale = 'ar'
    
    // Mock PWA mode - requires mobile user agent + standalone mode
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
    
    // Mock mobile user agent (required for isPWA() to return true)
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    })

    render(
      <PDFLinkButton
        href="/documents/test.pdf"
        filename="test.pdf"
      >
        عرض PDF
      </PDFLinkButton>
    )

    const button = screen.getByRole('link')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/ar/pdf-viewer?file=%2Fdocuments%2Ftest.pdf')
    })
  })

  it('uses default English route for English locale', async () => {
    // mockLocale is already 'en' from beforeEach
    
    // Mock PWA mode - requires mobile user agent + standalone mode
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
    
    // Mock mobile user agent (required for isPWA() to return true)
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
    })

    render(
      <PDFLinkButton
        href="/documents/test.pdf"
        filename="test.pdf"
      >
        View PDF
      </PDFLinkButton>
    )

    const button = screen.getByRole('link')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/pdf-viewer?file=%2Fdocuments%2Ftest.pdf')
    })
  })
})
