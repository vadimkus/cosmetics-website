/**
 * Product 59 (DEEP MOISTURIZING BEAUTY BOX): drop two gallery slides that show a
 * size the box does not contain.
 *
 * Earlier today the box was given a gallery built from the packshots of its five
 * members. Reviewing it slide by slide, two of them are the wrong picture for
 * this record:
 *
 *   /images/cleanser/Main.jpg   180ml Homecare *and* 500ml Professional
 *   /images/hyaluron/main.jpeg  50g Homecare *and* 250g Professional
 *
 * On products 10 and 29 those are the correct main images, because both sizes
 * are sold there and the size selector is on the same screen. In this box's own
 * gallery they read as contents, and the box holds one 180ml and one 50g. A
 * shopper paging through six photos of what they are buying should not have to
 * infer that half of what is shown is not included.
 *
 * The remaining three are single-unit shots of exactly what ships, and the main
 * image is the composite of all five items, so the box is still fully
 * illustrated:
 *
 *   1  Snow Booster 200ml   /images/Second/main_booster.jpg
 *   2  Hyaluron Serum 30ml  /images/hyaluron_serum/main.jpeg
 *   3  Sea Algae Mask 25g   /images/sea_algae/Main.jpeg
 *
 * Not used, and worth recording so nobody reaches for them next time: the S1-S6
 * alternates for both products are marketing infographics that state
 * "PHYTOLEX SC", "MULTIEX PHYTROGEN" and "11 Types of Hyaluronic Acid". Those
 * are the same claims that were removed from this box's copy today, because no
 * manufacturer document supports them - the formulas list neither complex, and
 * both hyaluronate decks list 8 INCI names, not 11. They are still live on
 * products 10 and 29 and need new artwork, which is a separate job.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-product-59-gallery-drop-dual-size-20260813.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-59-gallery-drop-dual-size-20260813.ts --commit
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

const DROP = ['/images/cleanser/Main.jpg', '/images/hyaluron/main.jpeg']

const GALLERY = [
  '/images/Second/main_booster.jpg',
  '/images/hyaluron_serum/main.jpeg',
  '/images/sea_algae/Main.jpeg',
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '59' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 59 not found')

  const missing = GALLERY.filter(src => !existsSync(join(process.cwd(), 'public', src)))
  if (missing.length) throw new Error(`Missing image files: ${missing.join(', ')}`)
  if (GALLERY.includes(product.image)) {
    throw new Error('Gallery must not repeat the main image; the clients prepend it')
  }

  console.log(`Product 59: ${product.name}`)
  console.log(`main:   ${product.image}`)
  console.log(`before: ${product.images ?? 'null'}`)
  console.log(`after:  ${JSON.stringify(GALLERY)}`)
  console.log(`dropped: ${DROP.join(', ')}`)

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
