import { getMhcreamCopy } from '@/components/product/mhcream/mhcreamCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { products } from '@/lib/products'
import enMessages from '@/messages/en.json'

const liveEn = {
  bespoke: getMhcreamCopy('en'),
  quickFacts: getCatalogQuickFacts('29', 'en'),
  fallback: products.find((p) => p.id === '29')?.description,
  recommendation: [
    enMessages.product.pc29Intro,
    enMessages.product.pc29Benefit1Text,
    enMessages.product.pc29Benefit2Text,
    enMessages.product.pc29Benefit3Text,
    enMessages.product.pc29Benefit4Text,
  ],
}

describe('product 29 EN copy', () => {
  it('sells the verified cream facts', () => {
    const text = JSON.stringify(liveEn)

    for (const required of ['Sealed fresh.', '+82%', '72 hours', '1,000.9 ppm', 'Glycerin at 9%', 'PENTAVITIN', 'Hyaluronan 11', '6.00', '50g', '250g']) {
      expect(text).toContain(required)
    }
  })

  it('carries no dossier voice or claims the formula cannot support', () => {
    const text = JSON.stringify(liveEn).toLocaleLowerCase()

    for (const forbidden of [
      'printed beside its name',
      'the carton prints',
      'the box tells you',
      'declared',
      'the manufacturer',
      'rounding error',
      'workhorse',
      'not the reason',
      'evidence file',
      'batch on file',
      'aquaporin',
      'electrolytes',
      'anti-inflammatory',
      'antioxidant',
      'fragrance-free',
      'all skin types',
      'wrinkle reduction',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
