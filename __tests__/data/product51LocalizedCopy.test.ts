import {
  PRODUCT_51_AR_TRANSLATION,
  PRODUCT_51_RU_TRANSLATION,
} from '@/data/product51LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getBioFermentCopy } from '@/components/product/bioferment/bioFermentCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'

const unsupported = [
  /218%|٢١٨٪/,
  /10[–-]11|١٠[–-]١١|١٠ إلى ١١/,
  /не сохнет|не сушит|لا يجف|يحبس الرطوبة/i,
  /все типы кожи|جميع أنواع البشرة/i,
  /перегрет|منهكة من الحر/i,
  /кипарисовая вода\s*[—-]\s*ароматический|ماء السرو\s+(?:هو\s+)?مكوّن عطري/i,
]

describe('product 51 audited localized copy', () => {
  it('is the single payload used by both translation maps', () => {
    expect(productTranslationsRu['51']).toBe(PRODUCT_51_RU_TRANSLATION)
    expect(productTranslations['51']).toBe(PRODUCT_51_AR_TRANSLATION)
  })

  it('keeps every verified pack and formula quantity', () => {
    const copy = JSON.stringify([PRODUCT_51_RU_TRANSLATION, PRODUCT_51_AR_TRANSLATION])
    for (const value of ['300', '40', '1 : 1', '5–10', '15–20', '41,79', '41.79', '35%', '15%', '6%', '0,2%', '0.2%', '0,1%', '0.1%', '6 месяцев', '6 أشهر']) {
      expect(copy).toContain(value)
    }
    expect(copy).toContain('0,093%')
    expect(copy).toContain('0.093%')
    expect(copy).toContain('0,02%')
    expect(copy).toContain('0.02%')
    expect(copy).toContain('0,001%')
    expect(copy).toContain('0.001%')
    expect(copy).toContain('0,00001%')
    expect(copy).toContain('0.00001%')
  })

  it('does not retail unsupported study, skin or fragrance conclusions', () => {
    const liveRuAr = JSON.stringify([
      PRODUCT_51_RU_TRANSLATION,
      PRODUCT_51_AR_TRANSLATION,
      getBioFermentCopy('ru'),
      getBioFermentCopy('ar'),
      getCatalogQuickFacts('51', 'ru'),
      getCatalogQuickFacts('51', 'ar'),
    ])
    for (const pattern of unsupported) expect(liveRuAr).not.toMatch(pattern)
  })

  it('states the evidence boundary around fragrance explicitly', () => {
    const copy = JSON.stringify([PRODUCT_51_RU_TRANSLATION, PRODUCT_51_AR_TRANSLATION])
    expect(copy).toContain('Parfum')
    expect(copy).toContain('не указаны')
    expect(copy).toContain('لا تذكر')
  })
})
