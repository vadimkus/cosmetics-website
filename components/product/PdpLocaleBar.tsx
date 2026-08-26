'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import LocaleSwitchInline from '@/components/LocaleSwitchInline'
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

/** How far the page must travel one way before the bar reacts. */
const DIRECTION_THRESHOLD = 10

export type BarScrollState = {
  y: number
  /** Where the current run of travel in one direction began. */
  anchorY: number
  direction: 'up' | 'down' | 'none'
  hidden: boolean
}

export const INITIAL_BAR_STATE: BarScrollState = {
  y: 0,
  anchorY: 0,
  direction: 'none',
  hidden: false,
}

/**
 * Where the bar should be after the page has moved to `y`.
 *
 * The threshold is measured from the point the scroll last changed direction,
 * not from the previous frame. Frame-to-frame is what the app does, and it
 * works there because a flung native list reports big jumps - but a deliberate
 * drag on a web page arrives as two or three pixels per frame, which never
 * clears a ten pixel gate, and the bar simply never moves. Accumulating the
 * travel keeps the same feel for a flick and still responds to a slow drag.
 *
 * Pure and exported because the awkward cases are the ones worth a test:
 * rubber-band bounce at the top reads as downward travel, and a thumb resting
 * on the glass sends a stream of one-pixel deltas.
 */
export function nextBarState(prev: BarScrollState, y: number, distance: number): BarScrollState {
  // Nothing to gain by hiding near the top: the bar covers nothing there yet.
  if (y <= distance) return { y, anchorY: y, direction: 'none', hidden: false }

  const delta = y - prev.y
  if (delta === 0) return { ...prev, y }

  const direction: 'up' | 'down' = delta > 0 ? 'down' : 'up'
  const anchorY = direction === prev.direction ? prev.anchorY : prev.y

  if (Math.abs(y - anchorY) < DIRECTION_THRESHOLD) {
    return { y, anchorY, direction, hidden: prev.hidden }
  }
  return { y, anchorY, direction, hidden: direction === 'down' }
}

export default function PdpLocaleBar({ backTo = 'products' }: { backTo?: 'products' | 'blog' }) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const isRTL = locale === 'ar'
  const target = backTo === 'blog' ? '/blog' : '/products'

  const barRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let state: BarScrollState = { ...INITIAL_BAR_STATE, y: window.scrollY, anchorY: window.scrollY }
    let frame = 0

    const read = () => {
      frame = 0
      const bar = barRef.current
      if (!bar) return
      // Measured rather than assumed: the height follows the font size and the
      // offset follows the safe-area inset, neither of which is knowable here.
      //
      // Deliberately not `offsetTop`: on a stuck sticky element that reports the
      // shifted position, so it grows with the scroll and the dead zone stays
      // permanently ahead of it - which reads as the bar simply never moving.
      const distance = bar.getBoundingClientRect().height + parseFloat(getComputedStyle(bar).top || '0')
      const wasHidden = state.hidden
      state = nextBarState(state, window.scrollY, distance)
      if (state.hidden !== wasHidden) setHidden(state.hidden)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={barRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      // mweb-float-sticky-top lifts the notch out of the bar's own padding and
      // into the gap above it on mobile web, which is what makes it read as a
      // floating bar rather than a strip pinned to the edge.
      className={`pdp-locale-bar mweb-float-sticky-top sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--cera-line)] bg-[var(--cera-cream)]/95 px-4 py-2.5 backdrop-blur md:hidden ${
        hidden ? 'pdp-locale-bar-hidden' : ''
      } ${isRTL ? 'flex-row-reverse' : ''}`}
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
