import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getBbCushionCopy } from '@/components/product/bbcushion/bbCushionCopy'
import { CHARMING_LOOK_COPY } from '@/components/product/beautybox/copy/charmingLook'
import {
  PRODUCT_57_AR_TRANSLATION,
  PRODUCT_57_RU_TRANSLATION,
} from '@/data/product57LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { PRODUCT_QUICK_FACTS_CATALOG } from '@/lib/productQuickFactsCatalog'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 57 localized copy', () => {
  it('serves one canonical RU/AR payload from both runtime maps', () => {
    expect(getProductTranslationsRu('57')).toEqual(PRODUCT_57_RU_TRANSLATION)
    expect(getProductTranslations('57')).toEqual(PRODUCT_57_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 57 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_57_RU_TRANSLATION : PRODUCT_57_AR_TRANSLATION
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('keeps five products, six physical pieces and the exact shared component order', () => {
    const text = JSON.stringify({
      ru: PRODUCT_57_RU_TRANSLATION,
      ar: PRODUCT_57_AR_TRANSLATION,
      bespokeRu: CHARMING_LOOK_COPY.ru,
      bespokeAr: CHARMING_LOOK_COPY.ar,
      facts: PRODUCT_QUICK_FACTS_CATALOG['57'],
    })

    for (const required of [
      '180 мл', '180 مل', '200 мл', '200 مل', '100 г', '100 غ',
      '15 г', '15 غ', 'пять', 'خمسة', 'шесть', 'ست',
      '#01 Ivory', '#02 Beige', '#03 Camel',
    ]) {
      expect(text).toContain(required)
    }

    expect(PRODUCT_ROUTINES['57']!.steps.map(step => step.titleKey)).toEqual([
      'routineMakeupRemoverTitle',
      'routineSnowO2Title',
      'routineSnowBoosterTitle',
      'routineOvernightMaskTitle',
      'routineBBCushionTitle',
    ])
  })

  it('preserves verified cushion formula, shade and sun-use limits', () => {
    const text = JSON.stringify({
      ru: PRODUCT_57_RU_TRANSLATION,
      ar: PRODUCT_57_AR_TRANSLATION,
      bespokeRu: CHARMING_LOOK_COPY.ru,
      bespokeAr: CHARMING_LOOK_COPY.ar,
      routineRu: ruMessages.product,
      routineAr: arMessages.product,
    })

    for (const required of [
      'пять УФ-фильтров', 'خمسة مرشحات',
      'ниацинамид 2%', 'نياسيناميد 2%',
      'аденозин 0,04%', 'أدينوزين 0.04%',
      'каждые два часа', 'كل ساعتين',
      'водостойкость', 'مقاومة الماء',
      'спонж', 'الإسفنجة',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }
  })

  it('requires a localized shade on the product 57 cart line', () => {
    for (const locale of ['ru', 'ar'] as const) {
      const shadeCopy = getBbCushionCopy(locale)
      expect(shadeCopy.shadeRequired.length).toBeGreaterThan(0)
      expect(shadeCopy.shades.map(shade => shade.value)).toEqual(['Ivory', 'Beige', 'Camel'])
    }

    const pageSource = readFileSync(
      join(process.cwd(), 'components/product/beautybox/BeautyBoxProductPage.tsx'),
      'utf8',
    )
    expect(pageSource).toContain("const requiresShade = boxNumber === '57'")
    expect(pageSource).toContain("await addItem(product, qty, requiresShade ? shade : '', '')")
    expect(pageSource).toContain('role="radiogroup"')
    expect(pageSource).toContain('cushionCopy.shadeRequired')
  })

  it('keeps conditional PM use plus fragrance, essential-oil and eye cautions', () => {
    const text = JSON.stringify({
      ru: PRODUCT_57_RU_TRANSLATION,
      ar: PRODUCT_57_AR_TRANSLATION,
      bespokeRu: CHARMING_LOOK_COPY.ru,
      bespokeAr: CHARMING_LOOK_COPY.ar,
      routineRu: ruMessages.product,
      routineAr: arMessages.product,
    }).toLocaleLowerCase()

    for (const required of [
      'если был макияж', 'عند استخدام المكياج',
      'один-два раза в неделю', 'مرة أو مرتين أسبوعياً',
      'отдуш', 'عطر', 'ароматические растительные масла', 'زيوت نباتية عطرية',
      'закрытом веке', 'الجفن المغلق',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not restore removed mechanisms, engines, blanket claims or stale prices', () => {
    const text = JSON.stringify({
      ru: PRODUCT_57_RU_TRANSLATION,
      ar: PRODUCT_57_AR_TRANSLATION,
      bespokeRu: CHARMING_LOOK_COPY.ru,
      bespokeAr: CHARMING_LOOK_COPY.ar,
      facts: PRODUCT_QUICK_FACTS_CATALOG['57'],
    }).toLocaleLowerCase()

    for (const forbidden of [
      'кислородные пузырьки',
      'فقاعات الأكسجين',
      'без раздражения',
      'دون تهيج',
      'для всех типов кожи',
      'لجميع أنواع البشرة',
      'repairing pep9',
      'глутатион',
      'غلوتاثيون',
      'восстанавливает барьер',
      'إصلاح الحاجز',
      'укрепляющие пептиды',
      'ببتيدات الشد',
      'pink ceramide',
      'розовый керамид',
      'السيراميد الوردي',
      'факторы роста',
      'عوامل النمو',
      '1292',
      '1520',
      '228 aed',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
