import { readFileSync } from 'fs'
import { join } from 'path'

import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getProductConfig } from '@/data/productConfig'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { localizeProductImages } from '@/lib/localizedProductImages'
import {
  PRODUCT_67_AR_TRANSLATION,
  PRODUCT_67_EN,
  PRODUCT_67_PRICE,
  PRODUCT_67_RU_TRANSLATION,
  PRODUCT_67_SIZES,
} from '@/data/product67LocalizedCopy'

const ROLLER_LENGTHS = ['0.25mm', '0.5mm', '1.0mm', '1.5mm', '2.0mm']

describe('product 67, GENOSYS DTS Microneedle Stamp', () => {
  it('serves the Russian and Arabic copy under its product number', () => {
    expect(getProductTranslationsRu('67')).toBe(PRODUCT_67_RU_TRANSLATION)
    expect(getProductTranslations('67')).toBe(PRODUCT_67_AR_TRANSLATION)
  })

  it('is sold in the roller lengths at the roller price', () => {
    expect([...PRODUCT_67_SIZES]).toEqual(ROLLER_LENGTHS)
    const config = getProductConfig('67')
    expect(config?.pricing.basePrice).toBe(PRODUCT_67_PRICE)
    expect(config?.sizes?.map(s => s.value)).toEqual(ROLLER_LENGTHS)
    expect(getProductConfig('1')?.sizes?.map(s => s.value)).toEqual(ROLLER_LENGTHS)
  })

  it('maps every length to its own MoySklad item', () => {
    const source = readFileSync(join(__dirname, '..', '..', 'lib', 'moysklad.ts'), 'utf8')
    for (const size of ROLLER_LENGTHS) {
      expect(source).toMatch(new RegExp(`'MICRONEEDLE STAMP \\| ${size.replace('.', '\\.')}':\\s+'[0-9a-f-]{36}'`))
    }
    expect(source).toMatch(/'Microneedle Stamp':\s+'[0-9a-f-]{36}'/)
  })

  it('keeps every structured field valid JSON', () => {
    for (const copy of [PRODUCT_67_EN, PRODUCT_67_RU_TRANSLATION, PRODUCT_67_AR_TRANSLATION]) {
      for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
        expect(() => JSON.parse(copy[key])).not.toThrow()
      }
    }
  })

  it('claims only what the stamp sources support', () => {
    const copy = JSON.stringify({ en: PRODUCT_67_EN, ru: PRODUCT_67_RU_TRANSLATION, ar: PRODUCT_67_AR_TRANSLATION })
    // roller-only figures, and claims no DTS source makes for the stamp
    for (const forbidden of ['0.2 mm', '0,2 мм', '0.2 مم', 'SUS 304', 'gamma', 'гамма', 'غاما', '540', 'FDA', 'collagen', 'коллаген', 'كولاجين', '3 years']) {
      expect(copy).not.toContain(forbidden)
    }
    for (const locale of [PRODUCT_67_EN.description, PRODUCT_67_RU_TRANSLATION.description, PRODUCT_67_AR_TRANSLATION.description]) {
      expect(locale).toContain('140')
    }
  })

  it('has six quick facts in every locale and localized campaign slides', () => {
    for (const locale of ['en', 'ru', 'ar'] as const) {
      expect(getCatalogQuickFacts('67', locale)).toHaveLength(6)
    }
    const slides = Array.from({ length: 12 }, (_, i) => `/images/stamp_campaign/s${i + 1}.jpg`)
    expect(localizeProductImages(slides, 'ru')[0]).toBe('/images/stamp_campaign/ru/s1.jpg')
    expect(localizeProductImages(slides, 'ar')[11]).toBe('/images/stamp_campaign/ar/s12.jpg')
  })
})
