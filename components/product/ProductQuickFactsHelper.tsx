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
} from 'lucide-react'
import type { Product } from '@/types'
import { useTranslation } from '@/hooks/useTranslation'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import {
  getCatalogQuickFacts,
  type QuickFactLocale,
} from '@/lib/productQuickFactsCatalog'
import { isBeautyBoxProduct } from '@/lib/mobileDiscountRules'

type IngredientItem = {
  name?: string
  description?: string
}

type QuickFact = {
  title?: string
  text: string
}

const copy = {
  en: {
    button: 'Quick facts',
    title: 'Good to know',
    eyebrow: 'Product snapshot',
    itemCount: (count: number) => `${count} useful details`,
    sizeTitle: 'Format',
    shadeTitle: 'Selected shade',
    source: 'Official GENOSYS product formula.',
    boxSource: 'Verified GENOSYS box contents and pricing.',
    close: 'Close quick product facts',
  },
  ru: {
    button: 'Кратко о продукте',
    title: 'Полезно знать',
    eyebrow: 'Краткий обзор',
    itemCount: (count: number) => `${count} полезных фактов`,
    sizeTitle: 'Формат',
    shadeTitle: 'Выбранный оттенок',
    source: 'Официальная формула продукта GENOSYS.',
    boxSource: 'Проверенные состав и цена набора GENOSYS.',
    close: 'Закрыть краткую информацию',
  },
  ar: {
    button: 'حقائق سريعة عن المنتج',
    title: 'معلومات مفيدة',
    eyebrow: 'نظرة سريعة',
    itemCount: (count: number) => `${count} معلومات مفيدة`,
    sizeTitle: 'الحجم',
    shadeTitle: 'الدرجة المختارة',
    source: 'تركيبة منتج GENOSYS الرسمية.',
    boxSource: 'محتويات وأسعار مجموعة GENOSYS موثقة.',
    close: 'إغلاق الحقائق السريعة',
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

function normalizeFactValue(value: string | undefined) {
  return (value || '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function uniqueFacts(facts: QuickFact[]) {
  const seenTitles = new Set<string>()
  const seenTexts = new Set<string>()

  return facts.filter(fact => {
    const titleKey = normalizeFactValue(fact.title)
    const textKey = normalizeFactValue(fact.text)
    if (!textKey) return false

    if ((titleKey && seenTitles.has(titleKey)) || seenTexts.has(textKey)) {
      return false
    }

    if (titleKey) seenTitles.add(titleKey)
    seenTexts.add(textKey)
    return true
  })
}

function ingredientFacts(
  ingredients: IngredientItem[],
  locale: QuickFactLocale
): QuickFact[] {
  const facts: QuickFact[] = []
  for (const ingredient of ingredients) {
    const name = (ingredient.name || '').trim()
    const description = (ingredient.description || '').trim()
    if (!name && !description) continue
    if (name && description) {
      facts.push({ title: name, text: description })
    } else {
      facts.push({
        text:
          description ||
          (locale === 'ru'
            ? `Актив: ${name}`
            : locale === 'ar'
              ? `مكوّن فعّال: ${name}`
              : `Key active: ${name}`),
      })
    }
    if (facts.length >= 6) break
  }
  return facts
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
  unitsSold: _unitsSold = 0,
  selectedSize,
  selectedColor,
}: {
  product: Product
  /** Kept for call-site compatibility; sales proof is no longer shown here. */
  unitsSold?: number
  selectedSize?: string
  selectedColor?: string
}) {
  const { locale, dir } = useTranslation()
  const language: QuickFactLocale =
    locale === 'ar' ? 'ar' : locale === 'ru' ? 'ru' : 'en'
  const text = copy[language]
  const panelId = useId()
  const triggerId = useId()
  const [open, setOpen] = useState(false)
  const isRtl = dir === 'rtl'
  const productKey = product.productNumber || product.id
  const isBeautyBox = isBeautyBoxProduct(product)

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

    const catalogFacts = getCatalogQuickFacts(productKey, language)
    const facts: QuickFact[] = catalogFacts.map(fact => ({
      title: fact.title,
      text: fact.text,
    }))

    // Manual-sourced catalog first. If a SKU has no catalog yet, fall back to
    // ingredient actives — never recycle on-page benefits/keyFeatures copy.
    if (facts.length < 3) {
      const ingredients = parseArray<IngredientItem>(
        translations?.ingredients || product.ingredients
      )
      facts.push(...ingredientFacts(ingredients, language))
    }

    // Variant facts are useful for single products, but never for curated
    // Beauty Boxes. A box may contain a sized or coloured constituent and must
    // not inherit that constituent's option state as if it described the box.
    if (!isBeautyBox) {
      if (selectedColor) {
        facts.push({ title: text.shadeTitle, text: selectedColor })
      }
      const format = selectedSize || product.size
      if (format) {
        facts.push({ title: text.sizeTitle, text: format })
      }
    }

    return {
      productName,
      facts: uniqueFacts(facts).slice(0, 6),
    }
  }, [
    language,
    isBeautyBox,
    locale,
    product,
    productKey,
    selectedColor,
    selectedSize,
    text,
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
        aria-label={text.button}
        className={`group flex min-h-16 w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-start shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          open
            ? 'border-primary-300 bg-gradient-to-r from-primary-50 via-white to-rose-50 shadow-md shadow-primary-100/60'
            : 'border-[var(--color-border-primary)] bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md'
        } ${isRtl ? 'flex-row-reverse' : ''}`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-rose-600 text-white shadow-sm shadow-primary-200">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-primary-600">
            {text.eyebrow}
          </span>
          <span className="mt-0.5 block text-sm font-bold text-[var(--color-text-primary)] md:text-base">
            {text.button}
          </span>
          <span className="mt-0.5 block truncate text-xs text-[var(--color-text-tertiary)]">
            {text.itemCount(content.facts.length)} · {content.productName}
          </span>
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-primary)] bg-white text-[var(--color-text-secondary)] transition-transform duration-300 group-hover:border-primary-200 group-hover:text-primary-600 ${
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
            className="mt-2 overflow-hidden rounded-2xl border border-[var(--color-border-primary)] bg-gradient-to-b from-white to-gray-50/80 p-3 shadow-lg shadow-gray-200/50 md:p-4"
            dir={dir}
          >
            <div className={`mb-3 flex items-center gap-2 px-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] md:text-base">{text.title}</h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {content.facts.map((fact, index) => (
                <div
                  key={`${fact.title || 'fact'}-${index}`}
                  className="group/fact relative overflow-hidden rounded-xl border border-[var(--color-border-primary)]/80 bg-white p-3 transition-all duration-200 hover:border-primary-200 hover:shadow-sm"
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
                        <h4 className="text-xs font-bold leading-5 text-[var(--color-text-primary)] md:text-sm">
                          {fact.title}
                        </h4>
                      )}
                      <p className={`${fact.title ? 'mt-0.5' : ''} text-xs leading-5 text-[var(--color-text-secondary)] md:text-sm`}>
                        {fact.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-3 flex items-center gap-2 rounded-xl bg-[var(--color-bg-secondary)]/80 px-3 py-2 text-xs text-[var(--color-text-tertiary)] ${isRtl ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <p>{isBeautyBox ? text.boxSource : text.source}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
