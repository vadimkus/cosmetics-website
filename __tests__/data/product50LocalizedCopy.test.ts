import { getEyeKitCopy } from '@/components/product/eyekit/eyekitCopy'
import { product33Ar, product33Ru } from '@/data/product33LocalizedCopy'
import {
  PRODUCT_50_AR_TRANSLATION,
  PRODUCT_50_RU_TRANSLATION,
} from '@/data/product50LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { getCategoryBySlug } from '@/lib/concernsData'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const liveCopy = {
  centralRu: PRODUCT_50_RU_TRANSLATION,
  centralAr: PRODUCT_50_AR_TRANSLATION,
  bespokeRu: getEyeKitCopy('ru'),
  bespokeAr: getEyeKitCopy('ar'),
  quickFactsRu: getCatalogQuickFacts('50', 'ru'),
  quickFactsAr: getCatalogQuickFacts('50', 'ar'),
  categoryRu: getCategoryBySlug('eye-care')?.seo.ru,
  categoryAr: getCategoryBySlug('eye-care')?.seo.ar,
  routineRu: ruMessages.product.routineEyeKitSerumRollDesc,
  routineAr: arMessages.product.routineEyeKitSerumRollDesc,
  patchRu: product33Ru,
  patchAr: product33Ar,
}

describe('product 50 RU/AR localized copy', () => {
  it('serves one canonical RU/AR payload from both translation maps', () => {
    expect(getProductTranslationsRu('50')).toBe(PRODUCT_50_RU_TRANSLATION)
    expect(getProductTranslations('50')).toBe(PRODUCT_50_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 50 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru' ? PRODUCT_50_RU_TRANSLATION : PRODUCT_50_AR_TRANSLATION

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

  it('keeps every component, size and functional concentration exact', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      '10 мл',
      '10 مل',
      '0,25 мм',
      '0.25 مم',
      '60 игл',
      '60 إبرة',
      '101 г / 60',
      '101 غ / 60',
      '20 г',
      '20 غ',
      'Арбутин 2%',
      'أربوتين 2%',
      'Ниацинамид 2%',
      'نياسيناميد 2%',
      'аденозин 0,04%',
      'أدينوزين 0.04%',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps the sourced roller method, reuse and contraindications', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      'горизонталь',
      'أفقي',
      'вертикаль',
      'عمودي',
      'нескольких минут',
      'لبضع دقائق',
      '5 минут',
      '5 دقائق',
      'хлоргексидин',
      'الكلورهيكسيدين',
      'повторн',
      'إعادة الاستخدام',
      'нержавеющую сталь',
      'الفولاذ المقاوم للصدأ',
      'келоид',
      'الندبات الجدروية',
      'дерматит',
      'التهاب جلدي',
      'повреждённ',
      'متضررة',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps the localized patch instructions aligned with the kit sequence', () => {
    expect(product33Ru.howToUse).toContain('после сыворотки и роллера')
    expect(product33Ar.howToUse).toContain('بعد السيروم والرولر')
  })

  it('keeps patch placement, wear time, cream finish and frequency boundary', () => {
    const text = JSON.stringify(liveCopy)

    expect(text).toContain('под глазами')
    expect(text).toContain('под бровями')
    expect(text).toContain('تحت العينين')
    expect(text).toContain('أسفل الحاجبين')
    expect(text).toContain('20–40')
    expect(text).toContain('крем')
    expect(text).toContain('الكريم')
    expect(text).toContain('не устанавливает универсальную частоту')
    expect(text).toContain('لا تضع العبوة وتيرة عامة')
  })

  it('keeps kit-level pregnancy and peanut-allergy warnings explicit', () => {
    const text = JSON.stringify(liveCopy)

    for (const required of [
      'беременности',
      'грудного вскармливания',
      'الحمل',
      'الرضاعة',
      'арахис',
      'الفول السوداني',
      'глаз',
      'العين',
      'слизист',
      'الأغشية المخاطية',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('removes blunt audit copy and trace-peptide selling from live RU/AR surfaces', () => {
    const text = JSON.stringify({
      centralRu: liveCopy.centralRu,
      centralAr: liveCopy.centralAr,
      bespokeRu: liveCopy.bespokeRu,
      bespokeAr: liveCopy.bespokeAr,
      quickFactsRu: liveCopy.quickFactsRu,
      quickFactsAr: liveCopy.quickFactsAr,
      categoryRu: liveCopy.categoryRu,
      categoryAr: liveCopy.categoryAr,
      routineRu: liveCopy.routineRu,
      routineAr: liveCopy.routineAr,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'не собранный здесь',
      'зарегистрированная коробка',
      'пептиды в косметическом следе',
      '46,5 ppb',
      'коробка пишет',
      'собирают здесь',
      'ليس صندوق جمال جُمع هنا',
      'علبة كورية مسجّلة بباركود',
      'الببتيدات عند أثر تجميلي',
      'جزء في البليون',
      'العلبة تقول',
      'تُجمَّع هنا',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })

  it('does not make medical delivery, penetration or collagen claims for the roller', () => {
    const text = JSON.stringify(liveCopy).toLocaleLowerCase()

    for (const forbidden of [
      'доставка актив',
      'проникновение актив',
      'микроканал',
      'активирует коллаген',
      'стимулирует коллаген',
      'توصيل المكونات',
      'اختراق المكونات',
      'قنوات دقيقة',
      'ينشّط الكولاجين',
      'يحفز الكولاجين',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
