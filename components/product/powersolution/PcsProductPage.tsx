'use client'

import type { Product } from '@/types'
import { PCS_VARIANT } from './pcsCopy'
import PowerSolutionProductPage from './PowerSolutionProductPage'

/**
 * POWER SOLUTION PCS, product 7. See pcsCopy.ts for the sourcing.
 *
 * A client component, not a server one, even though it renders no interactive
 * markup itself. A variant carries getCopy, a function, and functions cannot be
 * serialised across the server/client boundary - so if this file stayed on the
 * server the variant would have to be passed as a prop into the client page and
 * React would refuse it. Declaring it here keeps the whole handoff inside the
 * client bundle, where the variant is an import rather than a payload.
 */
export default function PcsProductPage(props: {
  product: Product
  unitsSold?: number
  routineProducts?: Product[]
}) {
  return <PowerSolutionProductPage {...props} variant={PCS_VARIANT} />
}
