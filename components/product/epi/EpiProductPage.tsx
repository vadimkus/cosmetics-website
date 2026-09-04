'use client'

/**
 * Bespoke product page for EPI TURNOVER BOOSTING PEELING GEL (product 12).
 *
 * Shares the editorial design system built for product 66 - the primitives, the
 * gallery and the structural CSS all come from ../cerabarrier - and layers a
 * mint/forest palette on top via epi.css, taken from the tube.
 *
 * Section order:
 *
 *   effects  Roll · Rinse · Smooth
 *   engine   cellulose 3%, the peel you feel
 *   howTo    dry skin, one minute, rinse, plus the product video
 *   actives  ingredient cards from the product record, plus the full INCI
 *   suited   who it is for and who should buy something else
 *   routine  cleanse → peel → mist → serum → cream
 *
 * There is a dedicated DTS MG deck and a safety assessment, and no quantified
 * clinical trial, so this page has no proof chart. See epiCopy.ts for the
 * sourcing rules. In particular: do not rebuild the page around papaya at
 * 0.000150% or moringa at 0.000020%.
 */

import '../cerabarrier/cerabarrier.css'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import './epi.css'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Share2,
  Sparkles,
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
import { getPriceForSize, getProductSizeOptions } from '@/utils/productPricing'
import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getRoutineStepImage } from '@/lib/routineStepImages'
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { getProductTranslations } from '@/data/productTranslations'
import { getProductTranslationsRu } from '@/data/productTranslationsRu'
import { withFullInciFallback } from '@/lib/localizedIngredients'
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
  CeraBrochureLinks,
  CeraReveal,
  CeraSectionHeader,
  CeraStickyQuantity,
  useCeraStickyBar,
} from '../cerabarrier/CeraPrimitives'
import { getEpiCopy } from './epiCopy'

interface Props {
  product: Product
  unitsSold?: number
  /** Real records for the routine steps, so the cross-sell can show live price
   *  and stock and add straight to the bag. Resolved in the server component. */
  routineProducts?: Product[]
}

interface ActiveIngredient {
  name: string
  description: string
}

/** Section art, each slide paired with the section it illustrates. s5 is the
 *  smooth-not-stripped results slide, s4 the once-or-twice-weekly how-to.
 *  s1 still carries the old "without irritation" line and is queued for
 *  re-export; the editorial copy does not repeat it. The engine figure
 *  stays on the tube packshot. */
