import { HAIRGEN_BOOSTER_AR, HAIRGEN_BOOSTER_RU } from '@/components/product/hr3/hairGenBoosterLocalizedCopy'
import { getHairGentronCopy } from '@/components/product/hr3/hairGentronCopy'
import { MESOPECIA_KIT_COPY } from '@/components/product/hr3/mesopeciaKitCopy'
import {
  PRODUCT_47_AR_TRANSLATION,
  PRODUCT_47_RU_TRANSLATION,
} from '@/data/product47LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const liveCopy = {
  centralRu: PRODUCT_47_RU_TRANSLATION,
  centralAr: PRODUCT_47_AR_TRANSLATION,
  bespokeRu: MESOPECIA_KIT_COPY.ru,
  bespokeAr: MESOPECIA_KIT_COPY.ar,
  quickFactsRu: getCatalogQuickFacts('47', 'ru'),
  quickFactsAr: getCatalogQuickFacts('47', 'ar'),
  routineRu: ruMessages.product.routineMesopeciaRollerDesc,
  routineAr: arMessages.product.routineMesopeciaRollerDesc,
  boosterRu: HAIRGEN_BOOSTER_RU,
  boosterAr: HAIRGEN_BOOSTER_AR,
  gentronRu: getHairGentronCopy('ru'),
  gentronAr: getHairGentronCopy('ar'),
}

describe('product 47 RU/AR localized copy', () => {
  it('serves one canonical RU/AR payload from both translation maps', () => {
    expect(getProductTranslationsRu('47')).toBe(PRODUCT_47_RU_TRANSLATION)
    expect(getProductTranslations('47')).toBe(PRODUCT_47_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 47 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_47_RU_TRANSLATION : PRODUCT_47_AR_TRANSLATION

    for (const key of [
      'productDetails',
      'keyFeatures',
      'benefits',
      'ingredients',
      'howToUse',
    ] as const) {
      expect(() => JSON.parse(copy[key])).not.toThrow()
    }
  })

  it('keeps the exact kit contents and roller identity visible', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      '100 мл',
      '100 مل',
      '4 мл × 6',
      '4 مل × 6',
      'роллер',
      'رولر',
      '0,5 мм',
      '0.5 مم',
      'STAMP(ROLLER)',
    ]) {
      expect(text).toContain(required)
    }

    expect(text).not.toContain('5 мл × 6')
    expect(text).not.toContain('5 مل × 6')
  })

  it('keeps the exact sequence and single-use handling', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      'пять минут',
      'خمس دقائق',
      '2–5 минут',
      '2–5 دقائق',
      'сразу после вскрытия',
      'فور فتحها',
      'одноразовый',
      'أحادي الاستخدام',
      'Не наносите Scalp Peeling после роллера',
      'لا تضعي Scalp Peeling بعد الرولر',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('does not turn six vials into six sessions or invent a course', () => {
    const ru = JSON.stringify({ central: PRODUCT_47_RU_TRANSLATION, bespoke: MESOPECIA_KIT_COPY.ru }).toLowerCase()
    const ar = JSON.stringify({ central: PRODUCT_47_AR_TRANSLATION, bespoke: MESOPECIA_KIT_COPY.ar }).toLowerCase()

    expect(ru).not.toContain('шесть процедур')
    expect(ru).not.toContain('курс из шести')
    expect(ar).not.toContain('ست جلسات')
    expect(ar).not.toContain('دورة من ست')
  })

  it('keeps pregnancy and roller contraindications on the live page', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      'беременности',
      'грудного вскармливания',
      'الحمل',
      'الرضاعة',
      'аллергии на металл',
      'حساسية للمعادن',
      'келоид',
      'الندبات الجدروية',
      'дерматит',
      'التهاب جلدي',
      'инфицированной',
      'مصابة بعدوى',
      'воспалённой',
      'ملتهبة',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('removes delivery, penetration and drug claims from live RU/AR product 47 surfaces', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    for (const forbidden of [
      'роллер открывает путь',
      'раствор входит вслед',
      'вбивается',
      'доставляется к фолликул',
      'подавляет dht',
      'стимулирует ангиогенез',
      'эффективность факторов роста',
      'الرولر يفتح الطريق',
      'يدخل المحلول خلفه',
      'يُدفع إلى الداخل',
      'يوصل إلى البصيلات',
      'يثبط dht',
      'يحفز تكوين الأوعية',
      'فعالية عوامل النمو',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
