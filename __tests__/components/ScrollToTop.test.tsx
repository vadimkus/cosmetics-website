import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  /**
   * Both kinds of bottom bar have to be accounted for. The bespoke product pages use a
   * fixed one; the four products that fall through to the generic page use a sticky one,
   * and only knowing about the fixed one put this control on top of it.
   */
  it.each([
    ['fixed, on the bespoke pages', 'mweb-float-bottom'],
    ['sticky, on the generic page', 'mweb-float-sticky-bottom'],
  ])('sits above a bottom bar that is %s', async (_name, className) => {
    const bar = document.createElement('div')
    bar.className = className
    // A bar resting on the edge, inset by 10px: 800 - 10 - 100 = 690.
    bar.getBoundingClientRect = () => ({ top: 690, bottom: 790, height: 100 }) as DOMRect
    document.body.appendChild(bar)

    render(<ScrollToTop />)
    const button = screen.getByRole('button', { hidden: true })

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1300 })
    fireEvent.scroll(window)

    // Measured from the bar's top, so the inset below it counts: 800 - 690 + 16.
    await waitFor(() => expect(button).toHaveStyle({ bottom: '126px' }))
    document.body.removeChild(bar)
  })

  it('ignores a bar that has left the bottom edge', async () => {
    const bar = document.createElement('div')
    bar.className = 'mweb-float-sticky-bottom'
    // A sticky bar at the end of the page, travelling up with the content.
    bar.getBoundingClientRect = () => ({ top: 300, bottom: 400, height: 100 }) as DOMRect
    document.body.appendChild(bar)

    render(<ScrollToTop />)
    const button = screen.getByRole('button', { hidden: true })

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1300 })
    fireEvent.scroll(window)

    await waitFor(() => expect(button).toHaveAttribute('aria-hidden', 'false'))
    // No inline override: the class-based offset stands.
    expect(button.style.bottom).toBe('')
    document.body.removeChild(bar)
  })

  /**
   * The bug this was reported for: the buy bar grew after the last scroll — prices
   * resolving for a signed-in customer, or the quantity passing one and adding a per-unit
   * line — and the control stayed where a shorter bar had put it, on top of the price.
   */
  it('re-measures when the bar changes height without a scroll', async () => {
    const observed: Element[] = []
    let fire: (() => void) | undefined
    // @ts-expect-error - jsdom has no ResizeObserver
    global.ResizeObserver = class {
      constructor(cb: () => void) {
        fire = cb
      }
      observe(el: Element) {
        observed.push(el)
      }
      disconnect() {}
    }

    const bar = document.createElement('div')
    bar.className = 'mweb-float-bottom'
    let height = 80
    bar.getBoundingClientRect = () => ({ top: 800 - height, bottom: 790, height }) as DOMRect
    document.body.appendChild(bar)

    render(<ScrollToTop />)
    const button = screen.getByRole('button', { hidden: true })

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1300 })
    fireEvent.scroll(window)
    await waitFor(() => expect(button).toHaveStyle({ bottom: '96px' }))
    expect(observed).toContain(bar)

    // The bar grows. No scroll, no resize — only the observer can catch this.
    height = 130
    act(() => fire?.())

    await waitFor(() => expect(button).toHaveStyle({ bottom: '146px' }))
    document.body.removeChild(bar)
  })

  it('stays hidden in the installed PWA', () => {
    mockUsePWAMode.mockReturnValue({ isPWA: true, isClient: true })

    render(<ScrollToTop />)

    expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
  })
})
