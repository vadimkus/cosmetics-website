export interface SkinTypeVisual {
  image: string
  imagePosition: string
}

/**
 * Artwork for the five skin-type options in the /skin-recommendation quiz.
 *
 * Deliberately the same shape and treatment as CONCERN_VISUALS in
 * lib/concernVisuals.ts: 960x720 macro abstracts, subject weighted into the
 * right third, left side falling away to near-white so the copy laid over it
 * stays legible without a heavy scrim.
 *
 * Kept separate from the concern set because these describe a skin type rather
 * than a concern, and only one word overlaps ("sensitive"). Sharing the file
 * would tie the quiz to the concern slugs, which are a different taxonomy.
 */
export const SKIN_TYPE_VISUALS = {
  dry: {
    image: '/images/skin-types/dry.webp',
    imagePosition: '62% center',
  },
  oily: {
    image: '/images/skin-types/oily.webp',
    imagePosition: '64% center',
  },
  combination: {
    image: '/images/skin-types/combination.webp',
    imagePosition: '66% center',
  },
  normal: {
    image: '/images/skin-types/normal.webp',
    imagePosition: '64% center',
  },
  sensitive: {
    image: '/images/skin-types/sensitive.webp',
    imagePosition: '60% center',
  },
} as const satisfies Record<string, SkinTypeVisual>

export type SkinTypeVisualSlug = keyof typeof SKIN_TYPE_VISUALS

export function getSkinTypeVisual(value: string): SkinTypeVisual | undefined {
  return SKIN_TYPE_VISUALS[value as SkinTypeVisualSlug]
}
