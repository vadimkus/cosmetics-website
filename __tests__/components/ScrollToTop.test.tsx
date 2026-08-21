import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ScrollToTop from '@/components/ScrollToTop'

const mockUsePWAMode = jest.fn()

jest.mock('@/hooks/usePWAMode', () => ({
  usePWAMode: () => mockUsePWAMode(),
}))

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => (key === 'common.backToTop' ? 'Back to top' : key),
    dir: 'ltr',
  }),
}))

jest.mock('@/hooks/useReducedMotion', () => ({
  prefersReducedMotion: () => false,
}))

describe('ScrollToTop', () => {
  beforeEach(() => {
    mockUsePWAMode.mockReturnValue({ isPWA: false, isClient: true })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    window.scrollTo = jest.fn()
  })

  it('shows the website control after scrolling and returns to the top', async () => {
    render(<ScrollToTop />)

    const button = screen.getByRole('button', { hidden: true })
    expect(button).not.toHaveClass('md:hidden')
    expect(button).toHaveClass('md:bottom-6', 'md:left-6')

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1300 })
    fireEvent.scroll(window)

    await waitFor(() => expect(button).toHaveAttribute('aria-hidden', 'false'))
    expect(button).toHaveAccessibleName('Back to top')
    fireEvent.click(button)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('stays hidden in the installed PWA', () => {
    mockUsePWAMode.mockReturnValue({ isPWA: true, isClient: true })

    render(<ScrollToTop />)

    expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
  })
})
