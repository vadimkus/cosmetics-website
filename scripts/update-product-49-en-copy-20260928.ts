/**
 * Product 49 (GENO-LED IR II): bring the EN record in line with RU/AR. Writes the EN
 * description and structured fields from PRODUCT_49_EN_RECORD in
 * data/product49LocalizedCopy.ts, which sells the same verified hardware as the RU/AR
 * payload with no effect, contact or post-procedure claims. It also clears skinType,
 * targetConcerns, usage and ageGroup again, as the August audit did: no concern is verified
 * for the device. RU/AR and the gallery stay as they are.
 *
 *   npx tsx --env-file=.env.local scripts/update-product-49-en-copy-20260928.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-49-en-copy-20260928.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_49_EN_RECORD } from '../data/product49LocalizedCopy'

const APPLY = process.argv.includes('--apply')
const COPY_FIELDS = ['description', 'productDetails', 'keyFeatures', 'benefits', 'howToUse', 'directions'] as const
const CLEARED = { skinType: null, targetConcerns: null, usage: null, ageGroup: null }
const FIELDS = [...COPY_FIELDS, ...(Object.keys(CLEARED) as (keyof typeof CLEARED)[])]

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '49' },
    select: { id: true, name: true, ...Object.fromEntries(FIELDS.map((f) => [f, true])) },
  })
  if (!product) throw new Error('Product 49 not found')

  const data: Record<string, string | null> = {
    ...Object.fromEntries(COPY_FIELDS.map((f) => [f, PRODUCT_49_EN_RECORD[f]])),
    ...CLEARED,
  }
  for (const f of FIELDS) {
    const before = (product as Record<string, unknown>)[f]
    console.log(`${f}: ${before === data[f] ? 'unchanged' : 'changes'}`)
  }

  if (!APPLY) {
    console.log('Dry run. Pass --apply to write.')
    return
  }
  await prisma.product.update({ where: { id: product.id }, data })

  const after = await prisma.product.findUnique({
    where: { id: product.id },
    select: Object.fromEntries(FIELDS.map((f) => [f, true])),
  })
  const drift = FIELDS.filter((f) => (after as Record<string, unknown>)[f] !== data[f])
  if (drift.length) throw new Error(`post-write mismatch: ${drift.join(', ')}`)
  console.log('written and verified')
}

main().finally(() => prisma.$disconnect())
