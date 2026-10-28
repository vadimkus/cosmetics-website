/**
 * Block INTENSIVE BLEMISH BALM CREAM (productNumber 42) — out of stock,
 * storefront shows the "Available in 5 days" note from lib/restockInfo.ts.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/block-blemish-balm-product-42.ts          # dry run
 *   npx tsx --env-file=.env.local scripts/block-blemish-balm-product-42.ts --apply
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

  const matches = await prisma.product.findMany({
    where: { name: { contains: 'BLEMISH BALM', mode: 'insensitive' } },
    select: { id: true, productNumber: true, name: true, inStock: true, isHidden: true },
  })
  console.log('MATCHES:', matches)

  const before = matches.find((p) => p.productNumber === '42')
  if (!before) throw new Error('Product 42 (INTENSIVE BLEMISH BALM CREAM) not found')
  if (!/INTENSIVE BLEMISH BALM/i.test(before.name)) {
    throw new Error(`Product 42 is "${before.name}", expected INTENSIVE BLEMISH BALM CREAM`)
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
