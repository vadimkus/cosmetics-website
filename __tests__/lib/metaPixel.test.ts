import { CONSENT_KEY } from '@/lib/consent'

function loadPixel() {
  let mod: typeof import('@/lib/metaPixel') | undefined
  jest.isolateModules(() => {
    mod = require('@/lib/metaPixel')
  })
  return mod!
}

describe('Meta Pixel consent gating', () => {
  beforeEach(() => {
    localStorage.clear()
    delete window.fbq
    delete window._fbq
    document.head.innerHTML = ''
  })

  it('loads nothing and sends nothing before consent', () => {
    const { metaTrack, metaPageView } = loadPixel()
    metaPageView()
    metaTrack('AddToCart', { value: 300 })
    expect(window.fbq).toBeUndefined()
    expect(document.querySelector('script[src*="fbevents.js"]')).toBeNull()
  })

  it('after consent: loads the script once, grants, inits the dataset and queues events', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    const { metaTrack, metaPageView, metaPurchaseEventId, META_PIXEL_ID } = loadPixel()
    metaPageView()
    metaTrack('Purchase', { value: 600, currency: 'AED' }, metaPurchaseEventId('GEN1'))
    expect(document.querySelectorAll('script[src*="fbevents.js"]')).toHaveLength(1)
    expect(window.fbq!.queue).toEqual([
      ['consent', 'grant'],
      ['init', META_PIXEL_ID],
      ['track', 'PageView'],
      ['track', 'Purchase', { value: 600, currency: 'AED' }, { eventID: 'purchase_GEN1' }],
    ])
  })
})
