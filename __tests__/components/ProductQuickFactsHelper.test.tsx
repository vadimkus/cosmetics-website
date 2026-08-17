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

  it('never shows units-sold popular proof in quick facts', () => {
    render(
      <ProductQuickFactsHelper
        product={product('66', 'CERABARRIER BIOME GEL CLEANSER')}
        unitsSold={120}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick facts' }))
    const region = screen.getByRole('region')
    expect(region).not.toHaveTextContent(/units sold/i)
    expect(region).not.toHaveTextContent(/popular with customers/i)
    expect(region).toHaveTextContent('+145.8% post-wash hydration')
  })

  it('uses manual-sourced catalog facts for cushion 41', () => {
    render(
      <ProductQuickFactsHelper
        product={product('41', 'SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]')}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick facts' }))
    const region = screen.getByRole('region')
    expect(region).toHaveTextContent('SPF 50+ / PA++++')
    expect(region).toHaveTextContent('Niacinamide 2%, adenosine 0.04%')
    expect(region).toHaveTextContent('Cushion + refill (15 g × 2)')
    expect(region).not.toHaveTextContent(/40% peptide/i)
    expect(region).not.toHaveTextContent(/popular with customers/i)
    // Both claims the dossier audit ruled out: the named ingredients sum to
    // ~73.6%, which puts water at about a quarter, and the nine peptides run
    // 640 ppb down to 10 ppb, so nothing can be "regenerating" at that dose.
    expect(region).not.toHaveTextContent(/moisture essence/i)
    expect(region).not.toHaveTextContent(/regenerating peptides/i)
  })

  it('does not recycle on-page benefits when catalog exists', () => {
    render(
      <ProductQuickFactsHelper
        product={product('41', 'CUSHION', {
          benefits: JSON.stringify([
            'Popular with customers - ignore this PDP copy',
            'Skin cover up - ignore this PDP copy',
          ]),
          keyFeatures: JSON.stringify([
            {
              title: 'Weak PDP feature',
              description: 'Should not appear when catalog facts exist.',
            },
          ]),
        })}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick facts' }))
    const region = screen.getByRole('region')
    expect(region).not.toHaveTextContent('Weak PDP feature')
    expect(region).not.toHaveTextContent('Skin cover up')
    expect(region).toHaveTextContent('Triple fixing polymers')
  })

  it('keeps verified PDRN catalog facts for Product 52', () => {
    render(
      <ProductQuickFactsHelper
        product={product('52', 'SKIN REBOOT PDRN MASK PACK', {
          size: '30 sheets',
        })}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick facts' }))
    const region = screen.getByRole('region')
    expect(region).toHaveTextContent('Sodium DNA 1,000 ppm')
    expect(region).toHaveTextContent('TEWL improved ~35%')
    expect(region).toHaveTextContent('30 ready-to-use sheets')
  })

  it('falls back to ingredient actives when no catalog exists', () => {
    render(
      <ProductQuickFactsHelper
        product={product('19', 'ALL FOR SENSITIVE SERUM', {
          ingredients: JSON.stringify([
            {
              name: 'Centella Complex',
              description: 'Supports post-treatment recovery comfort.',
            },
            {
              name: 'Peptide Technology',
              description: 'Helps the skin look calmer after procedures.',
            },
          ]),
          benefits: JSON.stringify([
            'Rapid Recovery - Should not be preferred over ingredients',
          ]),
        })}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick facts' }))
    const region = screen.getByRole('region')
    expect(region).toHaveTextContent('Centella Complex')
    expect(region).toHaveTextContent('Peptide Technology')
    expect(region).not.toHaveTextContent('Rapid Recovery')
  })

  it('always produces useful fallback facts from size when needed', () => {
    render(
      <ProductQuickFactsHelper
        product={product('55', 'PROBLEM SKIN CARE BEAUTY BOX')}
      />
    )
    const section = screen.getByRole('button', {
      name: 'Quick facts',
    }).closest('section')
    expect(Number(section?.getAttribute('data-product-fact-count'))).toBeGreaterThan(0)
  })

  it('never lets constituent option defaults leak into Beauty Box facts', () => {
    render(
      <ProductQuickFactsHelper
        product={product('58', 'ANTI-AGING BEAUTY BOX', {
          category: 'Beauty Boxes',
          size: '1 kit',
        })}
        selectedSize="50g"
        selectedColor="Beige"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'Quick facts' }))
    const region = screen.getByRole('region')

    expect(region).toHaveTextContent('9 pieces inside')
    expect(region).toHaveTextContent('Save AED 208.50')
    expect(region).toHaveTextContent('Verified GENOSYS box contents and pricing.')
    expect(region).not.toHaveTextContent('Selected shade')
    expect(region).not.toHaveTextContent('Beige')
    expect(region).not.toHaveTextContent('Format')
    expect(region).not.toHaveTextContent('50g')
    expect(region).not.toHaveTextContent('1 kit')
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
    expect(screen.getByRole('region')).toHaveTextContent(title)
  })
})
