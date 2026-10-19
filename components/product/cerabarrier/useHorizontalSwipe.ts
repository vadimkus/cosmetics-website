'use client'

import { useCallback, useRef, useState } from 'react'
import type { TouchEvent } from 'react'

/**
 * One-finger horizontal swipe for an image stage. The stage follows the finger
 * (`offset`), and a swipe past `threshold` px calls `onNext` / `onPrev`.
 * Vertical movement is left to the page so scrolling never fights the gallery;
 * pair it with `touch-action: pan-y` on the element.
 *
 * `consumeClick()` returns true once after a swipe, so the tap handler on the
 * same element (open lightbox) does not fire at the end of a drag.
 */
export function useHorizontalSwipe({
  onNext,
  onPrev,
  isRtl = false,
  threshold = 40,
}: {
  onNext: () => void
  onPrev: () => void
  isRtl?: boolean
  threshold?: number
}) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const axis = useRef<'x' | 'y' | null>(null)
  const swiped = useRef(false)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) {
      start.current = null
      return
    }
    const t = e.touches[0]!
    start.current = { x: t.clientX, y: t.clientY }
    axis.current = null
    swiped.current = false
  }, [])

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!start.current || e.touches.length !== 1) return
    const t = e.touches[0]!
    const dx = t.clientX - start.current.x
    const dy = t.clientY - start.current.y
    if (!axis.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      axis.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    }
    if (axis.current === 'x') {
      setDragging(true)
      setOffset(dx)
    }
  }, [])

  const onTouchEnd = useCallback(() => {
    const dx = offset
    const wasHorizontal = axis.current === 'x'
    start.current = null
    axis.current = null
    setDragging(false)
    setOffset(0)
    if (!wasHorizontal) return
    swiped.current = true
    if (Math.abs(dx) < threshold) return
    // Finger moving left shows the next image (right-to-left pages mirror it).
    const forward = isRtl ? dx > 0 : dx < 0
    if (forward) onNext()
    else onPrev()
  }, [offset, threshold, isRtl, onNext, onPrev])

  const consumeClick = useCallback(() => {
    if (!swiped.current) return false
    swiped.current = false
    return true
  }, [])

  return {
    offset,
    dragging,
    consumeClick,
    handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd },
  }
}
