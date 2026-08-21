import { ANTI_AGING_COPY } from '@/components/product/beautybox/copy/antiAging'
import {
  PRODUCT_58_AR_TRANSLATION,
  PRODUCT_58_RU_TRANSLATION,
} from '@/data/product58LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 58 localized copy', () => {
  it('serves exact canonical RU/AR payloads by product number and CUID', () => {
    expect(getProductTranslationsRu('58')).toEqual(PRODUCT_58_RU_TRANSLATION)
    expect(getProductTranslations('58')).toEqual(PRODUCT_58_AR_TRANSLATION)
    expect(getProductTranslationsRu('cmhozfrep00008oxxizeqk8a0')).toEqual(PRODUCT_58_RU_TRANSLATION)
    expect(getProductTranslations('cmhozfrep00008oxxizeqk8a0')).toEqual(PRODUCT_58_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 58 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_58_RU_TRANSLATION : PRODUCT_58_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('keeps the exact nine-piece contents and safe order', () => {
    const text = JSON.stringify({
      ru: PRODUCT_58_RU_TRANSLATION,
      ar: PRODUCT_58_AR_TRANSLATION,
      bespokeRu: ANTI_AGING_COPY.ru,
      bespokeAr: ANTI_AGING_COPY.ar,
      factsRu: getCatalogQuickFacts('58', 'ru'),
      factsAr: getCatalogQuickFacts('58', 'ar'),
    })
    for (const required of [
      '180 мл', '180 مل', '200 мл', '200 مل', '30 мл', '30 مل',
      '50 г', '50 غ', '23 г', '23 غ', '15–20', '25,45%', '25.45%',
      '2%', '0,04%', '0.04%', '18,062%', '18.062%',
    ]) {
      expect(text).toContain(required)
    }
    expect(ANTI_AGING_COPY.ru.contents.items.map(item => [item.productNumber, item.quantity])).toEqual([
      ['10', 1], ['16', 1], ['22', 1], ['32', 1], ['53', 5],
    ])
    expect(PRODUCT_ROUTINES['58']!.steps.map(step => step.titleKey)).toEqual([
      'routineSnowO2Title',
      'routineSnowBoosterTitle',
      'routineCollagenMaskTitle',
      'routineAntiWrinkleSerumTitle',
      'routineAntiWrinkleCreamTitle',
    ])
  })

  it('preserves sunscreen, fragrance, propolis and mask cautions', () => {
    const text = JSON.stringify({
      ru: PRODUCT_58_RU_TRANSLATION,
      ar: PRODUCT_58_AR_TRANSLATION,
      bespokeRu: ANTI_AGING_COPY.ru,
      bespokeAr: ANTI_AGING_COPY.ar,
      routineRu: ruMessages.product,
      routineAr: arMessages.product,
    }).toLocaleLowerCase()
    for (const required of [
      'spf', 'واقي شمس', 'отдуш', 'عطر', 'прополис', 'البروبوليس',
      'сои', 'الصويا', '0,1%', '0.1%',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not restore unsupported box or component claims', () => {
    const live = JSON.stringify({
      ru: PRODUCT_58_RU_TRANSLATION,
      ar: PRODUCT_58_AR_TRANSLATION,
      bespokeRu: ANTI_AGING_COPY.ru,
      bespokeAr: ANTI_AGING_COPY.ar,
    }).toLocaleLowerCase()
    for (const forbidden of [
      'омолож', 'تجديد قوية', 'молодая кожа', 'بشرة شابة', 'подтянут', 'مشدود',
      'эластичност', 'المرونة', 'клинически доказ', 'مثبتة سريرياً',
      'p&k skin research', 'مركز p&k', 'центр кожи p&k',
      'кислородные пузырьки', 'فقاعات الأكسجين', 'без раздражения', 'دون تهيج',
      'натуральная альтернатива ретинолу', 'بديل طبيعي للريتينول',
      'липосом', 'ليبوسوم', 'глубокое увлажнение', 'ترطيب عميق',
      '2-3 раза', '2–3 раза', '2-3 مرات', '2–3 مرات',
      '1,390', '1181.50', '208.50',
    ]) {
      expect(live).not.toContain(forbidden)
    }
  })

  it('keeps the live RU/AR anti-aging concern surface aligned', () => {
    const concern = CONCERN_PAGES.find(item => item.slug === 'anti-aging')
    expect(concern).toBeDefined()
    const localized = JSON.stringify({
      arSeo: concern!.seo.ar,
      ruSeo: concern!.seo.ru,
      arWhy: concern!.why?.ar,
      ruWhy: concern!.why?.ru,
      arRoutine: concern!.routine?.ar,
      ruRoutine: concern!.routine?.ru,
      arFaq: concern!.faq.ar,
      ruFaq: concern!.faq.ru,
    }).toLocaleLowerCase()
    for (const required of [
      'تسع قطع', 'أربعة منتجات كاملة الحجم', 'خمسة أقنعة',
      'девять единиц', 'четыре полноразмерных средства', 'пять масок',
      'واقي الشمس', 'spf',
    ]) {
      expect(localized).toContain(required)
    }
    for (const forbidden of [
      'فقاعات الأكسجين', 'منظف الأكسجين', 'кислородн',
      'كريم وجه مغذ', 'питательный крем',
      'دعم الكولاجين', 'поддержк коллагена',
    ]) {
      expect(localized).not.toContain(forbidden)
    }
  })
})
