'use client'

import { useTranslation } from '@/hooks/useTranslation'

// Inlined to avoid an intermittent Turbopack messages-chunk issue on PDPs
// where products.trust* keys sometimes resolve to raw keys at runtime.
// Content is identical to products.trustShipping/Authentic/Vat.
const TRUST_COPY = {
  en: {
    shipping: 'Free shipping over AED 1,000',
    authentic: 'Authentic Korean dermacosmetics',
    vat: 'All prices VAT inclusive',
  },
  ar: {
    shipping: 'شحن مجاني للطلبات فوق 1,000 درهم',
    authentic: 'مستحضرات تجميل كورية أصلية',
    vat: 'جميع الأسعار شاملة ضريبة القيمة المضافة',
  },
  ru: {
    shipping: 'Бесплатная доставка от 1,000 AED',
    authentic: 'Оригинальная корейская дерматокосметика',
    vat: 'Все цены с учётом НДС',
  },
} as const

type Props = {
  /**
   * `horizontal` — single row, centered (good for full-width mobile placement).
   * `stacked`    — vertical list in a bordered white card with tinted icon wells.
   *                Designed for narrow desktop columns (~590px) where a single
   *                horizontal row can't fit three whitespace-nowrap badges —
   *                e.g. the PDP left column under the Add to Cart button.
   * Defaults to `horizontal`.
   */
  layout?: 'horizontal' | 'stacked'
}

export default function TrustBadges({ layout = 'horizontal' }: Props) {
  const { locale, dir } = useTranslation()
  const copy = TRUST_COPY[locale as keyof typeof TRUST_COPY] ?? TRUST_COPY.en

  if (layout === 'stacked') {
    // Premium trust card — used under the PDP Add to Cart on desktop. Icon wells
    // + short copy + muted caption reads as a conversion-anchor reassurance block
    // rather than the previous plain gray strip.
    return (
      <div
        className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
        dir={dir}
        role="region"
        aria-label="Trust signals"
      >
        <ul className="flex flex-col gap-3">
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l4 5v5h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-800 leading-snug pt-1.5">{copy.shipping}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-800 leading-snug pt-1.5">{copy.authentic}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--status-blue-bg)]">
              <svg className="h-4 w-4 text-[var(--status-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h4m-6 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-800 leading-snug pt-1.5">{copy.vat}</span>
          </li>
        </ul>
      </div>
    )
  }

  const containerClass =
    'flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-8 text-xs md:text-sm font-medium text-gray-800 border-y border-gray-200 bg-gray-50 px-3 py-3'
  const itemClass = 'flex items-center gap-2 whitespace-nowrap'

  return (
    <div
      className={containerClass}
      dir={dir}
      role="region"
      aria-label="Trust signals"
    >
      <span className={itemClass}>
        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l4 5v5h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" />
        </svg>
        {copy.shipping}
      </span>
      <span className={itemClass}>
        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {copy.authentic}
      </span>
      <span className={itemClass}>
        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h4m-6 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {copy.vat}
      </span>
    </div>
  )
}
