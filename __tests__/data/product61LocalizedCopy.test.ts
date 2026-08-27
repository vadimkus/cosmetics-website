import {
  PRODUCT_61_AR_TRANSLATION,
  PRODUCT_61_RU_TRANSLATION,
} from '@/data/product61LocalizedCopy'
import { productTranslations } from '@/data/productTranslations'
import { productTranslationsRu } from '@/data/productTranslationsRu'
import { getScalpBrushCopy } from '@/components/product/scalpbrush/scalpBrushCopy'
import { getCatalogQuickFacts } from '@/lib/productQuickFactsCatalog'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

const unsupportedPositiveClaims = [
  /помога\w*.{0,40}(?:усилить|увеличить).{0,35}(?:кров|объ[её]м)/i,
  /более густ\w*.{0,10}пен|глубок\w*.{0,15}очищ/i,
  /удал\w*.{0,30}(?:отшелуш|остатк\w+ средств)/i,
  /(?:без царап|не царап|кажд\w*.{0,12}мыть|2\s*[ - -]\s*3 минут|300%)/i,
  /(?:улучш|усил).{0,30}(?:впитыв|проникнов)/i,
  /(?:يساعد|تساعد).{0,40}(?:زيادة|تحسين).{0,35}(?:تدفق الدم|حجم الشعر|الكثافة)/i,
  /رغوة أغنى|تنظيف أعمق|الخلايا الميتة|تراكم المنتجات|دون خدش/i,
  /كل غسلة|2\s*[ - -]\s*3 دقائق|300%/i,
  /(?:تحسين|تعزيز).{0,30}(?:الامتصاص|اختراق)/i,
]

describe('product 61 audited RU/AR copy', () => {
  it('feeds both translation maps from one canonical payload', () => {
    expect(productTranslationsRu['61']).toBe(PRODUCT_61_RU_TRANSLATION)
    expect(productTranslations['61']).toBe(PRODUCT_61_AR_TRANSLATION)
  })

  it('keeps only verified construction and wet-shampoo use facts', () => {
    const copy = JSON.stringify([
      PRODUCT_61_RU_TRANSLATION,
      PRODUCT_61_AR_TRANSLATION,
      getScalpBrushCopy('ru'),
      getScalpBrushCopy('ar'),
      getCatalogQuickFacts('61', 'ru'),
      getCatalogQuickFacts('61', 'ar'),
      ruMessages.product.routineScalpBrushDesc,
      arMessages.product.routineScalpBrushDesc,
    ])

    for (const value of [
      'Мягкий силикон',
      'سيليكون ناعم',
      'устойчивый центральный хват',
      'مقبض مركزي ثابت',
      'влажных волосах',
      'شعر مبلل',
      'контролируем',
      'متحكم',
    ]) {
      expect(copy).toContain(value)
    }
    for (const pattern of unsupportedPositiveClaims) expect(copy).not.toMatch(pattern)
  })

  it('keeps leave-on products outside brush use and gives conservative safety boundaries', () => {
    const copy = JSON.stringify([
      PRODUCT_61_RU_TRANSLATION,
      PRODUCT_61_AR_TRANSLATION,
      getScalpBrushCopy('ru'),
      getScalpBrushCopy('ar'),
    ])
    for (const value of [
      'не этой щёткой',
      'لا بهذه الفرشاة',
      'инфицирован',
      'مصابة بعدوى',
      'полностью высохнуть',
      'تجف تماماً',
      'срок замены',
      'موعداً زمنياً ثابتاً للاستبدال',
    ]) {
      expect(copy).toContain(value)
    }
  })

  it('does not invent origin, dimensions, tip count or a fixed replacement schedule', () => {
    const copy = JSON.stringify([
      PRODUCT_61_RU_TRANSLATION,
      PRODUCT_61_AR_TRANSLATION,
      getScalpBrushCopy('ru'),
      getScalpBrushCopy('ar'),
    ])
    expect(copy).not.toMatch(/Сделано в Корее|صنع في كوريا/)
    expect(copy).toContain('не указаны в доступном руководстве')
    expect(copy).toContain('لا يحدد الدليل المتاح')
  })
})
