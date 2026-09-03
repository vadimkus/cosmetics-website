'use client'

import { ReactNode, useEffect, useId, useRef, useState } from 'react'
import { Download, Minus, Plus } from 'lucide-react'
import { getProductBarcodes } from '@/data/productBarcodes'
import { getProductDocumentation } from '@/data/productConfig'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * Small presentational primitives shared across the bespoke product pages
 * (60, 61, 63, 64, 65, 66). Scoped to those pages so the standard PDP is
 * untouched.
 */

/**
 * Drives the floating add-to-bag bar.
 *
 * The bar is a stand-in for the two real buy controls on the page: the one in
 * the hero and the one in the closing band. It shows only while neither is on
 * screen, so the reader never sees two competing CTAs at once.
 */
export function useCeraStickyBar() {
  const heroCta = useRef<HTMLDivElement | null>(null)
  const closingCta = useRef<HTMLDivElement | null>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const nodes = [heroCta.current, closingCta.current].filter(
      (node): node is HTMLDivElement => Boolean(node)
    )
    if (!nodes.length) return

    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target)
          else onScreen.delete(entry.target)
        }
        setShowStickyBar(onScreen.size === 0)
      },
      { rootMargin: '-80px 0px -80px 0px' }
    )
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return { heroCta, closingCta, showStickyBar }
}

/**
 * Quantity stepper for the floating bar.
 *
 * The hero has one of these, but once the reader scrolls past it the floating
 * bar was the only buy control left and it could only ever add one. Ordering six
 * meant scrolling back up. The bar already showed a stepper *after* the first
 * add, which is too late to be discoverable and does not let the price preview
 * the real total.
 *
 * Deliberately shorter than the hero's 54px so the bar keeps its height, but the
 * two tap targets stay 44px wide.
 */
export function CeraStickyQuantity({
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
  label,
}: {
  value: number
  onChange: (next: number) => void
  decreaseLabel: string
  increaseLabel: string
  label: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex h-12 flex-none items-center rounded-full border border-[var(--cera-line)] bg-white"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex h-12 w-11 items-center justify-center rounded-s-full text-[var(--cera-muted)] transition-colors disabled:opacity-35 hover:text-[var(--cera-ink)]"
        aria-label={decreaseLabel}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className="w-7 text-center text-[15px] font-semibold tabular-nums text-[var(--cera-ink)]"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        disabled={value >= 99}
        className="flex h-12 w-11 items-center justify-center rounded-e-full text-[var(--cera-muted)] transition-colors disabled:opacity-35 hover:text-[var(--cera-ink)]"
        aria-label={increaseLabel}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

/** Fades + lifts children into view once, then stops observing. */
export function CeraReveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'ul' | 'ol' | 'article'
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`cera-reveal ${className}`.trim()}
      data-shown={shown ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/** Section wrapper: eyebrow + serif heading + optional intro, centred column. */
export function CeraSectionHeader({
  eyebrow,
  title,
  intro,
  align = 'center',
}: {
  eyebrow: string
  title: string
  intro?: string
  align?: 'center' | 'start'
}) {
  const isCenter = align === 'center'
  return (
    <CeraReveal className={isCenter ? 'text-center' : ''}>
      <p className="cera-eyebrow">{eyebrow}</p>
      <h2 className="cera-serif mt-3 text-[30px] leading-[1.12] sm:text-[40px] lg:text-[46px]">{title}</h2>
      {intro ? (
        <p
          className={`mt-4 text-[15px] leading-relaxed text-[var(--cera-muted)] sm:text-base ${
            isCenter ? 'mx-auto max-w-[54ch]' : 'max-w-[54ch]'
          }`}
        >
          {intro}
        </p>
      ) : null}
    </CeraReveal>
  )
}

/** Editorial accordion row used by the INCI list and the FAQ. */
export function CeraAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const uid = useId()
  const panelId = `${uid}-panel`
  const triggerId = `${uid}-trigger`

  return (
    <div className="border-b border-[var(--cera-line)]">
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full min-h-[56px] items-center justify-between gap-4 py-4 text-start"
        >
          <span className="cera-serif text-[19px] leading-snug text-[var(--cera-ink)] sm:text-[21px]">
            {title}
          </span>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--cera-line)] bg-white transition-transform duration-300 ${
              open ? 'rotate-45 border-[var(--cera-blush-deep)]' : ''
            }`}
          >
            <Plus className="h-4 w-4 text-[var(--cera-rose-ink)]" />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        inert={!open}
        className="cera-panel"
        data-open={open ? 'true' : 'false'}
      >
        <div className="cera-panel__inner">
          <div
            className="pb-6 pe-10 text-[15px] leading-relaxed text-[var(--cera-body)]"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Barcode rows for the spec table. Returns bare <div> rows so it can be dropped
 * straight into an existing <dl> alongside the copy-driven rows.
 *
 * Renders nothing when we hold no documented barcode for the product, which is
 * the correct outcome for kits and devices rather than a blank row.
 *
 * The digits are LTR-isolated. Without that, Arabic bidi reordering walks the
 * run of numerals around the label, the same trap the shade codes hit.
 */
export function CeraBarcodeRows({
  productNumber,
  label,
}: {
  productNumber: string | null | undefined
  label: string
}) {
  const codes = getProductBarcodes(productNumber)
  if (!codes.length) return null

  return (
    <div className="flex gap-4 py-3.5">
      <dt className="w-[38%] flex-none text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--cera-muted)]">
        {label}
      </dt>
      <dd className="text-[15px] leading-snug text-[var(--cera-body)]">
        {codes.map(({ label: variant, ean }) => (
          <span key={ean} className="block">
            {variant ? <span className="text-[var(--cera-muted)]">{variant} </span> : null}
            <span dir="ltr" className="font-medium tabular-nums [unicode-bidi:isolate]">
              {ean}
            </span>
          </span>
        ))}
      </dd>
    </div>
  )
}

/**
 * DTS MG product guide from productConfig. The generic PDP showed this
 * via ProductContentDisplay. Bespoke pages replaced that layout and
 * dropped the download unless they wired their own brochure link.
 * Renders nothing when the SKU has no documentation entry.
 */
export function CeraBrochureLinks({
  productNumber,
}: {
  productNumber: string | null | undefined
}) {
  const { locale } = useTranslation()
  const docs = getProductDocumentation(productNumber || '', locale)
  if (!docs.length) return null

  return (
    <div className="mt-4 flex flex-col gap-1">
      {docs.map(doc => (
        <a
          key={doc.url}
          href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 py-2 text-[14px] font-semibold text-[var(--cera-rose-ink)] underline-offset-4 hover:underline"
        >
          <Download className="h-4 w-4" />
          {doc.title}
        </a>
      ))}
    </div>
  )
}
