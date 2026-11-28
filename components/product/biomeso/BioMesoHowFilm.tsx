'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import type { HowMedia, HowStepCopy, HowUi } from './biomesoHowFilmCopy'
import './biomesoHowFilm.css'

/**
 * "How to use it" film for the BIO-MESO Homecare 5000 page: three short films, one per step of the weekly evening,
 * with every control on screen.
 *
 * Ways to drive it: click a numbered step tab, press the arrows or the play / pause pill on the picture, click a bar
 * at the top of the picture, press the keyboard arrows or space while it is focused, or swipe the picture. Nothing is
 * tied to page scroll. It plays only while it is on screen and the tab is visible, and with reduced motion or data
 * saver on it waits for Play and shows the still frames. The films load only when the picture is near the screen.
 *
 * The page's own section header and the four step cards sit around it; this component is the picture, its controls,
 * the step tabs and the caption of the step that is showing. It tells the page which step is playing, so the matching
 * card can light up.
 */

interface Props {
  steps: HowStepCopy[]
  media: HowMedia[]
  ui: HowUi
  dir?: 'ltr' | 'rtl'
  /** Called with the step that is showing while the picture is on screen, and with null when it is not. */
  onActiveChange?: (index: number | null) => void
}

const SWIPE_MIN = 44
/** A step without a working film holds its still this long, then the player moves on. */
const STILL_HOLD_MS = 4200
/** The picture cross-fades for this long; a film that has just left the screen is rewound after it. */
const FADE_MS = 700
/** The films start loading when the picture is within this distance of the screen. */
const LOAD_MARGIN = '900px 0px'

