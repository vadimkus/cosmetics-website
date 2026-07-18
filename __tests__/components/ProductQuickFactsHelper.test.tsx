import { fireEvent, render, screen } from '@testing-library/react'
import ProductQuickFactsHelper from '@/components/product/ProductQuickFactsHelper'
import type { Product } from '@/types'

let mockLocale: 'en' | 'ru' | 'ar' = 'en'

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: mockLocale,
    dir: mockLocale === 'ar' ? 'rtl' : 'ltr',
  }),
}))

const product = (
  productNumber: string,
  name: string,
  overrides: Partial<Product> = {}
): Product => ({
  id: productNumber,
  productNumber,
  name,
  price: 100,
  description: `${name} is designed for daily customer use. It offers a practical format and targeted care.`,
  image: '/images/test.jpg',
  category: 'Cream',
  inStock: true,
  size: '50ml',
  ...overrides,
})

describe('ProductQuickFactsHelper', () => {
  beforeEach(() => {
    mockLocale = 'en'
  })

  it('shows verified sales evidence only above the display threshold', () => {
    const { rerender } = render(
      <ProductQuickFactsHelper
        product={product('66', 'CERABARRIER BIOME GEL CLEANSER')}
        unitsSold={47}
      />
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Quick facts' })
    )
    expect(screen.getByRole('dialog')).toHaveTextContent(
      '40+ units sold through GENOSYS UAE'
    )
    expect(screen.getByRole('dialog')).not.toHaveTextContent(/best[- ]seller/i)

    rerender(
      <ProductQuickFactsHelper
        product={product('66', 'CERABARRIER BIOME GEL CLEANSER')}
        unitsSold={19}
      />
    )
    expect(
      screen.getByRole('button', { name: 'Quick product facts' })
    ).toBeInTheDocument()
  })

  it('uses structured product features before description fallback', () => {
    render(
      <ProductQuickFactsHelper
        product={product('49', 'GENO-LED IR II', {
          keyFeatures: JSON.stringify([
            {
              title: 'Four wavelengths',
              description: 'Selectable treatment modes for professional use.',
            },
          ]),
        })}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick product facts' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Four wavelengths')
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Selectable treatment modes'
    )
  })

  it('keeps verified PDRN quick facts for Product 52', () => {
    render(
      <ProductQuickFactsHelper
        product={product('52', 'SKIN REBOOT PDRN MASK PACK', {
          size: '30 sheets',
        })}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick product facts' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveTextContent('Sodium DNA 1,000 ppm')
    expect(dialog).toHaveTextContent('Niacinamide 2% and panthenol 1%')
    expect(dialog).toHaveTextContent('30 ready-to-use sheets')
  })

  it('always produces useful fallback facts', () => {
    render(
      <ProductQuickFactsHelper
        product={product('55', 'PROBLEM SKIN CARE BEAUTY BOX')}
      />
    )
    const section = screen.getByRole('button', {
      name: 'Quick product facts',
    }).closest('section')
    expect(Number(section?.getAttribute('data-product-fact-count'))).toBeGreaterThan(0)
  })

  it.each([
    ['ru', 'Кратко о продукте', 'Полезно знать'],
    ['ar', 'حقائق سريعة عن المنتج', 'معلومات مفيدة'],
  ] as const)('localizes quick-fact chrome for %s', (locale, button, title) => {
    mockLocale = locale
    render(
      <ProductQuickFactsHelper
        product={product('66', 'CERABARRIER BIOME GEL CLEANSER')}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: button }))
    expect(screen.getByRole('dialog')).toHaveTextContent(title)
  })
})
