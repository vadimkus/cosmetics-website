'use client'

/**
 * Bespoke product page for SKIN CARING BLEMISH BALM CUSHION (product 41).
 *
 * Built on the shared editorial primitives rather than cloned from another
 * product page, which is why it is a fraction of their length: `cera-page`
 * supplies the structure, `editorial.css` the components, and only the shade
 * selector and the filter table are specific to this product.
 *
 * Section order:
 *
 *   hero      the three licences, as four figures
 *   licences  what Korea actually granted, and on which actives
 *   filters   the five, split mineral and chemical
 *   shades    three, identical apart from the pigment
 *   puff      the fourth waterproof layer
 *   howTo     press, pat, build, refill
 *   inci      the full list, off the product record
 *   caution   including the two warnings only the Korean panel prints
 *
 * Every figure comes from bbCushionCopy.ts, which in turn comes from the
 * dossier audit. Do not print "60% moisture essence", Volufiline as a
 * volumiser, the peptides as an engine, or a sixth UV filter.
 */

import '../cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'
import './bbcushion.css'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { ceraSerif } from '../cerabarrier/ceraFont'
import { BB_CUSHION_COPY, type Locale } from './bbCushionCopy'
import { useTranslation } from '@/hooks/useTranslation'
import { useCart } from '@/components/cart/CartProvider'
import { useAuth } from '@/components/auth/AuthProvider'
import { getLocalizedPath } from '@/lib/i18n'
import { getPricingDisplay } from '@/lib/pricingDisplay'
import { canUserSeePrices } from '@/lib/discountUtils'
import { errorLog } from '@/lib/logger'

interface Props {
  product: Product
  unitsSold?: number
  routineProducts?: Product[]
}

