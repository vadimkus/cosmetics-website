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
    why: ['s2', 's3', 's4', 's1'].map(slide),
    pairing: slide('s7'),
    lengths: slide('s6'),
    howTo: slide('s5'),
    session: ['s8', 's9'].map(slide),
    details: ['s10', 's11', 's12'].map(slide),
  },
  pairingProductId: '45',
  protocolLengths: new Set(['0.25mm', '0.5mm']),
}

export default function StampProductPage(props: { product: Product; unitsSold?: number; routineProducts?: Product[] }) {
  return <DtsToolProductPage {...props} variant={STAMP_VARIANT} />
}
