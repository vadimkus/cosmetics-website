import { BLEMISH_BALM_COPY } from '@/components/product/blemishbalm/blemishBalmCopy'
import {
  PRODUCT_42_AR_TRANSLATION,
  PRODUCT_42_RU_TRANSLATION,
} from '@/data/product42LocalizedCopy'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { PRODUCT_QUICK_FACTS_CATALOG } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

describe('product 42 localized copy', () => {
  it('serves one canonical RU/AR payload everywhere', () => {
    expect(getProductTranslationsRu('42')).toEqual(PRODUCT_42_RU_TRANSLATION)
    expect(getProductTranslations('42')).toEqual(PRODUCT_42_AR_TRANSLATION)
  })

  it.each(['ru', 'ar'] as const)('keeps product 42 %s structured fields valid JSON', locale => {
    const copy = locale === 'ru'
      ? PRODUCT_42_RU_TRANSLATION
      : PRODUCT_42_AR_TRANSLATION

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

  it('preserves exact declarations, measurements and practical limits', () => {
    const text = JSON.stringify({
      centralRu: PRODUCT_42_RU_TRANSLATION,
      centralAr: PRODUCT_42_AR_TRANSLATION,
      bespokeRu: BLEMISH_BALM_COPY.ru,
      bespokeAr: BLEMISH_BALM_COPY.ar,
      facts: PRODUCT_QUICK_FACTS_CATALOG['42'],
    })

    for (const required of [
      '50 г', '50 غ', 'SPF 30 PA++',
      '19,70%', '19.70%',
      '7,70%', '7.70%', '7,09%', '7.09%',
      '7%', '6,31%', '6.31%',
      '5%', '4,50%', '4.50%',
      '2%', '1,81%', '1.81%',
      '0,04%', '0.04%', '0,10%', '0.10%',
      '5,5%', '5.5%', '7,44', '7.44',
      'Один оттенок', 'درجة واحدة',
      'Пчелиный воск 2%', 'شمع العسل 2%',
      'Водостойкость не заявлена', 'لا يدّعي المنتج مقاومة الماء',
    ]) {
      expect(text).toContain(required)
    }
  })

  it('keeps the Korean arbutin warning and sunscreen directions visible', () => {
    const text = JSON.stringify({
      centralRu: PRODUCT_42_RU_TRANSLATION,
      centralAr: PRODUCT_42_AR_TRANSLATION,
      bespokeRu: BLEMISH_BALM_COPY.ru,
      bespokeAr: BLEMISH_BALM_COPY.ar,
      routineRu: ruMessages.product.routineIntensiveBBDesc,
      routineAr: arMessages.product.routineIntensiveBBDesc,
    })

    expect(text).toContain('папул и лёгкого зуда')
    expect(text).toContain('حطاطات وحكة خفيفة')
    expect(text).toContain('за 15 минут')
    expect(text).toContain('قبل الخروج بـ15 دقيقة')
    expect(text).toContain('не реже чем каждые два часа')
    expect(text).toContain('كل ساعتين على الأقل')
    expect(text).toContain('после плавания')
    expect(text).toContain('بعد السباحة')
  })

  it('removes unsupported efficacy, audience and environmental claims', () => {
    const text = JSON.stringify({
      centralRu: PRODUCT_42_RU_TRANSLATION,
      centralAr: PRODUCT_42_AR_TRANSLATION,
      bespokeRu: BLEMISH_BALM_COPY.ru,
      bespokeAr: BLEMISH_BALM_COPY.ar,
      facts: PRODUCT_QUICK_FACTS_CATALOG['42'],
      routineRu: ruMessages.product.routineIntensiveBBDesc,
      routineAr: arMessages.product.routineIntensiveBBDesc,
    }).toLocaleLowerCase()

    for (const forbidden of [
      'для всех типов кожи',
      'لجميع أنواع البشرة',
      'безопасен для чувствительной кожи',
      'آمن للبشرة الحساسة',
      'зажив',
      'شفاء',
      'регенерац',
      'تجديد الخلايا',
      'глубокое проникновение',
      'اختراق عميق',
      'восстанавливает барьер',
      'يصلح حاجز البشرة',
      'лечит пигментацию',
      'يعالج التصبغ',
      'защита от загрязнений',
      'الحماية من التلوث',
      'широкий спектр',
      'واسع الطيف',
      '6 июня 2027',
      '6 يونيو 2027',
    ]) {
      expect(text).not.toContain(forbidden)
    }
  })
})
