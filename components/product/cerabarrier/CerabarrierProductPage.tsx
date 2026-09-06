'use client'

import './cerabarrier.css'
import PageBreadcrumb from '@/components/PageBreadcrumb'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
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
import { loginPathWithReturn } from '@/lib/loginReturn'
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

import { getCeraCopy } from './cerabarrierCopy'
import CeraGallery, { CeraGalleryImage } from './CeraGallery'
import CeraClosingCta from './CeraClosingCta'
import {
  CeraAccordion,
  CeraBarcodeRows,
  CeraReveal,
  CeraSectionHeader,
  CeraStickyQuantity,
  useCeraStickyBar,
} from './CeraPrimitives'

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

/**
 * The Aug 2026 studio set, `/images/cera_o/`. Each slide sits beside the section it
 * actually illustrates rather than being left to the gallery thumbs, per the bespoke-PDP
 * slides audit. Every claim printed on these slides is already in cerabarrierCopy.ts -
 * +145.8%, 2.4×, the five ceramides, the pro/prebiotic list, and the "clinical testing on
 * a single use, individual results vary" footnote - so nothing here introduces a claim the
 * page does not already make.
 */
const TEXTURE_IMAGE = '/images/cera_o/s3.jpeg' // GEL. WATER. FOAM.
const COMPLEX_IMAGE = '/images/cera_o/s1.jpeg' // Barrier Lipid × Microbiome Complex
const RITUAL_IMAGE = '/images/cera_o/s6.jpeg' // NO TIGHTNESS.
const FORMULA_IMAGE = '/images/cera_o/s5.jpeg' // MORE THAN CERAMIDES.
const PROOF_IMAGE = '/images/cera_o/s4.jpeg' // CLINICAL PROOF +145.8% / 2.4×

/**
 * The size cards stay on the older set: they need one bottle per card, and the 2026 set
 * photographs the two sizes together (s7) rather than separately. s7 is in the gallery.
 */
const SIZE_SPEC_IMAGE: Record<string, string> = {
  '200ml': '/images/cera/S4.jpeg',
  '600ml': '/images/cera/S5.jpeg',
}
const BROCHURE_URL = '/documents/ppt/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf'