export default function BioMesoHowFilm({ steps, media, ui, dir = 'ltr', onActiveChange }: Props) {
  const n = steps.length
  const isRtl = dir === 'rtl'

  const stageRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const barRefs = useRef<(HTMLElement | null)[]>([])
  const drag = useRef<{ x: number; y: number } | null>(null)
  const swipedAt = useRef(0)

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [finished, setFinished] = useState(false)
  const [inView, setInView] = useState(false)
  const [near, setNear] = useState(false)
  const [docVisible, setDocVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [announce, setAnnounce] = useState('')
  const [failed, setFailed] = useState<Record<number, boolean>>({})

  // Motion preferences: with reduced motion or data saver the film waits for the visitor to press Play.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const apply = () => {
      const quiet = mq.matches || Boolean(conn?.saveData)
      setReduced(quiet)
      if (quiet) setPaused(true)
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const onVisibility = () => setDocVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Play only while the picture is at least half on screen; start fetching the films when it is close.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const watch = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.5 })
    const load = new IntersectionObserver(([entry]) => setNear(Boolean(entry?.isIntersecting)), { rootMargin: LOAD_MARGIN })
    watch.observe(el)
    load.observe(el)
    return () => {
      watch.disconnect()
      load.disconnect()
    }
  }, [])

  const eager = near && !reduced
  const hasFilm = Boolean(media[active]?.video) && !failed[active]
  const shouldPlay = !paused && !finished && inView && docVisible

  useEffect(() => {
    onActiveChange?.(inView ? active : null)
  }, [active, inView, onActiveChange])

  // The films that are about to be needed (this step and the next) load as soon as the picture is near.
  useEffect(() => {
    if (!eager) return
    for (const i of [active, (active + 1) % n]) {
      const v = videoRefs.current[i]
      if (v && v.readyState === 0 && v.networkState !== v.NETWORK_LOADING) v.load()
    }
  }, [active, eager, n])

  useEffect(() => {
    const rewind: number[] = []
    videoRefs.current.forEach((v, i) => {
      if (!v || i === active) return
      if (!v.paused) v.pause()
      // Rewind a film once it has faded out, so it is on its first frame the next time it is shown.
      rewind.push(
        window.setTimeout(() => {
          try {
            v.currentTime = 0
          } catch {
            /* not loaded: nothing to rewind */
          }
        }, FADE_MS),
      )
    })
    const v = videoRefs.current[active]
    if (v) {
      if (shouldPlay) {
        // A browser can refuse autoplay (low-power mode): fall back to the still and the Play button.
        v.play().catch(() => setPaused(true))
      } else {
        v.pause()
      }
    }
    return () => rewind.forEach(id => window.clearTimeout(id))
  }, [active, shouldPlay])

  // Progress: one bar per step, written straight to the DOM every frame.
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const tick = () => {
      const v = videoRefs.current[active]
      const dur = v?.duration
      const p = finished
        ? 1
        : hasFilm && v && dur && Number.isFinite(dur) && dur > 0
          ? Math.min(1, v.currentTime / dur)
          : hasFilm
            ? 0
            : 1
      barRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleX(${i < active ? 1 : i === active ? p : 0})`
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, finished, hasFilm, inView])

  const goTo = useCallback((i: number) => {
    const v = videoRefs.current[i]
    if (v) {
      try {
        v.currentTime = 0
      } catch {
        /* metadata not loaded yet: the clip starts from zero anyway */
      }
    }
    setActive(i)
    setFinished(false)
  }, [])

  const select = useCallback(
    (i: number) => {
      const next = (i + n) % n
      goTo(next)
      if (!reduced) setPaused(false)
      setAnnounce(`${ui.stepOf(next + 1, n)}. ${steps[next]?.title ?? ''}`)
    },
    [goTo, n, reduced, steps, ui],
  )

  const toggle = useCallback(() => {
    if (finished) {
      select(0)
      setPaused(false)
      return
    }
    setPaused(p => !p)
  }, [finished, select])

  const handleEnded = useCallback(
    (i: number) => {
      if (i !== active) return
      if (i < n - 1) goTo(i + 1)
      else setFinished(true)
    },
    [active, goTo, n],
  )

  // A step with no working film (offline, blocked) holds its still for a few seconds, then moves on.
  useEffect(() => {
    if (!shouldPlay || hasFilm) return
    const id = window.setTimeout(() => {
      if (active < n - 1) goTo(active + 1)
      else setFinished(true)
    }, STILL_HOLD_MS)
    return () => window.clearTimeout(id)
  }, [active, goTo, hasFilm, n, shouldPlay])

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    const target = e.target as HTMLElement
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight'
    const back = isRtl ? 'ArrowRight' : 'ArrowLeft'
    if (e.key === forward) {
      e.preventDefault()
      select(active + 1)
    } else if (e.key === back) {
      e.preventDefault()
      select(active - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      select(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      select(n - 1)
    } else if (e.key === ' ' && target === stageRef.current) {
      e.preventDefault()
      toggle()
    }
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swipedAt.current = 0
    if ((e.target as HTMLElement).closest('button')) return
    drag.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swipedAt.current = performance.now()
      select((dx < 0) !== isRtl ? active + 1 : active - 1)
    }
  }

  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    // A mouse drag ends in a click on the same element: that click belongs to the swipe, not to Play / Pause.
    // (A finger swipe sends no click, so the flag is also cleared by the next pointer down.)
    if (performance.now() - swipedAt.current < 400) return
    if ((e.target as HTMLElement).closest('button')) return
    toggle()
  }

  // Tapping a step tab while the picture is mostly off screen brings the picture into view.
  const showStage = () => {
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
    // 'nearest' moves the page as little as possible; the margins in the CSS keep the picture clear of the header.
    if (visible < r.height * 0.6) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' })
  }

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft
  const NextIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <div className="hiw hiw-media" dir={dir} onKeyDown={onKeyDown}>
      <div
        ref={stageRef}
        className="hiw-stage"
        role="group"
        aria-label={ui.stage}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null
        }}
        onClick={onStageClick}
      >
        {steps.map((s, i) => {
          const m = media[i]
          if (!m) return null
          return (
            <div key={s.id} className={`hiw-layer${i === active ? ' is-active' : ''}`} aria-hidden={i !== active}>
              <Image src={m.poster} alt={s.alt} fill sizes="(max-width: 1023px) 92vw, 520px" quality={85} draggable={false} />
              <video
                ref={el => {
                  videoRefs.current[i] = el
                  // The film may have loaded before React took over the page: do not miss it.
                  if (el && el.readyState >= 2) el.classList.add('is-ready')
                }}
                src={m.video}
                muted
                playsInline
                disablePictureInPicture
                preload={eager && (i === active || i === (active + 1) % n) ? 'auto' : 'none'}
                aria-hidden="true"
                onLoadedData={e => e.currentTarget.classList.add('is-ready')}
                onError={() => setFailed(f => (f[i] ? f : { ...f, [i]: true }))}
                onEnded={() => handleEnded(i)}
              />
            </div>
          )
        })}

        <div className="hiw-bars">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="hiw-seg"
              aria-label={`${ui.stepOf(i + 1, n)}: ${s.title}`}
              aria-current={i === active ? 'step' : undefined}
              onClick={() => select(i)}
            >
              <i
                ref={el => {
                  barRefs.current[i] = el
                }}
              />
            </button>
          ))}
        </div>

        {/* The big mark shows a pause in the middle of the show. At the very end the last frame stays clean and the
            Replay pill below does the talking. */}
        <div className={`hiw-mark${paused && !finished ? ' is-on' : ''}`} aria-hidden="true">
          <span className="hiw-glass">
            <Play aria-hidden="true" fill="currentColor" strokeWidth={0} />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 p-4">
          <button type="button" className="hiw-glass" onClick={toggle}>
            {finished ? (
              <RotateCcw aria-hidden="true" />
            ) : paused ? (
              <Play aria-hidden="true" fill="currentColor" strokeWidth={0} />
            ) : (
              <Pause aria-hidden="true" fill="currentColor" strokeWidth={0} />
            )}
            <span>{finished ? ui.replay : paused ? ui.play : ui.pause}</span>
          </button>
          <div className="flex items-center gap-2">
            <button type="button" className="hiw-glass is-round" aria-label={ui.previous} onClick={() => select(active - 1)}>
              <PrevIcon aria-hidden="true" />
            </button>
            <span className="hiw-glass" style={{ cursor: 'default', fontVariantNumeric: 'tabular-nums' }} aria-hidden="true" dir="ltr">
              {active + 1} / {n}
            </span>
            <button type="button" className="hiw-glass is-round" aria-label={ui.next} onClick={() => select(active + 1)}>
              <NextIcon aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="hiw-tabs" role="group" aria-label={ui.region}>
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`hiw-tab${i === active ? ' is-active' : ''}`}
            aria-current={i === active ? 'step' : undefined}
            onClick={() => {
              select(i)
              showStage()
            }}
          >
            <span className="hiw-tab-num cera-serif cera-numeral" aria-hidden="true">
              {i + 1}
            </span>
            <span className="hiw-tab-label">{s.eyebrow}</span>
          </button>
        ))}
      </div>

      <div className="hiw-caption">
        {steps.map((s, i) => (
          <div key={s.id} className={`hiw-cap${i === active ? ' is-active' : ''}`} aria-hidden={i !== active}>
            <p className="hiw-cap-title cera-serif">{s.title}</p>
            <p className="hiw-cap-body">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="hiw-hint hiw-hint-desk" aria-hidden="true">
        {ui.hintKeys.map(h => (
          <span key={h.text} className="hiw-hint-item">
            {h.keys.map(k => (
              <span key={k} className="hiw-kbd">
                {k}
              </span>
            ))}
            {h.text}
          </span>
        ))}
      </div>
      <div className="hiw-hint hiw-hint-touch" aria-hidden="true">
        {ui.hintTouch}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  )
}
