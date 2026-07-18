'use client'

import { useEffect, useRef } from 'react'

/**
 * Fixed reading-progress hairline for long articles (blog / guides).
 *
 * Always driven by JS. CSS scroll timelines looked supported in some engines
 * but left the bar stuck at scaleX(0); inline transform is the reliable path.
 */
export default function ReadingProgressV3() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // Kill any CSS scroll-timeline animation so inline transform can win.
    bar.style.animation = 'none'
    ;(bar.style as CSSStyleDeclaration & { animationTimeline?: string }).animationTimeline =
      'auto'

    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scrolling = document.scrollingElement || document.documentElement
        const max = Math.max(0, scrolling.scrollHeight - scrolling.clientHeight)
        const top =
          scrolling.scrollTop ||
          document.documentElement.scrollTop ||
          window.scrollY ||
          0
        const progress = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0
        bar.style.transform = `scaleX(${progress})`
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const t1 = window.setTimeout(update, 300)
    const t2 = window.setTimeout(update, 1200)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      bar.style.removeProperty('transform')
      bar.style.removeProperty('animation')
      ;(bar.style as CSSStyleDeclaration & { animationTimeline?: string }).animationTimeline =
        ''
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="reading-progress reading-progress-v2"
      aria-hidden="true"
      role="presentation"
    />
  )
}
