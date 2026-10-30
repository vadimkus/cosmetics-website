/**
 * Block SKIN BARRIER PROTECTING CREAM (productNumber 27) — out of stock on shelves.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/block-skin-barrier-cream-product-27.ts          # dry run
 *   npx tsx --env-file=.env.local scripts/block-skin-barrier-cream-product-27.ts --apply
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
if (!process.env.DATABASE_URL && !process.env.PRISMA_DATABASE_URL) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
}

const apply = process.argv.includes('--apply')

async function main() {
  const { prisma } = await import('../lib/prisma')

  const before = await prisma.product.findFirst({
    where: { productNumber: '27' },
    select: { id: true, productNumber: true, name: true, inStock: true, isHidden: true },
  })
  if (!before) throw new Error('Product 27 (SKIN BARRIER PROTECTING CREAM) not found')
  if (!/SKIN BARRIER PROTECTING CREAM/i.test(before.name)) {
    throw new Error(`Product 27 is "${before.name}", expected SKIN BARRIER PROTECTING CREAM`)
  }
  console.log('BEFORE:', before)

  if (!apply) {
    console.log('Dry run. Re-run with --apply to set inStock=false.')
    return
  }

  const after = await prisma.product.update({
    where: { id: before.id },
    data: { inStock: false },
    select: { id: true, productNumber: true, name: true, inStock: true, isHidden: true },
  })
  console.log('AFTER:', after)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
