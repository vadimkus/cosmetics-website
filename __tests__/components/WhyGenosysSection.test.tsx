import { render, screen } from '@testing-library/react'
import WhyGenosysSection from '@/components/home/WhyGenosysSection'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

describe('WhyGenosysSection', () => {
  it('preserves the approved English claims and three-card order', () => {
    render(<WhyGenosysSection locale="en" dir="ltr" />)

    // Asserts the section renders, not what colour it is. The original line
    // pinned bg-[#f4efe8], which broke the moment the homepage moved onto the
    // editorial palette even though nothing a reader cares about had changed.
    expect(screen.getByTestId('why-genosys-section')).toBeInTheDocument()
    expect(screen.getByText('Why GENOSYS')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Korean science.Certified in the UAE.'
    )
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getAllByRole('heading', { level: 3 }).map(node => node.textContent)).toEqual([
      'Used by dermatologists across Korea',
      'Official UAE distributor',
      'Formulated and produced in GENOSYS labs',
    ])
    expect(screen.getByText('Clinical-grade')).toBeInTheDocument()
    expect(screen.getByText('In the UAE since 2019')).toBeInTheDocument()
    expect(screen.getByText('Seoul, Korea')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Certified by Dubai Municipality and VAT-registered. Every product is sourced directly from GENOSYS Korea — never gray-market.'
      )
    ).toBeInTheDocument()
  })

  it('renders polished Russian content without English fallback', () => {
    render(<WhyGenosysSection locale="ru" dir="ltr" />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Корейская наука.Сертифицировано в ОАЭ.'
    )
    expect(screen.getByText('Клинический класс')).toBeInTheDocument()
    expect(screen.getByText('Официальный дистрибьютор в ОАЭ')).toBeInTheDocument()
  })

  it('mirrors the Arabic composition and background', () => {
    const { container } = render(<WhyGenosysSection locale="ar" dir="rtl" />)

    expect(screen.getByTestId('why-genosys-section')).toHaveAttribute('dir', 'rtl')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'علم كوري.معتمد في الإمارات.'
    )
    expect(screen.getByText('بجودة عيادية')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveStyle({ transform: 'scaleX(-1)' })
  })
})
