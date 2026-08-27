'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Gift, Clock, Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface FreeMaskPromotionProps {
  subtotal: number
}

/**
 * The two free-mask thresholds in the cart.
 *
 * Colour is deliberately rationed here. Every earned element used to be saturated green at
 * once - the icon, both "Unlocked" labels, both full-width bars, both mask captions and a
 * green-on-green summary panel - which left nothing standing out and no sense of what to do
 * next. Rose now marks a bar you are still working toward, because that is the actionable
 * state, and green is kept for the fact of having earned a tier: the small Unlocked label,
 * the finished bar and the confirmation. Earned captions read in ink rather than a third
 * shade of green.
 */
export default function FreeMaskPromotion({ subtotal }: FreeMaskPromotionProps) {
  const { t, locale, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const THRESHOLD_500 = 500
  const THRESHOLD_700 = 700

  const remainingTo500 = Math.max(0, THRESHOLD_500 - subtotal)
  const remainingTo700 = Math.max(0, THRESHOLD_700 - subtotal)

  const qualifiesFor500 = subtotal >= THRESHOLD_500
  const qualifiesFor700 = subtotal >= THRESHOLD_700

  const progressTo500 = Math.min(100, (subtotal / THRESHOLD_500) * 100)
  const progressTo700 = Math.min(100, (subtotal / THRESHOLD_700) * 100)

  const thumb = 'relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] transition-colors hover:border-[var(--cera-blush-deep)] md:h-14 md:w-14'

  const tierHead = (label: string, earned: boolean, remaining: number) => (
    <div className={`mb-2.5 flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <span className="text-sm font-medium text-[var(--cera-ink)]">{label}</span>
      {earned ? (
        <span className={`flex items-center gap-1 text-[12px] font-semibold text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          {t('cart.unlocked')}
        </span>
      ) : (
        <span dir="ltr" className="cera-numeral whitespace-nowrap text-[12px] text-[var(--cera-muted)]">
          {remaining > 0 ? `AED ${remaining.toFixed(2)} ${t('cart.more')}` : ''}
        </span>
      )}
    </div>
  )

  const bar = (pct: number, earned: boolean) => (
    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-[var(--cera-cream-deep)]">
      <div
        className={`h-full rounded-full transition-all duration-500 ${earned ? 'bg-green-600' : 'bg-[var(--cera-rose)]'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )

  return (
    <div className={isRTL ? 'text-right' : ''}>
      <div className="mb-4">
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Gift className="h-5 w-5 text-[var(--cera-rose)]" aria-hidden="true" />
          <h3 className="cera-serif text-[20px] leading-tight text-[var(--cera-ink)]">
            {t('cart.freeMaskPromotion')}
          </h3>
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-cream-deep)] px-2.5 py-1 text-xs font-medium text-[var(--cera-muted)] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {t('cart.validUntil')}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {/* 500 AED Threshold */}
        <div className="rounded-2xl border border-[var(--cera-line)] p-4">
          {tierHead(t('cart.spendAed500'), qualifiesFor500, remainingTo500)}
          {bar(progressTo500, qualifiesFor500)}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Link href={getLocalizedPath('/products/53', locale)} className={thumb}>
              <Image
                src="/images/collagen_mask/Main.jpeg"
                alt="GENOSYS Collagen Mask - Free Korean dermacosmetics skincare product"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </Link>
            <Link
              href={getLocalizedPath('/products/53', locale)}
              className={`text-sm transition-colors hover:text-[var(--cera-rose-ink)] ${
                qualifiesFor500 ? 'font-medium text-[var(--cera-ink)]' : 'text-[var(--cera-body)]'
              }`}
            >
              {t('cart.oneFreeCollagenMask')}
            </Link>
          </div>
        </div>

        {/* 700 AED Threshold */}
        <div className="rounded-2xl border border-[var(--cera-line)] p-4">
          {tierHead(t('cart.spendAed700'), qualifiesFor700, remainingTo700)}
          {bar(progressTo700, qualifiesFor700)}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link href={getLocalizedPath('/products/36', locale)} className={thumb}>
                <Image
                  src="/images/sea_algae/Main.jpeg"
                  alt="GENOSYS Sea Algae Mask - Free Korean dermacosmetics skincare product"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </Link>
              <Link href={getLocalizedPath('/products/53', locale)} className={thumb}>
                <Image
                  src="/images/collagen_mask/Main.jpeg"
                  alt="GENOSYS Collagen Mask - Free Korean dermacosmetics skincare product"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </Link>
            </div>
            <Link
              href={getLocalizedPath('/products/36', locale)}
              className={`text-sm leading-snug transition-colors hover:text-[var(--cera-rose-ink)] ${
                qualifiesFor700 ? 'font-medium text-[var(--cera-ink)]' : 'text-[var(--cera-body)]'
              }`}
            >
              {t('cart.twoFreeMasks')}
            </Link>
          </div>
        </div>

        {/* Confirmation of what has been earned. Green here reports a fact, so the tint stays
            but the copy reads in ink rather than stacking green text on a green ground. */}
        {(qualifiesFor500 || qualifiesFor700) && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className={`flex items-center gap-2 text-sm font-semibold text-[var(--cera-ink)] ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Check className="h-4 w-4 flex-none text-green-700" aria-hidden="true" />
              {qualifiesFor700 ? t('cart.qualifyForTwoFreeMasks') : t('cart.qualifyForOneFreeMask')}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--cera-body)]">
              {t('cart.freeMasksAutoAdded')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
