'use client'

import type { Product } from '@/types'
import { CVS_VARIANT } from './powerSolutionCopy'
import PowerSolutionProductPage from './PowerSolutionProductPage'

/**
 * POWER SOLUTION CVS, product 5.
 *
 * BESPOKE_PDP_LAYOUTS maps a product number to a component that takes one fixed
 * set of props, so each ampoule gets a wrapper that supplies its own variant
 * rather than the shared layout guessing from the product row.
 *
 * A client component, not a server one, even though it renders no interactive
 * markup itself. A variant carries getCopy, a function, and functions cannot be
 * serialised across the server/client boundary - so if this file stayed on the
 * server the variant would have to be passed as a prop into the client page and
 * React would refuse it. Declaring it here keeps the whole handoff inside the
 * client bundle, where the variant is an import rather than a payload.
 */
export default function CvsProductPage(props: {
  product: Product
  unitsSold?: number
  routineProducts?: Product[]
}) {
  return <PowerSolutionProductPage {...props} variant={CVS_VARIANT} />
}
