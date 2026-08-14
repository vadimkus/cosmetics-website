/**
 * Take the COA lot codes out of the customer-facing spec on products 4 and 5.
 *
 * A lot code is dossier vocabulary: it means nothing to a buyer, and it dates
 * the page, because the box they receive will carry a different lot with a
 * different expiry. The measured figure and the specification it sits inside
 * are the proof worth printing; the code behind it is not.
 *
 *   npx tsx --env-file=.env.local scripts/fix-power-solution-lot-references-20260815.ts
 *   npx tsx --env-file=.env.local scripts/fix-power-solution-lot-references-20260815.ts --apply
 */
import { prisma } from '../lib/prisma'

const DETAIL_EDITS: Record<string, Record<string, string>> = {
  '4': {
    ph: '5.75, inside a 4.50 to 6.50 specification',
    fill: '2 ml per vial; specific gravity 1.0272',
    microbial: 'Under 10 cfu/ml, against a limit of 100',
    shelfLife: 'Three years from manufacture, with the expiry date on the box',
  },
  '5': {
    ph: '5.94, inside a 6.00 ± 1.00 specification',
    fill: '2 ml per vial; specific gravity 1.032',
    shelfLife: 'Three years from manufacture, with the expiry date on the box',
  },
}

async function main() {
  const apply = process.argv.includes('--apply')

  for (const [productNumber, edits] of Object.entries(DETAIL_EDITS)) {
    const product = await prisma.product.findFirst({ where: { productNumber } })
    if (!product) throw new Error(`product ${productNumber} not found`)
    if (!product.productDetails) throw new Error(`product ${productNumber} has no productDetails`)

    const details = JSON.parse(product.productDetails) as Record<string, string>
    console.log(`\n=== product ${productNumber} — ${product.name} ===`)

    for (const [key, next] of Object.entries(edits)) {
      const before = details[key]
      if (before === undefined) throw new Error(`product ${productNumber} has no ${key}`)
      if (before === next) {
        console.log(`  ${key}: already clean`)
        continue
      }
      console.log(`  ${key}:`)
      console.log(`    - ${before}`)
      console.log(`    + ${next}`)
      details[key] = next
    }

    if (apply) {
      await prisma.product.update({
        where: { id: product.id },
        data: { productDetails: JSON.stringify(details) },
      })
      console.log('  written')
    }
  }

  if (!apply) console.log('\nDry run. Re-run with --apply to write.')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
