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
export default function ScrollToTop() {
  const { isPWA, isClient } = usePWAMode()
  const { t, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const [visible, setVisible] = useState(false)
  const [barHeight, setBarHeight] = useState(0)

  useEffect(() => {
    // A viewport-relative threshold rather than a fixed pixel count: on a short phone
    // 600px is most of a screen, on a tall one it is barely half. 1.5 screens means the
    // control only turns up once scrolling back by hand has actually become a chore.
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 1.5)

      // The bar stays mounted and slides out of view, so presence in the DOM is not
      // the question — how much of it is actually on screen is.
      const bar = document.querySelector('.mweb-float-bottom')
      if (!bar) {
        setBarHeight(0)
        return
      }
      const rect = bar.getBoundingClientRect()
      const showing = Math.max(0, window.innerHeight - rect.top)
      setBarHeight(Math.round(Math.min(showing, rect.height)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
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
        // Only override the class-based offset while a floating bar is actually showing.
        ...(barHeight > 0 ? { bottom: `${barHeight + 16}px` } : {}),
      }}
    >
      <ArrowUp className="h-[19px] w-[19px]" aria-hidden="true" />
    </button>
  )
}
