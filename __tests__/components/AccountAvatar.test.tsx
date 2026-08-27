import { render, screen } from '@testing-library/react'
import AccountAvatar from '@/components/AccountAvatar'

describe('AccountAvatar', () => {
  /**
   * The circle is the CTA rose, not ink. The app's avatar has been rose since the
   * accent moved off ink, and this was the last place the two surfaces disagreed.
   */
  it('shows the initial on the accent with a presence dot when signed in', () => {
    const { container } = render(<AccountAvatar name="Vadim" signedIn />)

    expect(screen.getByText('V')).toBeInTheDocument()
    expect(container.querySelector('.bg-\\[var\\(--cera-cta\\)\\]')).toBeInTheDocument()
    expect(container.querySelector('.bg-\\[var\\(--status-green\\)\\]')).toBeInTheDocument()
  })

  /**
   * The bug this component exists to end: a signed-out visitor was shown a white "G" on a
   * dark circle, which reads as somebody's account. It was not their initial.
   */
  it('shows a neutral person outline and no dot when signed out', () => {
    const { container } = render(<AccountAvatar signedIn={false} />)

    expect(screen.queryByText('G')).not.toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(container.querySelector('.bg-\\[var\\(--status-green\\)\\]')).not.toBeInTheDocument()
    expect(container.querySelector('.bg-\\[var\\(--cera-cream-deep\\)\\]')).toBeInTheDocument()
  })

  it('falls back to G only for a signed-in account with no name', () => {
    render(<AccountAvatar name={null} signedIn />)

    expect(screen.getByText('G')).toBeInTheDocument()
  })

  it('places the presence dot on the logical end, so Arabic mirrors it', () => {
    const { container } = render(<AccountAvatar name="Vadim" signedIn />)

    const dot = container.querySelector('.bg-\\[var\\(--status-green\\)\\]')
    expect(dot).toHaveClass('end-0')
    expect(dot).not.toHaveClass('right-0')
  })
})
