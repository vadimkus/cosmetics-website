/**
 * Product 59 (DEEP MOISTURIZING BEAUTY BOX): give the box a gallery.
 *
 * The record has one image, the composite shot of all five products on white.
 * That is the right main image, but it leaves the gallery empty, so a shopper
 * cannot look at any single item in the box before buying it.
 *
 * Every product inside the box already has its own photographed packshot in the
 * repo, so the gallery is assembled from those, in the order the routine is
 * used. No new assets, and nothing here is a photograph of anything other than
 * what is actually in the box:
 *
 *   1  Snow O₂ Cleanser 180ml   /images/cleanser/Main.jpg
 *   2  Snow Booster 200ml       /images/Second/main_booster.jpg
 *   3  Hyaluron Serum 30ml      /images/hyaluron_serum/main.jpeg
 *   4  Hyaluron Cream 50g       /images/hyaluron/main.jpeg
 *   5  Sea Algae Mask 25g       /images/sea_algae/Main.jpeg
 *
 * Per .cursor/rules/product-gallery-images.mdc the DB `images` field is the one
 * source of truth and the main image is prepended by the web and mobile clients,
 * so it is deliberately not repeated in the array. The mobile app is API-driven
 * and picks this up without a release.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/set-product-59-gallery-20260813.ts
 *   npx tsx --env-file=.env.local scripts/set-product-59-gallery-20260813.ts --commit
 */

import { PrismaClient } from '@prisma/client'
import { existsSync } from 'fs'
import { join } from 'path'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : ({ datasourceUrl: databaseUrl, log: ['error'] } as never)
)

const COMMIT = process.argv.includes('--commit')

const GALLERY = [
  '/images/cleanser/Main.jpg',
  '/images/Second/main_booster.jpg',
  '/images/hyaluron_serum/main.jpeg',
  '/images/hyaluron/main.jpeg',
  '/images/sea_algae/Main.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '59' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 59 not found')

  // A gallery entry that 404s is worse than no gallery, so the files are checked
  // on disk before the record is touched.
  const missing = GALLERY.filter(src => !existsSync(join(process.cwd(), 'public', src)))
  if (missing.length) throw new Error(`Missing image files: ${missing.join(', ')}`)

  if (GALLERY.includes(product.image)) {
    throw new Error('Gallery must not repeat the main image; the clients prepend it')
  }

  console.log(`Product 59: ${product.name}`)
  console.log(`main:   ${product.image}`)
  console.log(`images: ${product.images ?? 'null'} -> ${JSON.stringify(GALLERY)}`)
  console.log(`All ${GALLERY.length} files present on disk.`)

  if (!COMMIT) {
    console.log('\nDry run. Re-run with --commit to write.')
    await prisma.$disconnect()
    return
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(GALLERY) },
  })
  const after = await prisma.product.findUnique({ where: { id: product.id }, select: { images: true } })
  console.log(`\nWritten: ${after?.images}`)
  await prisma.$disconnect()
}

main()
