'use client'

/**
 * Bespoke product page for HR³ MATRIX HAIR TONIC α (product 43), first of the
 * five-product scalp line. Shares hr3.css with the rest of the line, because they
 * are sold as a system and the pages cross-reference each other.
 *
 * FRAMING (owner decision, 17 Aug): this is a SCALP TONER. No hair-loss claim, and
 * no mention of the Korean functional designation — we do not hold that filing and
 * it appears only on the Korean, Russian and Arabic panels. The English carton
 * function is "scalp nourishing, hair conditioning" and that is what the page says.
 *
 * THE AVOID LIST COMES FIRST, above any selling. The Korean panel tells people with
 * salicylate sensitivity, diabetes, circulatory disorders, renal impairment, active
 * scalp infection, and anyone menstruating, pregnant or possibly pregnant, to AVOID
 * the product because existing symptoms may worsen. It appears on no other panel
 * and was nowhere on our site. Given diabetes prevalence in the UAE it leads, in
 * amber, before the formula.
 *
 * THE HONEST SELLING POINT is the certificate: THREE functional actives assayed on
 * the batch — dexpanthenol 103.40% of 0.2%, L-menthol 99.37% of 0.3%, salicylic
 * acid 101.28% of 0.25% — which no other product in the GENOSYS range manages. The
 * sensitisation test is also a full HRIPT rather than a single-application patch
 * test. Both are real differentiators and neither was being used.
 *
 * MUST NEVER BE ADDED: the Russian panel's claim that the tonic "inhibits
 * 5α-reductase activation, suppresses dihydrotestosterone production" and
 * "stimulates the growth of new hair" — the mechanism of finasteride, a
 * prescription medicine. Nor any hair-loss, regrowth, density or shedding claim of
 * any kind. Nor a mechanism from caffeine (10 ppm), copper tripeptide-1 (1 ppm) or
 * the botanicals. Nor the contract manufacturer or the lot code.
 */

import '../cerabarrier/cerabarrier.css'
import './hr3.css'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Star,
} from 'lucide-react'

import type { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/components/cart/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { canUserSeePrices } from '@/lib/discountUtils'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { findSelectedStandardCartLine } from '@/lib/cartVariantSelection'
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
  CeraReveal,
  CeraSectionHeader,
  useCeraStickyBar,
} from '../cerabarrier/CeraPrimitives'
import { COMPANION_PRODUCT_IDS, getHairTonicCopy } from './hairTonicCopy'

