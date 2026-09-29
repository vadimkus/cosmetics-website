'use client'

import type { Product } from '@/types'
import DtsToolProductPage, { type DtsToolVariant } from '../dtstool/DtsToolProductPage'
import { getStampCopy } from './stampCopy'

const slide = (name: string) => `/images/stamp_scalp/${name}.jpg`

/**
 * GENOSYS DTS Microneedle Stamp, product 67: the "Press here." campaign, paired
 * with HR³ MATRIX HAIR SOLUTION α (product 45), whose scalp protocol is
 * documented at 0.25 and 0.5 mm.
 */
const STAMP_VARIANT: DtsToolVariant = {
  productNumber: '67',
  getCopy: getStampCopy,
  slides: {
    why: ['s2', 's4', 's3', 's8'].map(slide),
    pairing: slide('s7'),
    lengths: slide('s6'),
    howTo: slide('s5'),
    session: ['s9', 's10b'].map(slide),
    details: ['s1', 's11b', 's12'].map(slide),
  },
  pairingProductId: '45',
  protocolLengths: new Set(['0.25mm', '0.5mm']),
}

export default function StampProductPage(props: { product: Product; unitsSold?: number; routineProducts?: Product[] }) {
  return <DtsToolProductPage {...props} variant={STAMP_VARIANT} />
}
