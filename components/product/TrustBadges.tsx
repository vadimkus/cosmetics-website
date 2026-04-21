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
    authentic: 'Оригинальная корейская космецевтика',
    vat: 'Все цены с учётом НДС',
  },
} as const

type Props = {
  /**
   * `horizontal` — single row, centered (good for full-width mobile placement).
   * `stacked`    — vertical list, left-aligned (good for narrow desktop columns
   *                where all three badges can't fit on one line).
   * Defaults to `horizontal`.
   */
  layout?: 'horizontal' | 'stacked'
}

export default function TrustBadges({ layout = 'horizontal' }: Props) {
  const { locale, dir } = useTranslation()
  const copy = TRUST_COPY[locale as keyof typeof TRUST_COPY] ?? TRUST_COPY.en

  const containerClass =
    layout === 'stacked'
      ? 'flex flex-col items-start gap-2.5 text-xs md:text-sm font-medium text-gray-800 border-y border-gray-200 bg-gray-50 px-4 py-3'
      : 'flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-8 text-xs md:text-sm font-medium text-gray-800 border-y border-gray-200 bg-gray-50 px-3 py-3'

  const itemClass =
    layout === 'stacked'
      ? 'flex items-center gap-2 whitespace-nowrap'
      : 'flex items-center gap-2 whitespace-nowrap'

  return (
    <div
      className={containerClass}
      dir={dir}
      role="region"
      aria-label="Trust signals"
    >
      <span className={itemClass}>
        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h13l4 5v5h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" />
        </svg>
        {copy.shipping}
      </span>
      <span className={itemClass}>
        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {copy.authentic}
      </span>
      <span className={itemClass}>
        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h4m-6 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {copy.vat}
      </span>
    </div>
  )
}