interface Props {
  product: Product
  unitsSold?: number
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

export default function HairTonicProductPage({ product, unitsSold = 0, routineProducts = [] }: Props) {
  const router = useRouter()
  const { locale, dir, t } = useTranslation()
  const { user } = useAuth()
  const { addItem, items: cartItems, updateQuantity } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const isRtl = dir === 'rtl'
  const copy = getHairTonicCopy(locale)
  const Chevron = isRtl ? ChevronLeft : ChevronRight

  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const canSeePrices = canUserSeePrices(user)
  const pricing = getPricingDisplay(product, user)
  const cartLine = findSelectedStandardCartLine(cartItems, product.id, '', '')
  const inCartQty = cartLine?.quantity || 0

  const fullInci = useMemo(() => {
    const list = parseJsonArray<{ name?: string; description?: string }>(product.ingredients)
    return list.find(i => i?.name === 'Full INCI')?.description?.trim() || null
  }, [product.ingredients])

  const galleryImages: CeraGalleryImage[] = useMemo(() => {
    const list = Array.from(
      new Set([product.image, ...parseJsonArray<string>(product.images)].filter(Boolean))
    )
    return list.map((src, i) => ({
      src,
      alt: `${product.name} - GENOSYS Korean dermacosmetics, image ${i + 1} of ${list.length}`,
    }))
  }, [product.image, product.images, product.name])

  const companions = useMemo(() => {
    const byNumber = new Map<string, Product>()
    for (const p of routineProducts) byNumber.set(String(p.productNumber ?? p.id), p)
    return COMPANION_PRODUCT_IDS.map(id => byNumber.get(id)).filter((p): p is Product => Boolean(p))
  }, [routineProducts])

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

  const { heroCta: ctaSentinel, closingCta, showStickyBar } = useCeraStickyBar()

  const addToCart = useCallback(
    async (qty: number) => {
      if (!user) {
        router.push(getLocalizedPath('/login', locale))
        return
      }
      try {
        await addItem(product, qty, undefined, undefined)
        try {
          trackAddToCart({
            id: product.id,
            name: product.name,
            category: product.category || 'Scalp/Hair',
            price: product.price,
            quantity: qty,
          })
        } catch { /* analytics is best-effort */ }
      } catch (error) {
        errorLog('HairTonic: add to cart failed', error)
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

  const priceLabel = canSeePrices ? `${pricing.displayPrice.toFixed(2)} ${isRtl ? 'درهم' : 'AED'}` : null

  const ctaLabel = !product.inStock
    ? copy.outOfStock
    : !user
      ? t('product.loginToSeePrice')
      : isAdding
        ? copy.adding
        : justAdded
          ? copy.added
          : copy.addToBag

  return (
    <div className={`cera-page hr3-page ${ceraSerif.variable} min-h-[100dvh]`} dir={dir}>
      {/* ───────────────────────────── Hero ─────────────────────────────── */}
      <section className="mx-auto max-w-[1200px] px-4 pt-4 sm:px-6 md:pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[var(--cera-muted)]">
          <Link href={getLocalizedPath('/', locale)} className="transition-colors hover:text-[var(--cera-rose-ink)]">
            {t('common.home')}
          </Link>
          <Chevron className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          <Link href={getLocalizedPath('/products', locale)} className="transition-colors hover:text-[var(--cera-rose-ink)]">
            {copy.backToProducts}
          </Link>
          <Chevron className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          <span className="truncate text-[var(--cera-ink)]">{product.name}</span>
        </nav>

        <div className="mt-5 grid grid-cols-1 gap-8 lg:mt-9 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CeraGallery
              images={galleryImages}
              isRtl={isRtl}
              badge={product.inStock ? t('product.inStock') : t('product.soldOut')}
            />
          </div>

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

            <h1 className="cera-serif mt-3 text-[30px] leading-[1.06] sm:text-[40px] lg:text-[45px]">
              {product.name}
            </h1>
            <p className="cera-serif mt-2 text-[19px] leading-snug text-[var(--cera-rose-ink)] sm:text-[23px]">
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

            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-[var(--cera-body)] sm:text-base">
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
                      <span dir="ltr" className="rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
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
                      : 'bg-[var(--cera-ink)] text-white hover:bg-black hover:shadow-[0_18px_38px_-20px_rgba(27,25,19,0.8)]'
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
                <div className="mt-3 flex items-center gap-2 text-[13px] text-emerald-700">
                  <Check className="h-4 w-4" />
                  <span>
                    {copy.inBag} · {inCartQty}
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

      {/* ─────────────── The avoid list, before anything else ───────────── */}
      <section className="mx-auto max-w-[900px] px-4 pt-14 sm:px-6 lg:pt-20">
        <CeraReveal className="hr3-alert p-6 md:p-9">
          <p className="cera-eyebrow hr3-alert__title">{copy.avoid.eyebrow}</p>
          <h2 className="cera-serif hr3-alert__title mt-3 text-[26px] leading-tight sm:text-[33px]">
            {copy.avoid.title}
          </h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--cera-body)]">{copy.avoid.body}</p>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {copy.avoid.items.map(item => (
              <li key={item} className={`flex gap-2.5 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-[#b4801f]" aria-hidden="true" />
                <span className="text-[14.5px] font-medium leading-relaxed text-[var(--cera-ink)]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[14.5px] leading-relaxed text-[var(--cera-body)]">{copy.avoid.detail}</p>
        </CeraReveal>
      </section>

      {/* ───────────────── The three assayed actives ────────────────────── */}
      <section className="mx-auto max-w-[1040px] px-4 py-16 sm:px-6 lg:py-20">
        <CeraSectionHeader eyebrow={copy.assay.eyebrow} title={copy.assay.title} intro={copy.assay.intro} />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-6">
          {copy.assay.rows.map((row, i) => (
            <CeraReveal key={row.name} delay={i * 80} as="article" className="hr3-assay p-6 text-center md:p-7">
              <p dir="ltr" className="cera-serif text-[18px] leading-tight text-[var(--cera-ink)]">
                {row.name}
              </p>
              <p dir="ltr" className="cera-numeral hr3-assay__value mt-3 text-[38px] leading-none text-[var(--cera-rose)] sm:text-[44px]">
                {row.measured}
              </p>
              <p dir="ltr" className="mt-2 text-[13px] font-semibold uppercase tracking-[0.07em] text-[var(--cera-muted)]">
                of {row.declared}
              </p>
            </CeraReveal>
          ))}
        </div>

        <CeraReveal>
          <p className="mt-7 text-[15.5px] leading-relaxed text-[var(--cera-body)]">{copy.assay.body}</p>
        </CeraReveal>
      </section>

      {/* ────────────────────── The working formula ─────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
          <CeraSectionHeader eyebrow={copy.working.eyebrow} title={copy.working.title} intro={copy.working.intro} />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {copy.working.items.map((item, i) => (
              <CeraReveal key={item.name} delay={i * 70} as="article" className="cera-card cera-card-hover flex flex-col p-6">
                <p dir="ltr" className="cera-serif text-[19px] leading-tight text-[var(--cera-ink)]">
                  {item.name}
                </p>
                <p dir="ltr" className="cera-numeral hr3-figure mt-2 text-[25px] leading-none text-[var(--cera-rose)]">
                  {item.dose}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--cera-body)]">{item.body}</p>
              </CeraReveal>
            ))}
          </div>

          <CeraReveal delay={90} className="hr3-note mx-auto mt-8 max-w-[900px] p-6 md:p-7">
            <p className="cera-eyebrow">{copy.trace.eyebrow}</p>
            <h3 className="cera-serif mt-2 text-[22px] leading-tight sm:text-[26px]">{copy.trace.title}</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--cera-body)]">{copy.trace.body}</p>
          </CeraReveal>
        </div>
      </section>

      {/* ───────────────────────── How to use ──────────────────────────── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CeraReveal>
                <div className="cera-stage relative aspect-square overflow-hidden rounded-[28px]">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 92vw, 44vw" className="object-contain" />
                </div>
              </CeraReveal>
            </div>

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
                        <h3 className="cera-serif text-[20px] leading-tight text-[var(--cera-ink)] sm:text-[23px]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-[var(--cera-body)]">{step.body}</p>
                      </div>
                    </div>
                  </CeraReveal>
                ))}
              </ol>

              <CeraReveal>
                <p className="mt-8 rounded-2xl border border-[var(--cera-blush-deep)] bg-[var(--cera-blush)]/60 p-5 text-[14.5px] leading-relaxed text-[var(--cera-body)]">
                  {copy.howTo.note}
                </p>
              </CeraReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────── Quality ─────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <CeraReveal>
                <p className="cera-eyebrow">{copy.quality.eyebrow}</p>
                <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px]">{copy.quality.title}</h2>
                <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-[var(--cera-body)]">
                  {copy.quality.intro}
                </p>
                <p className="mt-6 flex max-w-[46ch] items-start gap-2.5 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">
                  <Info className="mt-[2px] h-4 w-4 flex-none" aria-hidden="true" />
                  <span>{copy.quality.patch}</span>
                </p>
              </CeraReveal>
            </div>

            <CeraReveal className="cera-card overflow-hidden">
              <table className="hr3-table w-full border-collapse text-start">
                <caption className="sr-only">{copy.quality.title}</caption>
                <tbody>
                  {copy.quality.rows.map(row => (
                    <tr key={row.label} className="border-b border-[var(--cera-line)] last:border-b-0">
                      <th
                        scope="row"
                        className="w-[34%] px-5 py-4 text-start align-top text-[12.5px] font-semibold uppercase tracking-[0.07em] text-[var(--cera-muted)]"
                      >
                        {row.label}
                      </th>
                      <td className="px-5 py-4 text-start align-top text-[14.5px] leading-snug text-[var(--cera-ink)]">
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

      {/* ────────────────────────── Full INCI ───────────────────────────── */}
      {fullInci ? (
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[900px] px-4 sm:px-6">
            <CeraSectionHeader eyebrow={copy.inci.eyebrow} title={copy.inci.title} intro={copy.inci.intro} />
            <CeraReveal className="mt-8 border-t border-[var(--cera-line)]">
              <CeraAccordion title={copy.inci.fullInci}>
                <p className="text-[14.5px] leading-[1.9] text-[var(--cera-body)]" dir="ltr">
                  {fullInci}
                </p>
                <p className="mt-3 text-[13px] text-[var(--cera-muted)]">{copy.inci.fullInciNote}</p>
              </CeraAccordion>
            </CeraReveal>
          </div>
        </section>
      ) : null}

      {/* ───────────────────────────── Safety ───────────────────────────── */}
      <section className="mx-auto max-w-[900px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.safety.eyebrow} title={copy.safety.title} />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {copy.safety.points.map((point, i) => (
            <CeraReveal key={point} as="li" delay={i * 60} className="cera-card flex gap-4 p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-[var(--cera-rose-ink)]" aria-hidden="true" />
              <span className="text-[14.5px] leading-relaxed text-[var(--cera-body)]">{point}</span>
            </CeraReveal>
          ))}
        </ul>
        <CeraReveal>
          <p className="mt-6 text-[13.5px] text-[var(--cera-muted)]">{copy.safety.note}</p>
        </CeraReveal>
      </section>

      {/* ───────────────────────── What goes with it ────────────────────── */}
      {companions.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
            <CeraSectionHeader
              eyebrow={copy.inci.eyebrow}
              title={locale === 'ar' ? 'ما يعمل معه' : locale === 'ru' ? 'Что рядом с ним' : 'What goes with it'}
            />
            <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {companions.map((item, i) => (
                <CeraReveal key={item.id} as="li" delay={i * 60}>
                  <Link
                    href={getLocalizedPath(`/products/${item.productNumber ?? item.id}`, locale)}
                    className="cera-card cera-card-hover group flex h-full flex-col overflow-hidden"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[var(--cera-cream)]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 1024px) 45vw, 24vw"
                          quality={80}
                          className="object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                        />
                      ) : null}
                    </div>
                    <p className="cera-serif p-3.5 text-[14.5px] leading-snug text-[var(--cera-ink)] group-hover:text-[var(--cera-rose-ink)]">
                      {item.name}
                    </p>
                  </Link>
                </CeraReveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ───────────────────────── Specification ────────────────────────── */}
      <section className="mx-auto max-w-[820px] px-4 py-16 sm:px-6 lg:py-24">
        <CeraSectionHeader eyebrow={copy.spec.eyebrow} title={copy.spec.title} />
        <CeraReveal className="cera-card mt-10 p-6 lg:mt-14 lg:p-8">
          <dl className="divide-y divide-[var(--cera-line)]">
            {copy.spec.rows.map(row => (
              <div key={row.label} className="flex gap-4 py-3.5">
                <dt className="w-[36%] flex-none text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[var(--cera-muted)]">
                  {row.label}
                </dt>
                <dd className="text-[15px] leading-snug text-[var(--cera-body)]">{row.value}</dd>
              </div>
            ))}
            <CeraBarcodeRows productNumber={product.productNumber ?? product.id} label={t('product.barcode')} />
          </dl>
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
                : 'bg-[var(--cera-ink)] text-white hover:bg-black hover:shadow-[0_18px_38px_-20px_rgba(27,25,19,0.8)]'
            }`}
          >
            {justAdded ? <Check className="h-[18px] w-[18px]" /> : <ShoppingBag className="h-[18px] w-[18px]" />}
            {ctaLabel}
          </button>
        }
      />

      {/* ─────────────────────── Sticky add to bag ─────────────────────── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-[var(--cera-line)] bg-white/95 backdrop-blur-xl transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!showStickyBar}
        inert={!showStickyBar}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      >
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 pt-3 sm:gap-4 sm:px-6">
          <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
            <div className="relative h-11 w-11 flex-none overflow-hidden rounded-xl border border-[var(--cera-line)] bg-white">
              <Image src={product.image} alt="" fill sizes="44px" className="object-contain p-1" />
            </div>
            <div className="min-w-0">
              <p className="cera-serif truncate text-[16px] text-[var(--cera-ink)]">{product.name}</p>
              <p className="truncate text-[11px] text-[var(--cera-muted)]">{product.size}</p>
            </div>
          </div>
          <div className="min-w-0 flex-none">
            {canSeePrices ? (
              <p className="cera-serif cera-numeral text-[20px] text-[var(--cera-ink)]">
                {pricing.displayPrice.toFixed(2)}
                <span className="ms-1 text-[12px] text-[var(--cera-muted)]">{isRtl ? 'درهم' : 'AED'}</span>
              </p>
            ) : null}
          </div>

          {inCartQty > 0 && product.inStock && user ? (
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
                justAdded ? 'bg-emerald-600 text-white' : 'bg-[var(--cera-ink)] text-white active:bg-black'
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
