/**
 * Product 37 — PEPTIDE GEL MASK: new image set in /images/peptide_mask/
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/update-product-37-peptide-images.ts
 *   npx tsx --env-file=.env.local scripts/update-product-37-peptide-images.ts --apply
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never
)

const OLD_PATHS = ['/images/PEP.jpg']
const NEW_MAIN = '/images/peptide_mask/main.jpeg'
// Gallery only — main is prepended by web + mobile
const NEW_GALLERY = [
  '/images/peptide_mask/s1.jpeg',
  '/images/peptide_mask/s2.jpeg',
  '/images/peptide_mask/s3.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '37' }, { id: '37' }] },
    select: { id: true, productNumber: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 37 not found')
  console.log('BEFORE product:', JSON.stringify(product, null, 2))

  // Find order items still pointing at old path(s)
  const byPath = await prisma.orderItem.findMany({
    where: { image: { contains: 'PEP.jpg' } },
    select: { id: true, productName: true, image: true, productId: true },
  })
  const byName = await prisma.orderItem.findMany({
    where: {
      productName: { contains: 'PEPTIDE GEL MASK', mode: 'insensitive' },
      image: { contains: 'PEP' },
    },
    select: { id: true, productName: true, image: true, productId: true },
  })
  const itemMap = new Map<string, (typeof byPath)[0]>()
  for (const it of [...byPath, ...byName]) itemMap.set(it.id, it)
  const orderItems = [...itemMap.values()]
  console.log(`Order items to repoint: ${orderItems.length}`)
  for (const it of orderItems.slice(0, 8)) {
    console.log(`  - ${it.id} | ${it.productName} | ${it.image}`)
  }
  if (orderItems.length > 8) console.log(`  … +${orderItems.length - 8} more`)

  const dryRun = !process.argv.includes('--apply')
  if (dryRun) {
    console.log('DRY RUN — pass --apply to write')
    return
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: {
      image: NEW_MAIN,
      images: JSON.stringify(NEW_GALLERY),
    },
    select: { id: true, name: true, image: true, images: true },
  })
  console.log('AFTER product:', JSON.stringify(updated, null, 2))

  let n = 0
  for (const it of orderItems) {
    await prisma.orderItem.update({
      where: { id: it.id },
      data: { image: NEW_MAIN },
    })
    n++
  }
  console.log(`Repointed ${n} order items → ${NEW_MAIN}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
