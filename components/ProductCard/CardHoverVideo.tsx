'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { markPlayed, registerInViewCard, releaseInViewCard, type InViewCard } from '@/lib/cardVideoInView'

interface Props {
  src: string
  /** The element whose hover (desktop) or position on screen (touch) starts the clip: the card's image frame. */
  hostRef: React.RefObject<HTMLElement | null>
}

const FADE_MS = 200

type Mode = 'hover' | 'inview' | null

interface NetworkInformationLike {
  saveData?: boolean
  effectiveType?: string
}

function pickMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return 'hover'
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
  if (conn?.saveData || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType ?? '')) return null
  return 'inview'
}

/**
 * A muted clip laid over the card photo.
 * - Desktop (fine pointer): loops while the mouse rests on the card; on leave it fades back and rewinds.
 * - Touch screens: plays one sweep when the card comes to rest near the middle of the screen, once per
 *   visit, one card at a time (see lib/cardVideoInView), then settles back on the photo.
 * Off under prefers-reduced-motion and on save-data / slow connections. Nothing is fetched until the
 * clip is first needed, and every rewind lands on frame 1, which matches the photo.
 */
export default function CardHoverVideo({ src, hostRef }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<Mode>(null)
  const [loaded, setLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const rewind = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wanted = useRef(false)
  const refused = useRef<(() => void) | null>(null)

  useEffect(() => {
    const queries = ['(hover: hover) and (pointer: fine)', '(prefers-reduced-motion: reduce)'].map(q => window.matchMedia(q))
    const update = () => setMode(pickMode())
    update()
    queries.forEach(q => q.addEventListener('change', update))
    return () => queries.forEach(q => q.removeEventListener('change', update))
  }, [])

  const play = useCallback(() => {
    const v = videoRef.current
    // Before the source is mounted a play() call is only aborted; the `loaded` effect plays instead.
    if (!v || !v.getAttribute('src')) return
    // A replay after pause + rewind does not always fire `playing`, so show on the resolved promise,
    // and only if the clip is still wanted by then.
    v.play().then(() => { if (wanted.current) setVisible(true) })
      .catch((e: unknown) => {
        // Autoplay refused (e.g. iOS Low Power Mode): the photo stays and the card gives up its turn.
        if ((e as { name?: string })?.name === 'NotAllowedError') refused.current?.()
      })
  }, [])

  const start = useCallback(() => {
    wanted.current = true
    if (rewind.current) clearTimeout(rewind.current)
    setLoaded(true)
    play()
  }, [play])

  const stop = useCallback(() => {
    wanted.current = false
    setVisible(false)
    if (rewind.current) clearTimeout(rewind.current)
    rewind.current = setTimeout(() => {
      const v = videoRef.current
      if (!v) return
      v.pause()
      v.currentTime = 0
    }, FADE_MS)
  }, [])

  // Desktop: hover.
  useEffect(() => {
    const host = hostRef.current
    if (!host || mode !== 'hover') return
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') start() }
    const leave = (e: PointerEvent) => { if (e.pointerType === 'mouse') stop() }
    host.addEventListener('pointerenter', enter)
    host.addEventListener('pointerleave', leave)
    return () => {
      host.removeEventListener('pointerenter', enter)
      host.removeEventListener('pointerleave', leave)
      if (rewind.current) clearTimeout(rewind.current)
    }
  }, [mode, hostRef, start, stop])

  // Touch: the page-wide coordinator decides when this card plays.
  const inView = useRef<InViewCard | null>(null)
  useEffect(() => {
    const host = hostRef.current
    if (!host || mode !== 'inview') return
    const card: InViewCard = { el: host, src, play: start, stop }
    inView.current = card
    const unregister = registerInViewCard(card)
    return () => {
      unregister()
      inView.current = null
      if (rewind.current) clearTimeout(rewind.current)
    }
  }, [mode, hostRef, src, start, stop])

  const ended = useCallback(() => {
    markPlayed(src)
    stop()
    if (inView.current) releaseInViewCard(inView.current)
  }, [src, stop])

  useEffect(() => {
    refused.current = mode === 'inview' ? ended : null
  }, [mode, ended])

  // The first trigger mounts the source; play once it is on the element.
  useEffect(() => {
    if (loaded && wanted.current) play()
  }, [loaded, play])

  if (!mode) return null

  return (
    <video
      ref={videoRef}
      src={loaded ? src : undefined}
      muted
      loop={mode === 'hover'}
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => { if (wanted.current) setVisible(true) }}
      onEnded={mode === 'inview' ? ended : undefined}
      onError={mode === 'inview' ? ended : undefined}
      className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
    />
  )
}
