'use client'

import type { Product } from '@/types'
import DtsToolProductPage, { type DtsToolVariant } from '../dtstool/DtsToolProductPage'
import { getStampCopy } from './stampCopy'

const slide = (name: string) => `/images/stamp_press/${name}.jpg`

/**
 * GENOSYS DTS Microneedle Stamp, product 67: the "Press. Don't pull." campaign, paired
 * with HR³ MATRIX HAIR SOLUTION α (product 45), whose scalp protocol is
 * documented at 0.25 and 0.5 mm.
 */
const STAMP_VARIANT: DtsToolVariant = {
  productNumber: '67',
  getCopy: getStampCopy,
  slides: {
    why: ['s2b', 's3b', 's4b', 's1b'].map(slide),
    pairing: slide('s7b'),
    lengths: slide('s6b'),
    howTo: slide('s5b'),
    session: ['s8b', 's9'].map(slide),
    details: ['s10b', 's11b', 's12b'].map(slide),
  },
  pairingProductId: '45',
  protocolLengths: new Set(['0.25mm', '0.5mm']),
}

export default function StampProductPage(props: { product: Product; unitsSold?: number; routineProducts?: Product[] }) {
  return <DtsToolProductPage {...props} variant={STAMP_VARIANT} />
}
