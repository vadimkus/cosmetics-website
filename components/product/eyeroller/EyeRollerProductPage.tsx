'use client'

import type { Product } from '@/types'
import DtsToolProductPage, { type DtsToolVariant } from '../dtstool/DtsToolProductPage'
import { getEyeRollerCopy } from './eyeRollerCopy'

const slide = (name: string) => `/images/eyeroller_art/${name}.jpg`

/**
 * GENOSYS Eye Roller 0.25 mm, product 69: the "For your eyes only." campaign, paired with
 * EyeCell Eye Contour Serum (product 17), the serum it rolls over.
 */
const EYE_ROLLER_VARIANT: DtsToolVariant = {
  productNumber: '69',
  getCopy: getEyeRollerCopy,
  slides: {
    why: ['s3', 's11', 's6', 's8'].map(slide),
    pairing: slide('s4'),
    lengths: slide('s2'),
    howTo: slide('s5'),
    session: ['s7', 's9'].map(slide),
    details: ['s1', 's10', 's12'].map(slide),
  },
  pairingProductId: '17',
  protocolLengths: new Set(),
}

export default function EyeRollerProductPage(props: { product: Product; unitsSold?: number; routineProducts?: Product[] }) {
  return <DtsToolProductPage {...props} variant={EYE_ROLLER_VARIANT} />
}