export default function BbCushionProductPage({ product }: Props) {
  const { locale, dir } = useTranslation()
  const { addItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const copy = BB_CUSHION_COPY[(locale as Locale) ?? 'en'] ?? BB_CUSHION_COPY.en
  const isRTL = dir === 'rtl'

  const [shade, setShade] = useState(copy.shades[1]?.name ?? 'Beige')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [busy, setBusy] = useState(false)

  const pricing = getPricingDisplay(product, user)
  const canSeePrice = canUserSeePrices(user)

  /** Gallery: the main shot first, then whatever the record carries. */
  const gallery = useMemo(() => {
    let extra: string[] = []
    try {
      const raw = (product as unknown as Record<string, unknown>).images
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (Array.isArray(parsed)) extra = parsed.filter((v): v is string => typeof v === 'string')
    } catch {
      /* a malformed images field should not take the page down */
    }
    return [product.image, ...extra].filter(Boolean) as string[]
  }, [product])

  const [shot, setShot] = useState(0)

  /* The INCI list is not its own column: it lives inside the ingredients JSON
     as an entry named "Full INCI", the same place every other bespoke page
     reads it from. The first draft of this page looked for a `fullIngredients`
     field, which does not exist, so the section silently never rendered. */
  const inciText = useMemo(() => {
    try {
      const raw = (product as unknown as Record<string, unknown>).ingredients
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (!Array.isArray(parsed)) return null
      const entry = (parsed as Array<{ name?: string; description?: string }>).find(
        (i) => i?.name === 'Full INCI',
      )
      return entry?.description?.trim() || null
    } catch {
      return null
    }
  }, [product])

  async function handleAdd() {
    if (!user) {
      router.push(getLocalizedPath('/login', locale))
      return
    }
    if (busy) return
    setBusy(true)
    try {
      // The shade is a colour, not a size: the three share one price and one SKU size.
      await addItem(product, qty, shade, undefined)
      setAdded(true)
      setTimeout(() => setAdded(false), 2200)
    } catch (error) {
      errorLog('BbCushion: add to cart failed', error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={`cera-page genosys-page bbc-page ${ceraSerif.variable} min-h-[100dvh]`} dir={dir}>
      <div className="mx-auto max-w-[1120px] px-4 py-8 md:px-8 md:py-14">
        {/* ───────────────────────────── Hero ───────────────────────────── */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="cera-stage relative aspect-square overflow-hidden rounded-[22px]">
              {gallery[shot] && (
                <Image
                  src={gallery[shot]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                />
              )}
            </div>
            {gallery.length > 1 && (
              <div className={`mt-3 flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setShot(i)}
                    aria-label={`View image ${i + 1} of ${gallery.length}`}
                    aria-pressed={shot === i}
                    className={`relative h-16 w-16 overflow-hidden rounded-xl border transition-colors ${
                      shot === i ? 'border-[var(--cera-rose)]' : 'border-[var(--cera-line)]'
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={isRTL ? 'text-right' : ''}>
            <p className="cera-eyebrow mb-3">{copy.eyebrow}</p>
            <h1 className="cera-serif text-[32px] leading-[1.06] md:text-[44px]">{copy.headline}</h1>
            <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-[var(--cera-muted)]">{copy.lead}</p>

            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
              {copy.facts.map((fact) => (
                <div key={fact.label}>
                  <dd className="cera-numeral text-[22px] leading-none text-[var(--cera-ink)]">{fact.value}</dd>
                  <dt className="mt-1.5 text-[12.5px] leading-tight text-[var(--cera-muted)]">{fact.label}</dt>
                </div>
              ))}
            </dl>

            {/* ─────────────────────── Shade selector ────────────────────── */}
            <div className="mt-9">
              <p className="cera-eyebrow mb-3">{copy.shadesEyebrow}</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {copy.shades.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setShade(s.name)}
                    data-selected={shade === s.name}
                    className="bbc-shade"
                    aria-pressed={shade === s.name}
                  >
                    <span className={`bbc-swatch bbc-swatch--0${i + 1}`} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="cera-serif block text-[15px] leading-tight text-[var(--cera-ink)]">
                        {s.code} {s.name}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[var(--cera-muted)]">{s.tone}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ─────────────────────────── Buy ───────────────────────────── */}
            <div className="mt-8">
              {canSeePrice ? (
                <p className="cera-numeral text-[26px] text-[var(--cera-ink)]">
                  AED {pricing.displayPrice.toFixed(0)}
                </p>
              ) : (
                <p className="text-[14px] text-[var(--cera-muted)]">
                  {locale === 'ar' ? 'سجّلي الدخول لعرض السعر' : locale === 'ru' ? 'Войдите, чтобы увидеть цену' : 'Sign in to see the price'}
                </p>
              )}

              <div className={`mt-4 flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-1 rounded-full border border-[var(--cera-line)] bg-white p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--cera-muted)] transition-colors hover:bg-[var(--cera-cream-deep)]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="cera-numeral w-7 text-center text-[15px]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(20, q + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--cera-muted)] transition-colors hover:bg-[var(--cera-cream-deep)]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button onClick={handleAdd} disabled={busy} className="ed-cta px-7 py-3 text-[15px]">
                  {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  {added
                    ? locale === 'ar' ? 'أُضيف' : locale === 'ru' ? 'Добавлено' : 'Added'
                    : locale === 'ar' ? 'أضيفي إلى الحقيبة' : locale === 'ru' ? 'В корзину' : 'Add to bag'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="cera-rule mt-14 md:mt-20" />

        {/* ───────────────────────── The three licences ───────────────────── */}
        <section className={`mt-12 md:mt-16 ${isRTL ? 'text-right' : ''}`}>
          <p className="cera-eyebrow mb-2.5">{copy.licenceEyebrow}</p>
          <h2 className="cera-serif text-[26px] leading-tight md:text-[38px]">{copy.licenceTitle}</h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[var(--cera-muted)]">{copy.licenceLead}</p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {copy.licences.map((item, i) => (
              <article key={item.title} className="ed-row p-5">
                <span className="ed-mark ed-mark--tactile cera-numeral mb-4 flex h-10 w-10 text-[14px]" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="cera-serif text-[18px] leading-tight">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--cera-muted)]">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ───────────────────────────── Filters ──────────────────────────── */}
        <section className={`mt-14 md:mt-20 ${isRTL ? 'text-right' : ''}`}>
          <p className="cera-eyebrow mb-2.5">{copy.filtersEyebrow}</p>
          <h2 className="cera-serif text-[26px] leading-tight md:text-[38px]">{copy.filtersTitle}</h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[var(--cera-muted)]">{copy.filtersLead}</p>

          <div className="ed-row mt-8 p-5 md:p-7">
            {copy.filters.map((f) => (
              <div key={f.name} className="bbc-filter">
                <span className="flex flex-wrap items-baseline gap-2.5">
                  <span dir="ltr" className="text-[14.5px] text-[var(--cera-ink)]">{f.name}</span>
                  <span className="bbc-kind" data-mineral={f.kind === 'Mineral' || f.kind === 'معدني' || f.kind === 'Минеральный'}>
                    {f.kind}
                  </span>
                </span>
                <span dir="ltr" className="cera-numeral flex-none text-[15px] text-[var(--cera-ink)]">{f.percent}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-[var(--cera-muted)]">{copy.filtersNote}</p>
        </section>

        {/* ────────────────────────────── Shades ──────────────────────────── */}
        <section className={`mt-14 md:mt-20 ${isRTL ? 'text-right' : ''}`}>
          <p className="cera-eyebrow mb-2.5">{copy.shadesEyebrow}</p>
          <h2 className="cera-serif text-[26px] leading-tight md:text-[38px]">{copy.shadesTitle}</h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[var(--cera-muted)]">{copy.shadesLead}</p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {copy.shades.map((s, i) => (
              <article key={s.name} className="ed-row p-5">
                <span className={`bbc-swatch bbc-swatch--0${i + 1} mb-4 !h-11 !w-11`} aria-hidden="true" />
                <h3 className="cera-serif text-[18px] leading-tight">
                  <span dir="ltr">{s.code}</span> {s.name}
                </h3>
                <p className="mt-1.5 text-[13.5px] text-[var(--cera-muted)]">{s.tone}</p>
                <p className="text-[13.5px] text-[var(--cera-muted)]">{s.undertone}</p>
                <p className="cera-numeral mt-3 text-[12.5px] text-[var(--cera-rose-ink)]">{s.pigment}</p>
              </article>
            ))}
          </div>
          <p className="mt-3 text-[13.5px] text-[var(--cera-muted)]">{copy.shadesNote}</p>
        </section>

        {/* ─────────────────────────────── Puff ───────────────────────────── */}
        <section className={`mt-14 md:mt-20 ${isRTL ? 'text-right' : ''}`}>
          <p className="cera-eyebrow mb-2.5">{copy.puffEyebrow}</p>
          <h2 className="cera-serif text-[26px] leading-tight md:text-[38px]">{copy.puffTitle}</h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-[var(--cera-muted)]">{copy.puffLead}</p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {copy.puffPoints.map((point) => (
              <article key={point.title} className="ed-row p-5 md:p-6">
                <h3 className="cera-serif text-[18px] leading-tight">{point.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--cera-muted)]">{point.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────── How to ─────────────────────────── */}
        <section className={`mt-14 md:mt-20 ${isRTL ? 'text-right' : ''}`}>
          <p className="cera-eyebrow mb-2.5">{copy.howEyebrow}</p>
          <h2 className="cera-serif text-[26px] leading-tight md:text-[38px]">{copy.howTitle}</h2>

          <ol className="mt-8 grid gap-3 md:grid-cols-4">
            {copy.howSteps.map((step, i) => (
              <li key={step.title} className="ed-row p-5">
                <span className="ed-mark ed-mark--tactile cera-numeral mb-4 flex h-9 w-9 text-[13px]" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="cera-serif text-[17px] leading-tight">{step.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ─────────────────────────────── INCI ───────────────────────────── */}
        {inciText && (
          <section className={`mt-14 md:mt-20 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="cera-serif text-[22px] leading-tight md:text-[26px]">{copy.inciTitle}</h2>
            <div className="ed-row mt-5 p-5 md:p-7">
              <p dir="ltr" className={`text-[14px] leading-[1.9] text-[var(--cera-body)] ${isRTL ? 'text-right' : ''}`}>
                {inciText}
              </p>
              <p className="mt-3 text-[13px] text-[var(--cera-muted)]">{copy.inciNote}</p>
            </div>
          </section>
        )}

        {/* ────────────────────────────── Caution ─────────────────────────── */}
        <section className={`mt-14 md:mt-20 ${isRTL ? 'text-right' : ''}`}>
          <h2 className="cera-serif text-[22px] leading-tight md:text-[26px]">{copy.cautionTitle}</h2>
          <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
            {copy.cautions.map((line) => (
              <li key={line} className="ed-row p-4 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">
                {line}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
