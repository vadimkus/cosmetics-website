'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  /** The element whose hover starts the loop: the card's image frame. */
  hostRef: React.RefObject<HTMLElement | null>
}

const FADE_MS = 200

/**
 * A muted loop laid over the card photo while a mouse rests on it. Desktop with a fine pointer only,
 * off under prefers-reduced-motion. Nothing is fetched until the first hover; on leave the clip fades
 * back to the photo and rewinds, so the next hover starts on the frame that matches the photo.
 */
export default function CardHoverVideo({ src, hostRef }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const rewind = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hovering = useRef(false)

  const play = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    // A replay after pause + rewind does not always fire `playing`, so show on the resolved promise,
    // and only if the mouse is still on the card by then.
    v.play().then(() => { if (hovering.current) setVisible(true) })
      .catch(() => { /* autoplay refused: the photo simply stays */ })
  }, [])

  useEffect(() => {
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(hover.matches && !reduce.matches)
    update()
    hover.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      hover.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])

  const start = useCallback(() => {
    hovering.current = true
    if (rewind.current) clearTimeout(rewind.current)
    setLoaded(true)
    play()
  }, [play])

  const stop = useCallback(() => {
    hovering.current = false
    setVisible(false)
    rewind.current = setTimeout(() => {
      const v = videoRef.current
      if (!v) return
      v.pause()
      v.currentTime = 0
    }, FADE_MS)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !enabled) return
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') start() }
    const leave = (e: PointerEvent) => { if (e.pointerType === 'mouse') stop() }
    host.addEventListener('pointerenter', enter)
    host.addEventListener('pointerleave', leave)
    return () => {
      host.removeEventListener('pointerenter', enter)
      host.removeEventListener('pointerleave', leave)
      if (rewind.current) clearTimeout(rewind.current)
    }
  }, [enabled, hostRef, start, stop])

  // The first hover mounts the source; play once the element exists.
  useEffect(() => {
    if (loaded) play()
  }, [loaded, play])

  if (!enabled) return null

  return (
    <video
      ref={videoRef}
      src={loaded ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => { if (hovering.current) setVisible(true) }}
      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
    />
  )
}
