import {
  PRODUCT_29_RU_DESCRIPTION,
  PRODUCT_29_RU_NAME,
  PRODUCT_29_RU_TRANSLATION,
} from '@/data/product29RussianCopy'
import { getMhcreamCopy } from '@/components/product/mhcream/mhcreamCopy'

describe('product 29 Russian copy', () => {
  it('uses natural customer-facing Russian instead of literal English calques', () => {
    const text = JSON.stringify({
      name: PRODUCT_29_RU_NAME,
      description: PRODUCT_29_RU_DESCRIPTION,
      page: getMhcreamCopy('ru'),
      translation: PRODUCT_29_RU_TRANSLATION,
    })

    for (const calque of [
      'Крем везёт',
      'где на самом деле вес',
      'втирайте как плёнку',
      'укладываете плёнку влаги',
      'одна действительно везёт крем',
      'Вода внутрь',
      'рабочая лошадь',
    ]) {
      expect(text).not.toContain(calque)
    }
  })

  it('keeps every structured translation field valid JSON', () => {
    for (const key of [
      'productDetails',
      'keyFeatures',
      'benefits',
      'ingredients',
      'howToUse',
    ] as const) {
      expect(() => JSON.parse(PRODUCT_29_RU_TRANSLATION[key])).not.toThrow()
    }
  })
})
