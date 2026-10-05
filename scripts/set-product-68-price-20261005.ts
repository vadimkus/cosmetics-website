import { prisma } from '@/lib/prisma'

// GLASS SKIN RITUAL KIT: 25% off its 870 AED component value (serum 330 + cream
// 290 + Revita Glow 250), 740 -> 652.50 AED. The page derives the badge from
// BEAUTY_BOX_REGULAR_PRICES['68'] in lib/discountUtils.ts.
//   npx tsx --env-file=.env --env-file=.env.local scripts/set-product-68-price-20261005.ts
async function main() {
  const r = await prisma.product.updateMany({ where: { productNumber: '68' }, data: { price: 652.5 } })
  const p = await prisma.product.findFirst({ where: { productNumber: '68' }, select: { price: true } })
  console.log('updated', r.count, 'price now', p?.price)
}

main().finally(() => prisma.$disconnect())
