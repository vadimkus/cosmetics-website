/**
 * Product 11 (SKIN DEFENDER LIP & EYE MAKEUP REMOVER) moves to the August 2026
 * campaign set in `public/images/defender_0/`.
 *
 *   hero     Main.jpeg          clean bottle on white
 *   gallery  S1 … S6, Closing   the six storytelling slides plus the final card
 *
 * Packshot-tall.jpeg is the vertical cut. It stays on disk for social and out of
 * the gallery, matching how product 52 handles its tall packshot.
 *
 * Replaces the /images/remover/ set (main4 + S1b … S6b). Idempotent.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-11-defender-slides-20260826.ts
 */
import { prisma } from '../lib/prisma'

const FOLDER = '/images/defender_0'
const MAIN = `${FOLDER}/Main.jpeg`
const GALLERY = [
  `${FOLDER}/S1.jpeg`,
  `${FOLDER}/S2.jpeg`,
  `${FOLDER}/S3.jpeg`,
  `${FOLDER}/S4.jpeg`,
  `${FOLDER}/S5.jpeg`,
  `${FOLDER}/S6.jpeg`,
  `${FOLDER}/Closing.jpeg`,
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '11' },
    select: { id: true, name: true, image: true, images: true },
  })

  if (!product) throw new Error('Product 11 not found')

  console.log('before')
  console.log('  image ', product.image)
  console.log('  images', product.images)

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
    select: { image: true, images: true },
  })

  console.log('after')
  console.log('  image ', updated.image)
  console.log('  images', updated.images)

  await prisma.$disconnect()
}

main()
