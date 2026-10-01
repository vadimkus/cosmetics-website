/**
 * Product 3 (HairGen BOOSTER): gallery slide 5 "FEELS LIKE A MASSAGE." moves from the s5b model
 * shot to s5c, the device with a white feather resting on its head (1 Oct 2026).
 * RU/AR swap in through lib/localizedProductImages.ts. Run after the deploy carrying s5c is live.
 *   npx tsx --env-file=.env.local scripts/update-product-3-slide5-feather-20261001.ts
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const OLD = '/images/hairgen_campaign/s5b.jpg'
const NEW = '/images/hairgen_campaign/s5c.jpg'

async function main() {
  const res = await fetch(`https://genosys.ae${NEW}`, { method: 'HEAD' })
  if (!res.ok) throw new Error(`${NEW} is not live yet (${res.status})`)

  const product = await prisma.product.findFirst({ where: { productNumber: '3' } })
  if (!product) throw new Error('product 3 not found')
  const images: string[] = JSON.parse(product.images || '[]')
  if (images.includes(NEW) && !images.includes(OLD)) {
    console.log('product 3 gallery already on s5c')
    return
  }
  const i = images.indexOf(OLD)
  if (i < 0) throw new Error(`product 3 gallery has no ${OLD}: ${product.images}`)
  images[i] = NEW
  await prisma.product.update({ where: { id: product.id }, data: { images: JSON.stringify(images) } })
  console.log(`product 3 gallery slide ${i + 1}: ${OLD} -> ${NEW}`)
}

main().finally(() => prisma.$disconnect())
