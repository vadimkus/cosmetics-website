'use client'

/**
 * Shared bespoke layout for the Bio-Meso PDRN ampoules, products 60 and 65.
 *
 * Both products are the same formula at different spicule loads, so they get
 * one layout driven by a config object rather than two near-identical files.
 * Product 65 (Homecare 5000) is the default export; product 60 (Expert 60000)
 * wraps the same layout in BioMesoExpertProductPage.
 *
 * Shares the editorial design system built for product 66 - the primitives,
 * the gallery and the structural CSS all come from ../cerabarrier - and layers
 * a pearl/violet palette on top via biomeso.css.
 *
 * Where it deliberately diverges from the Cerabarrier layout:
 *   - No size selector or size-comparison section. Both are single SKUs.
 *   - A renewal timeline instead of a texture story, because the shedding
 *     sequence is the thing a first-time buyer most needs to expect.
 *   - A safety section, because spicules have real contraindications.
 *   - Clinical results render only when the config supplies them. Product 60
 *     has a KC Skin Research Center study, product 65 has none, so 65 shows
 *     laboratory specification alone and carries no percentages anywhere.
 */

import '../cerabarrier/cerabarrier.css'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import './biomeso.css'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Download,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Share2,
  Star,
} from 'lucide-react'

import { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { localizeProductImage } from '@/lib/localizedProductImages'
import { getPriceForSize, getProductSizeOptions } from '@/utils/productPricing'
import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getRoutineStepImage } from '@/lib/routineStepImages'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { UNITS_SOLD_DISPLAY_THRESHOLD, roundUnitsSold } from '@/lib/salesDisplay'
import { trackAddToCart } from '@/lib/analytics'
import { errorLog } from '@/lib/logger'
import ProductReviews from '@/components/product/ProductReviews'
import ProductOptionDialog from '@/components/product/ProductOptionDialog'
import type { ProductOptionSelection } from '@/lib/productOptions'

import CeraGallery, { CeraGalleryImage } from '../cerabarrier/CeraGallery'
import CeraClosingCta from '../cerabarrier/CeraClosingCta'
import {
  CeraAccordion,
  CeraBarcodeRows,
  CeraReveal,
  CeraSectionHeader,
  CeraStickyQuantity,
  useCeraStickyBar,
} from '../cerabarrier/CeraPrimitives'
import { getBioMesoCopy, type BioMesoCopy } from './biomesoCopy'

/**
 * Everything that differs between the two ampoules. Keeping it to copy, two
 * images and a brochure is what makes one layout viable for both; if a future
 * product in the line needs a structurally different section, give it its own
 * component rather than growing this into a switchboard.
 */
export interface BioMesoPageConfig {
  /** Catalogue number, used to find this product's own step in the routine. */
  productNumber: string
  /** Resolved per render so the layout follows the active locale. */
  getCopy: (locale: string) => BioMesoCopy
  /** Inline art for the mechanism section. */
  mechanismImage: string
  /** Inline art for the application section. */
  ritualImage: string
  /** The three below are optional because only the Homecare 5000 has a slide set
   *  wide enough to fill them. Each section renders its figure only when the
   *  config supplies one, so the Expert page is unchanged by their existence. */
  timelineImage?: string
  complexImage?: string
  activesImage?: string
  /** Tailwind aspect class for the two inline figures. These are slide exports,
   *  not packshots, so the frame has to follow the artwork: cropping one to a
   *  square cuts the headline printed inside it. */
  figureAspect: string
  brochureUrl: string
  /** Label used to disambiguate the two pages in error logs. */
  logLabel: string
}

/**
 * The Aug 2026 slide set, `/images/pdrn_5000_new/`. It was drawn from this page's own
 * copy, so the pairings are titles matching titles rather than a judgement call: S3 is
 * headed "Four things. Happen at once." against a section of the same name, S4 "What the
 * 5,000 is made of", S6 "Six days. One renewal cycle.", S7 "Once a week. In the evening."
 * Every figure printed on them - 0.25 mm needle equivalence, 5,000 / 1,010 / 10,000 ppm,
 * nine peptides, five ceramides, the six-day sequence, 3 ml, the roller warning - is
 * already in biomesoCopy.ts, so none of them introduces a claim the page does not make.
 *
 * S1 and S2 and Close carry no section of their own and stay in the thumbnail strip.
 * Insta.jpeg is a portrait social export and is deliberately not referenced here.
 */
const HOMECARE_CONFIG: BioMesoPageConfig = {
  productNumber: '65',
  getCopy: getBioMesoCopy,
  mechanismImage: '/images/pdrn_5000_new/S3.jpeg',
  ritualImage: '/images/pdrn_5000_new/S7.jpeg',
  timelineImage: '/images/pdrn_5000_new/S6.jpeg',
  complexImage: '/images/pdrn_5000_new/S4.jpeg',
  activesImage: '/images/pdrn_5000_new/S8.jpeg',
  figureAspect: 'aspect-square',
  brochureUrl: '/documents/ppt/GENOSYS-Training%20manual-Bio-Meso%20PDRN%20line.pdf',
  logLabel: 'BioMeso',
}

interface Props {
  product: Product
  unitsSold?: number
  /** Real records for the routine steps, so the cross-sell can show live price
   *  and stock and add straight to the bag. Resolved in the server component. */
  routineProducts?: Product[]
  /** Defaults to the Homecare 5000 page; the Expert wrapper overrides it. */
  config?: BioMesoPageConfig
}

