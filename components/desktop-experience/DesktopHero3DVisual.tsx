'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useDesktopExperience } from '@/hooks/useDesktopExperience'

const AtomFieldScene = dynamic(() => import('./AtomFieldScene'), {
  ssr: false,
  loading: () => null,
})

/**
 * Desktop hero visual:
 *   1. Static portrait (petri-dish + baked-in translucent molecules) renders
 *      immediately - instant LCP, no blank frame.
 *   2. <video> preloads in the background. Once it can play through it
 *      cross-fades over the static image, plays through end-to-end
 *      PLAYS_PER_CYCLE times, then fades back to the static image.
 *   3. Clicking (or pressing Enter / Space on) the hero block while the
 *      static image is showing replays the cycle.
 *   4. R3F atom field overlays everything with cursor parallax.
 *
 * Honors prefers-reduced-motion: skips video entirely for that audience.
 */

const STATIC_SRC = '/images/desktop-experience/genosys-athlete-face-hero.png'
const VIDEO_SRC = '/videos/desktop-experience/genosys-hero.mp4'
const PLAYS_PER_CYCLE = 1

export default function DesktopHero3DVisual() {
  const experience = useDesktopExperience({ minWidth: 768 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const playCountRef = useRef(0)
  const [videoActive, setVideoActive] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [idleReady, setIdleReady] = useState(false)

  // Defer the three.js chunk until the browser is idle so it never competes
  // with LCP / hydration of the rest of the page.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setIdleReady(true), { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(() => setIdleReady(true), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const startCycle = useCallback(() => {
    const v = videoRef.current
    if (!v || !videoReady) return
    playCountRef.current = 0
    try {
      v.currentTime = 0
    } catch {
      // Some browsers throw if metadata isn't ready yet; play() below will
      // still kick once readyState advances.
    }
    setVideoActive(true)
    v.play().catch(() => {
      // Autoplay blocked - revert to static and let the user click again.
      setVideoActive(false)
    })
  }, [videoReady])

  // Buffer detection: the moment the browser estimates it can play through.
  useEffect(() => {
    if (reduceMotion) return
    // Wait for the browser to go idle (post-LCP) before fetching the ~12MB
    // hero loop - with preload="none" the fetch only starts when we call
    // load(), so it no longer competes with LCP images / hydration.
    if (!idleReady) return
    const v = videoRef.current
    if (!v) return

    let cancelled = false
    const handleReady = () => {
      if (!cancelled) setVideoReady(true)
    }

    if (v.readyState >= 4) {
      handleReady()
    } else {
      v.addEventListener('canplaythrough', handleReady, { once: true })
      // Kick off buffering now that we're idle (preload="none" won't fetch on its own).
      try { v.load() } catch { /* noop */ }
    }

    return () => {
      cancelled = true
      v.removeEventListener('canplaythrough', handleReady)
    }
  }, [reduceMotion, idleReady])

  // First buffer-ready → kick the first cycle automatically.
  useEffect(() => {
    if (videoReady && !videoActive && playCountRef.current === 0) {
      startCycle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoReady])

  const handleEnded = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    playCountRef.current += 1
    if (playCountRef.current < PLAYS_PER_CYCLE) {
      v.currentTime = 0
      v.play().catch(() => setVideoActive(false))
    } else {
      setVideoActive(false)
      playCountRef.current = 0
    }
  }, [])

  // Click handler on the outer container - clicks anywhere inside bubble up
  // (including from the R3F canvas, since R3F doesn't stopPropagation by
  // default). Gated so clicks only do something when the static is showing.
  const onContainerClick = useCallback(() => {
    if (videoReady && !videoActive) startCycle()
  }, [videoReady, videoActive, startCycle])

  const onContainerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!videoReady || videoActive) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        startCycle()
      }
    },
    [videoReady, videoActive, startCycle],
  )

  const isReplayable = videoReady && !videoActive

  return (
    <div
      className={`cera-stage relative aspect-video w-full max-w-4xl overflow-hidden rounded-[24px] ${
        isReplayable ? 'cursor-pointer' : ''
      }`}
      onClick={onContainerClick}
      onKeyDown={onContainerKeyDown}
      role={isReplayable ? 'button' : undefined}
      tabIndex={isReplayable ? 0 : undefined}
      aria-label={isReplayable ? 'Play GENOSYS hero video' : undefined}
    >
      {/* Layer 1: static portrait - instant LCP, fades when video is active */}
      <Image
        src={STATIC_SRC}
        alt="GENOSYS - clinical-grade Korean dermacosmetics with photorealistic skincare science"
        fill
        priority
        sizes="(min-width: 768px) 896px, 100vw"
        className={`object-cover object-[center_30%] transition-opacity duration-[900ms] ease-in-out ${
          videoActive ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Layer 2: video - fades in when active, plays PLAYS_PER_CYCLE times */}
      {!reduceMotion ? (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="none"
          aria-hidden
          onEnded={handleEnded}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-[900ms] ease-in-out ${
            videoActive ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* Soft side vignette so the floating atoms read against the photo / video */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--cera-blush)]/25 via-transparent to-[var(--cera-blush)]/30" />

      {/* Layer 3: R3F atom field - cursor parallax, floats on top of both.
          Clicks bubble up through the canvas to the container's onClick. */}
      {experience.enabled && idleReady ? (
        <div className="absolute inset-0">
          <AtomFieldScene />
        </div>
      ) : null}
    </div>
  )
}
