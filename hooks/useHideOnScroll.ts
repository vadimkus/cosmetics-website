'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Hide-on-scroll for the mobile web chrome, mirroring the app.
 *
 * The rule is the app's, from `components/CollapsibleHeader.js`: the bar leaves
 * when you scroll into content and comes back the moment you scroll up, because
 * scrolling up is how someone signals they are done reading and want to
 * navigate. It never hides near the top, where it covers nothing, and it snaps
 * fully open or shut rather than resting halfway.
 *
 * What is deliberately *not* the app's is how the threshold is measured. The app
 * compares one scroll event to the last, which works on a flung native list
 * because those report big jumps. A deliberate drag on a web page arrives as two
 * or three pixels per frame and never clears a ten pixel gate, so a
 * frame-to-frame version simply never moves. Accumulating travel since the last
 * change of direction keeps the same feel for a flick and still answers a slow
 * drag.
 */

/** How far the page must travel one way before the bar reacts. */
export const DIRECTION_THRESHOLD = 10

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

/**
 * How far the bar has to travel to clear the screen.
 *
 * Measured rather than assumed: the height follows the font size and the offset
 * follows the safe-area inset, neither of which is knowable from here, and both
 * differ between the fixed site header and the sticky bars.
 *
 * Deliberately not `offsetTop`. On a stuck sticky element that reports the
 * shifted position, so the dead zone grows with the scroll and stays permanently
 * ahead of it - which reads as the bar never moving at all.
 */
export function hideDistance(el: HTMLElement): number {
  return el.getBoundingClientRect().height + parseFloat(getComputedStyle(el).top || '0')
}

/**
 * @param enabled Pass false while something is anchored to the bar - an open
 *   menu or dropdown - so it stays put instead of leaving its own panel behind.
 */
export function useHideOnScroll<T extends HTMLElement>({ enabled = true } = {}): {
  ref: RefObject<T | null>
  hidden: boolean
} {
  const ref = useRef<T>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return
    }

    let state: BarScrollState = { ...INITIAL_BAR_STATE, y: window.scrollY, anchorY: window.scrollY }
    let frame = 0

    const read = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const wasHidden = state.hidden
      state = nextBarState(state, window.scrollY, hideDistance(el))
      if (state.hidden !== wasHidden) setHidden(state.hidden)
    }

    // One decision per frame rather than per event: a scroll fires far more
    // often than the screen can redraw.
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  return { ref, hidden }
}
