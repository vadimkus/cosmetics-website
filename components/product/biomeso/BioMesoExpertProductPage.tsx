'use client'

/**
 * Bespoke product page for BIO-MESO PDRN EXPERT AMPOULE 60000 (product 60).
 *
 * The Expert and the Homecare 5000 are the same formula at different spicule
 * loads, so they share one layout. This file is only the configuration: which
 * routine to read, which copy to use, and which inline art to show. The layout
 * itself lives in BioMesoProductPage.
 *
 * The one structural difference is that this product supplies the optional
 * `clinical` block, because it has a KC Skin Research Center study on file and
 * product 65 does not.
 */

import BioMesoProductPage, { type BioMesoPageConfig } from './BioMesoProductPage'
import { getBioMesoExpertCopy } from './biomesoExpertCopy'
import type { Product } from '@/types'

/**
 * S4 is the cross-section of spicules entering skin and S3 is the in-clinic
 * application, so they pair with the mechanism and protocol sections. S2 and S6
 * are title and closing cards and S5 is the clinical slide; those three carry
 * no section of their own, so they run in the lookbook after the stats, since
 * the page already states the same figures in text.
 */
const EXPERT_CONFIG: BioMesoPageConfig = {
  productNumber: '60',
  getCopy: getBioMesoExpertCopy,
  mechanismImage: '/images/6000/S4.jpeg',
  ritualImage: '/images/6000/S3.jpeg',
  slides: [
    '/images/6000/S1.jpeg',
    '/images/6000/S2.jpeg',
    '/images/6000/S3.jpeg',
    '/images/6000/S4.jpeg',
    '/images/6000/S5.jpeg',
    '/images/6000/S6.jpeg',
  ],
  // This product's slides are 1200x896, unlike every other bespoke product's
  // square exports. A square frame cropped a quarter of the width, taking the
  // headline printed inside the artwork with it.
  figureAspect: 'aspect-[4/3]',
  brochureUrl: '/documents/ppt/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf',
  logLabel: 'BioMesoExpert',
}

interface Props {
  product: Product
  unitsSold?: number
  routineProducts?: Product[]
}

export default function BioMesoExpertProductPage(props: Props) {
  return <BioMesoProductPage {...props} config={EXPERT_CONFIG} />
}
