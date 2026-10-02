/**
 * Touch screens have no hover, so card clips play when a card comes to rest in view instead.
 * One coordinator for the whole page: once scrolling settles, the registered card nearest the middle
 * of the viewport (at least 70% visible, not yet played this visit) plays its sweep once. Only one
 * card plays at a time, and a card that leaves the screen stops.
 */

export interface InViewCard {
  el: HTMLElement
  src: string
  play: () => void
  stop: () => void
}

const SETTLE_MS = 300
const MIN_VISIBLE = 0.7
const PLAYED_KEY = 'genosys:card-video-played'

const cards = new Set<InViewCard>()
let active: InViewCard | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let listening = false

function played(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(PLAYED_KEY) || '[]') as string[])
  } catch {
    return new Set()
  }
}

export function markPlayed(src: string) {
  try {
    const set = played()
    set.add(src)
    sessionStorage.setItem(PLAYED_KEY, JSON.stringify([...set]))
  } catch {
    /* storage blocked: the clip may simply replay */
  }
}

function visibleShare(el: HTMLElement): number {
  const r = el.getBoundingClientRect()
  if (r.height <= 0) return 0
  const top = Math.max(r.top, 0)
  const bottom = Math.min(r.bottom, window.innerHeight)
  return Math.max(0, bottom - top) / r.height
}

function pick() {
  if (active && visibleShare(active.el) < MIN_VISIBLE) {
    active.stop()
    active = null
  }
  if (active) return
  const done = played()
  const mid = window.innerHeight / 2
  let best: InViewCard | null = null
  let bestDist = Infinity
  for (const c of cards) {
    if (done.has(c.src) || visibleShare(c.el) < MIN_VISIBLE) continue
    const r = c.el.getBoundingClientRect()
    const dist = Math.abs(r.top + r.height / 2 - mid)
    if (dist < bestDist) {
      best = c
      bestDist = dist
    }
  }
  if (best) {
    active = best
    best.play()
  }
}

function schedule() {
  if (timer) clearTimeout(timer)
  if (active && visibleShare(active.el) < MIN_VISIBLE) {
    active.stop()
    active = null
  }
  timer = setTimeout(pick, SETTLE_MS)
}

export function registerInViewCard(card: InViewCard): () => void {
  cards.add(card)
  if (!listening) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    listening = true
  }
  schedule()
  return () => {
    cards.delete(card)
    if (active === card) active = null
    if (!cards.size && listening) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      listening = false
    }
  }
}

/** The active card's sweep finished (or failed): free the slot so another card can take it. */
export function releaseInViewCard(card: InViewCard) {
  if (active === card) active = null
  schedule()
}
