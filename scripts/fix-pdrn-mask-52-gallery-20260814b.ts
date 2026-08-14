/**
 * Product 52, second image pass.
 *
 * The first pass this morning pulled the three AI renders under
 * /images/pdrn_mask/ and repointed the gallery at two files in Second/ that
 * looked like photographs at thumbnail size. One of them is not.
 *
 *   Second/pdrn_big2.jpg   the upper tub reads "Ultra-Slim Fit Skteet" and
 *                          "optimal absorptic", the lower tub reads "SKIN
 *                          REBOCT PDRN MASK PACK", and the rim between the two
 *                          tubs melts into itself. It is a render.
 *
 * The lesson from the first pass held: check every image at full resolution,
 * not at gallery size. It was only legible once the slide was opened at 2000px.
 *
 * /images/PDRN.png replaces it. Two tubs at an angle, white ground, and every
 * line correct - SKIN REBOOT, DERMATOLOGICALLY TESTED, Ultra-Slim Fit Sheet,
 * Rebooting System, Anti-Aging, 350g/30ea. It is 998px rather than 2000px, so
 * it is slightly soft in the lightbox, which is a fair trade for a shot that
 * spells the product's own name correctly.
 *
 * Surviving images for this product, all verified at full resolution:
 *
 *   Second/pdrnnn.jpg   main. Single tub, straight on, 2000px
 *   PDRN.png            two tubs at an angle, 998px
 *   Second/pdrn22.jpg   the sheet in the hands, no text on it at all, 2000px
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma') ? ({ accelerateUrl: url } as any) : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--commit')

const GALLERY = ['/images/PDRN.png', '/images/Second/pdrn22.jpg']

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '52' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('product 52 not found')

  console.log('image          ', product.image, '(unchanged)')
  console.log('current gallery', product.images)
  console.log('new gallery    ', JSON.stringify(GALLERY))

  if (!APPLY) {
    console.log('\ndry run, pass --commit to write')
    return
  }
  await prisma.product.update({
    where: { id: product.id },
    data: { images: JSON.stringify(GALLERY) },
  })
  console.log('\nupdated', product.name)
}

main().finally(() => prisma.$disconnect())
