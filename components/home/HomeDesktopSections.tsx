'use client'

/**
 * HomeDesktopSections — sections rendered BELOW the hero on the homepage.
 *
 * Mobile users are redirected to `/products` by `MobileRedirect` unless they
 * explicitly open `?full=true` from the Home menu. Sections therefore remain
 * responsive so that opt-in full-home experience works at every viewport.
 *
 * Sections (top → bottom):
 *  1. Bestsellers rail        — 4 up, real sales data (units sold, 180d)
 *  2. New arrivals rail       — newest products (≤120d old), aids indexing too
 *  3. Category rail           — 6 categories, image tile grid + product counts
 *  4. Shop-by-concern grid    — 8 concerns + product counts + analysis CTA
 *  5. Why GENOSYS 3-up        — brand credibility
 *  6. Newsletter CTA          — email capture → /api/newsletter/subscribe (live)
 */

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import HomeScrollReveals from '@/components/home/HomeScrollRevealsV2'
import {
  ArrowRight,
  Check,
  Mail,
  Lock,
} from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { getLocalizedPath } from '@/lib/i18n'
import { useTranslation } from '@/hooks/useTranslation'
import { translateCategory } from '@/utils/categoryTranslations'
import { CATEGORY_PAGES } from '@/lib/concernsData'
import SkinConcernSection from '@/components/home/SkinConcernSection'
import WhyGenosysSection from '@/components/home/WhyGenosysSection'
import type { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'

interface HomeDesktopSectionsProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
  featuredProducts: Product[]
  /** Newest products (added recently), rendered as a "New arrivals" rail. */
  newArrivals?: Product[]
  /**
   * Map of category slug -> product image URL. Computed on the server against
   * the full catalog so every tile on the rail has real imagery, not just the
   * 4 categories that happen to be in featuredProducts.
   */
  categoryImages?: Record<string, string>
  /** Visible product count per homepage category slug (server-computed). */
  categoryCounts?: Record<string, number>
  /** Visible product count per concern slug (server-computed). */
  concernCounts?: Record<string, number>
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

// One-line descriptors per category, keyed by locale. Short enough to fit
// beside the title in the 3-col rail without wrapping to 3 lines.
const CATEGORY_DESCRIPTORS: Record<string, { en: string; ar: string; ru: string }> = {
  microneedling: {
    en: 'In-clinic & at-home needling systems',
    ar: 'رولرات الميكرونيدلينغ للعيادة والمنزل',
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

// Homepage category tiles are intentionally shorter than SEO H1s. The SEO
// labels are descriptive, but Russian versions are too long for the compact
// desktop rail and can collide with the supporting copy.
const CATEGORY_RAIL_TITLES: Record<string, { en: string; ar: string; ru: string }> = {
  microneedling: {
    en: 'Microneedling systems',
    ar: 'رولرات الميكرونيدلينغ',
    ru: 'Ролики для микронидлинга',
  },
  'pro-solution': {
    en: 'PRO Solution serums',
    ar: 'سيرومات PRO Solution',
    ru: 'Сыворотки PRO Solution',
  },
  serum: {
    en: 'Professional face serums',
    ar: 'سيرومات احترافية',
    ru: 'Сыворотки для лица',
  },
  cream: {
    en: 'Professional face creams',
    ar: 'كريمات احترافية',
    ru: 'Кремы для лица',
  },
  mask: {
    en: 'Professional face masks',
    ar: 'ماسكات احترافية',
    ru: 'Маски для лица',
  },
  sun: {
    en: 'Sun protection creams',
    ar: 'كريمات الوقاية من الشمس',
    ru: 'SPF-кремы',
  },
}

// Localized "N products" label with correct Russian plural forms.
function formatProductCount(count: number, locale: Locale): string {
  if (locale === 'ar') return `${count} منتج`
  if (locale === 'ru') {
    const mod10 = count % 10
    const mod100 = count % 100
    const word =
      mod10 === 1 && mod100 !== 11
        ? 'продукт'
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? 'продукта'
        : 'продуктов'
    return `${count} ${word}`
  }
  return `${count} ${count === 1 ? 'product' : 'products'}`
}

function pickFirstImage(product: Product): string {
  // The main `image` field is the curated hero shot — always prefer it over
  // the gallery, whose first entry is often an infographic or box shot.
  if (product.image) return product.image
  if (product.images) {
    try {
      const arr = JSON.parse(product.images) as string[]
      if (Array.isArray(arr) && arr.length > 0 && arr[0]) return arr[0]
    } catch {
      /* noop */
    }
  }
  return '/images/placeholder.png'
}

/**
 * Product card shared by the Bestsellers and New Arrivals rails.
 * Auth-gated pricing mirrors ProductCard/ProductPrice site-wide rules.
 */
function RailProductCard({
  product,
  locale,
  isRtl,
  user,
  userCanSeePrices,
  badge,
}: {
  product: Product
  locale: Locale
  isRtl: boolean
  user: ReturnType<typeof useAuth>['user']
  userCanSeePrices: boolean
  badge: 'inStock' | 'new'
}) {
  const imgSrc = pickFirstImage(product)
  const { messages } = useTranslation()
  // Product names are never translated (brand identity) — English everywhere.
  // Categories ARE translated (they're UI labels, not brand names).
  const name = product.name
  const categoryLabel = translateCategory(product.category, messages)
  return (
    <Link
      href={getLocalizedPath(`/products/${product.productNumber || product.id}`, locale)}
      className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square bg-white overflow-hidden">
        <Image
          src={imgSrc}
          alt={name}
          width={400}
          height={400}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 400px"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          quality={80}
        />
        {/* Badges live on the category line below, never over the image —
            the studio-style product shots must stay clean. */}
      </div>
      <div className={`p-4 ${isRtl ? 'text-right' : ''}`}>
        <p className={`flex items-center gap-2 mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {badge === 'new' ? (
            <span className="inline-flex items-center rounded-full bg-gray-900 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
              {locale === 'ar' ? 'جديد' : locale === 'ru' ? 'Новинка' : 'New'}
            </span>
          ) : (
            product.inStock && (
              <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {locale === 'ar' ? 'متوفر' : locale === 'ru' ? 'В наличии' : 'In stock'}
              </span>
            )
          )}
          <span className="text-[10px] tracking-wide font-semibold text-gray-500 uppercase line-clamp-1">
            {categoryLabel}
          </span>
        </p>
        <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">
          {name}
        </h3>
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
            const pricing = getPricingDisplay(product, user)
            if (pricing.hasDiscount) {
              return (
                <div>
                  <div className={`flex items-center gap-2 flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-bold text-primary-600">
                      AED {pricing.displayPrice.toFixed(2)}
                    </span>
                    {pricing.originalPrice ? (
                      <span className="text-xs text-gray-500 line-through">
                        AED {pricing.originalPrice.toFixed(2)}
                      </span>
                    ) : null}
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
                AED {pricing.displayPrice.toFixed(2)}
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
}

export default function HomeDesktopSections({
  locale,
  dir,
  featuredProducts,
  newArrivals,
  categoryImages,
  categoryCounts,
  concernCounts,
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
    <div className="block" dir={dir} data-home-reveals>
      <HomeScrollReveals />
      {/* ── 1. Bestsellers rail — driven by real sales data (homeData) ───── */}
      {featuredProducts.length > 0 && (
        <section className="reveal-on-view bg-white py-16 lg:py-20 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className={`mb-10 flex items-end justify-between gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                    {locale === 'ar' ? 'الأكثر مبيعاً' : locale === 'ru' ? 'Бестселлеры' : 'Bestsellers'}
                  </p>
                  <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                    {locale === 'ar' ? 'الأكثر مبيعاً هذا الموسم' : locale === 'ru' ? 'Хиты продаж' : 'What\u2019s popular right now'}
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
                {featuredProducts.slice(0, 4).map(product => (
                  <RailProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    isRtl={isRtl}
                    user={user}
                    userCanSeePrices={userCanSeePrices}
                    badge="inStock"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. New arrivals rail — newest products, also feeds Google fresh
             internal links so new PDPs get crawled and indexed quickly ───── */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="reveal-on-view bg-gray-50 py-16 lg:py-20 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className={`mb-10 flex items-end justify-between gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                    {locale === 'ar' ? 'وصل حديثاً' : locale === 'ru' ? 'Новинки' : 'Just landed'}
                  </p>
                  <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                    {locale === 'ar'
                      ? 'أحدث منتجات GENOSYS'
                      : locale === 'ru'
                      ? 'Последние поступления GENOSYS'
                      : 'New arrivals from GENOSYS Korea'}
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
                {newArrivals.slice(0, 4).map(product => (
                  <RailProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    isRtl={isRtl}
                    user={user}
                    userCanSeePrices={userCanSeePrices}
                    badge="new"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Category rail ─────────────────────────────────────────────── */}
      <section className="reveal-on-view border-t border-gray-100 bg-white py-16 lg:py-20">
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
                  ? 'من بروتوكولات العيادة إلى العناية اليومية — مصنوعة في كوريا ومعتمدة في الإمارات'
                  : locale === 'ru'
                  ? 'От клинических процедур до ежедневного ухода — сделано в Корее, сертифицировано в ОАЭ'
                  : 'From in-clinic treatments to everyday essentials — made in Korea, certified in the UAE.'}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {featuredCategories.map((cat, idx) => {
                const imageSrc = categoryImageBySlug[cat.slug]
                const count = categoryCounts?.[cat.slug]
                const title =
                  CATEGORY_RAIL_TITLES[cat.slug]?.[locale as 'en' | 'ar' | 'ru'] ??
                  (locale === 'ar'
                    ? cat.seo.ar.h1
                    : locale === 'ru'
                    ? cat.seo.ru.h1
                    : cat.seo.en.h1)
                const descriptor =
                  CATEGORY_DESCRIPTORS[cat.slug]?.[locale as 'en' | 'ar' | 'ru']
                const shopLabel =
                  locale === 'ar' ? 'تسوق' : locale === 'ru' ? 'Смотреть' : 'Shop'
                return (
                  <Link
                    key={cat.slug}
                    href={getLocalizedPath(`/products/category/${cat.slug}`, locale)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2"
                  >
                    {/* Product image on a neutral well — same treatment as product cards */}
                    <div className="relative h-[170px] lg:h-[190px] bg-gray-50 overflow-hidden">
                      {imageSrc && (
                        <div className="absolute inset-0 flex items-center justify-center p-5">
                          <Image
                            src={imageSrc}
                            alt=""
                            width={320}
                            height={320}
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 30vw, 320px"
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                      <span
                        className={`absolute top-3 font-mono text-[11px] tracking-[0.14em] text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`}
                        aria-hidden="true"
                      >
                        {String(idx + 1).padStart(2, '0')} / {String(featuredCategories.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Copy */}
                    <div className={`flex flex-1 flex-col p-5 ${isRtl ? 'text-right' : ''}`}>
                      <h3 className="text-[16px] lg:text-[17px] font-semibold text-gray-900 leading-snug tracking-tight font-display">
                        {title}
                      </h3>
                      {descriptor && (
                        <p className="mt-1.5 text-[12px] lg:text-[13px] text-gray-500 leading-snug line-clamp-2">
                          {descriptor}
                        </p>
                      )}
                      <div className={`mt-auto flex items-center justify-between gap-3 pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        {typeof count === 'number' && count > 0 ? (
                          <span className="text-[12px] text-gray-500">
                            {formatProductCount(count, locale)}
                          </span>
                        ) : (
                          <span aria-hidden="true" />
                        )}
                        <span className={`flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 transition-colors group-hover:text-primary-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                          {shopLabel}
                          <ArrowRight className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} aria-hidden="true" />
                        </span>
                      </div>
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

      {/* ── 4. Shop by concern ──────────────────────────────────────────── */}
      <SkinConcernSection locale={locale} dir={dir} concernCounts={concernCounts} />

      {/* ── 5. Why GENOSYS ───────────────────────────────────────────────── */}
      <WhyGenosysSection locale={locale} dir={dir} />

      {/* ── 6. Newsletter CTA ───────────────────────────────────────────── */}
      <HomeNewsletter locale={locale} isRtl={isRtl} />
    </div>
  )
}

function HomeNewsletter({ locale, isRtl }: { locale: Locale; isRtl: boolean }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot — bots will fill this; real users won't see it
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const headline = locale === 'ar'
    ? 'انضم إلى عائلة GENOSYS'
    : locale === 'ru'
    ? 'Вступайте в сообщество GENOSYS'
    : 'Join the GENOSYS insiders'

  const description = locale === 'ar'
    ? 'بريد إلكتروني واحد شهرياً. أدلة العناية بالبشرة من المتخصصين، الإطلاقات الجديدة، وعروض حصرية للمشتركين — من فريقنا في دبي.'
    : locale === 'ru'
    ? 'Одно письмо в месяц. Советы от специалистов по уходу, новинки и эксклюзивные предложения для подписчиков — от нашей команды в Дубае.'
    : 'One email a month. Skincare guides written by clinicians, new product launches, and subscriber-only offers — from our Dubai team.'

  const kicker = locale === 'ar'
    ? 'النشرة البريدية · رسالة واحدة شهرياً'
    : locale === 'ru'
    ? 'Рассылка · 1 письмо в месяц'
    : 'Newsletter · 1 email per month'

  const benefitsTitle = locale === 'ar'
    ? 'ماذا ستحصل عليه'
    : locale === 'ru'
    ? 'Что вы получите'
    : 'What you\u2019ll get'

  const benefits = locale === 'ar'
    ? [
        'إطلاقات المنتجات الجديدة أولاً',
        'أدلة العناية بالبشرة من المختصين',
        'عروض حصرية للمشتركين',
        'وصول مبكر لفعاليات العيادة في دبي',
      ]
    : locale === 'ru'
    ? [
        'Новинки раньше, чем в магазинах',
        'Советы по уходу от специалистов',
        'Эксклюзивные акции для подписчиков',
        'Ранний доступ к событиям клиники в Дубае',
      ]
    : [
        'New product launches before anyone else',
        'Skincare guides from K-beauty clinicians',
        'Subscriber-only promos & bundles',
        'Early access to clinic events in Dubai',
      ]

  const successMsg = locale === 'ar'
    ? 'شكراً لك! تحقق من بريدك الإلكتروني للتأكيد.'
    : locale === 'ru'
    ? 'Спасибо! Проверьте почту — мы отправили подтверждение.'
    : 'Thanks — check your inbox for a welcome email.'

  const alreadySubscribedMsg = locale === 'ar'
    ? 'أنت مشترك بالفعل. إذا لم تجد رسالة الترحيب، تحقق من البريد غير المرغوب أو العروض الترويجية.'
    : locale === 'ru'
    ? 'Вы уже подписаны. Если письма нет, проверьте папки «Спам» и «Промоакции».'
    : 'You’re already on the list. If you missed the welcome email, check Spam or Promotions.'

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

      const data = await res.json().catch(() => null)

      if (res.ok) {
        setStatus(data?.alreadySubscribed === true ? 'already' : 'success')
        setEmail('')
        return
      }

      if (res.status === 429) {
        setStatus('error')
        setErrorMsg(rateLimitMsg)
        return
      }

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
    <section className="reveal-on-view relative overflow-hidden bg-gray-950 text-white py-20 lg:py-28">
      {/* Subtle radial highlight + grain to add depth to the dark band */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(180, 70, 100, 0.22), rgba(2, 6, 23, 0) 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-start ${isRtl ? 'text-right' : ''}`}>
            {/* ── LEFT: kicker, headline, copy, form ─────────────────────── */}
            <div className="lg:col-span-7">
              <div className={`inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-gray-400 mb-5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span aria-hidden="true" className="h-px w-8 bg-gray-600" />
                {kicker}
              </div>
              <h2 className="text-3xl lg:text-[44px] lg:leading-[1.05] font-bold font-display tracking-tight">
                {headline}
              </h2>
              <p className="mt-4 text-gray-300 text-[15px] lg:text-base leading-relaxed max-w-lg">
                {description}
              </p>

              {status === 'success' || status === 'already' ? (
                <div className={`mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-5 py-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    {status === 'already' ? alreadySubscribedMsg : successMsg}
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className={`mt-8 max-w-lg ${isRtl ? '' : ''}`}
                >
                  <label htmlFor="home-newsletter-email" className="sr-only">
                    {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email address'}
                  </label>
                  {/* Unified pill: input flows into the button. White ring on focus, soft border at rest. */}
                  <div className={`flex items-center gap-1 p-1 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-sm transition-colors focus-within:bg-white/[0.1] focus-within:border-white/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <input
                      id="home-newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={
                        locale === 'ar' ? 'أدخل بريدك الإلكتروني' : locale === 'ru' ? 'Введите email' : 'Enter your email'
                      }
                      className={`flex-1 min-w-0 bg-transparent border-0 px-5 py-2.5 text-sm text-white placeholder:text-gray-400 focus:outline-none disabled:opacity-60 ${isRtl ? 'text-right' : ''}`}
                      autoComplete="email"
                      disabled={status === 'loading'}
                      aria-invalid={status === 'error'}
                      aria-describedby={status === 'error' ? 'home-newsletter-error' : undefined}
                    />

                    {/* Honeypot — hidden from a11y tree; only bots fill it. */}
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
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-gray-900 px-6 py-2.5 font-semibold text-sm hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {status === 'loading'
                        ? (locale === 'ar' ? 'جارٍ الإرسال…' : locale === 'ru' ? 'Отправляем…' : 'Subscribing…')
                        : (locale === 'ar' ? 'اشترك' : locale === 'ru' ? 'Подписаться' : 'Subscribe')}
                      {status !== 'loading' && (
                        <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </form>
              )}

              {status === 'error' && (
                <p id="home-newsletter-error" className="mt-4 text-sm text-red-300" role="alert">
                  {errorMsg || genericError}
                </p>
              )}

              <p className={`mt-4 text-xs text-gray-500 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Check className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                {locale === 'ar'
                  ? 'إلغاء الاشتراك بنقرة واحدة. نحن نحترم خصوصيتك.'
                  : locale === 'ru'
                  ? 'Отписка в один клик. Мы уважаем вашу приватность.'
                  : 'Unsubscribe in one click. We respect your privacy.'}
              </p>
            </div>

            {/* ── RIGHT: benefits card ──────────────────────────────────── */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 lg:p-8">
                <div className={`flex items-center gap-3 mb-5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 border border-white/15">
                    <Mail className="h-4 w-4 text-white" aria-hidden="true" />
                  </span>
                  <p className="text-[11px] font-mono tracking-[0.18em] uppercase text-gray-400">
                    {benefitsTitle}
                  </p>
                </div>
                <ul className="space-y-3">
                  {benefits.map(benefit => (
                    <li
                      key={benefit}
                      className={`flex items-start gap-3 text-[14px] text-gray-200 leading-relaxed ${isRtl ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-400" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Frequency promise — handles the #1 objection */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <p className={`text-[12px] text-gray-400 leading-relaxed ${isRtl ? 'text-right' : ''}`}>
                    {locale === 'ar'
                      ? 'نرسل بريداً إلكترونياً واحداً في الشهر فقط — لا رسائل غير مرغوب فيها، ولا مشاركة بياناتك مع أي طرف ثالث.'
                      : locale === 'ru'
                      ? 'Только одно письмо в месяц. Без спама. Не передаём ваши данные третьим лицам.'
                      : 'One email a month. No spam. We never share your data with third parties.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
