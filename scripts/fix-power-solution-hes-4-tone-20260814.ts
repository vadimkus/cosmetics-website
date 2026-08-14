/**
 * Product 4 (POWER SOLUTION HES), English DB row: stop citing the carton.
 *
 * The claims audit earlier today rewrote this row against the registration
 * documents, and in doing so it sourced several claims to the packaging - "the
 * two functions printed on the carton", "the carton shows the heavy HA carried
 * past the surface", "which is why the box can say no artificial fragrance".
 * Every one of those is accurate. None of them belongs in body copy: the
 * selling-tone rule reserves "as printed on the carton" for the full INCI note,
 * where it tells a buyer the on-screen list matches the pack in their hand.
 * Everywhere else it makes us sound like we are reading the box back to someone
 * who is holding it.
 *
 * Also drops "batch" where it was doing no work ("3% of the batch" is 3% of the
 * vial) and fixes one real inaccuracy: it is Korea that registers the function,
 * not the carton.
 *
 * The bespoke page reads components/product/powersolution/hesCopy.ts, not this
 * row, so these fields surface on the mobile app, the product cards, search and
 * the JSON-LD. The wording is kept in step with hesCopy.ts deliberately.
 *
 * Usage: npx tsx --env-file=.env.local scripts/fix-power-solution-hes-4-tone-20260814.ts [--apply]
 */

import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

/** Each pair must match exactly once in the field, or the script refuses. */
const EDITS: Record<string, [string, string][]> = {
  description: [
    [
      'and the carton registers it for two things: firming and hydrating',
      'and Korea registers it for two things: firming and hydrating',
    ],
  ],
  productDetails: [
    [
      '"keyBenefits":"Firming and hydrating, the two functions registered on the carton"',
      '"keyBenefits":"Firming and hydrating, the two functions it is registered for"',
    ],
    [
      '"packaging":"Sealed glass vial with a rubber crimp cap, ten vials to the carton"',
      '"packaging":"Sealed glass vial with a rubber crimp cap, ten vials to a box"',
    ],
  ],
  keyFeatures: [
    ['BIOPHYTEX is three percent of the batch', 'BIOPHYTEX is three percent of the vial'],
  ],
  benefits: [
    [
      '"Firming and hydrating, the two functions printed on the carton"',
      '"Firming and hydrating, the two things it is licensed to do"',
    ],
  ],
  ingredients: [
    [
      'This is where the scent comes from, which is why the box can say no artificial fragrance. Too little to declare a single fragrance allergen.',
      'This is where the scent comes from: real oils rather than a synthetic fragrance, and too little for any single fragrance allergen to reach a declarable level.',
    ],
    ['"name":"BIOPHYTEX (3% of the batch)"', '"name":"BIOPHYTEX (3% of the vial)"'],
    [
      'so every batch arrives with the same 217-amino-acid sequence instead of varying the way a plant extract does',
      'so it is the same 217-amino-acid sequence every time instead of varying the way a plant extract does',
    ],
  ],
  howToUse: [
    [
      'With a roller, under a practitioner: the carton shows the heavy HA carried past the surface rather than sitting on it.',
      'With a roller, under a practitioner, the heavy HA is carried past the surface rather than left sitting on it.',
    ],
  ],
}

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '4' } })
  if (!product) throw new Error('product 4 not found')

  const data: Record<string, string> = {}

  for (const [field, pairs] of Object.entries(EDITS)) {
    const current = (product as unknown as Record<string, unknown>)[field]
    if (typeof current !== 'string') throw new Error(`${field} is not a string`)

    let next = current
    for (const [from, to] of pairs) {
      const count = next.split(from).length - 1
      if (count !== 1) throw new Error(`${field}: ${count} matches for ${from.slice(0, 60)}`)
      next = next.replace(from, to)
    }
    if (next !== current) data[field] = next
    console.log(`${field}: ${pairs.length} edit(s)`)
  }

  if (!APPLY) {
    console.log('\nDry run. Pass --apply to write.')
    return
  }

  await prisma.product.update({ where: { id: product.id }, data })
  console.log('\nUpdated product 4.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
