import { render, screen, within } from '@testing-library/react'
import SkinConcernSection, {
  SKIN_CONCERN_CARDS,
} from '@/components/home/SkinConcernSection'
import { getConcernVisual } from '@/lib/concernVisuals'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill: _fill, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

const counts = {
  'sun-protection': 5,
  'acne-treatment': 7,
  pigmentation: 5,
  'scars-treatment': 6,
  'hair-loss': 9,
  'anti-aging': 9,
  hydration: 8,
  sensitivity: 9,
}

describe('SkinConcernSection', () => {
  it('renders the exact eight English concerns in the requested order', () => {
    render(<SkinConcernSection locale="en" dir="ltr" concernCounts={counts} />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Shop by skin concern'
    )
    expect(SKIN_CONCERN_CARDS.map((card) => card.label.en)).toEqual([
      'Sun Protection',
      'Acne & Blemishes',
      'Pigmentation',
      'Scar Treatment',
      'Hair Loss',
      'Anti-Aging',
      'Hydration',
      'Sensitive Skin',
    ])
    expect(SKIN_CONCERN_CARDS.map((card) => getConcernVisual(card.slug)?.image)).toEqual([
      '/images/home/skin_concern/sun-protection.webp',
      '/images/home/skin_concern/acne-blemishes.webp',
      '/images/home/skin_concern/pigmentation.webp',
      '/images/home/skin_concern/scar-treatment.webp',
      '/images/home/skin_concern/hair-loss.webp',
      '/images/home/skin_concern/anti-aging.webp',
      '/images/home/skin_concern/hydration.webp',
      '/images/home/skin_concern/sensitive-skin.webp',
    ])

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((heading) => heading.textContent)).toEqual(
      SKIN_CONCERN_CARDS.map((card) => card.label.en)
    )
    expect(screen.getByText('Daily UV protection built for UAE sun.')).toBeInTheDocument()
    expect(screen.getByText('Deep hydration that lasts all day.')).toBeInTheDocument()
  })

  it('preserves concern destinations, product counts, and the analysis CTA', () => {
    render(<SkinConcernSection locale="en" dir="ltr" concernCounts={counts} />)

    for (const card of SKIN_CONCERN_CARDS) {
      const link = screen.getByRole('link', {
        name: `${card.label.en}, ${card.count} products`,
      })
      expect(link).toHaveAttribute('href', `/products/concern/${card.slug}`)
      expect(within(link).getByText(`${card.count} products`)).toBeInTheDocument()
      expect(within(link).getByText('Explore')).toBeInTheDocument()
    }

    expect(
      screen.getByRole('link', { name: 'Start free GENOSYS skin analysis' })
    ).toHaveAttribute('href', '/skin-recommendation')
    expect(screen.getByText('Not sure where to start?')).toBeInTheDocument()
    expect(
      screen.getByText('Get a personalised routine in under a minute.')
    ).toBeInTheDocument()
  })

  it('localizes Russian links and renders Arabic in RTL', () => {
    const { rerender } = render(
      <SkinConcernSection locale="ru" dir="ltr" concernCounts={counts} />
    )

    expect(screen.getByRole('link', { name: /Защита от солнца/ })).toHaveAttribute(
      'href',
      '/ru/products/concern/sun-protection'
    )

    rerender(<SkinConcernSection locale="ar" dir="rtl" concernCounts={counts} />)
    const section = screen.getByTestId('skin-concern-section')
    expect(section.closest('[dir="rtl"]') ?? section).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /الحماية من الشمس/ })).toHaveAttribute(
      'href',
      '/ar/products/concern/sun-protection'
    )
  })
})
