import { getHairGentronCopy } from '@/components/product/hr3/hairGentronCopy'
import {
  PRODUCT_48_AR_TRANSLATION,
  PRODUCT_48_RU_TRANSLATION,
} from '@/data/product48LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getConcernBySlug } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const liveCopy = {
  centralRu: PRODUCT_48_RU_TRANSLATION,
  centralAr: PRODUCT_48_AR_TRANSLATION,
  bespokeRu: getHairGentronCopy('ru'),
  bespokeAr: getHairGentronCopy('ar'),
  quickFactsRu: getCatalogQuickFacts('48', 'ru'),
  quickFactsAr: getCatalogQuickFacts('48', 'ar'),
  concernRu: getConcernBySlug('hair-loss')?.seo.ru,
  concernAr: getConcernBySlug('hair-loss')?.seo.ar,
  recommendationRu: [
    ruMessages.product.pc48Intro,
    ruMessages.product.pc48Benefit1Text,
    ruMessages.product.pc48Benefit2Text,
    ruMessages.product.pc48Benefit3Text,
    ruMessages.product.pc48Benefit4Text,
  ],
  recommendationAr: [
    arMessages.product.pc48Intro,
    arMessages.product.pc48Benefit1Text,
    arMessages.product.pc48Benefit2Text,
    arMessages.product.pc48Benefit3Text,
    arMessages.product.pc48Benefit4Text,
  ],
}

describe('product 48 RU/AR localized copy', () => {
  it('serves one canonical RU/AR payload from both translation maps', () => {
    expect(getProductTranslationsRu('48')).toBe(PRODUCT_48_RU_TRANSLATION)
    expect(getProductTranslations('48')).toBe(PRODUCT_48_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 48 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_48_RU_TRANSLATION : PRODUCT_48_AR_TRANSLATION

    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
    expect(copy.ingredients).toBeNull()
  })

  it('preserves the exact manual specification', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      'HGHY01',
      '230 × 240 × 300',
      '158 × 68 × 42',
      '1,0 кг',
      '1.0 كغ',
      '10 / 20 / 30',
      'четыре режима',
      'أربعة أوضاع',
      '4 × AA',
      '24 месяца',
      '24 شهراً',
      '5–40 °C',
      '5–40 °م',
      'IEC/EN 60335-2-32',
      '2014/30/EU',
      '2014/35/EU',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps every manual doctor-consultation group and the heat warning', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      'медицинское лечение',
      'علاج طبي',
      'имплантированное электронное медицинское устройство',
      'جهاز طبي إلكتروني مزروع',
      'заболевание сердца',
      'مرض في القلب',
      'заболевание головы',
      'مرض في الرأس',
      'беременны',
      'حاملاً',
      'остеопороз',
      'هشاشة عظام',
      'переломом позвоночника',
      'كسر في العمود الفقري',
      'нарушением кровообращения',
      'اضطراب في الدورة الدموية',
      'выше 38 °C',
      'أعلى من 38 °م',
      'чувствительности к теплу',
      'الإحساس بالحرارة',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not recommend automatic post-procedure use', () => {
    const ru = JSON.stringify(liveCopy).toLocaleLowerCase()

    expect(ru).toContain('не используйте шлем непосредственно после процедуры без разрешения')
    expect(ru).toContain('لا تستخدميه مباشرة بعد إجراء إلا بموافقة')
    expect(ru).not.toContain('mesopecia kit или hairgen booster, они идут раньше')
    expect(ru).not.toContain('إن كنت تستعملين mesopecia kit أو hairgen booster، فذلك يأتي أولاً')
  })

  it('removes medical, Korean-certification and efficacy claims from live RU/AR surfaces', () => {
    const text = JSON.stringify({
      centralRu: liveCopy.centralRu,
      centralAr: liveCopy.centralAr,
      bespokeRu: liveCopy.bespokeRu,
      bespokeAr: liveCopy.bespokeAr,
      recommendationRu: liveCopy.recommendationRu,
      recommendationAr: liveCopy.recommendationAr,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'медицински сертифицирован',
      'сертифицирован в корее',
      'фототерап',
      'стимулирует фолликул',
      'стимулирует рост',
      'лечит выпадение',
      'улучшает кровообращение',
      'معتمد طبياً',
      'معتمد في كوريا',
      'علاج ضوئي',
      'يحفز البصيلات',
      'يحفز نمو',
      'يعالج تساقط',
      'يحسن الدورة الدموية',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })

  it('keeps brochure wavelengths attributed and omits LED count and irradiance claims', () => {
    const text = JSON.stringify({
      bespokeRu: liveCopy.bespokeRu,
      bespokeAr: liveCopy.bespokeAr,
    })

    expect(text).toContain('официальной брошюре')
    expect(text).toContain('النشرة الرسمية')
    expect(text).toContain('840')
    expect(text).toContain('640')
    expect(text).toContain('420')
    expect(text).not.toContain('60 светодиод')
    expect(text).not.toContain('ستين مصباح')
  })
})
