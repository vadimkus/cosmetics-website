export interface ConcernVisual {
  image: string
  imagePosition: string
  /**
   * For cards that set copy over the left of the image (~1.45:1). Shifts the
   * crop left so the face starts where the copy ends; imagePosition keeps the
   * subject centred for the hero and square thumbnails.
   */
  cardPosition: string
}

/**
 * Shared concern artwork used by homepage cards, concern landing pages,
 * social metadata, image sitemaps, and the mobile concern API.
 *
 * Keep slug coverage aligned with CONCERN_PAGES in lib/concernsData.ts.
 * The focused mapping test fails if either list drifts.
 *
 * 1600x900 frames: the concern and the moment it is treated sit in the right
 * half, the left half is empty ivory under the copy. The vertical position
 * keeps that detail inside the ~3.2:1 landing hero.
 */
export const CONCERN_VISUALS = {
  'sun-protection': {
    image: '/images/concern_campaign/sun-protection.webp',
    imagePosition: '68% 50%',
    cardPosition: '38% 50%',
  },
  'acne-treatment': {
    image: '/images/concern_campaign/acne-blemishes.webp',
    imagePosition: '64% 32%',
    cardPosition: '0% 32%',
  },
  pigmentation: {
    image: '/images/concern_campaign/pigmentation.webp',
    imagePosition: '64% 45%',
    cardPosition: '27% 45%',
  },
  'scars-treatment': {
    image: '/images/concern_campaign/scar-treatment.webp',
    imagePosition: '64% 48%',
    cardPosition: '27% 48%',
  },
  'hair-loss': {
    image: '/images/concern_campaign/hair-loss.webp',
    imagePosition: '66% 22%',
    cardPosition: '0% 22%',
  },
  'anti-aging': {
    image: '/images/concern_campaign/anti-aging.webp',
    imagePosition: '62% 40%',
    cardPosition: '16% 40%',
  },
  hydration: {
    image: '/images/concern_campaign/hydration.webp',
    imagePosition: '66% 38%',
    cardPosition: '8% 38%',
  },
  sensitivity: {
    image: '/images/concern_campaign/sensitive-skin.webp',
    imagePosition: '62% 50%',
    cardPosition: '0% 50%',
  },
} as const satisfies Record<string, ConcernVisual>

export type ConcernVisualSlug = keyof typeof CONCERN_VISUALS

export function getConcernVisual(slug: string): ConcernVisual | undefined {
  return CONCERN_VISUALS[slug as ConcernVisualSlug]
}
