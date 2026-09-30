import {
  PRODUCT_69_AR_TRANSLATION,
  PRODUCT_69_EN,
  PRODUCT_69_PRICE,
  PRODUCT_69_RU_TRANSLATION,
} from '@/data/product69LocalizedCopy'
import { PRODUCT_50_AR_TRANSLATION, PRODUCT_50_RU_TRANSLATION } from '@/data/product50LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getEyeRollerCopy } from '@/components/product/eyeroller/eyeRollerCopy'
import { getEyeKitCopy } from '@/components/product/eyekit/eyekitCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { localizeProductImage } from '@/lib/localizedProductImages'
import { products } from '@/lib/products'

const allCopy = () =>
  JSON.stringify([
    PRODUCT_69_EN,
    PRODUCT_69_RU_TRANSLATION,
    PRODUCT_69_AR_TRANSLATION,
    getEyeRollerCopy('en'),
    getEyeRollerCopy('ru'),
    getEyeRollerCopy('ar'),
    getCatalogQuickFacts('69', 'en'),
    getCatalogQuickFacts('69', 'ru'),
    getCatalogQuickFacts('69', 'ar'),
  ])

describe('product 69 eye roller', () => {
  it('wires RU/AR translations and the art gallery', () => {
    expect(productTranslationsRu['69']).toEqual(PRODUCT_69_RU_TRANSLATION)
    expect(productTranslations['69']).toEqual(PRODUCT_69_AR_TRANSLATION)
    const product = products.find(p => p.id === '69')
    expect(product?.price).toBe(PRODUCT_69_PRICE)
    expect(product?.image).toBe('/images/eyeroller_art/main.jpg')
    expect(JSON.parse(product?.images ?? '[]')).toHaveLength(12)
    expect(localizeProductImage('/images/eyeroller_art/s1.jpg', 'ar')).toBe('/images/eyeroller_art/ar/s1.jpg')
  })

  it('keeps the audited roller facts in every language', () => {
    const copy = allCopy()
    for (const value of ['0.25 mm', '0,25 мм', '0.25 مم', '60', 'chlorhexidine', 'хлоргексидин', 'الكلورهيكسيدين', 'keloid', 'келоид']) {
      expect(copy).toContain(value)
    }
  })

  it('makes no sterility, single-use, frequency or delivery claim', () => {
    const copy = allCopy().toLowerCase()
    for (const forbidden of [
      /single[- ]use|одноразов|للاستخدام مرة واحدة/,
      /steril|стерил|معقم/,
      /collagen|коллаген|الكولاجين/,
      /micro-?channel|микроканал|قنوات دقيقة/,
      /penetrat|проникнов|اختراق/,
      /once a week|раз в неделю|مرة أسبوعياً|every \d+ days/,
      /\bce\b|iso 13485/,
    ]) {
      expect(copy).not.toMatch(forbidden)
    }
  })

  it('stops calling the kit roller exclusive now that it sells alone', () => {
    const kit = JSON.stringify([
      PRODUCT_50_RU_TRANSLATION,
      PRODUCT_50_AR_TRANSLATION,
      getEyeKitCopy('en'),
      getEyeKitCopy('ru'),
      getEyeKitCopy('ar'),
      getCatalogQuickFacts('50', 'en'),
      getCatalogQuickFacts('50', 'ru'),
      getCatalogQuickFacts('50', 'ar'),
    ])
    for (const forbidden of [/kit only|only in this kit|only get here/i, /эксклюзив|только в (этом )?наборе/i, /حصري|في (هذا )?الطقم فقط/]) {
      expect(kit).not.toMatch(forbidden)
    }
  })
})
