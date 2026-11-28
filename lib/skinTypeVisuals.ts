export interface SkinTypeVisual {
  image: string
  imagePosition: string
}

/**
 * Artwork for the five skin-type options in the /skin-recommendation quiz.
 *
 * Same job as CONCERN_VISUALS in lib/concernVisuals.ts: a macro still behind
 * the copy, subject weighted into the right third, left side falling away to
 * near-white so the label and description stay legible without a heavy scrim.
 *
 * The "-v2" set (28 Nov 2026) is photographed, not procedural: GPT Image 2.5
 * via CapCut, 21:9 at 1600x680, one real material per skin type (wind-rippled
 * sand, golden oil droplets, sage plaster meeting dewy glass, champagne satin,
 * a single feather). Filenames carry the version because /images/* is served
 * immutable for a year; the v1 files stay on disk for pages cached before the
 * switch. Source takes and prompts: ~/Desktop/GENOSYS/03_PRODUCTS_TRAINING/
 * Images/SKIN_QUIZ_CARDS_2026-11/.
 *
 * Kept separate from the concern set because these describe a skin type rather
 * than a concern, and only one word overlaps ("sensitive"). Sharing the file
 * would tie the quiz to the concern slugs, which are a different taxonomy.
 */
export const SKIN_TYPE_VISUALS = {
  dry: {
    image: '/images/skin-types/dry-v2.webp',
    imagePosition: '62% center',
  },
  oily: {
    image: '/images/skin-types/oily-v2.webp',
    imagePosition: '64% center',
  },
  combination: {
    image: '/images/skin-types/combination-v2.webp',
    imagePosition: '66% center',
  },
  normal: {
    image: '/images/skin-types/normal-v2.webp',
    imagePosition: '64% center',
  },
  sensitive: {
    image: '/images/skin-types/sensitive-v2.webp',
    imagePosition: '60% center',
  },
} as const satisfies Record<string, SkinTypeVisual>

export type SkinTypeVisualSlug = keyof typeof SKIN_TYPE_VISUALS

export function getSkinTypeVisual(value: string): SkinTypeVisual | undefined {
  return SKIN_TYPE_VISUALS[value as SkinTypeVisualSlug]
}
