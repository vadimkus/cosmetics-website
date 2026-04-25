'use client'

/**
 * HomeDesktopSections — sections rendered BELOW the hero on the homepage.
 *
 * Desktop-only. Mobile users are redirected to `/products` by `MobileRedirect`
 * already, but every section still opts in with `hidden md:block` so SSR /
 * crawlers see them and mobile flashes stay clean.
 *
 * Sections (top → bottom):
 *  1. Category rail           — 6 categories, image tile grid
 *  2. Shop-by-concern grid    — 8 concerns with emoji icon wells
 *  3. Featured products rail  — 4 up, real DB products
 *  4. Why GENOSYS 3-up        — brand credibility
 *  5. Newsletter CTA          — email capture (stubbed — no backend wiring yet)
 */

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowRight, Check, Sparkles, Mail, Lock } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { getLocalizedPath } from '@/lib/i18n'
import { CATEGORY_PAGES, CONCERN_PAGES } from '@/lib/concernsData'
import type { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { calculateDiscountedPrice, canUserSeePrices } from '@/lib/discountUtils'
import {
  IconClinical,
  IconOfficialDistributor,
  IconMadeInKorea,
} from '@/components/icons/BrandIcons'

interface HomeDesktopSectionsProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
  featuredProducts: Product[]
  /**
   * Map of category slug -> product image URL. Computed on the server against
   * the full catalog so every tile on the rail has real imagery, not just the
   * 4 categories that happen to be in featuredProducts.
   */
  categoryImages?: Record<string, string>
}

// Curated category slugs we want to surface on the homepage rail (6 tiles).
// Order is chosen so the rail tells the brand story: treatments → essentials.
const FEATURED_CATEGORY_SLUGS = [
  'microneedling',
  'pro-solution',
  'serum',
  'cream',
  'mask',
  'sun',
] as const

// Per-category backdrop tint for the product photograph. All tiles share a
// uniform warm-neutral card body; the tint is confined to a soft circular
// vignette behind the product so the rail still has a whisper of category
// colour without the old "pastel-grid" look.
const CATEGORY_ACCENTS: Record<string, string> = {
  microneedling: 'from-rose-100/70 to-rose-50/40',
  'pro-solution': 'from-violet-100/70 to-violet-50/40',
  serum: 'from-emerald-100/70 to-emerald-50/40',
  cream: 'from-amber-100/70 to-amber-50/40',
  mask: 'from-sky-100/70 to-sky-50/40',
  sun: 'from-orange-100/70 to-orange-50/40',
}

// One-line descriptors per category, keyed by locale. Short enough to fit
// beside the title in the 3-col rail without wrapping to 3 lines.
const CATEGORY_DESCRIPTORS: Record<string, { en: string; ar: string; ru: string }> = {
  microneedling: {
    en: 'In-clinic & at-home needling systems',
    ar: 'أنظمة الوخز بالإبر للعيادة والمنزل',
    ru: 'Системы микронидлинга — клиника и дом',
  },
  'pro-solution': {
    en: 'Ampoule concentrates used by dermatologists',
    ar: 'أمبولات مركّزة يستخدمها أطباء الجلدية',
    ru: 'Концентраты в ампулах для дерматологов',
  },
  serum: {
    en: 'Targeted concentrates for every concern',
    ar: 'تراكيز موجهة لكل مشكلة بشرة',
    ru: 'Сыворотки для конкретных задач кожи',
  },
  cream: {
    en: 'Daily moisturisers and barrier creams',
    ar: 'مرطبات يومية وكريمات حاجز البشرة',
    ru: 'Ежедневные кремы и барьерный уход',
  },
  mask: {
    en: 'Post-procedure and intensive treatment masks',
    ar: 'أقنعة ما بعد الإجراءات والعلاج المكثف',
    ru: 'Маски после процедур и интенсивный уход',
  },
  sun: {
    en: 'Broad-spectrum SPF for UAE climate',
    ar: 'حماية واسعة الطيف لمناخ الإمارات',
    ru: 'SPF широкого спектра для климата ОАЭ',
  },
}

