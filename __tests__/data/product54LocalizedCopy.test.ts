import fs from 'node:fs'
import {
  PRODUCT_54_AR_TRANSLATION,
  PRODUCT_54_RU_TRANSLATION,
} from '@/data/product54LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { products } from '@/lib/products'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const localizedSurfaces = {
  centralRu: PRODUCT_54_RU_TRANSLATION,
  centralAr: PRODUCT_54_AR_TRANSLATION,
  quickFactsRu: getCatalogQuickFacts('54', 'ru'),
  quickFactsAr: getCatalogQuickFacts('54', 'ar'),
  categoryRu: ruMessages.products.holidayKits,
  categoryAr: arMessages.products.holidayKits,
}
const holidayKitFallback = products.find(product => product.id === '54')

const unsupported = [
  /complete all-skin|complete routine|all skin types/i,
  /полноценн\w+ ритуал|вс(?:е|ех) тип\w+ кож/i,
  /روتين متكامل|جميع أنواع البشرة/i,
  /irritation[- ]free|без раздражен|من دون تهيج/i,
  /oxygen delivery|доставк\w+ кислород|توصيل الأكسجين/i,
  /barrier protection|защит\w+ барьер|حماية الحاجز/i,
  /12 vitamins|12 витамин|12 فيتامين/i,
  /free radicals|свободн\w+ радикал|الجذور الحرة/i,
  /slowing ageing|замедл\w+ старен|إبطاء الشيخوخة/i,
  /collagen activation|активац\w+ коллаген|تنشيط الكولاجين/i,
  /UV.*shield|environmental shielding|УФ.*защит|экологическ\w+ защит|الحماية من الأشعة|العوامل البيئية/i,
]

describe('product 54 Holiday Kit RU/AR localized copy', () => {
  it('serves one canonical payload by product number and database id', () => {
    expect(getProductTranslationsRu('54')).toEqual(PRODUCT_54_RU_TRANSLATION)
    expect(getProductTranslations('54')).toEqual(PRODUCT_54_AR_TRANSLATION)
    expect(getProductTranslationsRu('cmhf1a6p400000xfa0iu3bw42')).toEqual(PRODUCT_54_RU_TRANSLATION)
    expect(getProductTranslations('cmhf1a6p400000xfa0iu3bw42')).toEqual(PRODUCT_54_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 54 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_54_RU_TRANSLATION : PRODUCT_54_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps the verified physical contents and exact sizes', () => {
    const text = JSON.stringify(localizedSurfaces)
    for (const required of [
      'Snow O₂',
      '180 мл',
      '180 مل',
      'Multi Vita Radiance Serum',
      '30 мл',
      '30 مل',
      'Multi Vita Radiance Cream',
      '50 г',
      '50 غ',
      'GENOSYS',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps the verified component facts without legacy kit claims', () => {
    const text = JSON.stringify(localizedSurfaces)
    expect(text).toMatch(/8%/)
    expect(text).toMatch(/2%/)
    expect(text).toMatch(/1%/)
    expect(text).toMatch(/0[,.]1%/)
    expect(text).toMatch(/13%/)
    for (const pattern of unsupported) expect(text).not.toMatch(pattern)
  })

  it('attributes dermatological testing only to the three skincare products', () => {
    const text = JSON.stringify(localizedSurfaces)
    expect(text).toMatch(/три косметических средства дерматологически протестированы/i)
    expect(text).toMatch(/المنتجات التجميلية الثلاثة مختبرة جلدياً/i)
    expect(text).toMatch(/зеркал\w+ является аксессуаром|المرآة فهي ملحق/i)
  })

  it('states discontinued out-of-stock status without implying availability', () => {
    const text = JSON.stringify(localizedSurfaces)
    expect(text).toMatch(/снят\w+ с продажи|متوقفة/i)
    expect(text).toMatch(/отсутствует в наличии|غير متوفرة حالياً/i)
    expect(holidayKitFallback?.inStock).toBe(false)
  })

  it('keeps localized SEO snippets explicitly out of stock', () => {
    const ruPage = fs.readFileSync('app/ru/products/[id]/page.tsx', 'utf8')
    const arPage = fs.readFileSync('app/ar/products/[id]/page.tsx', 'utf8')
    expect(ruPage).toContain("canonicalSlug === '54'")
    expect(ruPage).toContain('Сейчас отсутствует в наличии')
    expect(arPage).toContain("canonicalSlug === '54'")
    expect(arPage).toContain('غير متوفرة حالياً')
  })
})
