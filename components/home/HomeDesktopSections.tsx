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
 *
 * Reworked onto the editorial system in Aug 2026. Before that these six
 * sections carried three serif stacks (Georgia inline, Times New Roman inline
 * and font-display), five accent colours and four different creams between
 * them; the palette now comes from editorial.css and the page-specific pieces
 * from home.css.
 */

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'
import './home.css'

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
import { formatProductDisplayName } from '@/utils/formatProductDisplayName'
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

// Curated editorial artwork for the six professional-range tiles. These are
// intentionally category compositions, not whichever product happens to be
// first in the catalog.
const CATEGORY_RAIL_IMAGES: Record<string, string> = {
  microneedling: '/images/prof_range/microneedling.jpeg',
  'pro-solution': '/images/prof_range/pro_solutions.jpeg',
  serum: '/images/prof_range/prof_face_serums.jpeg',
  cream: '/images/prof_range/prof_face_creams.jpeg',
  mask: '/images/prof_range/prof_face_masks.jpeg',
  sun: '/images/prof_range/prof_sun.jpeg',
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
  const displayName = formatProductDisplayName(name)
  const isBeautyBoxTitle = /Beauty\s+Box$/i.test(name)
  const categoryLabel = translateCategory(product.category, messages)
  return (
    <Link
      href={getLocalizedPath(`/products/${product.productNumber || product.id}`, locale)}
      className="home-product-card group block"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={imgSrc}
          alt={name}
          width={400}
          height={400}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 400px"
          className="home-tile__image h-full w-full object-contain"
          quality={80}
        />
        {/* Badges live on the category line below, never over the image —
            the studio-style product shots must stay clean. */}
      </div>
      <div className={`p-4 ${isRtl ? 'text-right' : ''}`}>
        <p className={`mb-2 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {badge === 'new' ? (
            <span className="inline-flex items-center rounded-full bg-[var(--cera-ink)] px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-white">
              {locale === 'ar' ? 'جديد' : locale === 'ru' ? 'Новинка' : 'New'}
            </span>
          ) : (
            product.inStock && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--cera-line)] bg-white px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[var(--cera-muted)] ${
                  isRtl ? 'flex-row-reverse' : ''
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {locale === 'ar' ? 'متوفر' : locale === 'ru' ? 'В наличии' : 'In stock'}
              </span>
            )
          )}
          <span className="line-clamp-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--cera-muted)]">
            {categoryLabel}
          </span>
        </p>
        <h3
          className={`cera-serif mb-2 text-[16px] leading-tight text-[var(--cera-ink)] transition-colors group-hover:text-[var(--cera-rose-ink)] lg:text-[18px] ${
            isBeautyBoxTitle ? '' : 'line-clamp-2'
          }`}
        >
          {displayName}
        </h3>
        {product.isPriceOnRequest ? (
          <p className="text-[13.5px] font-semibold text-[var(--cera-rose-ink)]">
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
                  <div className={`flex flex-wrap items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="cera-numeral text-[16px] text-[var(--cera-ink)]">
                      {pricing.displayPrice.toFixed(2)}
                      <span className="ms-1 text-[11px] text-[var(--cera-muted)]">AED</span>
                    </span>
                    {pricing.originalPrice ? (
                      <span className="text-[12px] tabular-nums text-[var(--cera-muted)] line-through">
                        {pricing.originalPrice.toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                  {/* Green is the one colour kept off the palette here: a saving
                      is information, not decoration, the same call /orders made
                      for its status badges. */}
                  <span dir="ltr" className="mt-1 inline-block text-[10.5px] font-semibold text-emerald-700">
                    −{pricing.discountPercentage}%{' '}
                    {locale === 'ar' ? 'خصم' : locale === 'ru' ? 'скидка' : 'off'}
                  </span>
                </div>
              )
            }
            return (
              <p className="cera-numeral text-[16px] text-[var(--cera-ink)]">
                {pricing.displayPrice.toFixed(2)}
                <span className="ms-1 text-[11px] text-[var(--cera-muted)]">AED</span>
              </p>
            )
          })()
        ) : user ? (
          <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cera-muted)]">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            {locale === 'ar'
              ? 'السعر مقفل'
              : locale === 'ru'
              ? 'Цена заблокирована'
              : 'Price locked'}
          </p>
        ) : (
          <span className={`ed-pill ed-pill--accent ${isRtl ? 'flex-row-reverse' : ''}`}>
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

  // Always prefer the curated professional-range compositions. Keep the
  // server/fallback map as a defensive fallback if a category is added later.
  const categoryImageBySlug = useMemo(() => {
    const map: Record<string, string> = {
      ...(categoryImages ?? {}),
      ...CATEGORY_RAIL_IMAGES,
    }
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
        <section className="reveal-on-view home-band home-band--white px-4">
          <div className="mx-auto max-w-[1200px]">
            <div className={`mb-9 flex items-end justify-between gap-4 lg:mb-11 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={isRtl ? 'text-right' : ''}>
                <p className="cera-eyebrow mb-2.5">
                  {locale === 'ar' ? 'الأكثر مبيعاً' : locale === 'ru' ? 'Бестселлеры' : 'Bestsellers'}
                </p>
                <h2 className="cera-serif text-[30px] leading-[1.08] sm:text-[38px] lg:text-[44px]">
                  {locale === 'ar' ? 'الأكثر مبيعاً هذا الموسم' : locale === 'ru' ? 'Хиты продаж' : 'What\u2019s popular right now'}
                </h2>
              </div>
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`hidden items-center gap-1.5 text-[14px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 lg:inline-flex ${
                  isRtl ? 'flex-row-reverse' : ''
                }`}
              >
                {locale === 'ar' ? 'عرض الكل' : locale === 'ru' ? 'Все продукты' : 'View all'}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
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
        </section>
      )}

      {/* ── 2. New arrivals rail — newest products, also feeds Google fresh
             internal links so new PDPs get crawled and indexed quickly ───── */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="reveal-on-view home-band px-4">
          <div className="mx-auto max-w-[1200px]">
            <div className={`mb-9 flex items-end justify-between gap-4 lg:mb-11 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={isRtl ? 'text-right' : ''}>
                <p className="cera-eyebrow mb-2.5">
                  {locale === 'ar' ? 'وصل حديثاً' : locale === 'ru' ? 'Новинки' : 'Just landed'}
                </p>
                <h2 className="cera-serif text-[30px] leading-[1.08] sm:text-[38px] lg:text-[44px]">
                  {locale === 'ar'
                    ? 'أحدث منتجات GENOSYS'
                    : locale === 'ru'
                    ? 'Последние поступления GENOSYS'
                    : 'New arrivals from GENOSYS Korea'}
                </h2>
              </div>
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`hidden items-center gap-1.5 text-[14px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 lg:inline-flex ${
                  isRtl ? 'flex-row-reverse' : ''
                }`}
              >
                {locale === 'ar' ? 'عرض الكل' : locale === 'ru' ? 'Все продукты' : 'View all'}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
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
        </section>
      )}

      {/* ── 3. Category rail ─────────────────────────────────────────────── */}
      <section
        className="reveal-on-view home-band home-band--white px-4"
        data-testid="professional-range-section"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center">
            <p className="cera-eyebrow mb-2.5">
              {locale === 'ar' ? 'تسوق حسب الفئة' : locale === 'ru' ? 'Категории' : 'Shop by category'}
            </p>
            <h2 className="cera-serif text-[30px] leading-[1.08] sm:text-[38px] lg:text-[46px]">
              {locale === 'ar'
                ? 'مجموعة GENOSYS الاحترافية'
                : locale === 'ru'
                ? 'Профессиональная коллекция GENOSYS'
                : 'The GENOSYS professional range'}
            </h2>
            <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-[var(--cera-muted)]">
              {locale === 'ar'
                ? 'من بروتوكولات العيادة إلى العناية اليومية — مصنوعة في كوريا ومعتمدة في الإمارات'
                : locale === 'ru'
                ? 'От клинических процедур до ежедневного ухода — сделано в Корее, сертифицировано в ОАЭ'
                : 'From in-clinic treatments to everyday essentials — made in Korea, certified in the UAE.'}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-5">
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
              const descriptor = CATEGORY_DESCRIPTORS[cat.slug]?.[locale as 'en' | 'ar' | 'ru']
              const shopLabel = locale === 'ar' ? 'تسوق' : locale === 'ru' ? 'Смотреть' : 'Shop'
              return (
                <Link
                  key={cat.slug}
                  href={getLocalizedPath(`/products/category/${cat.slug}`, locale)}
                  className="home-tile group flex flex-col"
                >
                  {/* Full-bleed editorial category artwork, matching the supplied template. */}
                  <div className="relative aspect-[1.62/1] overflow-hidden bg-[var(--cera-cream-deep)]">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 380px"
                        className="home-tile__image object-cover"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      dir="ltr"
                      className={`cera-numeral absolute top-4 text-[12px] text-[var(--cera-rose-ink)] drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)] ${
                        isRtl ? 'right-4' : 'left-4'
                      }`}
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, '0')}/{String(featuredCategories.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Copy */}
                  <div className={`flex flex-1 flex-col px-5 pb-4 pt-4 ${isRtl ? 'text-right' : ''}`}>
                    <h3 className="cera-serif text-[19px] leading-tight text-[var(--cera-ink)] lg:text-[21px]">
                      {title}
                    </h3>
                    {descriptor && (
                      <p className="mt-1.5 line-clamp-2 min-h-[38px] text-[13.5px] leading-[1.45] text-[var(--cera-muted)]">
                        {descriptor}
                      </p>
                    )}
                    <div
                      className={`mt-4 flex items-center justify-between gap-3 border-t border-[var(--cera-line)] pt-3 ${
                        isRtl ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {typeof count === 'number' && count > 0 ? (
                        <span className="text-[12px] text-[var(--cera-muted)]">
                          {formatProductCount(count, locale)}
                        </span>
                      ) : (
                        <span aria-hidden="true" />
                      )}
                      <span
                        className={`flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cera-rose-ink)] ${
                          isRtl ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {shopLabel}
                        <ArrowRight
                          className={`h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 ${
                            isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-9 text-center">
            <Link
              href={getLocalizedPath('/products', locale)}
              className={`inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${
                isRtl ? 'flex-row-reverse' : ''
              }`}
            >
              {locale === 'ar' ? 'استعرض جميع المنتجات' : locale === 'ru' ? 'Посмотреть все продукты' : 'Browse all products'}
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>
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
    <section className="reveal-on-view home-band home-band--white px-4">
      <div className={`ed-panel ed-panel--seal mx-auto max-w-[1200px] p-7 sm:p-10 lg:p-14 ${isRtl ? 'text-right' : ''}`}>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ── LEFT: kicker, headline, copy, form ─────────────────────── */}
          <div className="lg:col-span-7">
            <p className="cera-eyebrow mb-3">{kicker}</p>
            <h2 className="cera-serif text-[30px] leading-[1.08] sm:text-[38px] lg:text-[44px]">{headline}</h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cera-muted)] lg:text-base">
              {description}
            </p>

            {status === 'success' || status === 'already' ? (
              <div
                className={`mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700 ${
                  isRtl ? 'flex-row-reverse' : ''
                }`}
              >
                <Check className="h-4 w-4 flex-none" aria-hidden="true" />
                <span className="text-[14px] font-semibold">
                  {status === 'already' ? alreadySubscribedMsg : successMsg}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-lg">
                <label htmlFor="home-newsletter-email" className="sr-only">
                  {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email address'}
                </label>
                {/* One pill: the input flows into the button and the wrapper
                    carries the focus ring for both. */}
                <div className={`home-subscribe ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <input
                    id="home-newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={
                      locale === 'ar' ? 'أدخل بريدك الإلكتروني' : locale === 'ru' ? 'Введите email' : 'Enter your email'
                    }
                    className={isRtl ? 'text-right' : ''}
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

                  <button type="submit" disabled={status === 'loading'} className="ed-cta whitespace-nowrap px-6 py-2.5 text-[14px]">
                    {status === 'loading'
                      ? locale === 'ar'
                        ? 'جارٍ الإرسال…'
                        : locale === 'ru'
                          ? 'Отправляем…'
                          : 'Subscribing…'
                      : locale === 'ar'
                        ? 'اشترك'
                        : locale === 'ru'
                          ? 'Подписаться'
                          : 'Subscribe'}
                    {status !== 'loading' && (
                      <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </form>
            )}

            {status === 'error' && (
              <p id="home-newsletter-error" className="mt-4 text-[14px] font-semibold text-[var(--cera-rose-ink)]" role="alert">
                {errorMsg || genericError}
              </p>
            )}

            <p className={`mt-4 flex items-center gap-2 text-[12.5px] text-[var(--cera-muted)] ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Check className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
              {locale === 'ar'
                ? 'إلغاء الاشتراك بنقرة واحدة. نحن نحترم خصوصيتك.'
                : locale === 'ru'
                ? 'Отписка в один клик. Мы уважаем вашу приватность.'
                : 'Unsubscribe in one click. We respect your privacy.'}
            </p>
          </div>

          {/* ── RIGHT: benefits card ──────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="cera-card p-6 lg:p-8">
              <div className={`mb-5 flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="ed-mark ed-mark--tactile ed-mark--round h-10 w-10" aria-hidden="true">
                  <Mail className="h-[17px] w-[17px]" />
                </span>
                <p className="cera-eyebrow">{benefitsTitle}</p>
              </div>
              <ul className="space-y-3">
                {benefits.map(benefit => (
                  <li
                    key={benefit}
                    className={`flex items-start gap-3 text-[14.5px] leading-relaxed text-[var(--cera-body)] ${
                      isRtl ? 'flex-row-reverse text-right' : ''
                    }`}
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--cera-rose)]" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Frequency promise — handles the #1 objection */}
              <div className="mt-6 border-t border-[var(--cera-line)] pt-5">
                <p className="text-[12.5px] leading-relaxed text-[var(--cera-muted)]">
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
    </section>
  )
}
