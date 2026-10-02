/**
 * Hover loops for product cards, keyed by the main image they were cut from.
 *
 * The clip's first frame is the main photo, so the swap on hover is invisible; keying by image (not
 * product number) means a re-shot main silently drops its old clip instead of playing a loop of a
 * photo that is no longer there. /videos/* is cached immutable for a year: a changed clip ships under
 * a new filename (53-v1.mp4 -> 53-v2.mp4).
 */
const CARD_VIDEOS: Readonly<Record<string, string>> = {
  '/images/collagen_campaign/main-v2.jpg': '/videos/cards/53-v1.mp4',
  '/images/seaalgae_campaign/main.jpg': '/videos/cards/36-v1.mp4',
  '/images/peptide_campaign/main-v2.jpg': '/videos/cards/37-v1.mp4',
  '/images/bb_age_campaign/main.jpg': '/videos/cards/bb_age-v1.mp4',
  '/images/bb_charming_campaign/main.jpg': '/videos/cards/bb_charming-v1.mp4',
  '/images/bb_deep_campaign/main.jpg': '/videos/cards/bb_deep-v1.mp4',
}

export function cardVideoFor(image: string | null | undefined): string | null {
  return (image && CARD_VIDEOS[image]) || null
}

export function cardVideoEntries(): Array<[string, string]> {
  return Object.entries(CARD_VIDEOS)
}
