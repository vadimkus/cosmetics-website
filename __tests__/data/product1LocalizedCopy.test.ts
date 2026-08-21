import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import {
  PRODUCT_1_AR_TRANSLATION,
  PRODUCT_1_RU_TRANSLATION,
} from '@/data/product1LocalizedCopy'

describe('product 1 localized copy', () => {
  it('serves the audited Russian and Arabic copy', () => {
    expect(getProductTranslationsRu('1')).toBe(PRODUCT_1_RU_TRANSLATION)
    expect(getProductTranslations('1')).toBe(PRODUCT_1_AR_TRANSLATION)
  })

  it('removes unsupported claims and unsafe reuse instructions', () => {
    const copy = JSON.stringify({
      ru: PRODUCT_1_RU_TRANSLATION,
      ar: PRODUCT_1_AR_TRANSLATION,
    })

    for (const forbidden of [
      'FDA',
      '300%',
      'معتمد من FDA',
      'نظف وعقم بعد كل استخدام',
      'Очищайте и дезинфицируйте после каждого использования',
      'minimal',
    ]) {
      expect(copy).not.toContain(forbidden)
    }
  })

  it('keeps every structured field valid JSON', () => {
    for (const translation of [
      PRODUCT_1_RU_TRANSLATION,
      PRODUCT_1_AR_TRANSLATION,
    ]) {
      for (const key of [
        'productDetails',
        'keyFeatures',
        'benefits',
        'howToUse',
      ] as const) {
        expect(() => JSON.parse(translation[key])).not.toThrow()
      }
    }
  })
})
