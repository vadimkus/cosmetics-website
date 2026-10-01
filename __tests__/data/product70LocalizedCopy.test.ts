import {
  PRODUCT_70_AR_TRANSLATION,
  PRODUCT_70_COMPONENTS,
  PRODUCT_70_EN,
  PRODUCT_70_PRICE,
  PRODUCT_70_RU_TRANSLATION,
} from '@/data/product70LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getMesopeciaCopy } from '@/components/product/mesopecia/mesopeciaCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { localizeProductImage } from '@/lib/localizedProductImages'
import { products } from '@/lib/products'

const allCopy = () =>
  JSON.stringify([
    PRODUCT_70_EN,
    PRODUCT_70_RU_TRANSLATION,
    PRODUCT_70_AR_TRANSLATION,
    getMesopeciaCopy('en'),
    getMesopeciaCopy('ru'),
    getMesopeciaCopy('ar'),
    getCatalogQuickFacts('70', 'en'),
    getCatalogQuickFacts('70', 'ru'),
    getCatalogQuickFacts('70', 'ar'),
  ])

describe('product 70 Mesopecia Kit', () => {
  it('wires RU/AR translations, the fallback record and the art gallery', () => {
    expect(productTranslationsRu['70']).toEqual(PRODUCT_70_RU_TRANSLATION)
    expect(productTranslations['70']).toEqual(PRODUCT_70_AR_TRANSLATION)
    const product = products.find(p => p.id === '70')
    expect(product?.price).toBe(PRODUCT_70_PRICE)
    expect(product?.image).toBe('/images/mesopecia_tend/main-v2.jpg')
    expect(JSON.parse(product?.images ?? '[]')).toHaveLength(12)
    expect(localizeProductImage('/images/mesopecia_tend/s1b.jpg', 'ru')).toBe('/images/mesopecia_tend/ru/s1b.jpg')
    expect(products.find(p => p.id === '47')?.isHidden).toBe(true)
  })

  it('links every item in the box to its live product, in the order of use', () => {
    for (const locale of ['en', 'ru', 'ar']) {
      expect(getMesopeciaCopy(locale).contents.items.map(i => i.productNumber)).toEqual([...PRODUCT_70_COMPONENTS])
    }
  })

  it('keeps the component facts in every language', () => {
    const copy = allCopy()
    for (const value of ['100 ml', '100 мл', '100 مل', '4 ml × 8', '4 мл × 8', '0.25 mm', '0,25 мм', '0.25 مم', '140', '1 to 2 cm', '1-2 см', '10 to 15', '10-15']) {
      expect(copy).toContain(value)
    }
  })

  it('makes no hair-loss, regrowth or frequency claim and does not cite DTS MG', () => {
    const copy = allCopy().toLowerCase()
    for (const forbidden of [
      /hair[- ]loss|alopecia|regrow|anti-?hair|выпаден|облысен|тساقط|تساقط|الصلع|إعادة نمو/,
      /growth factor|фактор(ы|ов)? роста|عوامل النمو/,
      /once a week|twice a week|раз в неделю|مرة أسبوعياً|مرتين أسبوعياً|every \d+ days/,
      /dts mg|dts-mg/,
      /kit only|only in this kit|только в (этом )?наборе|في (هذا )?الطقم فقط/,
    ]) {
      expect(copy).not.toMatch(forbidden)
    }
  })
})
