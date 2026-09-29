'use client'

import type { Product } from '@/types'
import DtsToolProductPage, { type DtsToolVariant } from '../dtstool/DtsToolProductPage'
import { getRollerCopy } from './rollerCopy'

const slide = (name: string) => `/images/roller_campaign/${name}.jpg`

/**
 * GENOSYS DTS Microneedle Roller, product 1: the "Every needle counts." campaign.
 * It is used with any Power Solution ampoule, so no single product gets the
 * pairing card and no length is tagged; the ampoules sit under "Works with".
 */
const ROLLER_VARIANT: DtsToolVariant = {
  productNumber: '1',
  getCopy: getRollerCopy,
  slides: {
    why: ['s2', 's3', 's4', 's5'].map(slide),
    pairing: slide('s9'),
    lengths: slide('s6'),
    howTo: slide('s8'),
    session: ['s7', 's10'].map(slide),
    details: ['s1', 's11', 's12'].map(slide),
  },
  pairingProductId: null,
  protocolLengths: new Set(),
}

export default function RollerProductPage(props: { product: Product; unitsSold?: number; routineProducts?: Product[] }) {
  return <DtsToolProductPage {...props} variant={ROLLER_VARIANT} />
}
