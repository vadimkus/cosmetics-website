'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useTranslation } from '@/hooks/useTranslation'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Return-to-top control for the website.
 *
 * Product pages, the catalogue and the guides run long enough that reaching the end leaves
 * no quick way back up. iOS Safari can scroll to top when you tap the status bar, but it is
 * undiscoverable and does nothing in Chrome or on desktop, so a visible control is the only
 * thing that works for every website visitor.
 *
 * Placement is the whole problem here. The chat bubble already owns the bottom trailing
 * corner at 96px, and it mirrors to the leading corner in Arabic, so this sits on the
 * opposite side in each direction. Two page-local back-to-top buttons used to live on
 * /privacy-policy and /terms at exactly the chat's coordinates, which put them underneath
 * the bubble at a lower z-index — present in the DOM, impossible to tap. Those are removed
 * in favour of this.
 *
 * On mobile, the vertical offset comes from --mobile-nav-height so it tracks the tab bar
 * rather than restating its height as a second magic number. Desktop has no bottom nav, so
 * the control uses the same 24px edge spacing as the chat widget.
 *
 * Product pages add a second floating bar of their own, and its height is not fixed — it
 * grew when the buy controls gained a quantity stepper. Rather than encode that height here
 * as a third magic number that would go stale the next time the bar changes, the control
 * measures whatever floating bar is currently on screen and sits above it.
 */

/**
 * Every kind of bar that parks itself on the bottom edge of a phone screen.
 *
 * There are two, and only knowing about one is what put this control on top of the buy bar
 * on the four products that fall through to the generic page: those use a sticky bar,
 * `mweb-float-sticky-bottom`, where the bespoke pages use a fixed one.
 */
const BOTTOM_BARS = '.mweb-float-bottom, .mweb-float-sticky-bottom'

/** Clearance between this control and whatever it is sitting above. */
const GAP = 16

/**
 * How much of the bottom edge is currently spoken for.
 *
 * Measured from the bar's top rather than its height, because a floating bar is inset from
 * the edge and that gap counts too — taking the height alone left six pixels of clearance
 * where sixteen were intended.
 */
function bottomBarInset(): number {
  let inset = 0
  for (const bar of Array.from(document.querySelectorAll(BOTTOM_BARS))) {
    const rect = bar.getBoundingClientRect()
    // Bars slide out of view rather than unmounting, so presence in the DOM is not the
    // question. A sticky bar that has reached the end of the page also travels up with the
    // content, at which point it is no longer on the edge and no longer in the way.
    if (rect.bottom < window.innerHeight - 24) continue
    inset = Math.max(inset, window.innerHeight - rect.top)
  }
  return Math.max(0, Math.round(inset))
}

export default function ScrollToTop() {
  const { isPWA, isClient } = usePWAMode()
  const { t, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const [visible, setVisible] = useState(false)
  const [barInset, setBarInset] = useState(0)

  useEffect(() => {
    // A viewport-relative threshold rather than a fixed pixel count: on a short phone
    // 600px is most of a screen, on a tall one it is barely half. 1.5 screens means the
    // control only turns up once scrolling back by hand has actually become a chore.
    const measure = () => {
      setVisible(window.scrollY > window.innerHeight * 1.5)
      setBarInset(bottomBarInset())
    }

    // A bar reaches its resting place after the scroll that triggered it has stopped, so
    // measuring on scroll alone can read it mid-slide and leave this control at a height
    // that was only ever true in passing.
    const onTransitionEnd = (event: TransitionEvent) => {
      const target = event.target as HTMLElement | null
      if (event.propertyName === 'transform' && target?.matches?.(BOTTOM_BARS)) measure()
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    document.addEventListener('transitionend', onTransitionEnd, true)
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      document.removeEventListener('transitionend', onTransitionEnd, true)
    }
  }, [])

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [])

  if (!isClient || isPWA) return null

  return (
    <button
      type="button"
      onClick={handleClick}
      // Kept mounted so the fade has something to animate, but taken out of the tab order
      // and off the accessibility tree while it is invisible.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label={t('common.backToTop') || 'Back to top'}
      className={`fixed bottom-[calc(var(--mobile-nav-height,58px)+16px)] z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--cera-line)] bg-white/95 text-[var(--cera-ink)] shadow-[0_10px_28px_-14px_rgba(23,20,15,0.5)] backdrop-blur transition-all duration-300 md:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      } ${isRTL ? 'right-4 md:right-6' : 'left-4 md:left-6'}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        // Only override the class-based offset while a bottom bar is actually showing.
        ...(barInset > 0 ? { bottom: `${barInset + GAP}px` } : {}),
      }}
    >
      <ArrowUp className="h-[19px] w-[19px]" aria-hidden="true" />
    </button>
  )
}
