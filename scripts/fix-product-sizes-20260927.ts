import { prisma } from '@/lib/prisma'

// Product 50 stored its size in Russian ("1 набор"), which English visitors saw
// in the cart. Sizes are stored in English and translated on display.
// Product 64's phrase did not translate cleanly.
//   npx tsx --env-file=.env --env-file=.env.local scripts/fix-product-sizes-20260927.ts
const SIZES: Record<string, { from: string; to: string }> = {
  '50': { from: '1 набор', to: '1 kit' },
  '64': { from: '1 box - 8 pcs of hair stamp', to: '1 box (8 pcs)' },
}

async function main() {
  for (const [productNumber, { from, to }] of Object.entries(SIZES)) {
    const r = await prisma.product.updateMany({ where: { productNumber, size: from }, data: { size: to } })
    console.log(productNumber, r.count ? `${from} -> ${to}` : 'already updated')
  }
}

main().finally(() => prisma.$disconnect())