// Concern card meta — short homepage label + 1-line symptom descriptor + a
// per-concern colour accent for the left edge bar. Replaces the old emoji
// well, which made every concern look the same. Colour is meaningful: warm
// tones for sun/acne/aging, cool tones for hydration/sensitivity, etc.
const CONCERN_META: Record<
  string,
  {
    accentBar: string
    accentText: string
    label: { en: string; ar: string; ru: string }
    symptoms: { en: string; ar: string; ru: string }
  }
> = {
  'sun-protection': {
    accentBar: 'bg-amber-400',
    accentText: 'text-amber-700',
    label: {
      en: 'Sun Protection',
      ar: 'الحماية من الشمس',
      ru: 'Защита от солнца',
    },
    symptoms: {
      en: 'UAE-grade SPF, BB cushion, daily UV defence',
      ar: 'حماية SPF بمستوى الإمارات، كوشن BB، دفاع يومي',
      ru: 'SPF для климата ОАЭ, BB-кушоны, дневная защита',
    },
  },
  'acne-treatment': {
    accentBar: 'bg-rose-400',
    accentText: 'text-rose-700',
    label: {
      en: 'Acne & Blemishes',
      ar: 'حب الشباب والشوائب',
      ru: 'Акне и воспаления',
    },
    symptoms: {
      en: 'Breakouts, oily skin, post-acne marks',
      ar: 'بثور، بشرة دهنية، آثار حب الشباب',
      ru: 'Высыпания, жирность, постакне',
    },
  },
  pigmentation: {
    accentBar: 'bg-violet-400',
    accentText: 'text-violet-700',
    label: {
      en: 'Pigmentation',
      ar: 'التصبغات',
      ru: 'Пигментация',
    },
    symptoms: {
      en: 'Dark spots, melasma, uneven tone',
      ar: 'بقع داكنة، كلف، لون غير موحد',
      ru: 'Тёмные пятна, мелазма, неровный тон',
    },
  },
  'scars-treatment': {
    accentBar: 'bg-teal-400',
    accentText: 'text-teal-700',
    label: {
      en: 'Scar Treatment',
      ar: 'علاج الندبات',
      ru: 'Лечение рубцов',
    },
    symptoms: {
      en: 'Acne scars, surgical scars, rough texture',
      ar: 'ندبات حب الشباب، الجراحة، ملمس خشن',
      ru: 'Постакне, послеоперационные, рельеф кожи',
    },
  },
  'hair-loss': {
    accentBar: 'bg-emerald-500',
    accentText: 'text-emerald-700',
    label: {
      en: 'Hair Loss',
      ar: 'تساقط الشعر',
      ru: 'Выпадение волос',
    },
    symptoms: {
      en: 'Thinning, shedding, scalp & follicle care',
      ar: 'ترقق، تساقط، العناية بفروة الرأس',
      ru: 'Редеющие волосы, уход за кожей головы',
    },
  },
  'anti-aging': {
    accentBar: 'bg-indigo-400',
    accentText: 'text-indigo-700',
    label: {
      en: 'Anti-Aging',
      ar: 'مكافحة الشيخوخة',
      ru: 'Anti-age',
    },
    symptoms: {
      en: 'Wrinkles, loss of firmness, dull tone',
      ar: 'تجاعيد، فقدان الثبات، بشرة باهتة',
      ru: 'Морщины, потеря упругости, тусклый цвет',
    },
  },
  hydration: {
    accentBar: 'bg-sky-400',
    accentText: 'text-sky-700',
    label: {
      en: 'Hydration',
      ar: 'الترطيب',
      ru: 'Увлажнение',
    },
    symptoms: {
      en: 'Dryness, dehydration, barrier repair',
      ar: 'جفاف، نقص ترطيب، إصلاح حاجز البشرة',
      ru: 'Сухость, обезвоженность, восстановление барьера',
    },
  },
  sensitivity: {
    accentBar: 'bg-lime-500',
    accentText: 'text-lime-700',
    label: {
      en: 'Sensitive Skin',
      ar: 'البشرة الحساسة',
      ru: 'Чувствительная кожа',
    },
    symptoms: {
      en: 'Redness, reactivity, soothing & calming',
      ar: 'احمرار، تفاعلية، تهدئة البشرة',
      ru: 'Покраснения, реактивность, успокаивающий уход',
    },
  },
}

