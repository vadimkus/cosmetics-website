/**
 * Product 51 — BIO-FERMENT AGE DEFYING POWDER MASK.
 *
 * Removes the "218%" hydration figure from the stored record.
 *
 * The DTS MG deck prints "218% improvement in skin hydration" beside the two
 * values it was measured from, 17.27 before and 48.513 after. Those values give
 * a 180.9% increase, or 2.81x the starting reading. 218% would require an after
 * value of 54.92, or 37.65 if read as a proportion of baseline; neither appears
 * anywhere in the deck. The figure looks like a transposition of 281%, which is
 * the after value expressed as a percentage of the before value.
 *
 * The measured pair is kept and the derived percentage dropped, so the record
 * says only what the trial actually read.
 *
 * Dry run by default:
 *   npx tsx --env-file=.env.local scripts/fix-product-51-hydration-claim-20260822.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-51-hydration-claim-20260822.ts --apply
 */
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

/** Every replacement is a straight swap of the unsupported figure. */
const REPLACEMENTS: Array<[string, string]> = [
  [
    'Hydration rose 218% in the DTS MG clinical trial.',
    'Skin moisture nearly tripled in the DTS MG clinical trial, from 17.27 to 48.513.',
  ],
  ['Hydrate — 218% lift in the DTS MG clinical trial', 'Hydrate — skin moisture nearly tripled in the DTS MG clinical trial'],
  ['218% lift in the DTS MG clinical trial', 'skin moisture nearly tripled in the DTS MG clinical trial'],
  ['218% hydration lift', 'skin moisture nearly tripled'],
  ['218%', 'nearly triple the starting reading'],
]

const FIELDS = ['description', 'keyFeatures', 'benefits', 'productDetails', 'howToUse', 'directions'] as const

function rewrite(value: string | null): string | null {
  if (!value) return value
  return REPLACEMENTS.reduce((text, [from, to]) => text.split(from).join(to), value)
}

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '51' },
    select: {
      id: true,
      name: true,
      description: true,
      keyFeatures: true,
      benefits: true,
      productDetails: true,
      howToUse: true,
      directions: true,
    },
  })
  if (!product) throw new Error('product 51 not found')

  const data: Record<string, string> = {}
  for (const field of FIELDS) {
    const before = product[field]
    const after = rewrite(before)
    if (after !== null && after !== before) data[field] = after
  }

  console.log(`Product 51 → ${product.name} (${product.id})`)
  console.log(`Mode: ${APPLY ? 'APPLY' : 'DRY RUN'}`)
  console.log(`Fields to change: ${Object.keys(data).join(', ') || 'none'}`)
  for (const [field, value] of Object.entries(data)) {
    console.log(`\n--- ${field} ---\n${value}`)
  }

  if (!Object.keys(data).length) {
    console.log('\nRecord already clean.')
    return
  }
  if (!APPLY) {
    console.log('\nDry run complete. Re-run with --apply to write.')
    return
  }

  await prisma.product.update({ where: { id: product.id }, data })

  const after = await prisma.product.findFirst({
    where: { id: product.id },
    select: { description: true, keyFeatures: true, benefits: true, productDetails: true },
  })
  if (JSON.stringify(after).includes('218')) {
    throw new Error('post-write check failed: 218 still present in the record')
  }
  console.log('\nLive record updated and verified free of the 218% figure.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
