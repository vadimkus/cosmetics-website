import { markPlayed, registerInViewCard, releaseInViewCard, type InViewCard } from '@/lib/cardVideoInView'

function card(src: string, top: number, height = 200): InViewCard & { plays: number; stops: number } {
  const el = document.createElement('div')
  el.getBoundingClientRect = () => ({ top, bottom: top + height, height, left: 0, right: 200, width: 200, x: 0, y: top, toJSON: () => ({}) })
  const c = {
    el,
    src,
    plays: 0,
    stops: 0,
    play: () => { c.plays++ },
    stop: () => { c.stops++ },
  }
  return c
}

describe('card video in-view coordinator', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    sessionStorage.clear()
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  })
  afterEach(() => jest.useRealTimers())

  it('plays only the card nearest the middle once scrolling settles', () => {
    const top = card('/videos/cards/a.mp4', 0)
    const middle = card('/videos/cards/b.mp4', 300)
    const offA = registerInViewCard(top)
    const offB = registerInViewCard(middle)
    expect(middle.plays).toBe(0)
    jest.advanceTimersByTime(300)
    expect(middle.plays).toBe(1)
    expect(top.plays).toBe(0)
    offA()
    offB()
  })

  it('skips cards already played this visit and cards mostly off screen', () => {
    const done = card('/videos/cards/a.mp4', 300)
    const clipped = card('/videos/cards/b.mp4', 700)
    const next = card('/videos/cards/c.mp4', 0)
    markPlayed(done.src)
    const offs = [done, clipped, next].map(registerInViewCard)
    jest.advanceTimersByTime(300)
    expect(done.plays).toBe(0)
    expect(clipped.plays).toBe(0)
    expect(next.plays).toBe(1)
    offs.forEach(off => off())
  })

  it('hands the turn to the next card when the active one finishes', () => {
    const first = card('/videos/cards/a.mp4', 300)
    const second = card('/videos/cards/b.mp4', 0)
    const offs = [first, second].map(registerInViewCard)
    jest.advanceTimersByTime(300)
    expect(first.plays).toBe(1)
    markPlayed(first.src)
    releaseInViewCard(first)
    jest.advanceTimersByTime(300)
    expect(second.plays).toBe(1)
    expect(first.plays).toBe(1)
    offs.forEach(off => off())
  })

  it('stops the active card when it scrolls off screen', () => {
    let top = 300
    const c = card('/videos/cards/a.mp4', 0)
    c.el.getBoundingClientRect = () => ({ top, bottom: top + 200, height: 200, left: 0, right: 200, width: 200, x: 0, y: top, toJSON: () => ({}) })
    const off = registerInViewCard(c)
    jest.advanceTimersByTime(300)
    expect(c.plays).toBe(1)
    top = -500
    window.dispatchEvent(new Event('scroll'))
    expect(c.stops).toBe(1)
    off()
  })
})
