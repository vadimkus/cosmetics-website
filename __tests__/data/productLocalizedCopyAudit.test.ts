import { AUDITED_PRODUCT_LOCALIZED_COPY } from '@/data/productLocalizedCopyAudit'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { HAIRGEN_BOOSTER_COPY } from '@/components/product/hr3/hairGenBoosterCopy'
import { getHesCopy } from '@/components/product/powersolution/hesCopy'
import { getPowerSolutionCopy } from '@/components/product/powersolution/powerSolutionCopy'
import { getCtsCopy } from '@/components/product/powersolution/ctsCopy'
import { getPcsCopy } from '@/components/product/powersolution/pcsCopy'
import { getSwsCopy } from '@/components/product/powersolution/swsCopy'
import { getAwsCopy } from '@/components/product/powersolution/awsCopy'
import { getSnowO2Copy } from '@/components/product/snowo2/snowo2Copy'
import { getRemoverCopy } from '@/components/product/remover/removerCopy'
import { getEpiCopy } from '@/components/product/epi/epiCopy'
import { getSrsCopy } from '@/components/product/srs/srsCopy'
import { getMistCopy } from '@/components/product/mist/mistCopy'
import { getPctTonerCopy } from '@/components/product/pcttoner/pctTonerCopy'
import { getBoosterCopy } from '@/components/product/booster/boosterCopy'
import { getEyeSerumCopy } from '@/components/product/eyeserum/eyeserumCopy'
import { getEyeKitCopy } from '@/components/product/eyekit/eyekitCopy'
import { getHsserumCopy } from '@/components/product/hsserum/hsserumCopy'
import { getAfsCopy } from '@/components/product/afs/afsCopy'
import { getPcserumCopy } from '@/components/product/pcserum/pcserumCopy'
import { getMvserumCopy } from '@/components/product/mvserum/mvserumCopy'
import { getAntiWrinkleCopy } from '@/components/product/antiwrinkle/antiWrinkleCopy'
import { getNdCellCopy } from '@/components/product/ndcell/ndCellCopy'
import { getEyeCreamCopy } from '@/components/product/eyecream/eyecreamCopy'
import { getPostcreamCopy } from '@/components/product/postcream/postcreamCopy'
import { getSpcreamCopy } from '@/components/product/spcream/spcreamCopy'
import { getHydroSoothingCopy } from '@/components/product/hydrosoothing/hydroSoothingCopy'
import { DEEP_MOISTURIZING_COPY } from '@/components/product/beautybox/copy/deepMoisturizing'
import { SENSITIVE_SKIN_COPY } from '@/components/product/beautybox/copy/sensitiveSkin'
import { PROBLEM_SKIN_COPY } from '@/components/product/beautybox/copy/problemSkin'
import { SKIN_BRIGHTENING_COPY } from '@/components/product/beautybox/copy/skinBrightening'
import { ANTI_AGING_COPY } from '@/components/product/beautybox/copy/antiAging'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { PRODUCT_QUICK_FACTS_CATALOG } from '@/lib/productQuickFactsCatalog'
import ruMessages from '@/messages/ru.json'
import arMessages from '@/messages/ar.json'

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

  it('serves the rewritten product 9 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('9')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['9'])
    expect(getProductTranslations('9')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['9'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 9 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['9']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps AWS source facts and removes contradicted or medical claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('9'),
      centralAr: getProductTranslations('9'),
      bespokeRu: getAwsCopy('ru'),
      bespokeAr: getAwsCopy('ar'),
    })

    for (const required of [
      '21,60%',
      '21.60%',
      '12,515%',
      '12.515%',
      '9,0858%',
      '9.0858%',
      'Аденозин 0,04%',
      'أدينوزين 0.04%',
      '2,5%',
      '2.5%',
      '0,1002%',
      '0.1002%',
      '10 ppm',
      '10 أجزاء في المليون',
      '6,6 ppm',
      '6.6 أجزاء في المليون',
      '0,4 ppm',
      '0.4 جزء في المليون',
      '4,93',
      '4.93',
      '1,028',
      '1.028',
      '2,12 мл',
      '2.12 مل',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'арбутин 2%',
      'أربوتين 2%',
      'ботокс',
      'релаксац.*мышц',
      'гормон роста',
      'игф-1',
      'заживлен',
      'регенерац',
      'علاج',
      'بوتوكس',
      'إرخاء العضلات',
      'هرمون النمو',
      'التئام',
      'تجديد الخلايا',
      '5-Free',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getAwsCopy('ru').freeFrom.items).not.toContain('ПАВ')
    expect(getAwsCopy('ar').freeFrom.items).not.toContain('المواد الخافضة للتوتر السطحي')
    expect(text).toContain('PEG-40 Hydrogenated Castor Oil')
    expect(text).toContain('вода кипариса хиноки')
    expect(text).toContain('ماء سرو الهينوكي')
  })

  it('serves the rewritten product 10 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('10')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['10'])
    expect(getProductTranslations('10')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['10'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 10 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['10']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps SNOW O2 source facts and removes medical, dossier and contradicted claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('10'),
      centralAr: getProductTranslations('10'),
      bespokeRu: getSnowO2Copy('ru'),
      bespokeAr: getSnowO2Copy('ar'),
    })

    for (const required of [
      'Methyl Perfluoroisobutyl Ether',
      '8%',
      '9,94%',
      '9.94%',
      '4,1089%',
      '4.1089%',
      '2,4%',
      '2.4%',
      '0,822%',
      '0.822%',
      '5,67',
      '5.67',
      '5,30–6,30',
      '5.30–6.30',
      '180 мл',
      '180 مل',
      '500 мл',
      '500 مل',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'кислородная терапия',
      'علاج بالأكسجين',
      'заживлен',
      'التئام',
      'открывает поры',
      'يفتح المسام',
      'все типы кожи',
      'جميع أنواع البشرة',
      'партия',
      'دفعة',
      'производитель',
      'الشركة المصنّعة',
      'WINNOVA',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(getSnowO2Copy('ru').howTo.steps).toHaveLength(4)
    expect(getSnowO2Copy('ar').howTo.steps).toHaveLength(4)
  })

  it('serves the rewritten product 11 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('11')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['11'])
    expect(getProductTranslations('11')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['11'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 11 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['11']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps SKIN DEFENDER source facts and removes unsupported treatment claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('11'),
      centralAr: getProductTranslations('11'),
      bespokeRu: getRemoverCopy('ru'),
      bespokeAr: getRemoverCopy('ar'),
    })

    for (const required of [
      '27,845%',
      '27.845%',
      '13%',
      '9%',
      '49,845%',
      '49.845%',
      '0,5%',
      '0.5%',
      '0,65 ppb',
      '0.65 جزء في البليون',
      '200 мл',
      '200 مل',
      '12 месяцев',
      '12 شهراً',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'без раздражения',
      'دون تهيج',
      'эффективно снимает водостойкий',
      'يزيل المكياج المقاوم للماء بفعالية',
      'офтальмологически протестировано',
      'مختبر عيونياً',
      'все типы кожи',
      'جميع أنواع البشرة',
      'укрепляющ.*пептид',
      'ببتيدات مشددة',
      'лечени',
      'علاج',
      'партия',
      'دفعة',
      'производитель',
      'الشركة المصنّعة',
      'WINNOVA',
      'Green Cos',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getRemoverCopy('ru').howTo.steps).toHaveLength(4)
    expect(getRemoverCopy('ar').howTo.steps).toHaveLength(4)
  })

  it('serves the rewritten product 12 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('12')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['12'])
    expect(getProductTranslations('12')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['12'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 12 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['12']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps EPI source facts and removes contradicted, medical and dossier-style claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('12'),
      centralAr: getProductTranslations('12'),
      bespokeRu: getEpiCopy('ru'),
      bespokeAr: getEpiCopy('ar'),
    })

    for (const required of [
      'Целлюлоза · 3%',
      'السليلوز · 3%',
      'PEG-8 · 10%',
      'Пропиленгликоль · 3,5%',
      'البروبيلين غليكول · 3.5%',
      'Аллантоин · 0,1%',
      'الألانتوين · 0.1%',
      '0,000150%',
      '0.000150%',
      '0,000020%',
      '0.000020%',
      '4,75%',
      '4.75%',
      '0,199972%',
      '0.199972%',
      '2,5–3,5',
      '2.5–3.5',
      '100 г',
      '100 غ',
      '6 месяцев',
      '6 أشهر',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'без раздражения',
      'من دون تهيج',
      'чудо-дерево',
      'شجرة المعجزات',
      'противовоспал',
      'مضاد للالتهاب',
      'антисептич',
      'مطهر',
      'заживлен',
      'التئام',
      'все типы кожи',
      'جميع أنواع البشرة',
      'клинические результаты дома',
      'نتائج العيادة في المنزل',
      'партия',
      'دفعة',
      'производитель',
      'الشركة المصنّعة',
      'Green Cos',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(getEpiCopy('ru').howTo.steps).toHaveLength(4)
    expect(getEpiCopy('ar').howTo.steps).toHaveLength(4)
    expect(JSON.parse(getProductTranslationsRu('12')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('12')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 13 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('13')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['13'])
    expect(getProductTranslations('13')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['13'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 13 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['13']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps SRS source facts and removes medical, dossier and contradicted claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('13'),
      centralAr: getProductTranslations('13'),
      bespokeRu: getSrsCopy('ru'),
      bespokeAr: getSrsCopy('ar'),
    })

    for (const required of [
      'Гликолевая кислота · 15%',
      'حمض الجليكوليك · 15%',
      'Молочная кислота · 13,5%',
      'حمض اللاكتيك · 13.5%',
      'Миндальная кислота · 2%',
      'حمض الماندليك · 2%',
      'Глицерин · 25%',
      'الغليسرين · 25%',
      '30,5%',
      '30.5%',
      '3,02',
      '3.02',
      '1,173',
      '1.173',
      '2,05 мл',
      '2.05 مل',
      '2 мл × 10',
      '2 مل × 10',
      '0,1 ppb',
      '0.1 جزء في البليون',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'регенерац',
      'стимулирует коллаген',
      'лечени',
      'антибактери',
      'مضاد للبكتيريا',
      'تحفيز الكولاجين',
      'علاج',
      'партия',
      'دفعة',
      'производитель',
      'الشركة المصنّعة',
      'нейтрализатор обязателен',
      'المعادل ضروري',
      'для всех типов кожи',
      'لجميع أنواع البشرة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getSrsCopy('ru').howTo.steps).toHaveLength(4)
    expect(getSrsCopy('ar').howTo.steps).toHaveLength(4)
    expect(JSON.parse(getProductTranslationsRu('13')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('13')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 14 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('14')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['14'])
    expect(getProductTranslations('14')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['14'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 14 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['14']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps mist source facts and removes medical, dossier and contradicted claims', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('14'),
      centralAr: getProductTranslations('14'),
      bespokeRu: getMistCopy('ru'),
      bespokeAr: getMistCopy('ar'),
    })

    for (const required of [
      'Масло ши · 1,2%',
      'زبدة الشيا · 1.2%',
      '7,255%',
      '7.255%',
      '4,01%',
      '4.01%',
      '3,245%',
      '3.245%',
      '0,08795%',
      '0.08795%',
      '0,000001%',
      '0.000001%',
      '5,48',
      '5.48',
      '1,0106',
      '1.0106',
      '80,63 мл',
      '80.63 مل',
      '10–20 см',
      '12 месяцев',
      '12 شهراً',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'заживлен',
      'лечени',
      'антибактери',
      'псориаз',
      'угревая болезнь',
      'дерматологически протестирован',
      'для всех типов кожи',
      'партия',
      'производитель',
      'التئام',
      'علاج',
      'مضاد للبكتيريا',
      'الصدفية',
      'حب الشباب',
      'مختبر جلدياً',
      'جميع أنواع البشرة',
      'رقم الدفعة',
      'الشركة المصنّعة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getMistCopy('ru').faq.items).toHaveLength(6)
    expect(getMistCopy('ar').faq.items).toHaveLength(6)
    expect(JSON.parse(getProductTranslationsRu('14')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('14')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 15 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('15')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['15'])
    expect(getProductTranslations('15')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['15'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 15 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['15']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps toner source facts and removes medical, dossier and contradicted claims', () => {
    const concernPage = CONCERN_PAGES.find(page => page.slug === 'acne-treatment')
    const concernSteps = {
      ru: [concernPage?.routine?.ru[0]?.steps[1], concernPage?.routine?.ru[1]?.steps[2]],
      ar: [concernPage?.routine?.ar[0]?.steps[1], concernPage?.routine?.ar[1]?.steps[2]],
    }
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('15'),
      centralAr: getProductTranslations('15'),
      bespokeRu: getPctTonerCopy('ru'),
      bespokeAr: getPctTonerCopy('ar'),
      concernSteps,
    })

    for (const required of [
      'Цинк PCA · 0,5%',
      'زنك PCA · 0.5%',
      '13,398%',
      '13.398%',
      '5,423%',
      '5.423%',
      '4,975%',
      '4.975%',
      '0,001%',
      '0.001%',
      '4,81',
      '4.81',
      '1,0200',
      '1.0200',
      '201,50 мл',
      '201.50 مل',
      '360°',
      '≈50%',
      '12 месяцев',
      '12 شهراً',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'лечит акне',
      'лечение акне',
      'предотвращение высыпаний',
      'антибактери',
      'заживлен',
      'партия',
      'производитель',
      'علاج حب الشباب',
      'منع العيوب',
      'مضاد للبكتيريا',
      'التئام',
      'رقم الدفعة',
      'الشركة المصنّعة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getPctTonerCopy('ru').faq.items).toHaveLength(9)
    expect(getPctTonerCopy('ar').faq.items).toHaveLength(9)
    expect(JSON.parse(getProductTranslationsRu('15')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('15')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 16 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('16')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['16'])
    expect(getProductTranslations('16')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['16'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 16 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['16']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps SNOW BOOSTER facts and removes medical, dossier and contradicted claims', () => {
    const concernSteps = CONCERN_PAGES.flatMap(page => [
      ...(page.routine?.ru.flatMap(group => group.steps) || []),
      ...(page.routine?.ar.flatMap(group => group.steps) || []),
    ]).filter(step => step.products.some(product => product.url === '/products/16'))

    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('16'),
      centralAr: getProductTranslations('16'),
      bespokeRu: getBoosterCopy('ru'),
      bespokeAr: getBoosterCopy('ar'),
      concernSteps,
    })

    for (const required of [
      'Бетаин · 3%',
      'بيتين · 3%',
      '5,7815%',
      '5.7815%',
      '4,55%',
      '4.55%',
      '3,99745%',
      '3.99745%',
      '0,00765%',
      '0.00765%',
      '6,14',
      '6.14',
      '6,17',
      '6.17',
      '200 мл',
      '200 مل',
      '1000 мл',
      '1000 مل',
      '6 месяцев',
      '6 أشهر',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'пробиотик',
      'суж.*пор',
      'проникать глубже',
      'рубцовую ткань',
      'коробка',
      'партия',
      'производитель',
      'بروبيوتيك',
      'تضييق.*المسام',
      'التغلغل بفعالية أكبر',
      'أنسجة الندبات',
      'العلبة',
      'رقم الدفعة',
      'الشركة المصنّعة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toMatch(new RegExp(unsupported, 'iu'))
    }

    expect(getBoosterCopy('ru').faq.items).toHaveLength(8)
    expect(getBoosterCopy('ar').faq.items).toHaveLength(8)
    expect(JSON.parse(getProductTranslationsRu('16')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('16')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 17 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('17')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['17'])
    expect(getProductTranslations('17')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['17'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 17 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['17']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps EyeCell serum facts and removes unsupported or dossier-style claims', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['17'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const eyeKitReferences = (['ru', 'ar'] as const).flatMap(locale => {
      const copy = getEyeKitCopy(locale)
      return [
        copy.contents.items.find(item => item.productNumber === '17'),
        copy.suited.alternatives.find(item => item.productNumber === '17'),
        copy.evidence.cards.find(card => card.title === (locale === 'ru' ? 'Сыворотка и крем' : 'السيروم والكريم')),
        copy.evidence.footnote,
      ]
    })
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('17'),
      centralAr: getProductTranslations('17'),
      bespokeRu: getEyeSerumCopy('ru'),
      bespokeAr: getEyeSerumCopy('ar'),
      quickFacts,
      eyeKitReferences,
    })

    for (const required of [
      'Арбутин · 2%',
      'أربوتين · 2%',
      'Аденозин · 0,04%',
      'أدينوسين · 0.04%',
      '0,20002%',
      '0.20002%',
      '0,0025%',
      '٠٫٠٠٢٥٪',
      '5,37',
      '٥٫٣٧',
      '10 мл',
      '١٠ مل',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      '20 мл',
      '٢٠ مل',
      'ботокс',
      'البوتوكس',
      '10 Years Back',
      'Turn Years Back',
      'заживлен',
      'التئام',
      'микроциркуляц',
      'الدورة الدموية',
      '14 добровольц',
      '14 متطوع',
      'номер партии',
      'رقم الدفعة',
      'производитель',
      'الشركة المصنّعة',
      'цифра для карточки',
      'الرقم الذي يستحق بطاقة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(getEyeSerumCopy('ru').faq.items).toHaveLength(7)
    expect(getEyeSerumCopy('ar').faq.items).toHaveLength(7)
    expect(JSON.parse(getProductTranslationsRu('17')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('17')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 18 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('18')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['18'])
    expect(getProductTranslations('18')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['18'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 18 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['18']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps Hyaluron Serum facts and removes unsupported or dossier-style claims', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['18'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const beautyBoxReferences = (['ru', 'ar'] as const).map(locale =>
      DEEP_MOISTURIZING_COPY[locale].contents.items.find(item => item.productNumber === '18')
    )
    const hydrationConcern = CONCERN_PAGES.find(page => page.slug === 'hydration')
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('18'),
      centralAr: getProductTranslations('18'),
      bespokeRu: getHsserumCopy('ru'),
      bespokeAr: getHsserumCopy('ar'),
      quickFacts,
      beautyBoxReferences,
      hydrationConcernRu: {
        seo: hydrationConcern?.seo.ru,
        why: hydrationConcern?.why?.ru,
        routine: hydrationConcern?.routine?.ru,
        faq: hydrationConcern?.faq.ru,
      },
      hydrationConcernAr: {
        seo: hydrationConcern?.seo.ar,
        why: hydrationConcern?.why?.ar,
        routine: hydrationConcern?.routine?.ar,
        faq: hydrationConcern?.faq.ar,
      },
    })

    for (const required of [
      '2 000 ppm',
      '2,000 جزء في المليون',
      '0,615%',
      '0.615%',
      '16,02%',
      '16.02%',
      '0,79595%',
      '0.79595%',
      '50,81',
      '50.81',
      '52,238',
      '52.238',
      '30 мл',
      '30 مل',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      '4-ступенчат',
      '4 خطوات',
      '78% кокос',
      '78% ماء',
      '+52%',
      'производитель',
      'الشركة المصنّعة',
      'номер партии',
      'رقم الدفعة',
      'зарегистрированн',
      'المسجّلة',
      'документ',
      'الوثائق',
      'коробка говорит',
      'العلبة تقول',
      'тройная гиалуроновая',
      'ثلاثي الوزن',
      'проникает глубоко в дерму',
      'يخترق عمق الأدمة',
      'работать непрерывно 8 часов',
      'العمل دون انقطاع لمدة 8 ساعات',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('18')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('18')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 19 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('19')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['19'])
    expect(getProductTranslations('19')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['19'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 19 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['19']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps All For Sensitive Serum facts and removes invented or medical claims', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['19'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const beautyBoxReferences = (['ru', 'ar'] as const).map(locale =>
      SENSITIVE_SKIN_COPY[locale].contents.items.find(item => item.productNumber === '19')
    )
    const sensitiveConcern = CONCERN_PAGES.find(page => page.slug === 'sensitivity')
    const concernRu = sensitiveConcern?.routine?.ru
      .flatMap(block => block.steps)
      .filter(step => step.products.some(product => product.url === '/products/19'))
    const concernAr = sensitiveConcern?.routine?.ar
      .flatMap(block => block.steps)
      .filter(step => step.products.some(product => product.url === '/products/19'))
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('19'),
      centralAr: getProductTranslations('19'),
      bespokeRu: getAfsCopy('ru'),
      bespokeAr: getAfsCopy('ar'),
      quickFacts,
      beautyBoxReferences,
      concernRu,
      concernAr,
    })

    for (const required of [
      'MultiEx BSASM® Plus',
      '1%',
      '0,5%',
      '0.5%',
      '0,1%',
      '0.1%',
      '0,01%',
      '0.01%',
      '5,77',
      '5.77',
      'масло апельсиновой цедры',
      'زيت قشر البرتقال',
    ]) {
      expect(text).toContain(required)
    }

    for (const unsupported of [
      'пантенол',
      'بانثينول',
      'мадекассосид',
      'ماديكاسوسايد',
      'лечит',
      'يعالج',
      'снимает воспаление',
      'يهدئان الالتهاب',
      'запускает восстановление',
      'يبدآن إصلاح',
      'fragrance-free',
      'производство DTS MG',
      'من إنتاج DTS MG',
      'номер партии',
      'رقم الدفعة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('19')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('19')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 20 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('20')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['20'])
    expect(getProductTranslations('20')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['20'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 20 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['20']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps Problem Control Serum facts and removes invented or dossier-style claims', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['20'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const beautyBoxReferences = (['ru', 'ar'] as const).map(locale =>
      PROBLEM_SKIN_COPY[locale].contents.items.find(item => item.productNumber === '20')
    )
    const acneConcern = CONCERN_PAGES.find(page => page.slug === 'acne-treatment')
    const concernRu = acneConcern?.routine?.ru
      .flatMap(block => block.steps)
      .filter(step => step.products.some(product => product.url === '/products/20'))
    const concernAr = acneConcern?.routine?.ar
      .flatMap(block => block.steps)
      .filter(step => step.products.some(product => product.url === '/products/20'))
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('20'),
      centralAr: getProductTranslations('20'),
      bespokeRu: getPcserumCopy('ru'),
      bespokeAr: getPcserumCopy('ar'),
      quickFacts,
      beautyBoxReferences,
      concernRu,
      concernAr,
    })

    for (const required of [
      'Цинк PCA',
      'زنك PCA',
      '0,05%',
      '0.05%',
      'Трегалоза 1%',
      'تريهالوز 1%',
      'Ксилитол 0,5%',
      'زيليتول 0.5%',
      'Пантенол 0,2%',
      'بانثينول 0.2%',
      'Аллантоин 0,1%',
      'ألانتوين 0.1%',
      '5,62',
      '5.62',
      'Phytolex SC',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'ACZERO',
      'PORE LASER',
      'ниацинамид',
      'نياسيناميد',
      'лечит акне',
      'يعالج حب الشباب',
      'проникает глубже',
      'يخترق أعمق',
      'вдвое эффективнее',
      'بضعف الفعالية',
      'регистрирует эту сыворотку',
      'تسجّل عليه كوريا',
      'номер партии',
      'رقم الدفعة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('20')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('20')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 21 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('21')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['21'])
    expect(getProductTranslations('21')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['21'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 21 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['21']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps Multi Vita Radiance Serum facts consistent across localized surfaces', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['21'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const beautyBoxReferences = (['ru', 'ar'] as const).map(locale =>
      SKIN_BRIGHTENING_COPY[locale].contents.items.find(item => item.productNumber === '21')
    )
    const pigmentationConcern = CONCERN_PAGES.find(page => page.slug === 'pigmentation')
    const recommendationMessages = {
      ru: {
        routine: ruMessages.product.routineMultiVitaSerumDesc,
        intro: ruMessages.product.pc21Intro,
        benefit1: ruMessages.product.pc21Benefit1Text,
        benefit2: ruMessages.product.pc21Benefit2Text,
        benefit3: ruMessages.product.pc21Benefit3Text,
        benefit4: ruMessages.product.pc21Benefit4Text,
      },
      ar: {
        routine: arMessages.product.routineMultiVitaSerumDesc,
        intro: arMessages.product.pc21Intro,
        benefit1: arMessages.product.pc21Benefit1Text,
        benefit2: arMessages.product.pc21Benefit2Text,
        benefit3: arMessages.product.pc21Benefit3Text,
        benefit4: arMessages.product.pc21Benefit4Text,
      },
    }
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('21'),
      centralAr: getProductTranslations('21'),
      bespokeRu: getMvserumCopy('ru'),
      bespokeAr: getMvserumCopy('ar'),
      quickFacts,
      beautyBoxReferences,
      concernRu: pigmentationConcern?.why?.ru,
      concernAr: pigmentationConcern?.why?.ar,
      recommendationMessages,
    })

    for (const required of [
      'Ниацинамид 2%',
      'نياسيناميد 2%',
      'Пантенол 1%',
      'بانثينول 1%',
      'MELAZERO®',
      '0,04%',
      '0.04%',
      '0,01%',
      '0.01%',
      '3-O-Ethyl Ascorbic Acid',
      '6,190',
      '6.190',
      '4,457',
      '4.457',
      '28,0%',
      '28.0%',
      '5,94',
      '5.94',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'арбутин',
      'أربوتين',
      'производитель',
      'المصنّع',
      'номер партии',
      'رقم الدفعة',
      'лечит пигментацию',
      'يعالج التصبغات',
      'подавляет тирозиназу',
      'يثبط التيروزيناز',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('21')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('21')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it.each(['ru', 'ar'] as const)('keeps product 22 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['22']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps Anti-Wrinkle Serum facts consistent across localized surfaces', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['22'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const beautyBoxReferences = (['ru', 'ar'] as const).map(locale =>
      ANTI_AGING_COPY[locale].contents.items.find(item => item.productNumber === '22')
    )
    const wrinklesConcern = CONCERN_PAGES.find(page => page.slug === 'anti-aging')
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('22'),
      centralAr: getProductTranslations('22'),
      bespokeRu: getAntiWrinkleCopy('ru'),
      bespokeAr: getAntiWrinkleCopy('ar'),
      quickFacts,
      beautyBoxReferences,
      concernRu: wrinklesConcern?.routine?.ru.flatMap(section =>
        section.steps.filter(step => step.products.some(product => product.url === '/products/22'))
      ),
      concernAr: wrinklesConcern?.routine?.ar.flatMap(section =>
        section.steps.filter(step => step.products.some(product => product.url === '/products/22'))
      ),
      recommendationRu: [
        ruMessages.product.routineAntiWrinkleSerumDesc,
        ruMessages.product.pc22Intro,
        ruMessages.product.pc32Intro,
        ruMessages.product.pc51Intro,
      ],
      recommendationAr: [
        arMessages.product.routineAntiWrinkleSerumDesc,
        arMessages.product.pc22Intro,
        arMessages.product.pc32Intro,
        arMessages.product.pc51Intro,
      ],
    })

    for (const required of [
      '25,45%',
      '25.45%',
      'Ниацинамид 2%',
      'نياسيناميد 2%',
      'Аденозин 0,04%',
      'أدينوزين 0.04%',
      'Бакучиол 0,1%',
      'باكوتشيول 0.1%',
      '1,4 ppm',
      '1.4 جزء في المليون',
      '6,78',
      '6.78',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'egf',
      'стимулируют выработку коллагена',
      'تحفز إنتاج الكولاجين',
      'глубокого проникновения',
      'الاختراق الأعمق',
      'все признаки старения',
      'جميع علامات الشيخوخة',
      'индекс возраста кожи',
      'مؤشر عمر البشرة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('22')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('22')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 23 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('23')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['23'])
    expect(getProductTranslations('23')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['23'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 23 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['23']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps ND Cell facts and safety notices consistent across localized surfaces', () => {
    const wrinklesConcern = CONCERN_PAGES.find(page => page.slug === 'anti-aging')
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('23'),
      centralAr: getProductTranslations('23'),
      bespokeRu: getNdCellCopy('ru'),
      bespokeAr: getNdCellCopy('ar'),
      concernRu: wrinklesConcern?.routine?.ru.flatMap(section =>
        section.steps.filter(step => step.products.some(product => product.url === '/products/23'))
      ),
      concernAr: wrinklesConcern?.routine?.ar.flatMap(section =>
        section.steps.filter(step => step.products.some(product => product.url === '/products/23'))
      ),
      recommendationRu: ruMessages.product.routineNDCellCreamDesc,
      recommendationAr: arMessages.product.routineNDCellCreamDesc,
    })

    for (const required of [
      'Сквалан 5%',
      'سكوالان 5%',
      'Аденозин 0,04%',
      'أدينوزين 0.04%',
      'Витамин E 1%',
      'فيتامين E بتركيز 1%',
      '0,0087%',
      '0.0087%',
      'Линалоол',
      'اللينالول',
      '6,32',
      '6.32',
      '51,5 ppm',
      '51.5 جزءاً في المليون',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'повышенной концентрацией факторов роста',
      'максимальной доставки факторов роста',
      'ускоряют обновление клеток',
      'تركيز أعلى من عوامل النمو',
      'أقصى توصيل لعوامل النمو',
      'تسرّع تجديد الخلايا',
      'эффективность в отношении морщин',
      'فعالية تحسين التجاعيد',
      'устраняет пигментацию',
      'يزيل التصبغات',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('23')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
    expect(JSON.parse(getProductTranslations('23')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Full INCI' })])
    )
  })

  it('serves the rewritten product 24 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('24')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['24'])
    expect(getProductTranslations('24')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['24'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 24 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['24']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps EyeCell Eye Contour Cream facts and safety consistent across localized surfaces', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('24'),
      centralAr: getProductTranslations('24'),
      bespokeRu: getEyeCreamCopy('ru'),
      bespokeAr: getEyeCreamCopy('ar'),
      quickFacts: PRODUCT_QUICK_FACTS_CATALOG['24'],
      kitRu: getEyeKitCopy('ru').contents.items.find(item => item.productNumber === '24'),
      kitAr: getEyeKitCopy('ar').contents.items.find(item => item.productNumber === '24'),
      recommendationRu: Object.fromEntries(
        Object.entries(ruMessages.product).filter(([key]) => key.startsWith('pc24'))
      ),
      recommendationAr: Object.fromEntries(
        Object.entries(arMessages.product).filter(([key]) => key.startsWith('pc24'))
      ),
    })

    for (const required of [
      'Арбутин 2%',
      'أربوتين 2%',
      'Аденозин 0,04%',
      'أدينوزين 0.04%',
      'Сквалан 2,5%',
      'السكوالان 2.5%',
      'арахисовое масло',
      'زيت الفول السوداني',
      '6,64',
      '6.64',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'более глубокого проникновения',
      'اختراق أعمق',
      'круглосуточная защита',
      'حماية العين على مدار الساعة',
      'синергетический пептидный комплекс',
      'مجمع الببتيد التآزري',
      '10 Years Back',
      'цифра для карточки',
      'الرقم الذي يستحق بطاقة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('24')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Полный состав (INCI)' })])
    )
    expect(JSON.parse(getProductTranslations('24')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'قائمة المكوّنات الكاملة (INCI)' })])
    )
  })

  it('serves the rewritten product 25 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('25')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['25'])
    expect(getProductTranslations('25')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['25'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 25 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['25']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps Postcream facts and safety consistent across localized surfaces', () => {
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('25'),
      centralAr: getProductTranslations('25'),
      bespokeRu: getPostcreamCopy('ru'),
      bespokeAr: getPostcreamCopy('ar'),
      quickFacts: PRODUCT_QUICK_FACTS_CATALOG['25'],
      concerns: CONCERN_PAGES,
      recommendationRu: Object.fromEntries(
        Object.entries(ruMessages.product).filter(([key]) => key.startsWith('pc25'))
      ),
      recommendationAr: Object.fromEntries(
        Object.entries(arMessages.product).filter(([key]) => key.startsWith('pc25'))
      ),
    })

    for (const required of [
      '18,39%',
      '18.39%',
      'Бутиленгликоль 12%',
      'بيوتيلين غلايكول 12%',
      '0,02%',
      '0.02%',
      'пчелиный воск',
      'شمع العسل',
      '6 месяцев',
      '6 أشهر',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'ускоряет регенерацию клеток',
      'يسرّع تجديد الخلايا',
      'заменяя дезорганизованный коллаген',
      'يستبدل تدريجياً كولاجين الندبة',
      'кислородную терапию',
      'علاج الأكسجين',
      'быстрому восстановлению и заживлению',
      'التعافي السريع والشفاء',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('25')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Полный состав (INCI)' })])
    )
    expect(JSON.parse(getProductTranslations('25')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'قائمة المكوّنات الكاملة (INCI)' })])
    )
  })

  it('serves the rewritten product 26 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('26')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['26'])
    expect(getProductTranslations('26')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['26'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 26 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['26']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps EGF Repair Oxymask facts and safety consistent across localized surfaces', () => {
    const sensitiveBoxFaq = {
      ru: SENSITIVE_SKIN_COPY.ru.faq.items.find(item => item.q.includes('EGF Repair Oxymask')),
      ar: SENSITIVE_SKIN_COPY.ar.faq.items.find(item => item.q.includes('EGF Repair Oxymask')),
    }
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('26'),
      centralAr: getProductTranslations('26'),
      sensitiveBoxFaq,
    })

    for (const required of [
      'Methyl Perfluoroisobutyl Ether',
      '5%',
      'Decyl Glucoside',
      '2,75%',
      '2.75%',
      '3,996%',
      '3.996%',
      '2,9979%',
      '2.9979%',
      'Аденозин 0,04%',
      'أدينوزين 0.04%',
      '0,043%',
      '0.043%',
      '0,1 ppm',
      '0.1 جزء في المليون',
      '0,05 ppm',
      '0.05 جزء في المليون',
      '100 ppm',
      '100 جزء في المليون',
      '6,18',
      '6.18',
      '3–5',
      'Не смывайте',
      'لا يُشطف',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'кислородная терапия',
      'العلاج بالأكسجين',
      'стимуляция коллагена',
      'تحفيز الكولاجين',
      'заживлен',
      'التئام الجروح',
      'регенерация клеток',
      'تجديد الخلايا',
      'клинически доказано',
      'مثبت سريرياً',
      'номер партии',
      'رقم الدفعة',
      'производитель',
      'الشركة المصنّعة',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('26')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Полный состав (INCI)' })])
    )
    expect(JSON.parse(getProductTranslations('26')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'قائمة المكوّنات الكاملة (INCI)' })])
    )
  })

  it('serves the rewritten product 27 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('27')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['27'])
    expect(getProductTranslations('27')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['27'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 27 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['27']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps Skin Barrier Protecting Cream facts and positioning consistent', () => {
    const quickFacts = (PRODUCT_QUICK_FACTS_CATALOG['27'] || []).flatMap(fact => [
      fact.title.ru,
      fact.text.ru,
      fact.title.ar,
      fact.text.ar,
    ])
    const beautyBoxItems = [
      SENSITIVE_SKIN_COPY.ru.contents.items.find(item => item.productNumber === '27'),
      SENSITIVE_SKIN_COPY.ar.contents.items.find(item => item.productNumber === '27'),
    ]
    const concernSteps = CONCERN_PAGES.flatMap(page => [
      ...(page.routine?.ru.flatMap(group => group.steps) || []),
      ...(page.routine?.ar.flatMap(group => group.steps) || []),
    ]).filter(step => step.products.some(product => product.url === '/products/27'))
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('27'),
      centralAr: getProductTranslations('27'),
      bespokeRu: getSpcreamCopy('ru'),
      bespokeAr: getSpcreamCopy('ar'),
      quickFacts,
      beautyBoxItems,
      concernSteps,
      recommendationRu: {
        title: ruMessages.product.routineSkinBarrierCreamTitle,
        description: ruMessages.product.routineSkinBarrierCreamDesc,
        intro: ruMessages.product.pc19Intro,
      },
      recommendationAr: {
        title: arMessages.product.routineSkinBarrierCreamTitle,
        description: arMessages.product.routineSkinBarrierCreamDesc,
        intro: arMessages.product.pc19Intro,
      },
    })

    for (const required of [
      'Церамид NP 0,5%',
      'سيراميد NP بتركيز 0.5%',
      '5 000 ppm',
      '5,000 جزء في المليون',
      'Глицерин 17,49%',
      'الغليسرين 17.49%',
      'Масло ши 3%',
      'زبدة الشيا 3%',
      '6,07',
      '6.07',
      '9,3 ppm',
      '9.3 أجزاء في المليون',
      '1 ppm',
      'جزء واحد في المليون',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'для всех типов кожи',
      'لجميع أنواع البشرة',
      'восстанавливает кожный барьер',
      'إصلاح حاجز البشرة',
      'заживлен',
      'التئام الندبات',
      'партия',
      'دفعة',
      'производитель',
      'الشركة المصنّعة',
      'DTS MG',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }

    expect(JSON.parse(getProductTranslationsRu('27')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Полный состав (INCI)' })])
    )
    expect(JSON.parse(getProductTranslations('27')?.ingredients || '[]')).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'قائمة المكوّنات الكاملة (INCI)' })])
    )
  })

  it('serves the rewritten product 28 copy in Russian and Arabic', () => {
    expect(getProductTranslationsRu('28')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ru['28'])
    expect(getProductTranslations('28')).toEqual(AUDITED_PRODUCT_LOCALIZED_COPY.ar['28'])
  })

  it.each(['ru', 'ar'] as const)('keeps product 28 %s structured fields valid JSON', locale => {
    const copy = AUDITED_PRODUCT_LOCALIZED_COPY[locale]['28']
    for (const key of ['productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse'] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps product 28 source facts consistent across customer-facing surfaces', () => {
    const concernSteps = CONCERN_PAGES.flatMap(page => [
      ...(page.routine?.ru.flatMap(group => group.steps) || []),
      ...(page.routine?.ar.flatMap(group => group.steps) || []),
    ]).filter(step => step.products.some(product => product.url === '/products/28'))
    const text = JSON.stringify({
      centralRu: getProductTranslationsRu('28'),
      centralAr: getProductTranslations('28'),
      bespokeRu: getHydroSoothingCopy('ru'),
      bespokeAr: getHydroSoothingCopy('ar'),
      quickFacts: PRODUCT_QUICK_FACTS_CATALOG['28'],
      concernSteps,
      recommendationRu: ruMessages.product.routineHydroSoothingCreamDesc,
      recommendationAr: arMessages.product.routineHydroSoothingCreamDesc,
    })

    for (const required of [
      '21,7%',
      '21.7%',
      '10,555%',
      '10.555%',
      '6,175%',
      '6.175%',
      '+12%',
      '−1 °C',
      '10 ppm',
      '10 أجزاء في المليون',
      '6,39',
      '6.39',
    ]) {
      expect(text.toLocaleLowerCase()).toContain(required.toLocaleLowerCase())
    }

    for (const unsupported of [
      'регенерац',
      'коллаген',
      'заживлен',
      'المحار',
      'تجديد الخلايا',
      'الكولاجين',
      'التئام',
      'более плотной текстурой',
      'بقوام أغنى ومهدئات',
    ]) {
      expect(text.toLocaleLowerCase()).not.toContain(unsupported.toLocaleLowerCase())
    }
  })
})
