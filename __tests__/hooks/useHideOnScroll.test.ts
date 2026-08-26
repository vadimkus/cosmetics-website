import { nextBarState, INITIAL_BAR_STATE, type BarScrollState } from '@/hooks/useHideOnScroll'

const DISTANCE = 68

/** Replay a series of scroll positions, as a real scroll arrives frame by frame. */
function run(positions: number[], from: BarScrollState = INITIAL_BAR_STATE): BarScrollState {
  return positions.reduce((state, y) => nextBarState(state, y, DISTANCE), from)
}

describe('mobile web hide-on-scroll', () => {
  it('stays put near the top, where it covers nothing', () => {
    expect(run([0]).hidden).toBe(false)
    expect(run([40, DISTANCE]).hidden).toBe(false)
  })

  it('steps aside on the way down', () => {
    expect(run([100, 200, 300]).hidden).toBe(true)
  })

  it('returns on the way up', () => {
    const down = run([100, 200, 300, 400])
    expect(down.hidden).toBe(true)
    expect(run([380, 340, 300], down).hidden).toBe(false)
  })

  it('comes back when a hidden bar reaches the top again', () => {
    const down = run([100, 300, 500])
    expect(nextBarState(down, 10, DISTANCE).hidden).toBe(false)
  })

  // The reason this is not the app's frame-to-frame rule. A deliberate drag
  // moves the page a few pixels per frame; comparing consecutive frames never
  // clears the gate, and the bar would never move at all.
  it('reacts to a slow drag, three pixels at a time', () => {
    const slow = Array.from({ length: 40 }, (_, i) => 100 + i * 3)
    expect(run(slow).hidden).toBe(true)
  })

  // A thumb resting on the glass jitters by a pixel either way.
  it('holds its state through jitter around one spot', () => {
    const down = run([100, 200, 300])
    const jitter = [301, 300, 301, 302, 301, 300, 299, 300]
    expect(run(jitter, down).hidden).toBe(true)
  })

  // Rubber-band bounce past the top reads as downward travel on the way back.
  it('does not hide on bounce back to the top', () => {
    expect(run([-30, -10, 4]).hidden).toBe(false)
  })

  it('ignores a repeated position', () => {
    const down = run([100, 200, 300])
    expect(nextBarState(down, 300, DISTANCE)).toEqual({ ...down, y: 300 })
  })
})

/**
 * The app's rule, copied from genosys-mobile-app/components/CollapsibleHeader.js.
 * Kept here so the two can be compared rather than assumed to agree.
 */
function shouldHideHeader({
  y,
  lastY,
  headerHeight,
  isHidden,
}: {
  y: number
  lastY: number
  headerHeight: number
  isHidden: boolean
}): boolean {
  if (y <= headerHeight) return false
  const delta = y - lastY
  if (Math.abs(delta) < 10) return isHidden
  return delta > 0
}

describe('agreement with the app', () => {
  // Where both are designed to behave the same: a flick, which arrives in jumps
  // larger than the threshold on either platform. The web version only parts
  // company below that, where the app would not move at all.
  it('matches the app on flick-sized movements', () => {
    const moves = [200, 400, 700, 640, 560, 480, 600, 900, 880, 40, 0, 300]
    let web = { ...INITIAL_BAR_STATE }
    let appHidden = false
    let lastY = 0

    for (const y of moves) {
      web = nextBarState(web, y, DISTANCE)
      appHidden = shouldHideHeader({ y, lastY, headerHeight: DISTANCE, isHidden: appHidden })
      lastY = y
      expect({ y, hidden: web.hidden }).toEqual({ y, hidden: appHidden })
    }
  })

  it('shares the app\u2019s two hard rules', () => {
    // Never hidden within its own height of the top.
    for (const y of [0, 1, DISTANCE]) {
      expect(nextBarState({ ...INITIAL_BAR_STATE, hidden: true }, y, DISTANCE).hidden).toBe(false)
      expect(shouldHideHeader({ y, lastY: 900, headerHeight: DISTANCE, isHidden: true })).toBe(false)
    }
    // Below the threshold, whatever it was measured against, state is kept.
    const down = run([100, 200, 300])
    expect(nextBarState(down, 305, DISTANCE).hidden).toBe(true)
    expect(shouldHideHeader({ y: 305, lastY: 300, headerHeight: DISTANCE, isHidden: true })).toBe(true)
  })
})