function parseJsonArray<T>(raw: string | null | undefined): T[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export default function CerabarrierProductPage({
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
  const copy = getCeraCopy(locale)

  // ── Variants ──────────────────────────────────────────────────────────
  const sizeOptions = useMemo(() => getProductSizeOptions('66', product), [product])
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0]?.value || '')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const unitPrice = getPriceForSize(product, selectedSize)
  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay({ ...product, price: unitPrice }, user, { selectedSize })

  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', selectedSize)
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
  // main image is prepended here (it is never stored inside `images`).
  // Slides carry their claims as printed text, so they are swapped for the
  // translated file where one exists - see lib/localizedProductImages.ts.
  const galleryImages: CeraGalleryImage[] = useMemo(() => {
    const list = Array.from(
      new Set([product.image, ...parseJsonArray<string>(product.images)].filter(Boolean))
    )
    return list.map((src, i) => ({
      src: localizeProductImage(src, locale),
      alt: `${product.name} - GENOSYS Korean dermacosmetics, image ${i + 1} of ${list.length}`,
    }))
  }, [locale, product.image, product.images, product.name])

  // The five inline figures follow the same rule as the gallery.
  const textureImage = localizeProductImage(TEXTURE_IMAGE, locale)
  const complexImage = localizeProductImage(COMPLEX_IMAGE, locale)
  const ritualImage = localizeProductImage(RITUAL_IMAGE, locale)
  const formulaImage = localizeProductImage(FORMULA_IMAGE, locale)
  const proofImage = localizeProductImage(PROOF_IMAGE, locale)

  // Legacy records carry the catalogue number in `id` with `productNumber` null,
  // newer ones the other way round; index on whichever is present.
  const routineProductByNumber = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of routineProducts) map.set(String(p.productNumber ?? p.id), p)
    return map
  }, [routineProducts])

  const routineSteps = useMemo(() => {
    const routine = PRODUCT_ROUTINES['66']
    if (!routine) return []
    return routine.steps.map(s => {
      const pid = ROUTINE_STEP_PRODUCT_IDS[s.titleKey]
      const linked = pid ? routineProductByNumber.get(pid) ?? null : null
      return {
        key: s.titleKey,
        productId: pid ?? null,
        linked,
        // Steps that ship in more than one size must not be added silently at
        // whichever size happens to be default. They get the picker instead.
        needsSizeChoice: linked
          ? getProductSizeOptions(linked.productNumber || linked.id, linked).length > 0
          : false,
        isSelf: pid === '66',
        image: linked?.image || getRoutineStepImage(s.titleKey),
        title: t(`product.${s.titleKey}`),
        description: t(`product.${s.descKey}`),
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

  // ── Sticky desktop bar appears once the hero CTA leaves the viewport ──
  const { heroCta: ctaSentinel, closingCta, showStickyBar } = useCeraStickyBar()

  // ── Cart actions ──────────────────────────────────────────────────────
  const addToCart = useCallback(
    async (qty: number, size: string = selectedSize) => {
      if (!user) {
        router.push(loginPathWithReturn(locale))
        return
      }
      const price = getPriceForSize(product, size)
      try {
        await addItem({ ...product, price }, qty, undefined, size)
        try {
          trackAddToCart({
            id: product.id,
            name: product.name,
            category: product.category || 'Cosmetics',
            price,
            quantity: qty,
          })
        } catch { /* analytics is best-effort */ }
      } catch (error) {
        errorLog('Cerabarrier: add to cart failed', error)
        throw error
      }
    },
    [addItem, locale, product, router, selectedSize, user]
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

  // Per-size add used by the size-comparison cards, so a shopper can buy either
  // format without scrolling back to the hero selector.
  const [sizeAdding, setSizeAdding] = useState<string | null>(null)
  const [sizeAdded, setSizeAdded] = useState<string | null>(null)

  const handleAddSize = useCallback(
    async (size: string) => {
      if (sizeAdding) return
      setSizeAdding(size)
      try {
        await addToCart(1, size)
        if (user) {
          setSizeAdded(size)
          setTimeout(() => setSizeAdded(prev => (prev === size ? null : prev)), 2200)
        }
      } catch { /* surfaced by the cart provider */ } finally {
        setSizeAdding(null)
      }
    },
    [addToCart, sizeAdding, user]
  )

  // Routine cross-sell adds. Every routine product for 66 is a single-variant
  // SKU, so there is no size to choose and one tap is enough.
  const [routineAdding, setRoutineAdding] = useState<string | null>(null)
  const [routineAdded, setRoutineAdded] = useState<string | null>(null)
  /** Routine step whose shade or size picker is open, if any. */
  const [optionStep, setOptionStep] = useState<Product | null>(null)

  const handleAddRoutineProduct = useCallback(
    async (item: Product, selection?: ProductOptionSelection, quantity = 1) => {
      if (!user) {
        router.push(loginPathWithReturn(locale))
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
        errorLog('Cerabarrier: routine add to cart failed', error)
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
        router.push(loginPathWithReturn(locale))
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
    updateQuantity(product.id, inCartQty - 1, '', selectedSize)
  }, [inCartQty, product.id, selectedSize, updateQuantity])

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
    <div className={`cera-page min-h-[100dvh]`} dir={dir}>
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
          {/* Gallery */}
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

            {/* Size selector */}
            {sizeOptions.length > 1 && (
              <fieldset className="mt-8">
                <legend className="cera-eyebrow mb-3">{copy.chooseSize}</legend>
                <div className="grid grid-cols-2 gap-3">
                  {sizeOptions.map((option, index) => {
                    const isActive = option.value === selectedSize
                    const optionPrice = getPriceForSize(product, option.value)
                    const label = index === 0 ? copy.sizes.homecareLabel : copy.sizes.proLabel
                    const note = index === 0 ? copy.sizes.homecareNote : copy.sizes.proNote
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSize(option.value)}
                        aria-pressed={isActive}
                        className={`group relative overflow-hidden rounded-2xl border p-4 text-start transition-all duration-300 ${
                          isActive
                            ? 'border-[var(--cera-rose)] bg-white shadow-[0_16px_36px_-26px_rgba(143,90,90,0.65)]'
                            : 'border-[var(--cera-line)] bg-white/60 hover:border-[var(--cera-blush-deep)] hover:bg-white'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute top-3 flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                            isRtl ? 'left-3' : 'right-3'
                          } ${isActive ? 'border-[var(--cera-rose)] bg-[var(--cera-rose)]' : 'border-[var(--cera-line)]'}`}
                        >
                          {isActive ? <Check className="h-2.5 w-2.5 text-white" strokeWidth={4} /> : null}
                        </span>
                        <span className="cera-serif block text-[24px] leading-none text-[var(--cera-ink)]">
                          {option.label}
                        </span>
                        <span className="mt-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-rose-ink)]">
                          {label}
                        </span>
                        <span className="mt-2 block text-[14px] leading-snug text-[var(--cera-body)]">{note}</span>
                        {canSeePrices ? (
                          <span className="mt-3 block text-[15px] font-semibold text-[var(--cera-ink)]">
                            {optionPrice.toFixed(2)} {isRtl ? 'درهم' : 'AED'}
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )}

            {/* Price + CTA */}
            <div ref={ctaSentinel} className="mt-8">
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
                      : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] hover:shadow-[0_18px_38px_-20px_rgba(25,23,22,0.8)]'
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
                  <span>
                    {copy.inBag} · {inCartQty} × {selectedSize}
                  </span>
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

            {/* Trust badges */}
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
              <p className="cera-serif cera-numeral text-[32px] text-[var(--cera-ink)] sm:text-[40px]">{stat.value}</p>
              <p className="mx-auto mt-2 max-w-[24ch] text-[14px] leading-snug text-[var(--cera-muted)]">
                {stat.label}
              </p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Science cards ────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.science.eyebrow} title={copy.science.title} intro={copy.science.intro} />
        <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-6">
          {copy.science.cards.map((card, i) => (
            <CeraReveal
              key={card.title}
              delay={i * 80}
              as="article"
              className="cera-card cera-card-hover flex flex-col p-7 lg:p-8"
            >
              <ScienceIcon index={i} />
              <h3 className="cera-serif mt-5 text-[23px] leading-tight lg:text-[25px]">{card.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--cera-body)] lg:text-[16px]">{card.body}</p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Texture story ────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
          <CeraReveal>
            <div className="cera-glow relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)]">
              <Image
                src={textureImage}
                alt={`${product.name} - gel, water and foam side by side`}
                fill
                sizes="(max-width: 1024px) 92vw, 44vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>

          <div>
            <CeraReveal>
              <p className="cera-eyebrow">{copy.texture.eyebrow}</p>
              <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.texture.title}</h2>
            </CeraReveal>

            <ol className="mt-8 space-y-6 lg:mt-10">
              {copy.texture.steps.map((step, i) => (
                <CeraReveal key={step.label} as="li" delay={i * 110}>
                  <div className="flex items-center gap-5">
                    <div
                      className={`cera-orb cera-orb--${['gel', 'water', 'foam'][i]} h-[76px] w-[76px] flex-none sm:h-[92px] sm:w-[92px]`}
                    >
                      <span className="cera-orb__sheen" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="cera-serif text-[22px] leading-none text-[var(--cera-ink)] sm:text-[26px]">
                        {step.label}
                      </p>
                      <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[16px]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </CeraReveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ─────────────────── CERABARRIER BIOME™ Complex ─────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <CeraReveal className="order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-[var(--cera-cream)]">
              <Image
                src={complexImage}
                alt="CERABARRIER BIOME - barrier lipids with five ceramides, cholesterol and phytosphingosine, beside the pro- and prebiotic microbiome complex"
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>

          <div className="order-1 lg:order-2">
            <CeraReveal>
              <p className="cera-eyebrow">{copy.complex.eyebrow}</p>
              <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.complex.title}</h2>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-[var(--cera-body)]">
                {copy.complex.body}
              </p>
            </CeraReveal>
            <ul className="mt-8 space-y-6">
              {copy.complex.points.map((point, i) => (
                <CeraReveal key={point.title} as="li" delay={i * 70}>
                  <div className="flex gap-4">
                    <span className="cera-serif cera-numeral mt-0.5 w-8 flex-none text-[20px] text-[var(--cera-rose)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[var(--cera-ink)]">{point.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--cera-body)]">{point.body}</p>
                    </div>
                  </div>
                </CeraReveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── How to use ───────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <CeraReveal>
              <p className="cera-eyebrow">{copy.howTo.eyebrow}</p>
              <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.howTo.title}</h2>
              <p className="mt-3 inline-flex rounded-full bg-[var(--cera-blush)] px-4 py-1.5 text-[13px] font-medium text-[var(--cera-rose-ink)]">
                {copy.howTo.frequency}
              </p>
            </CeraReveal>

            <ol className="mt-9 space-y-4">
              {copy.howTo.steps.map((step, i) => (
                <CeraReveal key={step.title} as="li" delay={i * 80}>
                  <div
                    className="cera-card flex gap-5 p-5 sm:gap-6 sm:p-6"
                  >
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
              <p className="mt-8 max-w-[58ch] border-s-2 border-[var(--cera-blush-deep)] ps-5 text-[15px] italic leading-relaxed text-[var(--cera-muted)]">
                {copy.howTo.note}
              </p>
            </CeraReveal>
          </div>

          <CeraReveal className="lg:pt-4">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
              <Image
                src={ritualImage}
                alt={`${product.name} - clean, comfortable skin with no tight feeling after washing`}
                fill
                sizes="(max-width: 1024px) 92vw, 40vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>
        </div>
      </section>

      {/* ─────────────────────────── Video ──────────────────────────────── */}
      {product.videoUrl ? (
        <section className="border-t border-[var(--cera-line)] py-16 lg:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
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
                <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">
                  {copy.video.title}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[var(--cera-body)]">
                  {copy.video.body}
                </p>
              </CeraReveal>
            </div>
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

          {/* The section used to open straight into the ingredient list. This slide is the
              same list drawn as an architecture - lipids, ceramides, microbiome complex,
              cholesterol and phytosphingosine - so it earns the space above it. */}
          <CeraReveal className="mx-auto mt-10 max-w-[540px] lg:mt-12">
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-[var(--cera-cream)]">
              <Image
                src={formulaImage}
                alt="More than ceramides - barrier lipids, five ceramides, the microbiome complex, and cholesterol with phytosphingosine"
                fill
                sizes="(max-width: 640px) 92vw, 540px"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>

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

      {/* ──────────────────────────── Proof ─────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <CeraReveal>
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-[var(--cera-line)] bg-white">
              <Image
                src={proofImage}
                alt={`${product.name} - clinical proof: +145.8% immediate hydration and a 2.4x increase in skin hydration`}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </CeraReveal>

          <div>
            <CeraReveal>
              <p className="cera-eyebrow">{copy.proof.eyebrow}</p>
              <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.proof.title}</h2>
              <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-rose-ink)]">
                {copy.proof.clinicalLabel}
              </p>
            </CeraReveal>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {copy.proof.claims.map((claim, i) => (
                <CeraReveal key={claim.label} delay={i * 90} className="cera-card p-6">
                  <p className="cera-serif cera-numeral text-[34px] text-[var(--cera-ink)] sm:text-[42px]">{claim.value}</p>
                  <p className="mt-2 text-[14px] leading-snug text-[var(--cera-body)]">{claim.label}</p>
                </CeraReveal>
              ))}
            </div>

            <CeraReveal>
              <h3 className="cera-serif mt-10 text-[24px] text-[var(--cera-ink)]">{copy.proof.feelTitle}</h3>
              <ul className="mt-4 space-y-3">
                {copy.proof.feels.map(feel => (
                  <li key={feel} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--cera-rose)]" />
                    <span className="text-[16px] leading-relaxed text-[var(--cera-body)]">{feel}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] leading-relaxed text-[var(--cera-muted)]">{copy.proof.disclaimer}</p>
            </CeraReveal>
          </div>
        </div>
      </section>

      {/* ────────────────── Size comparison / details ───────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <CeraSectionHeader eyebrow={copy.details.eyebrow} title={copy.details.title} />
          <div className="mt-10 grid grid-cols-1 gap-5 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
            {sizeOptions.map((option, index) => {
              const spec = SIZE_SPEC_IMAGE[option.value]
              const sizeInCart =
                findSelectedStandardCartLine(cartItems, product.id, '', option.value)?.quantity || 0
              const busy = sizeAdding === option.value
              const done = sizeAdded === option.value
              const cardCtaLabel = !product.inStock
                ? copy.outOfStock
                : !user
                  ? copy.loginToShop
                  : busy
                    ? copy.adding
                    : done
                      ? copy.added
                      : copy.addToBag
              return (
                <CeraReveal key={option.value} delay={index * 80} as="article" className="cera-card cera-card-hover overflow-hidden">
                  {spec ? (
                    <div className="relative aspect-square bg-[var(--cera-cream)]">
                      <Image
                        src={spec}
                        alt={`${product.name} ${option.label}`}
                        fill
                        sizes="(max-width: 1024px) 92vw, 30vw"
                        quality={85}
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="cera-serif text-[26px] leading-none text-[var(--cera-ink)]">{option.label}</h3>
                      {canSeePrices ? (
                        <span className="text-[15px] font-semibold text-[var(--cera-ink)]">
                          {getPriceForSize(product, option.value).toFixed(2)} {isRtl ? 'درهم' : 'AED'}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-rose-ink)]">
                      {index === 0 ? copy.sizes.homecareLabel : copy.sizes.proLabel}
                    </p>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--cera-body)]">
                      {index === 0 ? copy.sizes.homecareNote : copy.sizes.proNote}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAddSize(option.value)}
                      disabled={!product.inStock || busy}
                      className={`mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                        done
                          ? 'bg-[var(--cera-ink)] text-white'
                          : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)]'
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                      {cardCtaLabel}
                    </button>

                    {sizeInCart > 0 ? (
                      <p className="mt-3 flex items-center gap-2 text-[13px] text-[var(--cera-ok)]">
                        <Check className="h-4 w-4 flex-none" />
                        <span>
                          {copy.inBag} · {sizeInCart} × {option.label}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </CeraReveal>
              )
            })}

            <CeraReveal delay={160} className="cera-card p-6 lg:p-8">
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
                href={BROCHURE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 py-2 text-[14px] font-semibold text-[var(--cera-rose-ink)] underline-offset-4 hover:underline"
              >
                <Download className="h-4 w-4" />
                {copy.details.brochure}
              </a>
            </CeraReveal>
          </div>
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
              price and a direct add in secondary styling. The long step copy
              lives on each product's own page, which keeps this strip compact
              and scannable rather than a wall of paragraphs. */}
          <ol className="mt-10 grid grid-cols-2 gap-3 lg:mt-14 lg:grid-cols-5 lg:gap-4">
            {routineSteps.map((step, i) => {
              const item = step.linked
              const busy = item ? routineAdding === item.id : false
              const done = item ? routineAdded === item.id : false
              const inBag = item
                ? findSelectedStandardCartLine(cartItems, item.id, '', '')?.quantity || 0
                : 0
              // Same treatment the main buy box gets, so a customer on a tier
              // discount is not quoted the list price here.
              const itemPricing = item ? getPricingDisplay(item, user) : null

              return (
                <CeraReveal key={step.key} as="li" delay={i * 60}>
                  <div
                    className={`cera-card flex h-full flex-col overflow-hidden ${
                      step.isSelf ? 'border-[var(--cera-rose)] bg-[var(--cera-blush)]/40' : ''
                    }`}
                  >
                    <Link
                      href={step.productId ? getLocalizedPath(`/products/${step.productId}`, locale) : '#'}
                      className="group block"
                      aria-label={step.title}
                    >
                      <div className="relative aspect-square overflow-hidden bg-[var(--cera-cream)]">
                        {step.image ? (
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            sizes="(max-width: 1024px) 45vw, 18vw"
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
                        href={step.productId ? getLocalizedPath(`/products/${step.productId}`, locale) : '#'}
                        className="text-[16px] leading-snug text-[var(--cera-ink)] hover:text-[var(--cera-rose-ink)]"
                      >
                        {step.title}
                      </Link>

                      {canSeePrices && itemPricing ? (
                        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 text-[14px] font-semibold tabular-nums text-[var(--cera-ink)]">
                          <span>
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
                            add, so it reuses the hero CTA and its selected size. */}
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
                            href={step.productId ? getLocalizedPath(`/products/${step.productId}`, locale) : '#'}
                            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[var(--cera-line)] text-[13px] font-semibold text-[var(--cera-rose-ink)]"
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
      <section id="reviews" className="mx-auto max-w-[1000px] scroll-mt-24 px-4 py-16 sm:px-6 lg:py-20">
        <ProductReviews productId={product.id} variant="editorial" />
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
                {selectedSize} · {copy.eyebrow}
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
            <p className="min-w-0 max-w-[52%] shrink truncate text-[11px] text-[var(--cera-muted)] md:hidden">{selectedSize}</p>
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

/** Line icons for the four science cards, drawn to match the page weight. */
function ScienceIcon({ index }: { index: number }) {
  const common = 'h-6 w-6 text-[var(--cera-rose-ink)]'
  const wrap = (child: React.ReactNode) => (
    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--cera-blush)]">{child}</span>
  )

  if (index === 0) {
    return wrap(
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
        <path d="M6 4.5c0 3-3 4.2-3 7a3 3 0 0 0 6 0c0-2.8-3-4-3-7Z" strokeLinejoin="round" />
        <circle cx="16.5" cy="8" r="2.2" />
        <circle cx="19.5" cy="13" r="1.6" />
        <circle cx="14.5" cy="13.5" r="1.3" />
        <path d="M4 19.5h16" strokeLinecap="round" />
      </svg>
    )
  }
  if (index === 1) {
    return wrap(
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
        <path d="M12 3 5 6v5.2c0 4.2 2.9 7.6 7 9.3 4.1-1.7 7-5.1 7-9.3V6l-7-3Z" strokeLinejoin="round" />
        <path d="M9.2 12.3h5.6M9.2 9.6h5.6M10.4 15h3.2" strokeLinecap="round" />
      </svg>
    )
  }
  if (index === 2) {
    return wrap(
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="9.3" cy="10" r="1.5" />
        <circle cx="14.6" cy="9.4" r="1.1" />
        <circle cx="13" cy="14.6" r="1.7" />
        <path d="M10.8 11.5 12 13" strokeLinecap="round" />
      </svg>
    )
  }
  return wrap(
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
      <path d="M12 3.5c3.6 3.3 5.5 6 5.5 8.7a5.5 5.5 0 1 1-11 0c0-2.7 1.9-5.4 5.5-8.7Z" strokeLinejoin="round" />
      <path d="M9.6 13.4c.2 1.6 1.3 2.6 2.9 2.8" strokeLinecap="round" />
    </svg>
  )
}
