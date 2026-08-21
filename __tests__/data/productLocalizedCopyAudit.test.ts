import { AUDITED_PRODUCT_LOCALIZED_COPY } from '@/data/productLocalizedCopyAudit'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { HAIRGEN_BOOSTER_COPY } from '@/components/product/hr3/hairGenBoosterCopy'

describe('audited product localization copy', () => {
  it('serves the rewritten product 1 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('1')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['1'])
    expect(getProductTranslations('1')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['1'])
  })

  it('serves the rewritten product 2 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('2')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['2'])
    expect(getProductTranslations('2')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['2'])
  })

  it('serves the rewritten product 3 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('3')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['3'])
    expect(getProductTranslations('3')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['3'])
  })

  it('removes unsupported and unsafe roller claims from customer copy', () => {
    const text = JSON.stringify({
      ru: getProductTranslationsRu('1'),
      ar: getProductTranslations('1'),
    })

    for (const unsupported of [
      'FDA',
      '300%',
      'minimal',
      'Очищайте и дезинфицируйте после каждого использования',
      'نظف وعقم بعد كل استخدام',
    ]) {
      expect(text).not.toContain(unsupported)
    }

    expect(text).toContain('Только для однократного применения')
    expect(text).toContain('للاستخدام مرة واحدة فقط')
  })

  it.each(['ru', 'ar'] as const)('keeps product 1 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['1']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('removes unsupported Needle Pen-K claims and home-use guidance', () => {
    const text = JSON.stringify({
      ru: getProductTranslationsRu('2'),
      ar: getProductTranslations('2'),
    })

    for (const unsupported of [
      '300%',
      'профессиональное и домашнее использование',
      'للاستخدام الاحترافي والمنزلي',
      'оптимального заживления',
      'شفاء أمثل',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(text).toContain('0,25 до 2,0 мм')
    expect(text).toContain('0.25 إلى 2.0 مم')
  })

  it.each(['ru', 'ar'] as const)('keeps product 3 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['3']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps HairGen BOOSTER copy within the audited scalp-care boundary', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('3'),
      centralAr: getProductTranslations('3'),
      bespokeRu: HAIRGEN_BOOSTER_COPY.ru,
      bespokeAr: HAIRGEN_BOOSTER_COPY.ar,
    })

    for (const unsupported of [
      'алопеци',
      'الثعلب',
      'ангиоген',
      'تكوّن أوعية',
      'кровообращ',
      'الدورة الدموية',
      'заживление ран',
      'التئام الجروح',
      'коллаген',
      'الكولاجين',
      'DHT',
      'анаген',
      'التنامي',
      'восстановление роста',
      'إعادة إنبات',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(text).toContain('52')
    expect(text).toContain('0,3 мм')
    expect(text).toContain('0.3 مم')
    expect(text).toContain('24 месяца')
    expect(text).toContain('24 شهراً')
    expect(text).toContain('не заменяет диагностику или лечение')
    expect(text).toContain('لا يحل محل التشخيص أو العلاج')
  })
})
