/**
 * Prints every product's packshot and gallery paths as JSON, for the cut-out
 * pipeline to work through.
 *
 *   npx tsx --env-file=.env.local scripts/cutout/dump-product-images.ts
 */
import { prisma } from '../../lib/prisma'

async function main() {
  const rows = await prisma.product.findMany({
    select: { productNumber: true, name: true, image: true, images: true },
    orderBy: { productNumber: 'asc' },
  })
  process.stdout.write(JSON.stringify(rows))
}

main().finally(() => prisma.$disconnect())
