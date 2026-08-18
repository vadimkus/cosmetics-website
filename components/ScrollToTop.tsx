'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useTranslation } from '@/hooks/useTranslation'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Return-to-top control for mobile web.
 *
 * Product pages, the catalogue and the guides run long enough on a phone that reaching the
 * end left no way back up except repeated swiping. iOS Safari can scroll to top when you
 * tap the status bar, but it is undiscoverable and does nothing in Chrome or in the
 * installed app, so a visible control is the only thing that works for everyone.
 *
 * Placement is the whole problem here. The chat bubble already owns the bottom trailing
 * corner at 96px, and it mirrors to the leading corner in Arabic, so this sits on the
 * opposite side in each direction. Two page-local back-to-top buttons used to live on
 * /privacy-policy and /terms at exactly the chat's coordinates, which put them underneath
 * the bubble at a lower z-index — present in the DOM, impossible to tap. Those are removed
 * in favour of this.
 *
 * Vertical offset comes from --mobile-nav-height so it tracks the tab bar rather than
 * restating its height as a second magic number.
 */
export default function ScrollToTop() {
  const { isPWA, isClient } = usePWAMode()
  const { isMobile } = useIsMobile()
  const { t, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // A viewport-relative threshold rather than a fixed pixel count: on a short phone
    // 600px is most of a screen, on a tall one it is barely half. 1.5 screens means the
    // control only turns up once scrolling back by hand has actually become a chore.
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 1.5)
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

  if (!isClient || isPWA || !isMobile) return null

  return (
    <button
      type="button"
      onClick={handleClick}
      // Kept mounted so the fade has something to animate, but taken out of the tab order
      // and off the accessibility tree while it is invisible.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      aria-label={t('common.backToTop') || 'Back to top'}
      className={`fixed z-50 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--cera-line)] bg-white/95 text-[var(--cera-ink)] shadow-[0_10px_28px_-14px_rgba(23,20,15,0.5)] backdrop-blur transition-all duration-300 md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      } ${isRTL ? 'right-4' : 'left-4'}`}
      style={{
        bottom: 'calc(var(--mobile-nav-height, 58px) + 16px)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <ArrowUp className="h-[19px] w-[19px]" aria-hidden="true" />
    </button>
  )
}