interface ActiveIngredient {
  name: string
  description: string
}

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export default function BioMesoProductPage({
  product,
  unitsSold = 0,
  routineProducts = [],
  config = HOMECARE_CONFIG,
}: Props) {
  const router = useRouter()
  const { locale, dir, t } = useTranslation()
  const { user } = useAuth()
  const { addItem, items: cartItems, updateQuantity } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const isRtl = dir === 'rtl'
  const copy = config.getCopy(locale)

  // Single 50 ml SKU - no variants, so no size is ever passed to the cart.
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay(product, user)

  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', '')
  const inCartQty = cartLine?.quantity || 0

  // ── Content parsed from the product record ────────────────────────────
  const allIngredients = useMemo(
    () => parseJsonArray<ActiveIngredient>(product.ingredients),
    [product.ingredients]
  )
  const actives = useMemo(
    () => allIngredients.filter(i => i.name !== 'Full INCI'),
    [allIngredients]
  )
  const fullInci = useMemo(
    () => allIngredients.find(i => i.name === 'Full INCI')?.description ?? '',
    [allIngredients]
  )

  // The DB `images` field is the single source of truth for the gallery; the
  // main image is prepended, matching the product-gallery-images rule. Printed
  // claim slides follow the active language where a verified export exists.
  const galleryImages: CeraGalleryImage[] = useMemo(() => {
    const list = Array.from(
      new Set([product.image, ...parseJsonArray<string>(product.images)].filter(Boolean))
    )
    return list.map((src, i) => ({
      src: localizeProductImage(src, locale),
      alt: `${product.name} - GENOSYS Korean dermacosmetics, image ${i + 1} of ${list.length}`,
    }))
  }, [locale, product.image, product.images, product.name])

  // Inline figures use the same manifest as the gallery and mobile API. Product
  // 60 has no translated set, so these calls leave its paths untouched.
  const mechanismImage = localizeProductImage(config.mechanismImage, locale)
  const ritualImage = localizeProductImage(config.ritualImage, locale)
  const timelineImage = config.timelineImage
    ? localizeProductImage(config.timelineImage, locale)
    : undefined
  const complexImage = config.complexImage
    ? localizeProductImage(config.complexImage, locale)
    : undefined
  const activesImage = config.activesImage
    ? localizeProductImage(config.activesImage, locale)
    : undefined

  // Legacy records carry the catalogue number in `id` with `productNumber` null,
  // newer ones the other way round; index on whichever is present.
  const routineProductByNumber = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of routineProducts) map.set(String(p.productNumber ?? p.id), p)
    return map
  }, [routineProducts])

  const routineSteps = useMemo(() => {
    const routine = PRODUCT_ROUTINES[config.productNumber]
    if (!routine) return []
    return routine.steps.map(s => {
      const pid = ROUTINE_STEP_PRODUCT_IDS[s.titleKey]
      const linked = pid ? routineProductByNumber.get(pid) ?? null : null
      // Steps that sell in more than one size open the picker rather than
      // taking a one-tap add that would silently choose for the shopper, and
      // show a "from" price off the cheapest variant rather than the base
      // record price.
      const sizes = linked ? getProductSizeOptions(linked.productNumber || linked.id, linked) : []
      const lowestPrice = linked
        ? sizes.reduce(
            (min, s2) => Math.min(min, getPriceForSize(linked, s2.value)),
            sizes.length ? Number.POSITIVE_INFINITY : linked.price
          )
        : 0
      return {
        key: s.titleKey,
        productId: pid ?? null,
        linked,
        needsSizeChoice: sizes.length > 0,
        lowestPrice,
        isSelf: pid === config.productNumber,
        image: linked?.image || getRoutineStepImage(s.titleKey),
        title: t(`product.${s.titleKey}`),
      }
    })
  }, [config.productNumber, routineProductByNumber, t])

  // ── Live review aggregate (seeded product.rating is not trusted) ───────
  const [reviews, setReviews] = useState<{ averageRating: number | null; reviewCount: number } | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(`/api/products/${product.id}/reviews`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!cancelled && data) {
          setReviews({ averageRating: data.averageRating ?? null, reviewCount: data.reviewCount ?? 0 })
        }
      })
      .catch(() => { /* stars simply stay hidden */ })
    return () => { cancelled = true }
  }, [product.id])

  const rating = reviews && reviews.reviewCount > 0 ? reviews.averageRating : null
  const showUnitsSold = unitsSold >= UNITS_SOLD_DISPLAY_THRESHOLD

  // ── Sticky bars appear once the hero CTA leaves the viewport ──────────
  const { heroCta: ctaSentinel, closingCta, showStickyBar } = useCeraStickyBar()

  // ── Cart actions ──────────────────────────────────────────────────────
  const addToCart = useCallback(
    async (qty: number) => {
      if (!user) {
        router.push(getLocalizedPath('/login', locale))
        return
      }
      try {
        await addItem(product, qty)
        try {
          trackAddToCart({
            id: product.id,
            name: product.name,
            category: product.category || 'Cosmetics',
            price: product.price,
            quantity: qty,
          })
        } catch { /* analytics is best-effort */ }
      } catch (error) {
        errorLog(`${config.logLabel}: add to cart failed`, error)
        throw error
      }
    },
    [addItem, config.logLabel, locale, product, router, user]
  )

  const handleAdd = useCallback(async () => {
    if (isAdding) return
    setIsAdding(true)
    try {
      await addToCart(quantity)
      if (user) {
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2200)
      }
    } catch { /* surfaced by the cart provider */ } finally {
      setIsAdding(false)
    }
  }, [addToCart, isAdding, quantity, user])

  const [routineAdding, setRoutineAdding] = useState<string | null>(null)
  const [routineAdded, setRoutineAdded] = useState<string | null>(null)
  /** Routine step whose shade or size picker is open, if any. */
  const [optionStep, setOptionStep] = useState<Product | null>(null)

  const handleAddRoutineProduct = useCallback(
    async (item: Product, selection?: ProductOptionSelection, quantity = 1) => {
      if (!user) {
        router.push(getLocalizedPath('/login', locale))
        return
      }
      if (routineAdding) return
      setRoutineAdding(item.id)
      try {
        await addItem(item, quantity, selection?.selectedColor, selection?.selectedSize)
        try {
          trackAddToCart({
            id: item.id,
            name: item.name,
            category: item.category || 'Cosmetics',
            price: getPricingDisplay(item, user, selection).displayPrice,
            quantity,
          })
        } catch { /* analytics is best-effort */ }
        setRoutineAdded(item.id)
        setTimeout(() => setRoutineAdded(prev => (prev === item.id ? null : prev)), 2200)
      } catch (error) {
        errorLog(`${config.logLabel}: routine add to cart failed`, error)
      } finally {
        setRoutineAdding(null)
      }
    },
    [addItem, config.logLabel, locale, router, routineAdding, user]
  )

  /** Multi-size and multi-shade steps open the picker rather than navigating
   *  away, so the routine can be filled without leaving the page. Logged-out
   *  shoppers still go to login, matching the single-SKU button beside it. */
  const handleChooseRoutineOptions = useCallback(
    (item: Product) => {
      if (!user) {
        router.push(getLocalizedPath('/login', locale))
        return
      }
      setOptionStep(item)
    },
    [locale, router, user]
  )

  const handleConfirmRoutineOptions = useCallback(
    async (item: Product, selection: ProductOptionSelection, quantity: number) => {
      setOptionStep(null)
      await handleAddRoutineProduct(item, selection, quantity)
    },
    [handleAddRoutineProduct]
  )

  const handleDecrement = useCallback(() => {
    if (inCartQty <= 0) return
    updateQuantity(product.id, inCartQty - 1, '', '')
  }, [inCartQty, product.id, updateQuantity])

  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const data = { title: product.name, text: copy.headline, url }
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(data)) {
      try { await navigator.share(data) } catch { /* user cancelled */ }
      return
    }
    try { await navigator.clipboard.writeText(url) } catch { /* clipboard blocked */ }
  }, [copy.headline, product.name])

  const priceLabel = canSeePrices ? `${pricing.displayPrice.toFixed(2)} ${isRtl ? 'درهم' : 'AED'}` : null

  const ctaLabel = !product.inStock
    ? copy.outOfStock
    : !user
      ? copy.loginToShop
      : isAdding
        ? copy.adding
        : justAdded
          ? copy.added
          : copy.addToBag

  return (
    <div className={`cera-page biomeso-page min-h-[100dvh]`} dir={dir}>
      {/* ───────────────────────────── Hero ─────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pt-4 sm:px-6 md:pt-8 lg:pt-12">
        <PageBreadcrumb
          bare
          hideOnMobile
          items={[
            { name: t('common.home'), href: getLocalizedPath('/', locale) },
            { name: copy.backToProducts, href: getLocalizedPath('/products', locale) },
            { name: product.name },
          ]}
        />

        <div className="mt-5 grid grid-cols-1 gap-8 lg:mt-9 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CeraGallery
              images={galleryImages}
              isRtl={isRtl}
              badge={product.inStock ? t('product.inStock') : t('product.soldOut')}
            />
          </div>

          {/* Buy column */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <p className="cera-eyebrow pt-1">{copy.eyebrow}</p>
              <button
                type="button"
                onClick={handleShare}
                aria-label={t('product.shareProduct') || 'Share'}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[var(--cera-line)] bg-white text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-rose-ink)]"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            <h1 className="cera-serif mt-3 text-[34px] leading-[1.06] sm:text-[46px] lg:text-[54px]">
              {product.name}
            </h1>
            <p className="cera-serif mt-2 text-[21px] leading-snug text-[var(--cera-rose-ink)] sm:text-[25px]">
              {copy.headline}
            </p>

            {(rating || showUnitsSold) && (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[var(--cera-muted)]">
                {rating ? (
                  <a href="#reviews" className="flex items-center gap-1.5">
                    <span className="flex" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map(i => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'fill-[#d8a24a] text-[#d8a24a]' : 'text-[var(--cera-line)]'}`}
                        />
                      ))}
                    </span>
                    <span className="text-[var(--cera-ink)]">{rating.toFixed(1)}</span>
                    <span>({reviews?.reviewCount})</span>
                  </a>
                ) : null}
                {showUnitsSold ? (
                  <span>{t('product.unitsSold', { count: roundUnitsSold(unitsSold).toLocaleString() })}</span>
                ) : null}
              </div>
            )}

            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-base">
              {copy.subheadline}
            </p>

            <ul className="mt-6 space-y-2.5">
              {copy.heroBullets.map(bullet => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[var(--cera-blush)]">
                    <Check className="h-[11px] w-[11px] text-[var(--cera-rose-ink)]" strokeWidth={3} />
                  </span>
                  <span className="text-[16px] leading-relaxed text-[var(--cera-body)]">{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Single format, so the size is stated rather than selected. The
                weekly cadence sits beside it because using this daily is the
                single most likely way to misuse the product. */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <span className="cera-numeral rounded-full border border-[var(--cera-line)] bg-white px-4 py-2 text-[16px] text-[var(--cera-ink)]">
                {product.size}
              </span>
              <span className="rounded-full bg-[var(--cera-blush)] px-4 py-2 text-[13px] font-semibold text-[var(--cera-rose-ink)]">
                {copy.weeklyNote}
              </span>
            </div>

            {/* Price + CTA */}
            <div ref={ctaSentinel} className="mt-7">
              {canSeePrices ? (
                <div className="flex items-baseline gap-3">
                  <span className="cera-serif cera-numeral text-[38px] text-[var(--cera-ink)]">
                    {pricing.displayPrice.toFixed(2)}
                    <span className="ms-2 text-[19px] text-[var(--cera-muted)]">{isRtl ? 'درهم' : 'AED'}</span>
                  </span>
                  {pricing.hasDiscount && pricing.originalPrice ? (
                    <>
                      <span className="text-[15px] tabular-nums text-[var(--cera-muted)] line-through">
                        {pricing.originalPrice.toFixed(2)}
                      </span>
                      <span
                        /* dir=ltr so the minus stays in front of the number in Arabic. */
                        dir="ltr"
                        className="rounded-full bg-[var(--cera-ok-bg)] px-2.5 py-1 text-[12px] font-semibold text-[var(--cera-ok)]"
                      >
                        −{pricing.discountPercentage}%
                      </span>
                    </>
                  ) : null}
                  <span className="text-[12px] text-[var(--cera-muted)]">{copy.vatIncluded}</span>
                </div>
              ) : (
                <p className="text-[15px] text-[var(--cera-muted)]">{t('product.loginToSeePrice')}</p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex h-[54px] items-center rounded-full border border-[var(--cera-line)] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-[54px] w-12 items-center justify-center text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)]"
                    aria-label={t('product.decreaseQuantity')}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-[15px] font-semibold tabular-nums text-[var(--cera-ink)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(99, q + 1))}
                    className="flex h-[54px] w-12 items-center justify-center text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)]"
                    aria-label={t('product.increaseQuantity')}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!product.inStock || isAdding}
                  className={`inline-flex h-[54px] min-w-[220px] flex-1 items-center justify-center gap-2.5 rounded-full px-8 text-[15px] font-semibold tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${
                    justAdded
                      ? 'bg-[var(--cera-ink)] text-white'
                      : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] hover:shadow-[0_18px_38px_-20px_rgba(23,21,28,0.8)]'
                  }`}
                >
                  {justAdded ? <Check className="h-[18px] w-[18px]" /> : <ShoppingBag className="h-[18px] w-[18px]" />}
                  {ctaLabel}
                </button>

                <button
                  type="button"
                  onClick={() => user && toggleFavorite(product)}
                  disabled={!user}
                  aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
                  className={`flex h-[54px] w-[54px] flex-none items-center justify-center rounded-full border transition-colors disabled:opacity-40 ${
                    isFavorite(product.id)
                      ? 'border-[var(--cera-rose)] bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]'
                      : 'border-[var(--cera-line)] bg-white text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)]'
                  }`}
                >
                  <Heart className={`h-[18px] w-[18px] ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {inCartQty > 0 ? (
                <div className="mt-3 flex items-center gap-2 text-[13px] text-[var(--cera-ok)]">
                  <Check className="h-4 w-4" />
                  <span>{copy.inBag} · {inCartQty}</span>
                  <button
                    type="button"
                    onClick={() => router.push(getLocalizedPath('/cart', locale))}
                    className="underline underline-offset-2 hover:text-[var(--cera-ok)]"
                  >
                    {copy.viewBag}
                  </button>
                </div>
              ) : null}

              <p className="mt-4 text-[13px] text-[var(--cera-muted)]">{copy.freeDelivery}</p>
            </div>

            <ul className="mt-7 flex flex-wrap gap-2">
              {copy.badges.map(badge => (
                <li
                  key={badge}
                  className="rounded-full border border-[var(--cera-line)] bg-white/70 px-3.5 py-2 text-[12px] font-medium text-[var(--cera-body)]"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Stats strip ──────────────────────────── */}
      <section className="mt-14 border-y border-[var(--cera-line)] bg-white md:mt-20">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:py-12">
          {copy.stats.map((stat, i) => (
            <CeraReveal
              key={stat.label}
              delay={i * 70}
              className={`px-2 text-center lg:border-e lg:border-[var(--cera-line)] lg:last:border-e-0 ${
                i % 2 === 0 ? 'border-e border-[var(--cera-line)] lg:border-e' : ''
              }`}
            >
              <p className="cera-serif cera-numeral text-[28px] text-[var(--cera-ink)] sm:text-[36px]">{stat.value}</p>
              <p className="mx-auto mt-2 max-w-[24ch] text-[14px] leading-snug text-[var(--cera-muted)]">
                {stat.label}
              </p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ────────────────────── How it works + figure ───────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.science.eyebrow} title={copy.science.title} intro={copy.science.intro} />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-14">
          <CeraReveal className="lg:sticky lg:top-24 lg:self-start">
            <div className={`relative ${config.figureAspect} overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white`}>
              <Image
                src={mechanismImage}
                alt={copy.science.figureAlt}
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>

          <ol className="space-y-4">
            {copy.science.cards.map((card, i) => (
              <CeraReveal
                key={card.title}
                as="li"
                delay={i * 70}
                className="cera-card cera-card-hover flex gap-5 p-6 lg:p-7"
              >
                <span className="cera-serif cera-numeral flex-none text-[26px] text-[var(--cera-rose)] sm:text-[30px]" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[16px]">
                    {card.body}
                  </p>
                </div>
              </CeraReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ────────────────────── Six-day renewal timeline ────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <CeraSectionHeader
            eyebrow={copy.timeline.eyebrow}
            title={copy.timeline.title}
            intro={copy.timeline.intro}
          />

          {timelineImage ? (
            <CeraReveal className="mx-auto mt-10 max-w-[520px] lg:mt-12">
              <div className={`relative ${config.figureAspect} overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white`}>
                <Image
                  src={timelineImage}
                  alt={`${product.name} - the six-day renewal cycle, from tingling on day one to a renewed surface on day six`}
                  fill
                  sizes="(max-width: 640px) 92vw, 520px"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </CeraReveal>
          ) : null}

          <ol className="biomeso-rail mt-10 space-y-3 lg:mt-14">
            {copy.timeline.days.map((day, i) => (
              <CeraReveal key={day.day} as="li" delay={i * 60}>
                <div className="flex gap-5 sm:gap-6">
                  <span
                    className="relative z-10 mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[var(--cera-blush-deep)] bg-white sm:h-14 sm:w-14"
                    aria-hidden="true"
                  >
                    <span className="cera-serif cera-numeral text-[19px] text-[var(--cera-rose-ink)] sm:text-[22px]">
                      {i + 1}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1 pb-5">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--cera-rose-ink)]">
                      {day.day}
                    </p>
                    <h3 className="cera-serif mt-1.5 text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[24px]">
                      {day.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[16px]">
                      {day.body}
                    </p>
                  </div>
                </div>
              </CeraReveal>
            ))}
          </ol>

          <CeraReveal>
            <p
              className="mt-4 border-s-2 border-[var(--cera-blush-deep)] ps-5 text-[15px] italic leading-relaxed text-[var(--cera-muted)]"
            >
              {copy.timeline.note}
            </p>
          </CeraReveal>
        </div>
      </section>

      {/* ───────────── Measured results (only where a study exists) ─────── */}
      {copy.clinical ? (
        <section className="biomeso-clinical border-y border-[var(--cera-line)] bg-[var(--cera-blush)]/35">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
            <CeraSectionHeader
              eyebrow={copy.clinical.eyebrow}
              title={copy.clinical.title}
              intro={copy.clinical.intro}
            />

            <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-14 lg:gap-6">
              {copy.clinical.metrics.map((metric, i) => (
                <CeraReveal
                  key={metric.label}
                  delay={i * 70}
                  as="article"
                  className={`cera-card p-7 text-center lg:p-8 ${isRtl ? 'text-right sm:text-center' : ''}`}
                >
                  {/* LTR-isolated so Arabic bidi does not walk the percent sign
                      to the wrong end of the number. */}
                  <p
                    dir="ltr"
                    className="cera-serif cera-numeral text-[40px] text-[var(--cera-rose-ink)] [unicode-bidi:isolate] sm:text-[46px]"
                  >
                    {metric.value}
                  </p>
                  <h3 className="mt-3 text-[16px] font-semibold leading-snug text-[var(--cera-ink)]">
                    {metric.label}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--cera-muted)]">
                    {metric.detail}
                  </p>
                </CeraReveal>
              ))}
            </div>

            <CeraReveal>
              <p
                className="mx-auto mt-8 max-w-[720px] text-[15px] leading-relaxed text-[var(--cera-body)]"
              >
                {copy.clinical.note}
              </p>
              {/* The panel was twenty people. Saying so beside the figures is
                  the difference between evidence and advertising. */}
              <p
                className="mx-auto mt-4 max-w-[720px] text-[13px] leading-relaxed text-[var(--cera-muted)]"
              >
                {copy.clinical.disclaimer}
              </p>
            </CeraReveal>
          </div>
        </section>
      ) : null}

      {/* ─────────────────────── Inside the ampoule ─────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.complex.eyebrow} title={copy.complex.title} intro={copy.complex.body} />

        {complexImage ? (
          <CeraReveal className="mx-auto mt-10 max-w-[520px] lg:mt-12">
            <div className={`relative ${config.figureAspect} overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white`}>
              <Image
                src={complexImage}
                alt={`${product.name} - what the 5,000 is made of: PDRN complex, Sodium DNA, panthenol, nine peptides and five ceramides`}
                fill
                sizes="(max-width: 640px) 92vw, 520px"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>
        ) : null}

        <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-6">
          {copy.complex.points.map((point, i) => (
            <CeraReveal
              key={point.title}
              delay={i * 70}
              as="article"
              className="cera-card cera-card-hover p-7 lg:p-8"
            >
              <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                {point.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[16px]">
                {point.body}
              </p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── How to use ───────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <CeraReveal>
                <p className="cera-eyebrow">{copy.howTo.eyebrow}</p>
                <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.howTo.title}</h2>
                <p className="mt-3 inline-flex rounded-full bg-[var(--cera-blush)] px-4 py-1.5 text-[13px] font-semibold text-[var(--cera-rose-ink)]">
                  {copy.howTo.frequency}
                </p>
              </CeraReveal>

              <ol className="mt-9 space-y-4">
                {copy.howTo.steps.map((step, i) => (
                  <CeraReveal key={step.title} as="li" delay={i * 80}>
                    <div className="cera-card flex gap-5 p-5 sm:gap-6 sm:p-6">
                      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[var(--cera-rose)] sm:h-14 sm:w-14">
                        <span className="cera-serif cera-numeral text-[22px] text-white sm:text-[26px]">{i + 1}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[24px]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[16px]">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </CeraReveal>
                ))}
              </ol>

              <CeraReveal>
                <p className="mt-8 flex max-w-[58ch] gap-3 rounded-2xl border border-[var(--cera-blush-deep)] bg-[var(--cera-blush)]/60 p-5 text-[15px] leading-relaxed text-[var(--cera-body)]">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
                  <span>{copy.howTo.note}</span>
                </p>
              </CeraReveal>
            </div>

            <CeraReveal className="lg:pt-4">
              <div className={`relative ${config.figureAspect} overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white`}>
                <Image
                  src={ritualImage}
                  alt={`${product.name} - how to use`}
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </CeraReveal>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Video ──────────────────────────────── */}
      {product.videoUrl ? (
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <CeraReveal>
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
                <video
                  className="h-full w-full object-cover"
                  src={product.videoUrl}
                  poster={product.image}
                  controls
                  playsInline
                  preload="metadata"
                >
                  {copy.video.unsupported}
                </video>
              </div>
            </CeraReveal>
            <CeraReveal>
              <p className="cera-eyebrow">{copy.video.eyebrow}</p>
              <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.video.title}</h2>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[var(--cera-body)]">
                {copy.video.body}
              </p>
            </CeraReveal>
          </div>
        </section>
      ) : null}

      {/* ──────────────────────── Actives + INCI ────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <CeraSectionHeader
            eyebrow={copy.actives.eyebrow}
            title={copy.actives.title}
            intro={copy.actives.intro}
          />

          {activesImage ? (
            <CeraReveal className="mx-auto mt-10 max-w-[520px] lg:mt-12">
              <div className={`relative ${config.figureAspect} overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-[var(--cera-cream)]`}>
                <Image
                  src={activesImage}
                  alt={`${product.name} - formula composition and documented concentrations`}
                  fill
                  sizes="(max-width: 640px) 92vw, 520px"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </CeraReveal>
          ) : null}

          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-px sm:grid-cols-2 lg:mt-14 lg:gap-x-16">
            {actives.map((active, i) => (
              <CeraReveal
                key={active.name}
                delay={(i % 4) * 60}
                className="border-b border-[var(--cera-line)] py-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="cera-numeral text-[13px] text-[var(--cera-rose)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)]">{active.name}</h3>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)]">{active.description}</p>
              </CeraReveal>
            ))}
          </div>

          {fullInci ? (
            <CeraReveal className="mx-auto mt-10 max-w-[820px]">
              <CeraAccordion title={copy.actives.fullInci}>
                <p className="text-[15px] leading-[1.9] text-[var(--cera-body)]">{fullInci}</p>
                <p className="mt-3 text-[13px] text-[var(--cera-muted)]">{copy.actives.fullInciNote}</p>
              </CeraAccordion>
            </CeraReveal>
          ) : null}
        </div>
      </section>

      {/* ─────────────── Laboratory specification (no clinical %) ───────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <CeraReveal>
              <p className="cera-eyebrow">{copy.lab.eyebrow}</p>
              <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.lab.title}</h2>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[var(--cera-body)]">
                {copy.lab.intro}
              </p>
              <p className="mt-6 max-w-[46ch] text-[13px] leading-relaxed text-[var(--cera-muted)]">
                {copy.lab.disclaimer}
              </p>
            </CeraReveal>
          </div>

          <CeraReveal className="cera-card overflow-hidden">
            <table className="biomeso-spec w-full border-collapse text-start">
              <caption className="sr-only">{copy.lab.title}</caption>
              <tbody>
                {copy.lab.rows.map(row => (
                  <tr key={row.label} className="border-b border-[var(--cera-line)] last:border-b-0">
                    <th
                      scope="row"
                      className={`w-[46%] px-5 py-4 align-top text-[13px] font-semibold uppercase tracking-[0.07em] text-[var(--cera-muted)] text-start`}
                    >
                      {row.label}
                    </th>
                    <td
                      className={`px-5 py-4 align-top text-[15px] leading-snug text-[var(--cera-ink)] text-start`}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CeraReveal>
        </div>
      </section>

      {/* ───────────────────────── Safety notes ─────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <CeraSectionHeader eyebrow={copy.safety.eyebrow} title={copy.safety.title} />
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-12">
            {copy.safety.points.map((point, i) => (
              <CeraReveal
                key={point}
                as="li"
                delay={i * 60}
                className="cera-card flex gap-4 p-5"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
                <span className="text-[15px] leading-relaxed text-[var(--cera-body)]">{point}</span>
              </CeraReveal>
            ))}
          </ul>
          <CeraReveal>
            <p className="mt-6 text-[14px] text-[var(--cera-muted)]">
              {copy.safety.note}
            </p>
          </CeraReveal>
        </div>
      </section>

      {/* ─────────────────────── Complete the routine ───────────────────── */}
      {routineSteps.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
          <CeraSectionHeader
            eyebrow={copy.routine.eyebrow}
            title={copy.routine.title}
            intro={copy.routine.intro}
          />
          {/* Baymard's cross-sell guidance: thumbnail, fully visible title,
              price and a direct add in secondary styling. */}
          <ol className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-4 lg:gap-4">
            {routineSteps.map((step, i) => {
              const item = step.linked
              const busy = item ? routineAdding === item.id : false
              const done = item ? routineAdded === item.id : false
              const inBag = item
                ? findSelectedStandardCartLine(cartItems, item.id, '', '')?.quantity || 0
                : 0
              // Same treatment the main buy box gets, so a customer on a tier
              // discount is not quoted the list price here.
              const itemPricing = item
                ? getPricingDisplay({ ...item, price: step.lowestPrice }, user)
                : null
              const href = step.productId
                ? getLocalizedPath(`/products/${step.productId}`, locale)
                : '#'

              return (
                <CeraReveal key={step.key} as="li" delay={i * 60}>
                  <div
                    className={`cera-card flex h-full flex-col overflow-hidden ${
                      step.isSelf ? 'border-[var(--cera-rose)] bg-[var(--cera-blush)]/40' : ''
                    }`}
                  >
                    <Link href={href} className="group block" aria-label={step.title}>
                      <div className="relative aspect-square overflow-hidden bg-[var(--cera-cream)]">
                        {step.image ? (
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            sizes="(max-width: 1024px) 45vw, 23vw"
                            quality={80}
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                          />
                        ) : null}
                        <span className="absolute start-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[12px] font-semibold text-[var(--cera-ink)] shadow-sm backdrop-blur">
                          {i + 1}
                        </span>
                        {step.isSelf ? (
                          <span className="absolute end-2.5 top-2.5 rounded-full bg-[var(--cera-rose)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm">
                            {copy.routine.thisProduct}
                          </span>
                        ) : null}
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col p-3.5">
                      <Link
                        href={href}
                        className="text-[16px] leading-snug text-[var(--cera-ink)] hover:text-[var(--cera-rose-ink)]"
                      >
                        {step.title}
                      </Link>

                      {canSeePrices && itemPricing ? (
                        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[14px] font-semibold tabular-nums text-[var(--cera-ink)]">
                          <span>
                            {step.needsSizeChoice ? `${copy.routine.fromPrice} ` : ''}
                            {itemPricing.displayPrice.toFixed(2)} {isRtl ? 'درهم' : 'AED'}
                          </span>
                          {itemPricing.hasDiscount && itemPricing.originalPrice ? (
                            <span className="text-[12px] font-normal tabular-nums text-[var(--cera-muted)] line-through">
                              {itemPricing.originalPrice.toFixed(2)}
                            </span>
                          ) : null}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-[13px] text-[var(--cera-muted)]">{copy.loginToShop}</p>
                      )}

                      <div className="mt-auto pt-3">
                        {/* The step the shopper is already on still needs a working
                            add, so it reuses the hero CTA rather than a dead label. */}
                        {step.isSelf ? (
                          <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!product.inStock || isAdding}
                            className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                              justAdded
                                ? 'border-[var(--cera-ink)] bg-[var(--cera-ink)] text-white'
                                : 'border-[var(--cera-ink)] text-[var(--cera-ink)] hover:bg-[var(--cera-cta)] hover:text-white'
                            }`}
                          >
                            {justAdded ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            {ctaLabel}
                          </button>
                        ) : item && !step.needsSizeChoice ? (
                          <button
                            type="button"
                            onClick={() => handleAddRoutineProduct(item)}
                            disabled={!item.inStock || busy}
                            className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                              done
                                ? 'border-[var(--cera-ink)] bg-[var(--cera-ink)] text-white'
                                : 'border-[var(--cera-ink)] text-[var(--cera-ink)] hover:bg-[var(--cera-cta)] hover:text-white'
                            }`}
                          >
                            {done ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            {!item.inStock
                              ? copy.outOfStock
                              : busy
                                ? copy.adding
                                : done
                                  ? copy.added
                                  : copy.addToBag}
                          </button>
                        ) : item ? (
                          <button
                            type="button"
                            onClick={() => handleChooseRoutineOptions(item)}
                            disabled={!item.inStock || busy}
                            className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                              done
                                ? 'border-[var(--cera-ink)] bg-[var(--cera-ink)] text-white'
                                : 'border-[var(--cera-line)] text-[var(--cera-rose-ink)] hover:border-[var(--cera-rose)]'
                            }`}
                          >
                            {done ? <Check className="h-3.5 w-3.5" /> : null}
                            {!item.inStock
                              ? copy.outOfStock
                              : busy
                                ? copy.adding
                                : done
                                  ? copy.added
                                  : copy.routine.chooseOptions}
                          </button>
                        ) : (
                          <Link
                            href={href}
                            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[var(--cera-line)] text-[13px] font-semibold text-[var(--cera-rose-ink)] hover:border-[var(--cera-rose)]"
                          >
                            {copy.routine.viewProduct}
                            <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                          </Link>
                        )}

                        {inBag > 0 ? (
                          <p className="mt-2 flex items-center justify-center gap-1.5 text-[12px] text-[var(--cera-ok)]">
                            <Check className="h-3.5 w-3.5 flex-none" />
                            {copy.inBag} · {inBag}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CeraReveal>
              )
            })}
          </ol>
        </section>
      )}

      {/* ───────────────────────── Details + brochure ───────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[820px] px-4 sm:px-6">
          <CeraSectionHeader eyebrow={copy.details.eyebrow} title={copy.details.title} />
          <CeraReveal className="cera-card mt-10 p-6 lg:mt-14 lg:p-8">
            <dl className="divide-y divide-[var(--cera-line)]">
              {copy.details.rows.map(row => (
                <div key={row.label} className="flex gap-4 py-3.5">
                  <dt className="w-[38%] flex-none text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cera-muted)]">
                    {row.label}
                  </dt>
                  <dd className="text-[15px] leading-snug text-[var(--cera-body)]">{row.value}</dd>
                </div>
              ))}
              <CeraBarcodeRows
                productNumber={product.productNumber ?? product.id}
                label={t('product.barcode')}
              />
            </dl>
            <a
              href={config.brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 py-2 text-[14px] font-semibold text-[var(--cera-rose-ink)] underline-offset-4 hover:underline"
            >
              <Download className="h-4 w-4" />
              {copy.details.brochure}
            </a>
          </CeraReveal>
        </div>
      </section>

      {/* ──────────────────────────── FAQ ───────────────────────────────── */}
      <section className="mx-auto max-w-[820px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
        <div className="mt-10 border-t border-[var(--cera-line)] lg:mt-14">
          {copy.faq.items.map((item, i) => (
            <CeraAccordion key={item.q} title={item.q} defaultOpen={i === 0}>
              <p>{item.a}</p>
            </CeraAccordion>
          ))}
        </div>
      </section>

      {/* ─────────────────────────── Reviews ────────────────────────────── */}
      <section id="reviews" className="bg-white">
        <div className="mx-auto max-w-[1000px] scroll-mt-24 px-4 py-16 sm:px-6 lg:py-20">
          <ProductReviews productId={product.id} variant="editorial" />
        </div>
      </section>

      {/* ────────────────────────── Closing band ───────────────────────── */}
      <CeraClosingCta
        image={product.image}
        name={product.name}
        headline={copy.headline}
        note={copy.freeDelivery}
        priceLabel={priceLabel}
        vatLabel={copy.vatIncluded}
        sentinelRef={closingCta}
        cta={
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock || isAdding}
            className={`inline-flex h-[54px] min-w-[220px] items-center justify-center gap-2.5 rounded-full px-8 text-[15px] font-semibold tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45 ${
              justAdded
                ? 'bg-[var(--cera-ink)] text-white'
                : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] hover:shadow-[0_18px_38px_-20px_rgba(17,23,24,0.8)]'
            }`}
          >
            {justAdded ? <Check className="h-[18px] w-[18px]" /> : <ShoppingBag className="h-[18px] w-[18px]" />}
            {ctaLabel}
          </button>
        }
      />

      {/* ─────────────────────── Sticky add to bag ─────────────────────── */}
      <div
        className={`mweb-float-bottom fixed inset-x-0 bottom-0 z-50 border-t border-[var(--cera-line)] bg-white/95 pb-3 backdrop-blur-xl transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full mweb-float-bottom-hidden'
        }`}
        aria-hidden={!showStickyBar}
        inert={!showStickyBar}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-3 gap-y-1.5 px-4 pt-3 sm:gap-x-4 sm:px-6 md:flex-nowrap">
          {/* Desktop only: at full width a lone price and button read as a
              floating toolbar rather than as this product. */}
          <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
            <div className="relative h-11 w-11 flex-none overflow-hidden rounded-xl border border-[var(--cera-line)] bg-white">
              <Image src={product.image} alt="" fill sizes="44px" className="object-contain p-1" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[16px] text-[var(--cera-ink)]">{product.name}</p>
              <p className="truncate text-[11px] text-[var(--cera-muted)]">
                {product.size} · {copy.weeklyNote}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 items-end justify-between gap-3 md:w-auto md:flex-none md:justify-start">
            {canSeePrices ? (
              <div>
                {(inCartQty || quantity) > 1 ? (
                  <p className="text-[11px] leading-none text-[var(--cera-muted)]">
                    {t('product.pricePerUnit', {
                      count: inCartQty || quantity,
                      price: pricing.displayPrice.toFixed(2),
                    })}
                  </p>
                ) : null}
                <p className="cera-serif cera-numeral text-[20px] text-[var(--cera-ink)]">
                  {(pricing.displayPrice * Math.max(1, inCartQty || quantity)).toFixed(2)}
                  <span className="ms-1 text-[12px] text-[var(--cera-muted)]">{isRtl ? 'درهم' : 'AED'}</span>
                </p>
              </div>
            ) : null}
            <p className="min-w-0 max-w-[52%] shrink truncate text-[11px] text-[var(--cera-muted)] md:hidden">{product.size}</p>
          </div>

          {inCartQty === 0 && product.inStock && user ? (
            <CeraStickyQuantity
              value={quantity}
              onChange={setQuantity}
              decreaseLabel={t('product.decreaseQuantity')}
              increaseLabel={t('product.increaseQuantity')}
              label={t('product.quantity')}
            />
          ) : null}

          <div aria-hidden="true" className="w-full md:hidden" />

          {inCartQty > 0 && product.inStock && user ? (
            <div className="flex h-12 flex-1 items-center justify-between rounded-full bg-[var(--cera-ink)] px-1.5 text-white md:w-[280px] md:flex-none">
              <button
                type="button"
                onClick={handleDecrement}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 active:bg-white/30"
                aria-label={t('product.decreaseQuantity')}
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push(getLocalizedPath('/cart', locale))}
                className="flex flex-1 items-center justify-center gap-2 text-[14px] font-semibold"
              >
                <Check className="h-4 w-4" />
                {copy.viewBag} ({inCartQty})
              </button>
              <button
                type="button"
                onClick={() => addToCart(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 active:bg-white/30"
                aria-label={t('product.increaseQuantity')}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock || isAdding}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-colors disabled:opacity-45 md:w-[240px] md:flex-none ${
                justAdded ? 'bg-[var(--cera-ink)] text-white' : 'bg-[var(--cera-cta)] text-white active:bg-[var(--cera-rose-ink)]'
              }`}
            >
              {justAdded ? <Check className="h-[18px] w-[18px]" /> : <ShoppingBag className="h-[18px] w-[18px]" />}
              {ctaLabel}
            </button>
          )}

          <button
            type="button"
            onClick={() => user && toggleFavorite(product)}
            disabled={!user}
            aria-label={isFavorite(product.id) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
            className={`flex h-12 w-12 flex-none items-center justify-center rounded-full border disabled:opacity-40 ${
              isFavorite(product.id)
                ? 'border-[var(--cera-rose)] bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]'
                : 'border-[var(--cera-line)] text-[var(--cera-muted)]'
            }`}
          >
            <Heart className={`h-[18px] w-[18px] ${isFavorite(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {optionStep ? (
        <ProductOptionDialog
          open
          product={optionStep}
          user={user}
          isAdding={routineAdding === optionStep.id}
          onClose={() => setOptionStep(null)}
          onConfirm={handleConfirmRoutineOptions}
        />
      ) : null}
    </div>
  )
}
