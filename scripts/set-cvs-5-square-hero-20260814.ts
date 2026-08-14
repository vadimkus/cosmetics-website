/**
 * Points product 5 at the squared CVS hero shot.
 *
 * The original, /images/CVS.jpg, is 956x662 on a lilac-grey studio sweep. The
 * gallery stage is square, so it sat inside the stage tint with 147px of a
 * different grey above and below - a hard-cornered rectangle inside a rounded
 * card. scripts/square-cvs-hero-image-20260814.py extended the sweep to 956x956 so the
 * shot now fills the stage edge to edge with no inner boundary.
 *
 * New filename, not an in-place replacement: /images/* is served with a one-year
 * immutable cache, so overwriting CVS.jpg would leave every repeat visitor on
 * the old copy.
 *
 * /images/CVS.jpg stays on disk. Historical order emails reference it and
 * lib/products.ts still names it in the static fallback catalogue.
 *
 * Run: npx tsx --env-file=.env.local scripts/set-cvs-5-square-hero-20260814.ts [--apply]
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as any)

const APPLY = process.argv.includes('--apply')

const OLD_HERO = '/images/CVS.jpg'
const NEW_HERO = '/images/cvs-hero.jpg'

async function main() {
  const product =
    (await prisma.product.findFirst({ where: { productNumber: '5' } })) ||
    (await prisma.product.findUnique({ where: { id: '5' } }))
  if (!product) throw new Error('product 5 not found')

  // cvs-hero-square.jpg was an intermediate that never shipped: it was written,
  // then regenerated with a different sweep, which /images/*'s one-year immutable
  // cache does not allow for a name that has been served. It is accepted here so
  // a local database that already points at it can be moved on.
  const KNOWN = [OLD_HERO, NEW_HERO, '/images/cvs-hero-square.jpg']
  if (!KNOWN.includes(product.image)) {
    throw new Error(`expected image to be one of ${KNOWN.join(', ')}, found ${product.image}`)
  }

  // The gallery prepends product.image, so the array must not contain either
  // hero path or the shopper gets the same slide twice.
  const gallery: string[] = JSON.parse(product.images || '[]')
  const images = gallery.filter(src => !KNOWN.includes(src))

  console.log(`image:  ${product.image}\n     -> ${NEW_HERO}`)
  console.log(`images: ${JSON.stringify(gallery)}\n     -> ${JSON.stringify(images)}`)

  if (!APPLY) return console.log('\nDRY RUN - pass --apply to write')

  await prisma.product.update({
    where: { id: product.id },
    data: { image: NEW_HERO, images: JSON.stringify(images) },
  })
  console.log('written')
}

main()
  .catch(e => {
    console.error(e.message ?? e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
