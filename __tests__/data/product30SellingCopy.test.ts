import { PRODUCT_30_EN, product30Ar, product30Ru } from '@/data/product30LocalizedCopy'
import { getPccreamCopy } from '@/components/product/pccream/pccreamCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { localizeProductImage } from '@/lib/localizedProductImages'
import { products } from '@/lib/products'

describe('product 30 selling copy', () => {
  const en = JSON.stringify([PRODUCT_30_EN, getPccreamCopy('en'), getCatalogQuickFacts('30', 'en')]).toLowerCase()
  const all = JSON.stringify([
    en,
    product30Ru,
    product30Ar,
    getPccreamCopy('ru'),
    getPccreamCopy('ar'),
    getCatalogQuickFacts('30', 'ru'),
    getCatalogQuickFacts('30', 'ar'),
  ]).toLowerCase()

  it('leads with the campaign line in every language', () => {
    expect(getPccreamCopy('en').headline).toBe('Everything under control.')
    expect(getPccreamCopy('ru').headline).toBe('Всё под контролем.')
    expect(getPccreamCopy('ar').headline).toBe('كل شيء تحت السيطرة.')
  })

  it('keeps the selling facts', () => {
    for (const fact of ['zinc pca', '0.05%', 'oil-free', 'trehalose', 'xylitol', '50g', '250g', 'dermatologically tested']) {
      expect(en).toContain(fact)
    }
  })

  it('uses no dossier vocabulary in English', () => {
    for (const banned of [
      'carton says',
      'the carton asks',
      'batch',
      'specification',
      'paperwork',
      'dossier',
      'entry',
      'we will not',
      'honest answer',
      'on file',
      '86.6%',
      '1.3%',
    ]) {
      expect(en).not.toContain(banned)
    }
  })

  it('makes no unsupported claim in any language', () => {
    for (const banned of [/non-?comedogenic|некомедоген|غير مسبب لانسداد/, /no emulsifier|без эмульгатор|لا مستحلب/, /treats acne|лечит акне|يعالج حب الشباب/]) {
      expect(all).not.toMatch(banned)
    }
  })

  it('serves the art gallery, localized', () => {
    const product = products.find(p => p.id === '30')
    expect(JSON.parse(product?.images ?? '[]')).toHaveLength(12)
    expect(localizeProductImage('/images/problemcream_art/s4.jpg', 'ru')).toBe('/images/problemcream_art/ru/s4.jpg')
    expect(localizeProductImage('/images/problemcream_art/s4.jpg', 'ar')).toBe('/images/problemcream_art/ar/s4.jpg')
  })
})
