'use client'

/**
 * Product page for the EyeCell EYE ZONE CARE KIT (product 50).
 *
 * Modeled on the beauty-box layout because the argument is the sequence and
 * the arithmetic, not a fourth formula. It is not registered as a beauty box:
 * this carton is a registered Korean kit with its own EAN, and the fourth
 * piece (the 0.25mm eye roller) has no retail PDP.
 *
 *   contents  serum, roller, patches, cream. Live price / size / barcode /
 *             link for 17, 24 and 33. The roller is kit-only.
 *   howTo     cleanse, serum + roll, patches 20-40 min, cream
 *   evidence  the two functional pairs and the 0.25mm roller. No kit trial.
 *   suited    pregnancy, peanut oil, metal / keloid, or buy one piece
 *
 * The separate total is the three cosmetics only. The roller is not in that
 * sum. If the three ever cost less than the kit, the saving row hides.
 */

import '../cerabarrier/cerabarrier.css'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import './eyekit.css'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Share2,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

import { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'
import { getProductBarcodes } from '@/data/productBarcodes'
import { translateSize } from '@/utils/sizeTranslations'
import { UNITS_SOLD_DISPLAY_THRESHOLD, roundUnitsSold } from '@/lib/salesDisplay'
import { trackAddToCart } from '@/lib/analytics'
import { errorLog } from '@/lib/logger'
import ProductReviews from '@/components/product/ProductReviews'

import { ceraSerif } from '../cerabarrier/ceraFont'
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
import { getEyeKitCopy } from './eyekitCopy'

interface Props {
  product: Product
  unitsSold?: number
  /** Live records for products 17, 24 and 33. The eye roller has no retail
   *  SKU, so it is never in this list. Resolved from BESPOKE_COMPANIONS. */
  routineProducts?: Product[]
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

export default function EyeKitProductPage({
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
  const copy = getEyeKitCopy(locale)
  const currency = isRtl ? 'درهم' : 'AED'

  // One kit, one SKU, so no size or shade is ever passed to the cart.
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay(product, user)

  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', '')
  const inCartQty = cartLine?.quantity || 0

  const memberByNumber = useMemo(() => {
    const map = new Map<string, Product>()
    for (const p of routineProducts) map.set(String(p.productNumber ?? p.id), p)
    return map
  }, [routineProducts])

  /**
   * Kit hero, then the four-piece group shot and anything the kit record
   * lists, then the live packshots of 17 / 24 / 33 and the kit-only roller.
   * Member mains are composed from the catalogue so a replaced packshot
   * updates here too. Main is prepended; it is not also stored in `images`.
   */
  const galleryImages: CeraGalleryImage[] = useMemo(() => {
    const members = copy.contents.items
      .map(item => (item.productNumber ? memberByNumber.get(item.productNumber)?.image : item.image))
      .filter((src): src is string => Boolean(src))
    const listed = parseJsonArray<string>(product.images)
    const list = Array.from(
      new Set([product.image, ...listed, ...members].filter(Boolean))
    )
    return list.map((src, i) => ({
      src,
      alt: `${product.name} - GENOSYS Korean dermacosmetics, image ${i + 1} of ${list.length}`,
      blend: src === '/images/eye_kit/roller.jpeg' || src === '/images/eye_kit/contents.jpeg',
    }))
  }, [copy.contents.items, memberByNumber, product.image, product.images, product.name])

  /**
   * Copy declares the four pieces and the order; the catalogue supplies
   * price, size, stock and image for the three cosmetics. The roller has
   * no live record, so those fields stay empty rather than invented.
   */
  const contents = useMemo(
    () =>
      copy.contents.items.map(item => {
        const linked = item.productNumber ? memberByNumber.get(item.productNumber) ?? null : null
        const unitPricing = linked ? getPricingDisplay(linked, user) : null
        return {
          ...item,
          linked,
          size: linked ? translateSize(linked.size, locale, linked.category) : null,
          image: linked?.image ?? item.image ?? null,
          unitPrice: unitPricing?.displayPrice ?? null,
          lineTotal: unitPricing ? unitPricing.displayPrice * item.quantity : null,
          ean: item.productNumber ? getProductBarcodes(item.productNumber)[0]?.ean ?? null : null,
          href: item.productNumber ? getLocalizedPath(`/products/${item.productNumber}`, locale) : null,
        }
      }),
    [copy.contents.items, locale, memberByNumber, user]
  )

  /**
   * Compare only the three cosmetics. The roller has no retail price, so it
   * must not zero the whole panel. If any of the three records is missing,
   * hide the comparison rather than understate the separate total.
   */
  const value = useMemo(() => {
    if (!canSeePrices) return null
    const priced = contents.filter(item => item.productNumber)
    if (priced.some(item => item.lineTotal === null)) return null
    const separately = priced.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0)
    const boxPrice = pricing.displayPrice
    const saving = separately - boxPrice
    return {
      separately,
      boxPrice,
      saving,
      savingPercent: separately > 0 ? Math.round((saving / separately) * 100) : 0,
      showSaving: saving > 0.005,
    }
  }, [canSeePrices, contents, pricing.displayPrice])

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
        errorLog('EyeKit: add to cart failed', error)
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

  const priceLabel = canSeePrices ? `${pricing.displayPrice.toFixed(2)} ${currency}` : null

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
    <div
      className={`cera-page ek-page ${ceraSerif.variable} min-h-[100dvh]`}
      dir={dir}
    >
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

            {/* One kit, so the contents are stated rather than selected. The
                full-size note sits beside it because "is this a sample set?" is
                the first thing anyone asks of a boxed routine. */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <span className="cera-serif cera-numeral rounded-full border border-[var(--cera-line)] bg-white px-4 py-2 text-[16px] text-[var(--cera-ink)]">
                {copy.kitSize}
              </span>
              <span className="rounded-full bg-[var(--cera-blush)] px-4 py-2 text-[13px] font-semibold text-[var(--cera-rose-ink)]">
                {copy.fullSizeNote}
              </span>
            </div>

            {/* Price + CTA */}
            <div ref={ctaSentinel} className="mt-7">
              {canSeePrices ? (
                <div className="flex items-baseline gap-3">
                  <span className="cera-serif cera-numeral text-[38px] text-[var(--cera-ink)]">
                    {pricing.displayPrice.toFixed(2)}
                    <span className="ms-2 text-[19px] text-[var(--cera-muted)]">{currency}</span>
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

              {/* The saving is the reason to buy the box rather than the pieces,
                  so it is answered at the CTA and again, with the arithmetic
                  shown, further down the page. */}
              {value?.showSaving ? (
                <p className="mt-2.5 flex max-w-[46ch] flex-wrap items-baseline gap-x-1.5 text-[13.5px] leading-relaxed text-[var(--cera-ok)]">
                  <Check className="h-3.5 w-3.5 translate-y-0.5" strokeWidth={3} aria-hidden="true" />
                  <span className="font-semibold">
                    {copy.contents.youSave} {value.saving.toFixed(2)} {currency}
                  </span>
                  <span>{copy.contents.againstSeparate}.</span>
                  <a href="#contents" className="underline underline-offset-2 hover:text-[var(--cera-ok)]">
                    {copy.contents.seeBreakdown}
                  </a>
                </p>
              ) : null}

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
              <p
                /* Values like "SPF50+" and "2 × 15g" get reordered by the Arabic
                   paragraph direction without this, printing "+SPF50" and
                   "15g × 2". dir=auto keeps Arabic values Arabic. */
                dir="auto"
                className={`cera-serif text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px] ${
                  /^\d/.test(stat.value) ? 'cera-numeral' : ''
                }`}
              >
                {stat.value}
              </p>
              <p className="mx-auto mt-2 max-w-[24ch] text-[13.5px] leading-snug text-[var(--cera-muted)]">
                {stat.label}
              </p>
            </CeraReveal>
          ))}
        </div>
      </section>

      {/* ────────────────────────── What is inside ──────────────────────── */}
      <section id="contents" className="mx-auto max-w-[1200px] scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader
          eyebrow={copy.contents.eyebrow}
          title={copy.contents.title}
          intro={copy.contents.intro}
        />

        <ol className="mx-auto mt-10 max-w-[1000px] space-y-4 lg:mt-14">
          {contents.map((item, i) => (
            <CeraReveal key={item.id} as="li" delay={i * 60}>
              <div className="cera-card cera-card-hover flex gap-4 p-4 sm:gap-5 sm:p-6">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="group relative aspect-square w-[92px] flex-none self-start overflow-hidden rounded-2xl bg-white sm:w-[150px] lg:w-[170px]"
                    aria-label={item.title}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 92px, 170px"
                        quality={82}
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                      />
                    ) : null}
                    <span className="absolute start-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[11px] font-semibold tabular-nums text-[var(--cera-ink)] shadow-sm backdrop-blur sm:start-2.5 sm:top-2.5 sm:h-7 sm:w-7 sm:text-[12px]">
                      {i + 1}
                    </span>
                  </Link>
                ) : (
                  <div className="relative aspect-square w-[92px] flex-none self-start overflow-hidden rounded-2xl bg-white sm:w-[150px] lg:w-[170px]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 92px, 170px"
                        quality={82}
                        className="object-cover"
                      />
                    ) : null}
                    <span className="absolute start-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[11px] font-semibold tabular-nums text-[var(--cera-ink)] shadow-sm backdrop-blur sm:start-2.5 sm:top-2.5 sm:h-7 sm:w-7 sm:text-[12px]">
                      {i + 1}
                    </span>
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-rose-ink)]">
                    {item.step}
                  </p>
                  <h3 className="cera-serif mt-1.5 text-[21px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                    {item.href ? (
                      <Link href={item.href} className="hover:text-[var(--cera-rose-ink)]">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>

                  <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[13.5px] text-[var(--cera-muted)]">
                    {item.size ? (
                      /* dir=auto, because a size that opens on a digit ("1 sheet (25g)")
                         has the 1 thrown to the end of the line in an Arabic paragraph.
                         Auto resolves off the first strong character, so Latin sizes stay
                         Latin and translated Arabic sizes stay Arabic. */
                      <span className="tabular-nums" dir="auto">
                        {item.size}
                      </span>
                    ) : null}
                    {canSeePrices && item.unitPrice !== null ? (
                      <span className="tabular-nums">
                        {item.unitPrice.toFixed(2)} {currency} {copy.contents.each}
                      </span>
                    ) : null}
                  </p>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-[15.5px]">
                    {item.body}
                  </p>

                  {/* Measured facts off that item's own certificate or formula
                      sheet - a pH, a percentage, a fragrance warning. Chips
                      rather than another sentence, because this is the part a
                      shopper checks rather than reads. */}
                  {item.facts?.length ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {item.facts.map(fact => (
                        <li
                          key={fact}
                          dir="auto"
                          className="ek-fact rounded-full px-2.5 py-1 text-[12px] tabular-nums text-[var(--cera-body)]"
                        >
                          {fact}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-[var(--cera-rose-ink)] hover:underline"
                      >
                        {copy.contents.viewItem}
                        <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                      </Link>
                    ) : (
                      <span className="text-[13.5px] font-semibold text-[var(--cera-rose-ink)]">
                        {copy.contents.kitOnly}
                      </span>
                    )}
                    {item.ean ? (
                      <span className="text-[12.5px] text-[var(--cera-muted)]">
                        {copy.contents.eanLabel}{' '}
                        <span className="font-mono tabular-nums tracking-tight text-[var(--cera-body)]">
                          {item.ean}
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </CeraReveal>
          ))}
        </ol>

        {/* The arithmetic, computed from the five records above rather than
            written down, so it cannot drift out of date. */}
        {value ? (
          <CeraReveal className="mx-auto mt-8 max-w-[1000px]">
            <div className="cera-card overflow-hidden">
              <dl>
                <div className="flex items-baseline justify-between gap-4 px-6 py-4 lg:px-8">
                  <dt className="text-[14.5px] text-[var(--cera-body)]">{copy.contents.boughtSeparately}</dt>
                  <dd className="cera-numeral text-[19px] text-[var(--cera-muted)] line-through">
                    {value.separately.toFixed(2)} {currency}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-[var(--cera-line)] px-6 py-4 lg:px-8">
                  <dt className="text-[14.5px] font-semibold text-[var(--cera-ink)]">{copy.contents.inThisBox}</dt>
                  <dd className="cera-serif cera-numeral text-[26px] text-[var(--cera-ink)]">
                    {value.boxPrice.toFixed(2)} <span className="text-[15px] text-[var(--cera-muted)]">{currency}</span>
                  </dd>
                </div>
                {value.showSaving ? (
                  <div className="ek-saving flex items-baseline justify-between gap-4 px-6 py-4 lg:px-8">
                    <dt className="text-[14.5px] font-semibold text-[var(--cera-rose-ink)]">
                      {copy.contents.youSave}
                    </dt>
                    <dd className="cera-serif cera-numeral text-[26px] text-[var(--cera-rose-ink)]">
                      {value.saving.toFixed(2)} <span className="text-[15px]">{currency}</span>
                      <span className="ms-2 align-middle text-[13px] font-semibold tabular-nums">
                        (−{value.savingPercent}%)
                      </span>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
            <p className="mt-3 px-1 text-[12.5px] leading-relaxed text-[var(--cera-muted)]">
              {copy.contents.savingNote}
            </p>
          </CeraReveal>
        ) : null}
      </section>

      {/* ───────────────────────── How to use it ────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <CeraSectionHeader
            eyebrow={copy.howTo.eyebrow}
            title={copy.howTo.title}
            intro={copy.howTo.intro}
          />

          <ol className="mt-10 space-y-4 lg:mt-14">
            {copy.howTo.steps.map((step, i) => (
              <CeraReveal key={step.title} as="li" delay={i * 70}>
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
              <Sparkles className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
              <span>{copy.howTo.note}</span>
            </p>
          </CeraReveal>

          {product.videoUrl ? (
            <CeraReveal className="mt-10">
              <p className="cera-eyebrow">{copy.howTo.videoTitle}</p>
              <div className="ek-video relative mt-4 aspect-square overflow-hidden rounded-[28px] sm:aspect-video">
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
      </section>

      {/* ─────────────────────── What was measured ──────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader
          eyebrow={copy.evidence.eyebrow}
          title={copy.evidence.title}
          intro={copy.evidence.intro}
        />
        <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-3 lg:mt-14 lg:gap-6">
          {copy.evidence.cards.map((card, i) => (
            <CeraReveal
              key={card.title}
              as="article"
              delay={i * 70}
              className="cera-card cera-card-hover flex flex-col p-6 lg:p-7"
            >
              <p
                dir="auto"
                className={`cera-serif text-[34px] leading-none text-[var(--cera-rose)] sm:text-[40px] ${
                  /^\d/.test(card.value) ? 'cera-numeral' : ''
                }`}
              >
                {card.value}
              </p>
              <h3 className="cera-serif mt-4 text-[19px] leading-tight text-[var(--cera-ink)] sm:text-[21px]">
                {card.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--cera-body)]">{card.body}</p>
            </CeraReveal>
          ))}
        </div>
        <CeraReveal>
          <p className="mx-auto mt-6 max-w-[1040px] text-[12.5px] leading-relaxed text-[var(--cera-muted)]">
            {copy.evidence.footnote}
          </p>
        </CeraReveal>
      </section>

      {/* ─────────────────────────── Suitability ────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
          <CeraSectionHeader eyebrow={copy.suited.eyebrow} title={copy.suited.title} />
          <div className="mt-10 grid grid-cols-1 gap-4 lg:mt-14 lg:grid-cols-2 lg:gap-6">
            <CeraReveal as="section" className="cera-card p-6 lg:p-7">
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

            {/* Six beauty boxes exist and only one of them is right for any given
                shopper, so the mismatches are as useful as the matches - and
                tinted differently, so which list is which survives a glance. */}
            <CeraReveal as="section" delay={90} className="cera-card ek-notfor p-6 lg:p-7">
              <h3 className="cera-serif text-[21px] leading-tight text-[var(--cera-ink)]">
                {copy.suited.notForTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {copy.suited.notForList.map(point => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border border-[var(--cera-blush-deep)]">
                      <X className="h-[11px] w-[11px] text-[var(--cera-rose-ink)]" strokeWidth={3} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-[var(--cera-body)]">{point}</span>
                  </li>
                ))}
              </ul>

              {/* The other boxes named above. Sending someone to search
                  for them by name would be a dead end. */}
              <p className="mt-5 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[var(--cera-muted)]">
                {copy.suited.alternativesLabel}
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                {copy.suited.alternatives.map(alt => (
                  <li key={alt.productNumber}>
                    <Link
                      href={getLocalizedPath(`/products/${alt.productNumber}`, locale)}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--cera-line)] bg-white px-3.5 py-2 text-[12.5px] font-medium text-[var(--cera-rose-ink)] transition-colors hover:border-[var(--cera-rose)]"
                    >
                      {alt.label}
                      <ChevronRight className={`h-3.5 w-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </CeraReveal>
          </div>
          <CeraReveal>
            <p className="mt-6 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">{copy.suited.note}</p>
          </CeraReveal>
        </div>
      </section>

      {/* ───────────────────────────── Details ──────────────────────────── */}
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
              productNumber={String(product.productNumber ?? product.id)}
              label={copy.details.barcodeLabel}
            />
          </dl>
          <CeraBrochureLinks productNumber={product.productNumber ?? product.id} />
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
        imageFit="cover"
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
              <p className="cera-serif truncate text-[16px] text-[var(--cera-ink)]">{product.name}</p>
              <p className="truncate text-[11px] text-[var(--cera-muted)]">
                {copy.kitSize} · {copy.fullSizeNote}
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
                  <span className="ms-1 text-[12px] text-[var(--cera-muted)]">{currency}</span>
                </p>
              </div>
            ) : null}
            <p className="min-w-0 max-w-[52%] shrink truncate text-[11px] text-[var(--cera-muted)] md:hidden">{copy.kitSize}</p>
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
    </div>
  )
}
