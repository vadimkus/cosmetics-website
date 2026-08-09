export interface ConcernVisual {
  image: string
  imagePosition: string
}

/**
 * Shared concern artwork used by homepage cards, concern landing pages,
 * social metadata, image sitemaps, and the mobile concern API.
 *
 * Keep slug coverage aligned with CONCERN_PAGES in lib/concernsData.ts.
 * The focused mapping test fails if either list drifts.
 */
export const CONCERN_VISUALS = {
  'sun-protection': {
    image: '/images/home/skin_concern/sun-protection.webp',
    imagePosition: '58% center',
  },
  'acne-treatment': {
    image: '/images/home/skin_concern/acne-blemishes.webp',
    imagePosition: '60% center',
  },
  pigmentation: {
    image: '/images/home/skin_concern/pigmentation.webp',
    imagePosition: '59% center',
  },
  'scars-treatment': {
    image: '/images/home/skin_concern/scar-treatment.webp',
    imagePosition: '60% center',
  },
  'hair-loss': {
    image: '/images/home/skin_concern/hair-loss.webp',
    imagePosition: '61% center',
  },
  'anti-aging': {
    image: '/images/home/skin_concern/anti-aging.webp',
    imagePosition: '61% center',
  },
  hydration: {
    image: '/images/home/skin_concern/hydration.webp',
    imagePosition: '60% center',
  },
  sensitivity: {
    image: '/images/home/skin_concern/sensitive-skin.webp',
    imagePosition: '62% center',
  },
} as const satisfies Record<string, ConcernVisual>

export type ConcernVisualSlug = keyof typeof CONCERN_VISUALS

export function getConcernVisual(slug: string): ConcernVisual | undefined {
  return CONCERN_VISUALS[slug as ConcernVisualSlug]
}
