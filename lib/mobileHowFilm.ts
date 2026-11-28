/**
 * The "How to use it" film, in the shape the mobile app draws.
 *
 * Product 65 (BIO-MESO PDRN Homecare Ampoule 5000) has a three-film player on the website
 * (components/product/biomeso/BioMesoHowFilm.tsx). The app is native and draws its own player, so it needs the same
 * words and footage as plain data: this reads them from the module the web player reads, so the two can never
 * disagree on a caption, a language or a file name. The films are served from the site, so paths stay site-relative
 * and the app puts its asset origin in front, as it does for every other picture and video.
 *
 * It rides on the product's `howTo` bespoke block (see lib/bespokeContent.ts). An app that predates the player
 * ignores the extra field and shows the four step cards as before.
 */

import {
  getHowFilmCopy,
  HOW_FILM_CARD_FOR_STEP,
  HOW_FILM_MEDIA,
} from '@/components/product/biomeso/biomesoHowFilmCopy'

export interface BespokeFilmStep {
  id: string
  /** Short name of the step, shown on its tab. */
  eyebrow: string
  title: string
  body: string
  /** What the picture shows, for screen readers. */
  alt: string
}

export interface BespokeFilmMedia {
  /** The first frame of the film, so the film can start on top of it without a jump. */
  poster: string
  video: string
}

export interface BespokeFilmUi {
  /** Spoken name of the whole player. */
  region: string
  play: string
  pause: string
  replay: string
  previous: string
  next: string
  /** One line under the captions: how to move between steps by touch. */
  hint: string
  /** "Step 2 of 3", one per step, for screen readers. */
  stepLabels: string[]
}

export interface BespokeFilm {
  steps: BespokeFilmStep[]
  media: BespokeFilmMedia[]
  /** Which entry of the block lights up while each step plays (zero based), -1 for none. */
  cardForStep: number[]
  ui: BespokeFilmUi
}

/** Products whose "How to use it" has films. Same list as the pages that pass `howFilmMedia` on the website. */
const FILM_PRODUCTS = new Set(['65'])

const localeOf = (locale: string): 'en' | 'ru' | 'ar' => {
  const lang = String(locale || '').toLowerCase()
  if (lang.startsWith('ru')) return 'ru'
  if (lang.startsWith('ar')) return 'ar'
  return 'en'
}

export function getMobileHowFilm(
  productNumber: string | number | null | undefined,
  locale: string
): BespokeFilm | null {
  if (!FILM_PRODUCTS.has(String(productNumber ?? '').trim())) return null

  const copy = getHowFilmCopy(localeOf(locale))
  const total = copy.steps.length

  return {
    steps: copy.steps.map(({ id, eyebrow, title, body, alt }) => ({ id, eyebrow, title, body, alt })),
    media: HOW_FILM_MEDIA.map(({ poster, video }) => ({ poster, video })),
    cardForStep: copy.steps.map((_, i) => HOW_FILM_CARD_FOR_STEP[i] ?? -1),
    ui: {
      region: copy.ui.region,
      play: copy.ui.play,
      pause: copy.ui.pause,
      replay: copy.ui.replay,
      previous: copy.ui.previous,
      next: copy.ui.next,
      hint: copy.ui.hintTouch,
      stepLabels: copy.steps.map((_, i) => copy.ui.stepOf(i + 1, total)),
    },
  }
}
