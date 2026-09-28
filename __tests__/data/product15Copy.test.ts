import { getPctTonerCopy } from '@/components/product/pcttoner/pctTonerCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { products } from '@/lib/products'
import enMessages from '@/messages/en.json'

const liveEn = {
  bespoke: getPctTonerCopy('en'),
  quickFacts: getCatalogQuickFacts('15', 'en'),
  fallback: products.find((p) => p.id === '15')?.description,
  recommendation: [
    enMessages.product.pc15Intro,
    enMessages.product.pc15Benefit1Text,
    enMessages.product.pc15Benefit2Text,
    enMessages.product.pc15Benefit3Text,
    enMessages.product.pc15Benefit4Text,
  ],
}

describe('product 15 EN copy', () => {
  it('sells the verified toner facts', () => {
    const text = JSON.stringify(liveEn)

    for (const required of ['Zinc PCA', '0.5%', '13.4%', '~50%', 'about half', 'Non-comedogenic', 'QACS Ltd.', '360°', 'SNOW ICE', '4.81']) {
      expect(text).toContain(required)
    }
    expect(getPctTonerCopy('en').faq.items).toHaveLength(9)
  })

  it('carries no dossier voice, trace figures or contradicted claims', () => {
    const text = JSON.stringify(liveEn).toLocaleLowerCase()

    for (const forbidden of [
      'carton stops',
      'not why you pick',
      'named active',
      'registered inci',
      'dts mg deck',
      'leftover',
      'copper',
      'specific gravity',
      '1.0200',
      '201.50',
      '0.001%',
      '0.0005%',
      'mg001',
      'genic co',
      'do not buy',
      'treatment/protection',
      'acne-prone',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
