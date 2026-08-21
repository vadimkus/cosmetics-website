import { getCollagenMaskCopy } from '@/components/product/collagenmask/collagenMaskCopy'
import { ANTI_AGING_COPY } from '@/components/product/beautybox/copy/antiAging'
import {
  PRODUCT_53_AR_TRANSLATION,
  PRODUCT_53_FULL_INCI,
  PRODUCT_53_RU_TRANSLATION,
} from '@/data/product53LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const boxItems = (['ru', 'ar'] as const).map(locale =>
  ANTI_AGING_COPY[locale].contents.items.find(item => item.productNumber === '53'),
)

const liveRuAr = {
  centralRu: PRODUCT_53_RU_TRANSLATION,
  centralAr: PRODUCT_53_AR_TRANSLATION,
  bespokeRu: getCollagenMaskCopy('ru'),
  bespokeAr: getCollagenMaskCopy('ar'),
  quickFactsRu: getCatalogQuickFacts('53', 'ru'),
  quickFactsAr: getCatalogQuickFacts('53', 'ar'),
  boxItems,
  routineRu: ruMessages.product.routineCollagenMaskDesc,
  routineAr: arMessages.product.routineCollagenMaskDesc,
}

const unsupported = [
  /(?:firmer|firmness|lifted|elasticity)/i,
  /(?:упруг|подтянут|эластичн)/i,
  /(?:تماسك|مشدود|مرون)/i,
  /deep hydration|глубок\w+ увлажнен|ترطيب عميق/i,
  /barrier (?:repair|protection)|защит\w+ барьер|حماية الحاجز|إصلاح الحاجز/i,
  /reactive skin|реактивн\w+ кож|البشرة المتحسسة/i,
  /fine lines|тонк\w+ лини|الخطوط الدقيقة/i,
  /visible radiance|заметн\w+ сияни|إشراقة مرئية/i,
  /long-lasting|длительн\w+ результат|نتائج طويلة/i,
  /all skin types|вс(?:е|ех) тип\w+ кож|جميع أنواع البشرة/i,
  /mature skin|зрел\w+ кож|البشرة الناضجة/i,
  /2[–-]3 (?:times|раза)|2-3 مرات|مرتين إلى ثلاث/i,
  /holds? many times|во много раз|أضعاف وزنه/i,
]

describe('product 53 RU/AR localized copy', () => {
  it('serves one canonical payload by product number and database id', () => {
    expect(getProductTranslationsRu('53')).toEqual(PRODUCT_53_RU_TRANSLATION)
    expect(getProductTranslations('53')).toEqual(PRODUCT_53_AR_TRANSLATION)
    expect(getProductTranslationsRu('cmgj9ifoi00008o07p4eqmfb7')).toEqual(PRODUCT_53_RU_TRANSLATION)
    expect(getProductTranslations('cmgj9ifoi00008o07p4eqmfb7')).toEqual(PRODUCT_53_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 53 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_53_RU_TRANSLATION : PRODUCT_53_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps the verified pack, formula, pH and handling facts exact', () => {
    const text = JSON.stringify(liveRuAr)
    for (const required of [
      '23 г',
      '23 غ',
      '15–20',
      '18,062%',
      '18.062%',
      '10,052%',
      '10.052%',
      '8,010%',
      '8.010%',
      '0,8%',
      '0.8%',
      '0,5%',
      '0.5%',
      '0,2%',
      '0.2%',
      '0,0001%',
      '0.0001%',
      '6,67',
      '6.67',
      '6,96',
      '6.96',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('discloses fragrance, alcohol, soybean and the complete INCI', () => {
    const text = JSON.stringify(liveRuAr)
    expect(text).toContain('Parfum (Fragrance)')
    expect(text).toContain('Alcohol')
    expect(text).toMatch(/со[яи]|الصويا/i)
    expect(PRODUCT_53_FULL_INCI).toContain('Glycine Soja (Soybean) Seed Extract')
    expect(PRODUCT_53_FULL_INCI).toContain('Citrus Paradisi (Grapefruit) Fruit Extract')
  })

  it('keeps unsupported claims and invented protocols out of live RU/AR', () => {
    const text = JSON.stringify(liveRuAr)
    for (const pattern of unsupported) expect(text).not.toMatch(pattern)
  })

  it('keeps the existing routine order aligned with the localized mask copy', () => {
    expect(PRODUCT_ROUTINES['53']!.steps.map(step => step.titleKey)).toEqual([
      'routineSnowO2Title',
      'routineSnowBoosterTitle',
      'routineCollagenMaskTitle',
      'routineAntiWrinkleCreamTitle',
    ])
    expect(JSON.stringify(boxItems)).toContain('18,062%')
    expect(JSON.stringify(boxItems)).toContain('18.062%')
  })
})