const EFFECTS_IMAGE = '/images/epi/s5.jpeg'
const HOWTO_IMAGE = '/images/epi/s4.jpeg'
const ENGINE_IMAGE = '/images/epi/main.jpeg'

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export default function EpiProductPage({
  product,
  unitsSold = 0,
  routineProducts = [],
}: Props) {
  const router = useRouter()
  const { locale, dir, t } = useTranslation()
  const { user } = useAuth()
  const { addItem, items: cartItems, updateQuantity } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const isRtl = dir === 'rtl'
  const copy = getEpiCopy(locale)

  // Single SKU - one 300g jar - so no size is ever passed to the cart.
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay(product, user)

  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', '')
  const inCartQty = cartLine?.quantity || 0

  // Ingredient cards come from the product record. "Full INCI" is stored as a
  // pseudo-ingredient and is pulled out into the accordion rather than shown as
  // a card, the same convention as products 63 and 66.
  const allIngredients = useMemo(() => {
    const key = product.productNumber || product.id
    const localised =
      locale === 'ar'
        ? getProductTranslations(key)?.ingredients
        : locale === 'ru'
          ? getProductTranslationsRu(key)?.ingredients
          : null
    return parseJsonArray<ActiveIngredient>(
      withFullInciFallback(localised || product.ingredients, product.ingredients, locale) || ''
    )
  }, [locale, product.id, product.ingredients, product.productNumber])
  const actives = useMemo(
    () => allIngredients.filter(i => i.name !== 'Full INCI'),
    [allIngredients]
  )
  const fullInci = useMemo(
    () => allIngredients.find(i => i.name === 'Full INCI')?.description ?? '',
    [allIngredients]
  )

  // The DB `images` field is the single source of truth for the gallery; the
  // main image is prepended, matching the product-gallery-images rule.
  const galleryImages: CeraGalleryImage[] = useMemo(() => {
    const list = Array.from(
      new Set([product.image, ...parseJsonArray<string>(product.images)].filter(Boolean))
    )
    return list.map((src, i) => ({
      src,
      alt: `${product.name} - GENOSYS Korean dermacosmetics, image ${i + 1} of ${list.length}`,
    }))
  }, [product.image, product.images, product.name])

  // Legacy records carry the catalogue number in `id` with `productNumber` null,
  // newer ones the other way round; index on whichever is present.
  const routineProductByNumber = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of routineProducts) map.set(String(p.productNumber ?? p.id), p)
    return map
  }, [routineProducts])

  const routineSteps = useMemo(() => {
    const routine = PRODUCT_ROUTINES['12']
    if (!routine) return []
    return routine.steps.map(s => {
      const pid = ROUTINE_STEP_PRODUCT_IDS[s.titleKey]
      const linked = pid ? routineProductByNumber.get(pid) ?? null : null
      // Any routine product sold in more than one size opens the picker rather
      // than silently adding a size, and shows a "from" price off the cheapest
      // variant rather than the base record.
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
        isSelf: pid === '12',
        image: linked?.image || getRoutineStepImage(s.titleKey),
        title: t(`product.${s.titleKey}`),
      }
    })
  }, [routineProductByNumber, t])

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
        errorLog('Epi: add to cart failed', error)
        throw error
      }
    },
    [addItem, locale, product, router, user]
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
  /** Routine step whose size picker is open, if any. */
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
        errorLog('Epi: routine add to cart failed', error)
      } finally {
        setRoutineAdding(null)
      }
    },
    [addItem, locale, router, routineAdding, user]
  )

  /** Multi-size steps open the picker rather than navigating away, so the
   *  routine can be filled without leaving the page. Logged-out shoppers still
   *  go to login, matching the single-SKU button beside it. */
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
    <div className={`cera-page epi-page min-h-[100dvh]`} dir={dir}>
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

            {/* Single SKU, so the pack is stated rather than selected. */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <span className="cera-numeral rounded-full border border-[var(--cera-line)] bg-white px-4 py-2 text-[16px] text-[var(--cera-ink)]">
                {copy.packSize}
              </span>
              <span className="rounded-full bg-[var(--cera-blush)] px-4 py-2 text-[13px] font-semibold text-[var(--cera-rose-ink)]">
                {copy.usageNote}
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
                      : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] hover:shadow-[0_18px_38px_-20px_rgba(17,23,24,0.8)]'
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
              <p className="cera-serif cera-numeral text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px]">
                {stat.value}
              </p>
              <p className="mx-auto mt-2 max-w-[24ch] text-[14px] leading-snug text-[var(--cera-muted)]">
                {stat.label}
              </p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ──────────────────────── What it does ──────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <CeraReveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
              <Image
                src={EFFECTS_IMAGE}
                alt={copy.effects.title}
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                quality={85}
                className="object-contain"
              />
            </div>
          </CeraReveal>
          <div>
        <CeraSectionHeader
          eyebrow={copy.effects.eyebrow}
          title={copy.effects.title}
          intro={copy.effects.intro}
        />
        <ol className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-6">
          {copy.effects.cards.map((card, i) => (
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
        </div>
      </section>

      {/* ───────────────────────── The complex ──────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
            <CeraReveal className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
                <Image
                  src={ENGINE_IMAGE}
                  alt={copy.engine.figureAlt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 44vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
            </CeraReveal>

            <div>
              <CeraReveal>
                <p className="cera-eyebrow">{copy.engine.eyebrow}</p>
                <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.engine.title}</h2>
                <p className="mt-4 max-w-[50ch] text-[16px] leading-relaxed text-[var(--cera-body)]">
                  {copy.engine.body}
                </p>
              </CeraReveal>

              <div className="mt-8 space-y-4">
                {copy.engine.points.map((point, i) => (
                  <CeraReveal
                    key={point.title}
                    delay={i * 80}
                    as="article"
                    className="cera-card cera-card-hover p-6 lg:p-7"
                  >
                    <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                      {point.title}
                    </h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[16px]">
                      {point.body}
                    </p>
                  </CeraReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── How to use ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <CeraReveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
              <Image
                src={HOWTO_IMAGE}
                alt={copy.howTo.title}
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                quality={85}
                className="object-contain"
              />
            </div>
          </CeraReveal>
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
            <p className="mt-8 flex gap-3 rounded-2xl border border-[var(--cera-blush-deep)] bg-[var(--cera-blush)]/60 p-5 text-[15px] leading-relaxed text-[var(--cera-body)]">
              <Sparkles className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
              <span>{copy.howTo.note}</span>
            </p>
          </CeraReveal>

          {product.videoUrl ? (
            <CeraReveal className="mt-10">
              <p className="cera-eyebrow">{copy.howTo.videoTitle}</p>
              <div className="epi-video relative mt-4 mx-auto aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-[28px]">
                <video
                  src={product.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              </div>
            </CeraReveal>
          ) : null}
        </div>
        </div>
      </section>

      {/* ──────────────────────── Actives + INCI ────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <CeraSectionHeader
            eyebrow={copy.actives.eyebrow}
            title={copy.actives.title}
            intro={copy.actives.intro}
          />

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
              <CeraAccordion title={copy.actives.inciTitle}>
                <p className="text-[15px] leading-[1.9] text-[var(--cera-body)]">{fullInci}</p>
                <p className="mt-3 text-[13px] text-[var(--cera-muted)]">{copy.actives.inciNote}</p>
              </CeraAccordion>
            </CeraReveal>
          ) : null}
        </div>
      </section>

      {/* ────────────────────── Suited / not suited ─────────────────────── */}
      <section className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.suited.eyebrow} title={copy.suited.title} />
        <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-6">
          {/* Reasons to buy: plain card, ticks. */}
          <CeraReveal className="cera-card p-6 lg:p-7">
            <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)]">
              {copy.suited.forTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {copy.suited.forList.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[var(--cera-blush)]">
                    <Check className="h-[11px] w-[11px] text-[var(--cera-rose-ink)]" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-[var(--cera-body)]">{point}</span>
                </li>
              ))}
            </ul>
          </CeraReveal>

          {/* Reasons to buy something else: tinted and flagged, so the two are
              distinguishable before either list is read. */}
          <CeraReveal delay={90} className="cera-card epi-not p-6 lg:p-7">
            <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)]">
              {copy.suited.notTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {copy.suited.notList.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-[17px] w-[17px] flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
                  <span className="text-[15px] leading-relaxed text-[var(--cera-body)]">{point}</span>
                </li>
              ))}
            </ul>
          </CeraReveal>
        </div>
        <CeraReveal>
          <p className="mt-6 text-[14px] text-[var(--cera-muted)]">{copy.suited.note}</p>
        </CeraReveal>
      </section>

      {/* ─────────────────────── Where it sits ──────────────────────────── */}
      {routineSteps.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
          <CeraSectionHeader
            eyebrow={copy.routine.eyebrow}
            title={copy.routine.title}
            intro={copy.routine.intro}
          />
          {/* Baymard's cross-sell guidance: thumbnail, fully visible title,
              price and a direct add in secondary styling. */}
          <ol className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-5 lg:gap-4">
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

      {/* ───────────────────────────── Details ──────────────────────────── */}
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
            <CeraBrochureLinks productNumber={product.productNumber ?? product.id} />
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
        headline={copy.closing.title}
        note={copy.closing.body}
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
        className={`mweb-float-bottom fixed inset-x-0 bottom-0 z-50 border-t border-[var(--cera-line)] bg-[var(--cera-cream)] pb-3 backdrop-blur-xl transition-transform duration-300 ${
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
                {copy.packSize} · {copy.usageNote}
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
            <p className="min-w-0 max-w-[52%] shrink truncate text-[11px] text-[var(--cera-muted)] md:hidden">{copy.packSize}</p>
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
