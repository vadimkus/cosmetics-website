/**
 * Product 64 (Hair Stamp for HairGen BOOSTER): two productDetails keys read as source-audit
 * notes rather than product facts - `needleDepth` recited where the figure is and is not
 * printed, and `evidence` said no study is held for the stamp or the booster. The depth stays
 * 0.3 mm; `evidence` goes. Nothing else in the record changes.
 *
 *   npx tsx --env-file=.env.local scripts/fix-product-64-stamp-details-20260927.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/fix-product-64-stamp-details-20260927.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '64' },
    select: { id: true, name: true, productDetails: true },
  })
  if (!p?.productDetails) throw new Error('Product 64 or its productDetails not found')

  const details = JSON.parse(p.productDetails) as Record<string, string>
  console.log('BEFORE:', JSON.stringify(details, null, 2))
  details.needleDepth = '0.3 mm, a cosmetic depth'
  delete details.evidence
  console.log('AFTER:', JSON.stringify(details, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    return
  }
  await prisma.product.update({ where: { id: p.id }, data: { productDetails: JSON.stringify(details) } })
  console.log('written')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