function pickFirstImage(product: Product): string {
  if (product.images) {
    try {
      const arr = JSON.parse(product.images) as string[]
      if (Array.isArray(arr) && arr.length > 0 && arr[0]) return arr[0]
    } catch {
      /* noop */
    }
  }
  return product.image || '/images/placeholder.png'
}

export default function HomeDesktopSections({
  locale,
  dir,
  featuredProducts,
  categoryImages,
}: HomeDesktopSectionsProps) {
  const isRtl = dir === 'rtl'
  // Pricing on the bestsellers rail mirrors the site-wide auth-gated pattern:
  // guests see a "Login to see price" CTA, logged-in customers without pricing
  // permission see a lock, and approved customers see the price. Keeps the
  // homepage consistent with PDP / category page pricing rules.
  const { user } = useAuth()
  const userCanSeePrices = canUserSeePrices(user)

  // Map featured-category slugs to real CATEGORY_PAGES entries, preserving order.
  const featuredCategories = useMemo(
    () =>
      FEATURED_CATEGORY_SLUGS.map(slug =>
        CATEGORY_PAGES.find(c => c.slug === slug)
      ).filter((c): c is (typeof CATEGORY_PAGES)[number] => Boolean(c)),
    []
  )

  // For each category tile, prefer the server-computed map (covers all 6
  // categories from the full catalog). Fall back to featuredProducts in case
  // the server map was not provided.
  const categoryImageBySlug = useMemo(() => {
    const map: Record<string, string> = { ...(categoryImages ?? {}) }
    featuredCategories.forEach(cat => {
      if (map[cat.slug]) return
      const match = featuredProducts.find(p => {
        const productCat = p.category?.toLowerCase() ?? ''
        const categoryKey = cat.categoryKey.toLowerCase()
        return (
          productCat === cat.slug ||
          productCat === categoryKey ||
          // multi-category products like "Cushion BB, Sun, Cream" — substring
          productCat.includes(categoryKey)
        )
      })
      if (match) map[cat.slug] = pickFirstImage(match)
    })
    return map
  }, [featuredCategories, featuredProducts, categoryImages])

  return (
    <div className="hidden md:block" dir={dir}>
      {/* ── 1. Category rail ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                {locale === 'ar' ? 'تسوق حسب الفئة' : locale === 'ru' ? 'Категории' : 'Shop by category'}
              </p>
              <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                {locale === 'ar'
                  ? 'مجموعة GENOSYS الاحترافية'
                  : locale === 'ru'
                  ? 'Профессиональная коллекция GENOSYS'
                  : 'The GENOSYS professional range'}
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                {locale === 'ar'
                  ? 'من علاجات العيادة إلى العناية اليومية — مصنوعة في كوريا، معتمدة من الإمارات'
                  : locale === 'ru'
                  ? 'От клинических процедур до ежедневного ухода — сделано в Корее, сертифицировано в ОАЭ'
                  : 'From in-clinic treatments to everyday essentials — made in Korea, certified in the UAE.'}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {featuredCategories.map((cat, idx) => {
                const accent = CATEGORY_ACCENTS[cat.slug] ?? 'from-gray-100/70 to-gray-50/40'
                const imageSrc = categoryImageBySlug[cat.slug]
                const title =
                  locale === 'ar'
                    ? cat.seo.ar.h1
                    : locale === 'ru'
                    ? cat.seo.ru.h1
                    : cat.seo.en.h1
                const descriptor =
                  CATEGORY_DESCRIPTORS[cat.slug]?.[locale as 'en' | 'ar' | 'ru']
                const shopLabel =
                  locale === 'ar' ? 'تسوق' : locale === 'ru' ? 'Смотреть' : 'Shop'
                return (
                  <Link
                    key={cat.slug}
                    href={getLocalizedPath(`/products/category/${cat.slug}`, locale)}
                    className="group relative flex h-[220px] lg:h-[240px] overflow-hidden rounded-2xl bg-white border border-gray-200/80 shadow-[0_1px_2px_rgba(17,24,39,0.04)] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_16px_32px_-12px_rgba(17,24,39,0.15)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2"
                  >
                    {/* ── LEFT: copy (45%) ──────────────────────────── */}
                    <div className={`relative z-10 flex w-[45%] flex-col justify-between p-5 lg:p-6 ${isRtl ? 'text-right' : ''}`}>
                      <div>
                        <span className="font-mono text-[11px] tracking-[0.14em] text-gray-400">
                          {String(idx + 1).padStart(2, '0')} / {String(featuredCategories.length).padStart(2, '0')}
                        </span>
                        <h3 className="mt-3 text-[17px] lg:text-[19px] font-semibold text-gray-900 leading-[1.15] tracking-tight font-display">
                          {title}
                        </h3>
                        {descriptor && (
                          <p className="mt-2 text-[12px] lg:text-[13px] text-gray-500 leading-snug line-clamp-2">
                            {descriptor}
                          </p>
                        )}
                      </div>
                      <div className={`flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="relative pb-0.5 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gray-900 after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                          {shopLabel}
                        </span>
                        <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} aria-hidden="true" />
                      </div>
                    </div>

                    {/* ── RIGHT: image (55%) with soft tinted vignette ─ */}
                    <div className="relative w-[55%] overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} aria-hidden="true" />
                      <div
                        className="absolute inset-3 rounded-xl bg-white/60 backdrop-blur-[2px]"
                        aria-hidden="true"
                      />
                      {imageSrc && (
                        <div className="absolute inset-0 flex items-center justify-center p-4 lg:p-5">
                          <Image
                            src={imageSrc}
                            alt=""
                            width={320}
                            height={320}
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={getLocalizedPath('/products', locale)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded px-2 py-1"
              >
                {locale === 'ar' ? 'استعرض جميع المنتجات' : locale === 'ru' ? 'Посмотреть все продукты' : 'Browse all products'}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Shop by concern ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className={`mb-12 lg:mb-14 grid lg:grid-cols-12 gap-6 items-end ${isRtl ? 'text-right' : ''}`}>
              <div className="lg:col-span-7">
                <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-3">
                  {locale === 'ar' ? 'الحلول الموجهة' : locale === 'ru' ? 'Точечные решения' : 'Targeted solutions'}
                </p>
                <h2 className="text-3xl lg:text-[44px] lg:leading-[1.05] font-bold text-gray-900 font-display tracking-tight">
                  {locale === 'ar'
                    ? 'تسوق حسب مشكلة البشرة'
                    : locale === 'ru'
                    ? 'Подбор по задаче кожи'
                    : 'Shop by skin concern'}
                </h2>
              </div>
              <p className="lg:col-span-5 text-[15px] text-gray-600 leading-relaxed lg:max-w-md lg:ml-auto">
                {locale === 'ar'
                  ? 'اختر مخاوفك وسنوصلك إلى المنتجات والروتين المناسب لها — مدعوم بأبحاث GENOSYS العلمية.'
                  : locale === 'ru'
                  ? 'Выберите задачу — подберём продукты и пошаговый уход. Опираемся на клинические исследования GENOSYS.'
                  : 'Pick a concern and we\u2019ll route you to the right products and step-by-step routine — backed by GENOSYS clinical research.'}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {CONCERN_PAGES.map(concern => {
                const meta = CONCERN_META[concern.slug] ?? {
                  accentBar: 'bg-gray-300',
                  accentText: 'text-gray-700',
                  label: { en: '', ar: '', ru: '' },
                  symptoms: { en: '', ar: '', ru: '' },
                }
                const label =
                  meta.label[locale as 'en' | 'ar' | 'ru'] ||
                  (locale === 'ar' ? concern.seo.ar.h1 : locale === 'ru' ? concern.seo.ru.h1 : concern.seo.en.h1)
                const symptoms = meta.symptoms[locale as 'en' | 'ar' | 'ru'] || ''
                return (
                  <Link
                    key={concern.slug}
                    href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                    className={`group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 lg:p-6 min-h-[112px] lg:min-h-[128px] transition-all duration-300 hover:border-gray-300 hover:shadow-[0_10px_24px_-12px_rgba(17,24,39,0.18)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 ${isRtl ? 'text-right' : ''}`}
                  >
                    {/* Vertical color accent — per-concern, widens slightly on hover */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-0 bottom-0 w-1 ${meta.accentBar} transition-all duration-300 group-hover:w-1.5 ${isRtl ? 'right-0' : 'left-0'}`}
                    />
                    <div className={`flex items-start justify-between gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <h3 className="text-[15px] lg:text-[16px] font-semibold text-gray-900 tracking-tight leading-[1.25]">
                        {label}
                      </h3>
                      <ArrowRight
                        className={`h-4 w-4 flex-shrink-0 mt-0.5 text-gray-400 transition-all duration-300 group-hover:text-gray-900 group-hover:translate-x-0.5 ${isRtl ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`}
                        aria-hidden="true"
                      />
                    </div>
                    {symptoms && (
                      <p className="text-[12px] lg:text-[13px] text-gray-500 leading-snug line-clamp-2">
                        {symptoms}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={getLocalizedPath('/skin-recommendation', locale)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {locale === 'ar' ? 'ابدأ تحليل البشرة المجاني' : locale === 'ru' ? 'Бесплатный анализ кожи' : 'Start free skin analysis'}
              </Link>
              <p className="mt-3 text-[12px] text-gray-500">
                {locale === 'ar'
                  ? 'استبيان قصير من 4 أسئلة — يوصي بالمنتجات في 60 ثانية'
                  : locale === 'ru'
                  ? 'Короткая анкета из 4 вопросов — подбор за 60 секунд'
                  : '4 short questions · personalised routine in under a minute'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Featured products rail ───────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-16 lg:py-20 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className={`mb-10 flex items-end justify-between gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                    {locale === 'ar' ? 'المفضلة' : locale === 'ru' ? 'Избранное' : 'Bestsellers'}
                  </p>
                  <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                    {locale === 'ar' ? 'الأكثر مبيعاً هذا الموسم' : locale === 'ru' ? 'Хиты сезона' : 'What\u2019s popular right now'}
                  </h2>
                </div>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded px-1"
                >
                  {locale === 'ar' ? 'عرض الكل' : locale === 'ru' ? 'Все продукты' : 'View all'}
                  <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {featuredProducts.slice(0, 4).map(product => {
                  const imgSrc = pickFirstImage(product)
                  const name =
                    locale === 'ar' && product.nameAr
                      ? product.nameAr
                      : locale === 'ru' && product.nameRu
                      ? product.nameRu
                      : product.name
                  return (
                    <Link
                      key={product.id}
                      href={getLocalizedPath(`/products/${product.id}`, locale)}
                      className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <Image
                          src={imgSrc}
                          alt={name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          quality={80}
                        />
                        {product.inStock && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            {locale === 'ar' ? 'متوفر' : locale === 'ru' ? 'В наличии' : 'In stock'}
                          </span>
                        )}
                      </div>
                      <div className={`p-4 ${isRtl ? 'text-right' : ''}`}>
                        <p className="text-[10px] tracking-wide font-semibold text-gray-500 uppercase mb-1 line-clamp-1">
                          {product.category}
                        </p>
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">
                          {name}
                        </h3>
                        {/* Auth-gated price block — mirrors ProductCard/ProductPrice */}
                        {product.isPriceOnRequest ? (
                          <p className="text-sm font-semibold text-amber-600">
                            {locale === 'ar'
                              ? 'السعر عند الطلب'
                              : locale === 'ru'
                              ? 'Цена по запросу'
                              : 'Price on request'}
                          </p>
                        ) : userCanSeePrices ? (
                          (() => {
                            // Applies user-specific discount (Black Friday, tier-based,
                            // Beauty Box bundle) exactly like ProductCard/ProductPrice.
                            const pricing = calculateDiscountedPrice(product, user)
                            if (pricing.hasDiscount) {
                              return (
                                <div>
                                  <div className={`flex items-center gap-2 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-sm font-bold text-primary-600">
                                      AED {pricing.discountedPrice.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">
                                      AED {pricing.originalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                  <span className="mt-0.5 inline-block text-[10px] font-semibold text-green-600">
                                    {pricing.discountPercentage}%{' '}
                                    {locale === 'ar' ? 'خصم' : locale === 'ru' ? 'скидка' : 'off'}
                                  </span>
                                </div>
                              )
                            }
                            return (
                              <p className="text-sm font-semibold text-gray-900">
                                AED {pricing.originalPrice.toFixed(2)}
                              </p>
                            )
                          })()
                        ) : user ? (
                          <p className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                            {locale === 'ar'
                              ? 'السعر مقفل'
                              : locale === 'ru'
                              ? 'Цена заблокирована'
                              : 'Price locked'}
                          </p>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-full px-2.5 py-1 ${isRtl ? 'flex-row-reverse' : ''}`}
                          >
                            <Lock className="h-3 w-3" aria-hidden="true" />
                            {locale === 'ar'
                              ? 'سجّل الدخول لرؤية السعر'
                              : locale === 'ru'
                              ? 'Войдите, чтобы увидеть цену'
                              : 'Login to see price'}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Why GENOSYS 3-up ─────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className={`mb-12 lg:mb-14 grid lg:grid-cols-12 gap-6 items-end ${isRtl ? 'text-right' : ''}`}>
              <div className="lg:col-span-7">
                <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-3">
                  {locale === 'ar' ? 'لماذا GENOSYS' : locale === 'ru' ? 'Почему GENOSYS' : 'Why GENOSYS'}
                </p>
                <h2 className="text-3xl lg:text-[44px] lg:leading-[1.05] font-bold text-gray-900 font-display tracking-tight">
                  {locale === 'ar'
                    ? 'علم كوري. معتمد في الإمارات.'
                    : locale === 'ru'
                    ? 'Корейская наука. Сертифицировано в ОАЭ.'
                    : 'Korean science. Certified in the UAE.'}
                </h2>
              </div>
              <p className="lg:col-span-5 text-[15px] text-gray-600 leading-relaxed lg:max-w-md lg:ml-auto">
                {locale === 'ar'
                  ? 'GENOSYS هي علامة تجميل طبية كورية محترفة، نوزعها رسمياً في الإمارات منذ عام 2019.'
                  : locale === 'ru'
                  ? 'GENOSYS — профессиональная корейская дермакосметика. Мы официальный дистрибьютор в ОАЭ с 2019 года.'
                  : 'GENOSYS is a professional Korean dermacosmetics brand. We have been the official UAE distributor since 2019.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 border-y border-gray-200">
              {[
                {
                  icon: <IconClinical className="h-7 w-7" strokeWidth={1.5} />,
                  kicker: {
                    en: 'Clinical-grade',
                    ar: 'بدرجة سريرية',
                    ru: 'Клинический класс',
                  },
                  title: {
                    en: 'Used by dermatologists across Korea',
                    ar: 'يستخدمها أطباء الجلدية في كوريا',
                    ru: 'Применяется дерматологами в Корее',
                  },
                  body: {
                    en: 'The same formulas applied in Korean dermatology clinics — now available to UAE consumers and professionals.',
                    ar: 'نفس التركيبات المستخدمة في عيادات الجلدية الكورية — متاحة الآن للمستهلكين والمختصين في الإمارات.',
                    ru: 'Те же формулы, что применяются в дерматологических клиниках Кореи — теперь доступны в ОАЭ.',
                  },
                },
                {
                  icon: <IconOfficialDistributor className="h-7 w-7" strokeWidth={1.5} />,
                  kicker: {
                    en: 'In the UAE since 2019',
                    ar: 'في الإمارات منذ 2019',
                    ru: 'В ОАЭ с 2019',
                  },
                  title: {
                    en: 'Official UAE distributor',
                    ar: 'الموزع الرسمي في الإمارات',
                    ru: 'Официальный дистрибьютор в ОАЭ',
                  },
                  body: {
                    en: 'TDRA-licensed and VAT-registered. Every product is sourced directly from GENOSYS Korea — never gray-market.',
                    ar: 'مرخّص من TDRA ومسجّل للضريبة على القيمة المضافة. كل منتج موَرَّد مباشرة من GENOSYS كوريا — وليس من السوق الموازية.',
                    ru: 'Лицензия TDRA, регистрация НДС. Каждый продукт поставляется напрямую от GENOSYS Korea — никакого серого импорта.',
                  },
                },
                {
                  icon: <IconMadeInKorea className="h-7 w-7" strokeWidth={1.5} />,
                  kicker: {
                    en: 'Seoul, Korea',
                    ar: 'سيول، كوريا',
                    ru: 'Сеул, Корея',
                  },
                  title: {
                    en: 'Formulated and produced in GENOSYS labs',
                    ar: 'تركيب وإنتاج في مختبرات GENOSYS',
                    ru: 'Разработано и произведено в лабораториях GENOSYS',
                  },
                  body: {
                    en: 'Every product is made in our own Seoul facility, with R&D rooted in microneedling and growth-factor research.',
                    ar: 'كل منتج مصنوع في مصنعنا الخاص بسيول، مع بحث وتطوير متخصص في الوخز الدقيق وعوامل النمو.',
                    ru: 'Каждый продукт производится на собственной фабрике в Сеуле — исследования в области микронидлинга и факторов роста.',
                  },
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`group relative px-6 py-8 lg:px-8 lg:py-10 ${isRtl ? 'text-right' : ''}`}
                >
                  {/* Top accent rule that draws on hover */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-0 h-px w-12 bg-primary-600 scale-x-100 transition-transform duration-500 group-hover:scale-x-[5] ${
                      isRtl ? 'right-0 origin-right' : 'left-0 origin-left'
                    }`}
                  />
                  <div className="text-gray-900">
                    {item.icon}
                  </div>
                  <p className="mt-5 text-[11px] tracking-[0.18em] font-mono uppercase text-primary-600">
                    {item.kicker[locale] ?? item.kicker.en}
                  </p>
                  <h3 className="mt-2 text-[20px] lg:text-[22px] font-semibold text-gray-900 tracking-tight font-display leading-[1.2]">
                    {item.title[locale] ?? item.title.en}
                  </h3>
                  <p className="mt-3 text-[14px] text-gray-600 leading-relaxed max-w-sm">
                    {item.body[locale] ?? item.body.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Newsletter CTA (visual-only, no backend yet) ─────────────── */}
      <HomeNewsletter locale={locale} isRtl={isRtl} />
    </div>
  )
}

function HomeNewsletter({ locale, isRtl }: { locale: Locale; isRtl: boolean }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot — bots will fill this; real users won't see it
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const headline = locale === 'ar'
    ? 'انضم إلى عائلة GENOSYS'
    : locale === 'ru'
    ? 'Вступайте в сообщество GENOSYS'
    : 'Join the GENOSYS insiders'

  const description = locale === 'ar'
    ? 'نصائح من الخبراء، إطلاقات جديدة، وعروض حصرية — مباشرةً إلى بريدك الإلكتروني.'
    : locale === 'ru'
    ? 'Советы экспертов, новинки и эксклюзивные предложения — прямо на вашу почту.'
    : 'Expert tips, new launches, and exclusive offers — straight to your inbox.'

  const successMsg = locale === 'ar'
    ? 'شكراً لك! تحقق من بريدك الإلكتروني للتأكيد.'
    : locale === 'ru'
    ? 'Спасибо! Проверьте почту — мы отправили подтверждение.'
    : 'Thanks — check your inbox for a welcome email.'

  const genericError = locale === 'ar'
    ? 'تعذّر الاشتراك الآن. حاول مرة أخرى لاحقاً.'
    : locale === 'ru'
    ? 'Не удалось подписаться. Попробуйте позже.'
    : 'Could not subscribe right now. Please try again later.'

  const invalidEmailMsg = locale === 'ar'
    ? 'يرجى إدخال بريد إلكتروني صالح.'
    : locale === 'ru'
    ? 'Введите действительный email.'
    : 'Please enter a valid email address.'

  const rateLimitMsg = locale === 'ar'
    ? 'محاولات كثيرة. حاول بعد قليل.'
    : locale === 'ru'
    ? 'Слишком много попыток. Попробуйте позже.'
    : 'Too many attempts. Please try again in a few minutes.'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          locale,
          source: 'homepage',
          website, // honeypot; server silently accepts if filled
        }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        return
      }

      if (res.status === 429) {
        setStatus('error')
        setErrorMsg(rateLimitMsg)
        return
      }

      const data = await res.json().catch(() => null)
      setStatus('error')
      setErrorMsg(
        res.status === 400
          ? (typeof data?.error === 'string' ? data.error : invalidEmailMsg)
          : genericError
      )
    } catch {
      setStatus('error')
      setErrorMsg(genericError)
    }
  }

  return (
    <section className="bg-gray-900 text-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/10 mb-5">
            <Mail className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl lg:text-[36px] lg:leading-[1.1] font-bold font-display tracking-tight">
            {headline}
          </h2>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto text-sm lg:text-base">
            {description}
          </p>

          {status === 'success' ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-5 py-3">
              <Check className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-semibold">{successMsg}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={`mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto ${isRtl ? 'sm:flex-row-reverse' : ''}`}
            >
              <label htmlFor="home-newsletter-email" className="sr-only">
                {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email address'}
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={
                  locale === 'ar' ? 'أدخل بريدك الإلكتروني' : locale === 'ru' ? 'Введите email' : 'Enter your email'
                }
                className={`flex-1 min-w-0 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-60 ${isRtl ? 'text-right' : ''}`}
                autoComplete="email"
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'home-newsletter-error' : undefined}
              />

              {/* Honeypot — off-screen, hidden from a11y tree; only bots fill it. */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-5 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading'
                  ? (locale === 'ar' ? 'جارٍ الإرسال…' : locale === 'ru' ? 'Отправляем…' : 'Subscribing…')
                  : (locale === 'ar' ? 'اشترك' : locale === 'ru' ? 'Подписаться' : 'Subscribe')}
                {status !== 'loading' && (
                  <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p id="home-newsletter-error" className="mt-4 text-sm text-red-300" role="alert">
              {errorMsg || genericError}
            </p>
          )}

          <p className="mt-4 text-xs text-gray-400">
            {locale === 'ar'
              ? 'يمكنك إلغاء الاشتراك في أي وقت. نحن نحترم خصوصيتك.'
              : locale === 'ru'
              ? 'Можно отписаться в любой момент. Мы уважаем вашу приватность.'
              : 'Unsubscribe any time. We respect your privacy.'}
          </p>
        </div>
      </div>
    </section>
  )
}
