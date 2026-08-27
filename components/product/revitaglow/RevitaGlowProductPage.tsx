'use client'

/**
 * Bespoke product page for REVITA GLOW BB CREAM (product 63).
 *
 * Shares the editorial design system built for product 66 - the primitives,
 * the gallery and the structural CSS all come from ../cerabarrier - and layers
 * a champagne/bronze palette on top via revitaglow.css. Only the palette and
 * the section set differ.
 *
 * Where it deliberately diverges from the sibling layouts:
 *   - A shade selector. This is the first bespoke page with a real variant, so
 *     the shade is required before the CTA unlocks and every cart call is
 *     keyed on it. Picking the wrong shade of a base is an expensive mistake
 *     for the customer and a return for us, so it is not defaulted.
 *   - A UV filter table instead of a mechanism figure, because the filter
 *     system is the actual substance of the product and the only gallery
 *     graphic that could have illustrated it carries factual errors.
 *   - The shade section leads with the manufacturer swatch video, which shows
 *     No. 1 and No. 2 drawn down side by side - the single most useful thing a
 *     shade-shopper can see.
 *   - Laboratory specification instead of clinical claims. No efficacy study
 *     exists for this product, so there are no percentages anywhere on it.
 *   - The full INCI comes from revitaGlowCopy rather than the product record,
 *     because the stored record omits the fragrance declaration. See the
 *     sourcing note at the top of that file.
 */

import '../cerabarrier/cerabarrier.css'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import './revitaglow.css'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  Sun,
} from 'lucide-react'

import { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { localizeProductImage } from '@/lib/localizedProductImages'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
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
import {
  PRODUCT_63_AR_TRANSLATION,
  PRODUCT_63_RU_TRANSLATION,
} from '@/data/product63LocalizedCopy'

import { ceraSerif } from '../cerabarrier/ceraFont'
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
import { getRevitaGlowCopy, getRevitaGlowFullInci } from './revitaGlowCopy'

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

/** Section art, each slide paired with the section it illustrates. s2 is the two-shade
 *  comparison and stays beside the shade section, s4 the glass-skin finish
 *  how-to. */
/**
 * The Aug 2026 studio set, `/images/revita_o/`. Each slide sits beside the section it
 * illustrates rather than being left to the gallery thumbs, per the bespoke-PDP slides
 * audit: s2 carries the SPF figure next to the filter table, s3 the formula summary next
 * to the layering steps, s4 the three actives next to the actives list, s5 the two shades
 * next to the shade picker, and s6 the application next to the ritual.
 *
 * Every figure printed on them is already in revitaGlowCopy.ts: SPF 38 PA+++, niacinamide
 * 2%, adenosine, erythritol, the eight botanical extracts, #01 Bright and #02 Natural,
 * 50 g and dermatologically tested. s3's "8 botanical extracts" matches how this file
 * counts them; do not relabel it seven unless you are printing the branded complex name.
 *
 * s1 and s7 and closing.jpg carry no section of their own and stay in the thumbnail strip.
 */
const SHADE_FIGURE = '/images/revita_o/s5.jpg'
const HOWTO_IMAGE = '/images/revita_o/s6.jpg'
const FILTER_IMAGE = '/images/revita_o/s2.jpg'
const FORMULA_IMAGE = '/images/revita_o/s3.jpg'
const ACTIVES_IMAGE = '/images/revita_o/s4.jpg'
const BROCHURE_URL = '/documents/ppt/GENOSYS_REVITA_GLOW_BB_CREAM.pdf'

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export default function RevitaGlowProductPage({
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
  const copy = getRevitaGlowCopy(locale)
  const shadeFigure = localizeProductImage(SHADE_FIGURE, locale)
  const howToImage = localizeProductImage(HOWTO_IMAGE, locale)
  const filterImage = localizeProductImage(FILTER_IMAGE, locale)
  const formulaImage = localizeProductImage(FORMULA_IMAGE, locale)
  const activesImage = localizeProductImage(ACTIVES_IMAGE, locale)

  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  // Two shades, neither defaulted. A base in the wrong depth is worse than one
  // extra click, so the CTA stays locked until the shopper chooses.
  const [shade, setShade] = useState<'Bright' | 'Natural' | ''>('')
  const [shadeMissing, setShadeMissing] = useState(false)
  const shadeGroupRef = useRef<HTMLDivElement | null>(null)

  const selectedShade = useMemo(
    () => copy.shades.find(s => s.value === shade) ?? null,
    [copy.shades, shade]
  )

  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay(product, user)

  // Cart lines are keyed on the colour, so the counter must follow the shade.
  const cartLine = findSelectedStandardCartLine(cartItems, product.id, shade, '')
  const inCartQty = cartLine?.quantity || 0

  // RU/AR ingredient cards come from the audited canonical payload. The raw
  // database record remains the English source for the EN page.
  const localizedIngredients =
    locale === 'ru'
      ? PRODUCT_63_RU_TRANSLATION.ingredients
      : locale === 'ar'
        ? PRODUCT_63_AR_TRANSLATION.ingredients
        : product.ingredients
  const parsedIngredients = useMemo(
    () => parseJsonArray<ActiveIngredient>(localizedIngredients),
    [localizedIngredients]
  )
  const actives = useMemo(
    () => parsedIngredients.filter(i => !i.name.includes('INCI')),
    [parsedIngredients]
  )
  // The stored declaration was corrected in Aug 2026 to add 1,2-Hexanediol and
  // the fragrance allergen block, so it now matches the Intertek artwork and is
  // the single source of truth. getRevitaGlowFullInci is the fallback.
  const fullInci =
    parsedIngredients.find(i => i.name.includes('INCI'))?.description ?? getRevitaGlowFullInci()

  const galleryImages: CeraGalleryImage[] = useMemo(() => {
    const list = Array.from(
      new Set([product.image, ...parseJsonArray<string>(product.images)].filter(Boolean))
    )
    return list.map((src, i) => ({
      src: localizeProductImage(src, locale),
      alt: `${product.name} - GENOSYS Korean dermacosmetics, image ${i + 1} of ${list.length}`,
    }))
  }, [locale, product.image, product.images, product.name])

  // Legacy records carry the catalogue number in `id` with `productNumber` null,
  // newer ones the other way round; index on whichever is present.
  const routineProductByNumber = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of routineProducts) map.set(String(p.productNumber ?? p.id), p)
    return map
  }, [routineProducts])

  const routineSteps = useMemo(() => {
    const routine = PRODUCT_ROUTINES['63']
    if (!routine) return []
    return routine.steps.map(s => {
      const pid = ROUTINE_STEP_PRODUCT_IDS[s.titleKey]
      const linked = pid ? routineProductByNumber.get(pid) ?? null : null
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
        isSelf: pid === '63',
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
  const selectShade = useCallback((value: 'Bright' | 'Natural') => {
    setShade(value)
    setShadeMissing(false)
  }, [])

  /** Scrolls the shade picker into view and flags it, instead of silently
   *  doing nothing when someone taps a locked CTA. */
  const promptForShade = useCallback(() => {
    setShadeMissing(true)
    shadeGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const addToCart = useCallback(
    async (qty: number) => {
      if (!user) {
        router.push(getLocalizedPath('/login', locale))
        return
      }
      if (!shade) {
        promptForShade()
        return
      }
      try {
        await addItem(product, qty, shade, '')
        try {
          trackAddToCart({
            id: product.id,
            name: `${product.name} - ${shade}`,
            category: product.category || 'Cosmetics',
            price: product.price,
            quantity: qty,
          })
        } catch { /* analytics is best-effort */ }
      } catch (error) {
        errorLog('RevitaGlow: add to cart failed', error)
        throw error
      }
    },
    [addItem, locale, product, promptForShade, router, shade, user]
  )

  const handleAdd = useCallback(async () => {
    if (isAdding) return
    if (user && !shade) {
      promptForShade()
      return
    }
    setIsAdding(true)
    try {
      await addToCart(quantity)
      if (user && shade) {
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2200)
      }
    } catch { /* surfaced by the cart provider */ } finally {
      setIsAdding(false)
    }
  }, [addToCart, isAdding, promptForShade, quantity, shade, user])

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
        errorLog('RevitaGlow: routine add to cart failed', error)
      } finally {
        setRoutineAdding(null)
      }
    },
    [addItem, locale, router, routineAdding, user]
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
    updateQuantity(product.id, inCartQty - 1, shade, '')
  }, [inCartQty, product.id, shade, updateQuantity])

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
      : !shade
        ? copy.shadeLabel
        : isAdding
          ? copy.adding
          : justAdded
            ? copy.added
            : copy.addToBag

  /** The shade picker, rendered in the hero and reused by nothing else - kept
   *  inline so the buy column stays readable. */
  const shadePicker = (
    <div ref={shadeGroupRef} className="mt-7 scroll-mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-ink)]">
          {copy.shadeLabel}
        </p>
        <p className="text-[13px] text-[var(--cera-muted)]">{copy.shadeHelp}</p>
      </div>

      <div
        role="radiogroup"
        aria-label={copy.shadeLabel}
        aria-required="true"
        className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
      >
        {copy.shades.map(option => {
          const selected = shade === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectShade(option.value)}
              className={`revitaglow-shade-button flex items-center gap-3.5 rounded-2xl border bg-white p-3.5 text-start ${
                selected
                  ? 'border-[var(--cera-rose)]'
                  : shadeMissing
                    ? 'border-[var(--cera-rose)]/50'
                    : 'border-[var(--cera-line)] hover:border-[var(--cera-blush-deep)]'
              }`}
            >
              <span
                aria-hidden="true"
                className="revitaglow-swatch h-11 w-11 flex-none rounded-full"
                style={{ ['--swatch' as string]: option.hex }}
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span
                    dir="ltr"
                    className="cera-serif text-[17px] leading-none text-[var(--cera-ink)] [unicode-bidi:isolate]"
                  >
                    {option.code} {option.name}
                  </span>
                </span>
                <span className="mt-1 block text-[13px] leading-snug text-[var(--cera-muted)]">
                  {option.tagline}
                </span>
              </span>
              {selected ? (
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--cera-rose)] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {shadeMissing && !shade ? (
        <p role="alert" className="mt-2.5 text-[13px] font-semibold text-[var(--cera-rose-ink)]">
          {copy.shadeRequired}
        </p>
      ) : null}
    </div>
  )

  return (
    <div className={`cera-page revitaglow-page ${ceraSerif.variable} min-h-[100dvh]`} dir={dir}>
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
                  <span className="text-[15.5px] leading-relaxed text-[var(--cera-body)]">{bullet}</span>
                </li>
              ))}
            </ul>

            {shadePicker}

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="cera-serif cera-numeral rounded-full border border-[var(--cera-line)] bg-white px-4 py-2 text-[16px] text-[var(--cera-ink)]">
                {product.size}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-blush)] px-4 py-2 text-[13px] font-semibold text-[var(--cera-rose-ink)]">
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                SPF 38 PA+++
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
                        className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700"
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
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] hover:shadow-[0_18px_38px_-20px_rgba(28,24,20,0.8)]'
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

              {inCartQty > 0 && selectedShade ? (
                <div className="mt-3 flex items-center gap-2 text-[13px] text-emerald-700">
                  <Check className="h-4 w-4" />
                  <span>
                    {copy.inBag} ·{' '}
                    <span dir="ltr" className="[unicode-bidi:isolate]">
                      {selectedShade.code} {selectedShade.name}
                    </span>{' '}
                    · {inCartQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(getLocalizedPath('/cart', locale))}
                    className="underline underline-offset-2 hover:text-emerald-800"
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
              <p className="cera-numeral text-[28px] text-[var(--cera-ink)] sm:text-[36px]">{stat.value}</p>
              <p className="mx-auto mt-2 max-w-[24ch] text-[13.5px] leading-snug text-[var(--cera-muted)]">
                {stat.label}
              </p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ────────────────── Three registered functions ──────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader
          eyebrow={copy.functions.eyebrow}
          title={copy.functions.title}
          intro={copy.functions.intro}
        />
        <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-6">
          {copy.functions.cards.map((card, i) => (
            <CeraReveal
              key={card.title}
              delay={i * 70}
              as="article"
              className="cera-card cera-card-hover flex gap-5 p-6 lg:p-7"
            >
              <span className="cera-numeral flex-none text-[26px] text-[var(--cera-rose)] sm:text-[30px]" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[15.5px]">
                  {card.body}
                </p>
              </div>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ──────────────── How the formula layers on skin ────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 lg:pb-24">
        <CeraSectionHeader
          eyebrow={copy.mechanism.eyebrow}
          title={copy.mechanism.title}
          intro={copy.mechanism.intro}
        />
        <CeraReveal className="mx-auto mt-10 max-w-[520px] lg:mt-12">
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
            <Image
              src={formulaImage}
              alt={`${product.name} - more than makeup: a ten-vitamin complex, eight botanical extracts and niacinamide at 2%`}
              fill
              sizes="(max-width: 640px) 92vw, 520px"
              quality={85}
              className="object-cover"
            />
          </div>
        </CeraReveal>

        <ol className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {copy.mechanism.steps.map((step, i) => (
            <CeraReveal
              key={step.title}
              delay={i * 70}
              as="li"
              className="cera-card cera-card-hover flex flex-col p-6 lg:p-7"
            >
              <span className="cera-numeral text-[26px] text-[var(--cera-rose)] sm:text-[30px]" aria-hidden="true">
                {step.step}
              </span>
              <h3 className="cera-serif mt-3 text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[15.5px]">
                {step.body}
              </p>
            </CeraReveal>
          ))}
        </ol>
        <CeraReveal delay={210}>
          <p
            className="mx-auto mt-8 max-w-[70ch] text-[13px] leading-relaxed text-[var(--cera-muted)]"
          >
            {copy.mechanism.note}
          </p>
        </CeraReveal>
      </section>

      {/* ─────────────────────── The filter system ──────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <CeraReveal>
                <p className="cera-eyebrow">{copy.filters.eyebrow}</p>
                <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.filters.title}</h2>
                <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-[var(--cera-body)]">
                  {copy.filters.intro}
                </p>
                <p className="mt-6 max-w-[46ch] text-[13px] leading-relaxed text-[var(--cera-muted)]">
                  {copy.filters.note}
                </p>
              </CeraReveal>

              {/* The SPF figure the table adds up to, stated once as a headline. */}
              <CeraReveal delay={90}>
                <div className="relative mt-8 aspect-square max-w-[420px] overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
                  <Image
                    src={filterImage}
                    alt={`${product.name} - SPF 38 PA+++, UV protection with radiant complexion coverage`}
                    fill
                    sizes="(max-width: 1024px) 92vw, 420px"
                    quality={85}
                    className="object-cover"
                  />
                </div>
              </CeraReveal>
            </div>

            <CeraReveal className="cera-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="revitaglow-filters w-full border-collapse text-start">
                  <caption className="sr-only">{copy.filters.title}</caption>
                  <thead>
                    <tr className="border-b border-[var(--cera-line)]">
                      {[copy.filters.columns.name, copy.filters.columns.amount, copy.filters.columns.role].map(head => (
                        <th
                          key={head}
                          scope="col"
                          className={`px-4 py-3.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-[var(--cera-muted)] text-start`}
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {copy.filters.rows.map(row => (
                      <tr key={row.name} className="border-b border-[var(--cera-line)] last:border-b-0">
                        <th
                          scope="row"
                          className={`px-4 py-4 align-top text-[14px] font-medium leading-snug text-[var(--cera-ink)] text-start`}
                        >
                          {row.name}
                        </th>
                        <td
                          className={`whitespace-nowrap px-4 py-4 align-top text-[14px] tabular-nums text-[var(--cera-rose-ink)] text-start`}
                        >
                          {row.amount}
                        </td>
                        <td
                          className={`px-4 py-4 align-top text-[13.5px] leading-snug text-[var(--cera-body)] text-start`}
                        >
                          {row.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CeraReveal>
          </div>
        </div>
      </section>

      {/* ────────────────────────── Two shades ──────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader
          eyebrow={copy.shadeSection.eyebrow}
          title={copy.shadeSection.title}
          intro={copy.shadeSection.intro}
        />

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {copy.shades.map((option, i) => {
              const selected = shade === option.value
              return (
                <CeraReveal key={option.value} delay={i * 80} as="article" className="h-full">
                  <div
                    className={`cera-card flex h-full flex-col p-6 lg:p-7 ${
                      selected ? 'border-[var(--cera-rose)]' : ''
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="revitaglow-swatch h-16 w-16 rounded-full"
                      style={{ ['--swatch' as string]: option.hex }}
                    />
                    <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--cera-rose-ink)]">
                      {option.tagline}
                    </p>
                    <h3 className="cera-serif mt-1.5 text-[24px] leading-tight text-[var(--cera-ink)]">
                      <span dir="ltr" className="inline-block [unicode-bidi:isolate]">
                        {option.code} {option.name}
                      </span>
                    </h3>
                    <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-[var(--cera-body)]">
                      {option.body}
                    </p>
                    <button
                      type="button"
                      onClick={() => selectShade(option.value)}
                      className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full border text-[13px] font-semibold transition-colors ${
                        selected
                          ? 'border-[var(--cera-rose)] bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]'
                          : 'border-[var(--cera-ink)] text-[var(--cera-ink)] hover:bg-[var(--cera-cta)] hover:text-white'
                      }`}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" /> : null}
                      {selected ? copy.shadeSelected : copy.shadeLabel}
                    </button>
                  </div>
                </CeraReveal>
              )
            })}
          </div>

          {/* The manufacturer swatch video draws both shades down side by side,
              which answers the shade question better than any still. */}
          <CeraReveal>
            {product.videoUrl ? (
              <div className="mx-auto w-full max-w-[340px]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
                  <video
                    className="h-full w-full object-cover"
                    src={product.videoUrl}
                    poster={shadeFigure}
                    controls
                    playsInline
                    muted
                    preload="metadata"
                  >
                    {copy.video.unsupported}
                  </video>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--cera-muted)]">
                  {copy.video.body}
                </p>
              </div>
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
                <Image
                  src={shadeFigure}
                  alt={copy.shadeSection.figureAlt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  quality={85}
                  className="object-cover"
                />
              </div>
            )}
          </CeraReveal>
        </div>

        <CeraReveal>
          <p
            className="mx-auto mt-10 max-w-[70ch] border-s-2 border-[var(--cera-blush-deep)] ps-5 text-[15px] italic leading-relaxed text-[var(--cera-muted)]"
          >
            {copy.shadeSection.sameFormula}
          </p>
        </CeraReveal>
      </section>

      {/* ───────────────────────── How to use ───────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
            <CeraReveal className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
                <Image
                  src={howToImage}
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
                    <span className="cera-numeral text-[22px] text-white sm:text-[26px]">{i + 1}</span>
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
              <Sun className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
              <span>{copy.howTo.note}</span>
            </p>
          </CeraReveal>
          </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────── Actives + INCI ────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader
          eyebrow={copy.actives.eyebrow}
          title={copy.actives.title}
          intro={copy.actives.intro}
        />

        {/* The three actives the list below opens with, drawn at the top so the section
            does not start straight into a two-column ingredient list. */}
        <CeraReveal className="mx-auto mt-10 max-w-[520px] lg:mt-12">
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
            <Image
              src={activesImage}
              alt={`${product.name} - niacinamide at 2%, adenosine and erythritol`}
              fill
              sizes="(max-width: 640px) 92vw, 520px"
              quality={85}
              className="object-cover"
            />
          </div>
        </CeraReveal>

        {actives.length > 0 ? (
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
        ) : null}

        <CeraReveal className="mx-auto mt-10 max-w-[820px]">
          <p
            className="flex gap-3 rounded-2xl border border-[var(--cera-blush-deep)] bg-[var(--cera-blush)]/60 p-5 text-[14.5px] leading-relaxed text-[var(--cera-body)]"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
            <span>{copy.actives.fragranceNote}</span>
          </p>

          <div className="mt-6 border-t border-[var(--cera-line)]">
            <CeraAccordion title={copy.actives.fullInci}>
              <p className="text-[14.5px] leading-[1.9] text-[var(--cera-body)]" dir="ltr">
                {fullInci}
              </p>
              <p className="mt-3 text-[13px] text-[var(--cera-muted)]">{copy.actives.fullInciNote}</p>
            </CeraAccordion>
          </div>
        </CeraReveal>
      </section>

      {/* ─────────────── Laboratory specification (no clinical %) ───────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <CeraReveal>
                <p className="cera-eyebrow">{copy.lab.eyebrow}</p>
                <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.lab.title}</h2>
                <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-[var(--cera-body)]">
                  {copy.lab.intro}
                </p>
                <p className="mt-6 max-w-[46ch] text-[13px] leading-relaxed text-[var(--cera-muted)]">
                  {copy.lab.disclaimer}
                </p>
              </CeraReveal>
            </div>

            <CeraReveal className="cera-card overflow-hidden">
              <table className="revitaglow-spec w-full border-collapse text-start">
                <caption className="sr-only">{copy.lab.title}</caption>
                <tbody>
                  {copy.lab.rows.map(row => (
                    <tr key={row.label} className="border-b border-[var(--cera-line)] last:border-b-0">
                      <th
                        scope="row"
                        className={`w-[42%] px-5 py-4 align-top text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[var(--cera-muted)] text-start`}
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
        </div>
      </section>

      {/* ───────────────────────── Safety notes ─────────────────────────── */}
      <section className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 lg:py-24">
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
          <p className="mt-6 text-[13.5px] text-[var(--cera-muted)]">
            {copy.safety.note}
          </p>
        </CeraReveal>
      </section>

      {/* ─────────────────────── Complete the routine ───────────────────── */}
      {routineSteps.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <CeraSectionHeader
              eyebrow={copy.routine.eyebrow}
              title={copy.routine.title}
              intro={copy.routine.intro}
            />
            <ol className="mx-auto mt-10 grid max-w-[1080px] grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-5 lg:gap-4">
              {routineSteps.map((step, i) => {
                const item = step.linked
                const busy = item ? routineAdding === item.id : false
                const done = item ? routineAdded === item.id : false
                const inBag = item
                  ? findSelectedStandardCartLine(cartItems, item.id, '', '')?.quantity || 0
                  : 0
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
                              sizes="(max-width: 1024px) 45vw, 19vw"
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
                          className="cera-serif text-[15.5px] leading-snug text-[var(--cera-ink)] hover:text-[var(--cera-rose-ink)]"
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
                              add, so it reuses the hero CTA. With no shade picked yet
                              that scrolls back up to the swatches instead of guessing. */}
                          {step.isSelf ? (
                            <button
                              type="button"
                              onClick={handleAdd}
                              disabled={!product.inStock || isAdding}
                              className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                                justAdded
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
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
                              className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                                done
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
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
                              className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-full border text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                                done
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
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
                              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[var(--cera-line)] text-[12.5px] font-semibold text-[var(--cera-rose-ink)] hover:border-[var(--cera-rose)]"
                            >
                              {copy.routine.viewProduct}
                              <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                            </Link>
                          )}

                          {inBag > 0 ? (
                            <p className="mt-2 flex items-center justify-center gap-1.5 text-[11.5px] text-emerald-700">
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
          </div>
        </section>
      )}

      {/* ───────────────────────── Details + brochure ───────────────────── */}
      <section className="mx-auto max-w-[820px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.details.eyebrow} title={copy.details.title} />
        <CeraReveal className="cera-card mt-10 p-6 lg:mt-14 lg:p-8">
          <dl className="divide-y divide-[var(--cera-line)]">
            {copy.details.rows.map(row => (
              <div key={row.label} className="flex gap-4 py-3.5">
                <dt className="w-[38%] flex-none text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[var(--cera-muted)]">
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
            href={BROCHURE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 py-2 text-[13.5px] font-semibold text-[var(--cera-rose-ink)] underline-offset-4 hover:underline"
          >
            <Download className="h-4 w-4" />
            {copy.details.brochure}
          </a>
        </CeraReveal>
      </section>

      {/* ──────────────────────────── FAQ ───────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[820px] px-4 sm:px-6">
          <CeraSectionHeader eyebrow={copy.faq.eyebrow} title={copy.faq.title} />
          <div className="mt-10 border-t border-[var(--cera-line)] lg:mt-14">
            {copy.faq.items.map((item, i) => (
              <CeraAccordion key={item.q} title={item.q} defaultOpen={i === 0}>
                <p>{item.a}</p>
              </CeraAccordion>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Reviews ────────────────────────────── */}
      <section id="reviews">
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
                ? 'bg-emerald-600 text-white'
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
              <p className="cera-serif truncate text-[16px] text-[var(--cera-ink)]">{product.name}</p>
              <p className="truncate text-[11px] text-[var(--cera-muted)]">
                {product.size} · SPF 38 PA+++
                {selectedShade ? ` · ${selectedShade.code} ${selectedShade.name}` : ''}
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
            <p className="min-w-0 max-w-[52%] shrink flex overflow-hidden items-center gap-1.5 text-[11px] text-[var(--cera-muted)] md:hidden">
              {selectedShade ? (
                <>
                  <span
                    aria-hidden="true"
                    className="revitaglow-swatch inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ ['--swatch' as string]: selectedShade.hex }}
                  />
                  <span dir="ltr" className="truncate [unicode-bidi:isolate]">
                    {selectedShade.code} {selectedShade.name}
                  </span>
                </>
              ) : (
                product.size
              )}
            </p>
          </div>

          {!(inCartQty > 0 && shade) && product.inStock && user ? (
            <CeraStickyQuantity
              value={quantity}
              onChange={setQuantity}
              decreaseLabel={t('product.decreaseQuantity')}
              increaseLabel={t('product.increaseQuantity')}
              label={t('product.quantity')}
            />
          ) : null}

          <div aria-hidden="true" className="w-full md:hidden" />

          {inCartQty > 0 && product.inStock && user && shade ? (
            <div className="flex h-12 flex-1 items-center justify-between rounded-full bg-emerald-600 px-1.5 text-white md:w-[280px] md:flex-none">
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
                justAdded ? 'bg-emerald-600 text-white' : 'bg-[var(--cera-cta)] text-white active:bg-[var(--cera-rose-ink)]'
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
