'use client'

import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import LocaleSwitchInline from '@/components/LocaleSwitchInline'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import { getLocaleFromPath, getLocalizedPath } from '@/lib/i18n'

/**
 * Mobile-only bar for pages that render no header of their own.
 *
 * The bespoke editorial product layouts and the Arabic/Russian article pages
 * open with their own artwork rather than a top bar, and all three site headers
 * hide on those routes. On a phone that left nothing to tap: no way back, and
 * no way to change language.
 *
 * Desktop is deliberately excluded (`md:hidden`) because the site header is
 * still present there and already carries both controls.
 *
 * It steps aside on the way down and comes back on the way up, so the artwork
 * it floats over is never behind it while you are reading through it. Sticky
 * alone put the bar over the top of every packshot the moment the page moved.
 * The rule is the app's, down to the threshold, so a product page behaves the
 * same in both places.
 */

const BACK_LABEL = {
  products: { en: 'Products', ru: 'Продукты', ar: 'المنتجات' },
  blog: { en: 'Blog', ru: 'Блог', ar: 'المدونة' },
} as const

export default function PdpLocaleBar({ backTo = 'products' }: { backTo?: 'products' | 'blog' }) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const isRTL = locale === 'ar'
  const target = backTo === 'blog' ? '/blog' : '/products'

  const { ref: barRef, hidden } = useHideOnScroll<HTMLDivElement>()

  return (
    <div
      ref={barRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      // mweb-float-sticky-top lifts the notch out of the bar's own padding and
      // into the gap above it on mobile web, which is what makes it read as a
      // floating bar rather than a strip pinned to the edge.
      data-hidden={hidden}
      className={`pdp-locale-bar mweb-hide-on-scroll mweb-float-sticky-top sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-4 py-2.5 backdrop-blur md:hidden ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => router.push(getLocalizedPath(target, locale))}
        className={`flex items-center gap-1 text-[15px] text-[var(--cera-rose-ink)] ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
        <span>{BACK_LABEL[backTo][locale]}</span>
      </button>

      <LocaleSwitchInline />
    </div>
  )
}
