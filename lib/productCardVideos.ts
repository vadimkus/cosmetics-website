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
  '/images/bb_bright_campaign/main.jpg': '/videos/cards/bb_bright-v1.mp4',
  '/images/bb_problem_campaign/main.jpg': '/videos/cards/bb_problem-v1.mp4',
  '/images/6000/main-v2.jpg': '/videos/cards/6000-v1.mp4',
  '/images/cera_o/Main.jpeg': '/videos/cards/cera_o-v1.mp4',
  '/images/bb_sensitive_campaign/main.jpg': '/videos/cards/bb_sensitive-v1.mp4',
  '/images/pdrn_5000_new/main2c.jpg': '/videos/cards/pdrn_5000_new-v1.mp4',
  '/images/snowo2_campaign/main.jpg': '/videos/cards/10-v1.mp4',
  '/images/glass_skin_campaign/main.jpg': '/videos/cards/68-v1.mp4',
  '/images/defender_0/Main.jpeg': '/videos/cards/11-v1.mp4',
  '/images/hydro_soothing_o/main-v2.jpg': '/videos/cards/28-v1.mp4',
  '/images/multifunc_cream/main-v2.jpg': '/videos/cards/32-v1.mp4',
  '/images/radiance/main-v2.jpg': '/videos/cards/31-v1.mp4',
  '/images/problemcream_v2/main.jpg': '/videos/cards/30-v1.mp4',
  '/images/mhcream_campaign/main-v2.jpg': '/videos/cards/29-v1.mp4',
  '/images/soothing_rep_o/Main.jpeg': '/videos/cards/25-v1.mp4',
  '/images/nd_cell_o/Main.jpeg': '/videos/cards/23-v1.mp4',
  '/images/skin_barr/main-v2.jpg': '/videos/cards/27-v1.mp4',
  '/images/cushion_campaign/main.jpg': '/videos/cards/41-v1.mp4',
  '/images/revita_o/main-v2.jpg': '/videos/cards/revita_o-v1.mp4',
  '/images/blemish_o/main-v2.jpg': '/videos/cards/42-v1.mp4',
  '/images/led_campaign/main.jpg': '/videos/cards/49-v1.mp4',
  '/images/gentron_campaign/main-v2.jpg': '/videos/cards/48-v1.mp4',
  '/images/hairgen_campaign/main-v3.jpg': '/videos/cards/3-v1.mp4',
  '/images/eye_cream/main-v2.jpg': '/videos/cards/24-v1.mp4',
  '/images/patch/main-v2.jpg': '/videos/cards/33-v1.mp4',
  '/images/eyekit_campaign/main-v2.jpg': '/videos/cards/50-v1.mp4',
  '/images/bio_ferment2/main.jpeg': '/videos/cards/51-v1.mp4',
}

export function cardVideoFor(image: string | null | undefined): string | null {
  return (image && CARD_VIDEOS[image]) || null
}

export function cardVideoEntries(): Array<[string, string]> {
  return Object.entries(CARD_VIDEOS)
}
