import { AUDITED_PRODUCT_LOCALIZED_COPY } from '@/data/productLocalizedCopyAudit'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { HAIRGEN_BOOSTER_COPY } from '@/components/product/hr3/hairGenBoosterCopy'
import { getHesCopy } from '@/components/product/powersolution/hesCopy'
import { getPowerSolutionCopy } from '@/components/product/powersolution/powerSolutionCopy'
import { getCtsCopy } from '@/components/product/powersolution/ctsCopy'
import { getPcsCopy } from '@/components/product/powersolution/pcsCopy'
import { getSwsCopy } from '@/components/product/powersolution/swsCopy'

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

  it('serves the rewritten product 4 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('4')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['4'])
    expect(getProductTranslations('4')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['4'])
  })

  it('serves the rewritten product 5 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('5')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['5'])
    expect(getProductTranslations('5')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['5'])
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

  it.each(['ru', 'ar'] as const)('keeps product 4 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['4']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps HES source facts and removes unsafe or self-defeating claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('4'),
      centralAr: getProductTranslations('4'),
      bespokeRu: getHesCopy('ru'),
      bespokeAr: getHesCopy('ar'),
    })

    for (const required of [
      '1,65 ± 0,35 млн',
      '1.65 ± 0.35 مليون',
      'Ниацинамид 2%',
      'نياسيناميد 2%',
      'BIOPHYTEX',
      'MATRIXYL 3000',
      '1,2-гександиол 2%',
      '1,2-هيكسانيديول 2%',
      '5,75',
      '5.75',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'заживлен',
      'регенерац',
      'воспалени',
      'максимальн.*проникнов',
      'التئام',
      'تجديد الخلايا',
      'الالتهاب',
      'أقصى اختراق',
      'IGF-1',
      'сульфат',
      'كبريتات',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }
  })

  it.each(['ru', 'ar'] as const)('keeps product 5 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['5']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps CVS source facts and removes unsupported treatment claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('5'),
      centralAr: getProductTranslations('5'),
      bespokeRu: getPowerSolutionCopy('ru'),
      bespokeAr: getPowerSolutionCopy('ar'),
    })

    for (const required of [
      '23,965%',
      '23.965%',
      '12,485%',
      '12.485%',
      '11,48%',
      '11.48%',
      '0,1002%',
      '0.1002%',
      '2,5%',
      '2.5%',
      '5,94',
      '5.94',
      '1,032',
      '1.032',
      '2,05 мл',
      '2.05 مل',
      '1 ppm',
      'جزء واحد في المليون',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'заживлен',
      'регенерац',
      'неоколлаген',
      'сосудоукреп',
      'омолож',
      'заживление',
      'التئام',
      'تجديد الخلايا',
      'تحفيز الكولاجين',
      'اختراق أعمق',
      'максимальн.*впитыван',
      'أقصى امتصاص',
      'IGF-1',
      'почти нейтраль',
      'قريبة من المحايدة',
      'ПАВ',
      'خافض',
      'التوتر السطحي',
      '5-Free',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }
  })

  it('serves the rewritten product 6 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('6')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['6'])
    expect(getProductTranslations('6')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['6'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 6 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['6']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps CTS source facts and removes contradicted or medical claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('6'),
      centralAr: getProductTranslations('6'),
      bespokeRu: getCtsCopy('ru'),
      bespokeAr: getCtsCopy('ar'),
    })

    for (const required of [
      '28,0648%',
      '28.0648%',
      '14,5798%',
      '14.5798%',
      '13,485%',
      '13.485%',
      '2,5%',
      '2.5%',
      '0,1002%',
      '0.1002%',
      '0,0212%',
      '0.0212%',
      '212 ppm',
      '212 جزءاً في المليون',
      '7,61',
      '7.61',
      '1,041',
      '1.041',
      '2,06 мл',
      '2.06 مل',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'заживлен',
      'регенерац',
      'неоколлаген',
      'ремоделирован',
      'шрам',
      'growth hormone',
      'гормон роста',
      'التئام',
      'تجديد الخلايا',
      'إعادة تشكيل',
      'ندب',
      'هرمون النمو',
      'искусственн.*пав',
      'искусственн.*поверхностно',
      'خافضات التوتر السطحي الصناعية',
      '5-Free',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }
  })

  it('serves the rewritten product 7 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('7')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['7'])
    expect(getProductTranslations('7')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['7'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 7 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['7']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps PCS source facts and removes contradicted or medical claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('7'),
      centralAr: getProductTranslations('7'),
      bespokeRu: getPcsCopy('ru'),
      bespokeAr: getPcsCopy('ar'),
    })

    for (const required of [
      '22,98%',
      '22.98%',
      '12,9935%',
      '12.9935%',
      '9,9857%',
      '9.9857%',
      '1,5%',
      '1.5%',
      '0,1002%',
      '0.1002%',
      '7,98',
      '7.98',
      '1,031',
      '1.031',
      '2,08 мл',
      '2.08 مل',
      '5 ppm',
      '5 أجزاء في المليون',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'заживлен',
      'регенерац',
      'акне',
      'лечение',
      'IGF-1',
      'гормон роста',
      'التئام',
      'تجديد الخلايا',
      'حب الشباب',
      'علاج',
      'هرمون النمو',
      'искусственн.*пав',
      'искусственн.*поверхностно',
      'خافضات التوتر السطحي الصناعية',
      '5-Free',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }
  })

  it('serves the rewritten product 8 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('8')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['8'])
    expect(getProductTranslations('8')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['8'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 8 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['8']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps SWS source facts and removes contradicted or medical claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('8'),
      centralAr: getProductTranslations('8'),
      bespokeRu: getSwsCopy('ru'),
      bespokeAr: getSwsCopy('ar'),
    })

    for (const required of [
      '17,71%',
      '17.71%',
      '10,224%',
      '10.224%',
      '7,486%',
      '7.486%',
      'Арбутин 2%',
      'أربوتين 2%',
      '0,2002%',
      '0.2002%',
      '6,6 ppm',
      '6.6 أجزاء في المليون',
      '0,5 ppm',
      '0.5 جزء في المليون',
      '7,72',
      '7.72',
      '1,032',
      '1.032',
      '2,09 мл',
      '2.09 مل',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'заживлен',
      'регенерац',
      'лечение',
      'гормон роста',
      'التئام',
      'تجديد الخلايا',
      'علاج التصبغات',
      'هرمون النمو',
      'искусственн.*пав',
      'искусственн.*поверхностно',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getSwsCopy('ru').freeFrom.items).not.toContain('ПАВ')
    expect(getSwsCopy('ar').freeFrom.items).not.toContain('المواد الخافضة للتوتر السطحي')
    expect(text).toContain('Polysorbate 60')
  })
})
