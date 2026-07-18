'use client'

import { useId, useMemo, useState } from 'react'
import type { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import {
  UNITS_SOLD_DISPLAY_THRESHOLD,
  roundUnitsSold,
} from '@/lib/salesDisplay'

type FeatureItem = {
  title?: string
  description?: string
}

type QuickFact = {
  title?: string
  text: string
}

const copy = {
  en: {
    button: 'Quick product facts',
    popularButton: 'Quick facts',
    title: 'Good to know',
    salesTitle: 'Popular with customers',
    salesText: (count: string) => `${count}+ units sold through GENOSYS UAE`,
    sizeTitle: 'Format',
    shadeTitle: 'Selected shade',
    source: 'Based on official GENOSYS product information.',
    close: 'Close quick product facts',
    pdrnFacts: [
      { title: 'Verified PDRN level', text: 'Sodium DNA 1,000 ppm in the official formula.' },
      { title: 'Supporting actives', text: 'Niacinamide 2% and panthenol 1% support brightening, comfort and the skin barrier.' },
      { title: 'Practical format', text: '30 ready-to-use sheets with built-in tweezers.' },
    ],
  },
  ru: {
    button: 'Кратко о продукте',
    popularButton: 'Кратко о продукте',
    title: 'Полезно знать',
    salesTitle: 'Популярно у покупателей',
    salesText: (count: string) => `Более ${count} единиц продано через GENOSYS UAE`,
    sizeTitle: 'Формат',
    shadeTitle: 'Выбранный оттенок',
    source: 'На основе официальной информации GENOSYS.',
    close: 'Закрыть краткую информацию',
    pdrnFacts: [
      { title: 'Подтверждённый уровень PDRN', text: 'Sodium DNA 1 000 ppm в официальной формуле.' },
      { title: 'Дополнительные активы', text: 'Ниацинамид 2% и пантенол 1% поддерживают сияние, комфорт и кожный барьер.' },
      { title: 'Удобный формат', text: '30 готовых масок со встроенным пинцетом.' },
    ],
  },
  ar: {
    button: 'حقائق سريعة عن المنتج',
    popularButton: 'حقائق سريعة عن المنتج',
    title: 'معلومات مفيدة',
    salesTitle: 'شائع لدى العملاء',
    salesText: (count: string) => `تم بيع أكثر من ${count} وحدة عبر GENOSYS UAE`,
    sizeTitle: 'الحجم',
    shadeTitle: 'الدرجة المختارة',
    source: 'استناداً إلى معلومات GENOSYS الرسمية.',
    close: 'إغلاق الحقائق السريعة',
    pdrnFacts: [
      { title: 'مستوى PDRN موثّق', text: 'يحتوي على Sodium DNA بتركيز 1,000 ppm وفق التركيبة الرسمية.' },
      { title: 'مكونات فعالة داعمة', text: 'نياسيناميد 2% وبانثينول 1% لدعم الإشراقة والراحة وحاجز البشرة.' },
      { title: 'عبوة عملية', text: '30 ورقة جاهزة للاستخدام مع ملقط مدمج.' },
    ],
  },
} as const

function parseValue(value: string | null | undefined): unknown {
  if (!value) return null
  try {
    return JSON.parse(value) as unknown
  } catch {
    return null
  }
}

function parseArray<T>(value: string | null | undefined): T[] {
  const parsed = parseValue(value)
  return Array.isArray(parsed) ? (parsed as T[]) : []
}

function parseObject(value: string | null | undefined): Record<string, string> {
  const parsed = parseValue(value)
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? (parsed as Record<string, string>)
    : {}
}

function plainText(value: string | null | undefined) {
  return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function readableLabel(value: string) {
  const spaced = value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
  return spaced
    ? `${spaced.charAt(0).toLocaleUpperCase()}${spaced.slice(1)}`
    : value
}

function uniqueFacts(facts: QuickFact[]) {
  const seen = new Set<string>()
  return facts.filter(fact => {
    const key = `${fact.title || ''}:${fact.text}`.toLocaleLowerCase()
    if (!fact.text || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function ProductQuickFactsHelper({
  product,
  unitsSold = 0,
  selectedSize,
  selectedColor,
}: {
  product: Product
  unitsSold?: number
  selectedSize?: string
  selectedColor?: string
}) {
  const { locale, dir } = useTranslation()
  const language = locale === 'ar' ? 'ar' : locale === 'ru' ? 'ru' : 'en'
  const text = copy[language]
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const isRtl = dir === 'rtl'
  const productKey = product.productNumber || product.id
  const isPdrnMask = String(productKey) === '52'
  const showSales = unitsSold >= UNITS_SOLD_DISPLAY_THRESHOLD

  const content = useMemo(() => {
    const translations =
      locale === 'ar'
        ? getProductTranslations(productKey)
        : locale === 'ru'
          ? getProductTranslationsRu(productKey)
          : null
    const productName =
      locale === 'ar'
        ? product.nameAr || product.name
        : locale === 'ru'
          ? product.nameRu || product.name
          : product.name
    const details = parseObject(
      translations?.productDetails || product.productDetails
    )
    const features = parseArray<FeatureItem>(
      translations?.keyFeatures || product.keyFeatures
    )
    const benefits = parseArray<string>(
      translations?.benefits || product.benefits
    )
    const description = plainText(
      translations?.description ||
        (locale === 'ar'
          ? product.descriptionAr
          : locale === 'ru'
            ? product.descriptionRu
            : product.description) ||
        product.description
    )

    const facts: QuickFact[] = []
    if (showSales) {
      facts.push({
        title: text.salesTitle,
        text: text.salesText(roundUnitsSold(unitsSold).toLocaleString()),
      })
    }
    if (isPdrnMask) {
      facts.push(...text.pdrnFacts)
    } else {
      for (const feature of features.slice(0, 3)) {
        if (feature.description) {
          facts.push({
            ...(feature.title ? { title: feature.title } : {}),
            text: feature.description,
          })
        }
      }
      for (const benefit of benefits.slice(0, 3)) {
        facts.push({ text: benefit })
      }
      for (const [title, value] of Object.entries(details).slice(0, 4)) {
        facts.push({ title: readableLabel(title), text: String(value) })
      }
    }
    if (selectedColor) {
      facts.push({ title: text.shadeTitle, text: selectedColor })
    }
    const format = selectedSize || product.size
    if (format) {
      facts.push({ title: text.sizeTitle, text: format })
    }
    if (facts.length < 3 && description) {
      const sentences = description
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(Boolean)
      for (const sentence of sentences.slice(0, 3)) {
        facts.push({ text: sentence })
      }
    }

    return {
      productName,
      facts: uniqueFacts(facts).slice(0, 6),
    }
  }, [
    isPdrnMask,
    locale,
    product,
    productKey,
    selectedColor,
    selectedSize,
    showSales,
    text,
    unitsSold,
  ])

  return (
    <section
      className={`relative ${isRtl ? 'text-right' : 'text-left'}`}
      data-product-quick-facts={productKey}
      data-product-fact-count={content.facts.length}
    >
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`product-facts-trigger inline-flex min-h-[44px] items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:border-primary-300 hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${isRtl ? 'flex-row-reverse' : ''}`}
      >
        {showSales ? text.popularButton : text.button}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={text.title}
          className="product-facts-popover mt-3 max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
          dir={dir}
        >
          <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                {content.productName}
              </p>
              <h3 className="mt-1 text-lg font-bold text-gray-950">{text.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              aria-label={text.close}
            >
              ×
            </button>
          </div>

          <div className="mt-3 space-y-3 text-sm leading-6 text-gray-700">
            {content.facts.map((fact, index) => (
              <div key={`${fact.title || 'fact'}-${index}`}>
                {fact.title && (
                  <h4 className="font-semibold text-gray-950">{fact.title}</h4>
                )}
                <p>{fact.text}</p>
              </div>
            ))}
            <p className="border-t border-gray-200 pt-3 text-xs text-gray-500">
              {text.source}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
