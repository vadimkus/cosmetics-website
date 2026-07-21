'use client'

import { useId, useMemo, useState } from 'react'
import {
  Check,
  ChevronDown,
  Droplets,
  FlaskConical,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
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
    eyebrow: 'Product snapshot',
    itemCount: (count: number) => `${count} useful details`,
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
    eyebrow: 'Краткий обзор',
    itemCount: (count: number) => `${count} полезных фактов`,
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
    eyebrow: 'نظرة سريعة',
    itemCount: (count: number) => `${count} معلومات مفيدة`,
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

function normalizeFactValue(value: string | undefined) {
  return (value || '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function benefitToFact(benefit: string): QuickFact {
  const match = benefit.match(/^(.+?)\s+[-–—:]\s+(.+)$/)
  if (!match) return { text: benefit.trim() }

  const [, title, text] = match
  return {
    ...(title?.trim() ? { title: title.trim() } : {}),
    text: text?.trim() || benefit.trim(),
  }
}

function uniqueFacts(facts: QuickFact[]) {
  const seenTitles = new Set<string>()
  const seenTexts = new Set<string>()

  return facts.filter(fact => {
    const titleKey = normalizeFactValue(fact.title)
    const textKey = normalizeFactValue(fact.text)
    if (!textKey) return false

    // Structured features, benefits and product details often repeat the same
    // claim with slightly different copy. A repeated heading or body is one
    // fact—not another card. Source order keeps the richer feature first.
    if (
      (titleKey && seenTitles.has(titleKey)) ||
      seenTexts.has(textKey)
    ) {
      return false
    }

    if (titleKey) seenTitles.add(titleKey)
    seenTexts.add(textKey)
    return true
  })
}

const factIcons = [
  Sparkles,
  Droplets,
  FlaskConical,
  PackageCheck,
  Ruler,
  Check,
] as const

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
  const triggerId = useId()
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
      // Include the full candidate list before the final six-card limit. If an
      // early benefit duplicates a feature, a later distinct benefit can take
      // its place instead of leaving the panel short.
      for (const benefit of benefits) {
        facts.push(benefitToFact(benefit))
      }
      for (const [title, value] of Object.entries(details)) {
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
      className={`relative max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}
      data-product-quick-facts={productKey}
      data-product-fact-count={content.facts.length}
    >
      <button
        id={triggerId}
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={showSales ? text.popularButton : text.button}
        className={`group flex min-h-16 w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-start shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          open
            ? 'border-primary-300 bg-gradient-to-r from-primary-50 via-white to-rose-50 shadow-md shadow-primary-100/60'
            : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md'
        } ${isRtl ? 'flex-row-reverse' : ''}`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-rose-600 text-white shadow-sm shadow-primary-200">
          {showSales ? (
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
            {text.eyebrow}
          </span>
          <span className="mt-0.5 block text-sm font-bold text-gray-950 md:text-base">
            {showSales ? text.popularButton : text.button}
          </span>
          <span className="mt-0.5 block truncate text-xs text-gray-500">
            {text.itemCount(content.facts.length)} · {content.productName}
          </span>
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-transform duration-300 group-hover:border-primary-200 group-hover:text-primary-600 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50/80 p-3 shadow-lg shadow-gray-200/50 md:p-4"
            dir={dir}
          >
            <div className={`mb-3 flex items-center gap-2 px-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
              <h3 className="text-sm font-bold text-gray-950 md:text-base">{text.title}</h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {content.facts.map((fact, index) => (
                <div
                  key={`${fact.title || 'fact'}-${index}`}
                  className="group/fact relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-3 transition-all duration-200 hover:border-primary-200 hover:shadow-sm"
                >
                  <div className={`flex items-start gap-2.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors group-hover/fact:bg-primary-100">
                      {(() => {
                        const FactIcon = factIcons[index % factIcons.length] ?? Sparkles
                        return <FactIcon className="h-4 w-4" aria-hidden="true" />
                      })()}
                    </span>
                    <div className="min-w-0">
                      {fact.title && (
                        <h4 className="text-xs font-bold leading-5 text-gray-950 md:text-sm">
                          {fact.title}
                        </h4>
                      )}
                      <p className={`${fact.title ? 'mt-0.5' : ''} text-xs leading-5 text-gray-600 md:text-sm`}>
                        {fact.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-3 flex items-center gap-2 rounded-xl bg-gray-100/80 px-3 py-2 text-xs text-gray-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <p>
                {text.source}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
