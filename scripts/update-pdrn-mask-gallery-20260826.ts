/**
 * Product 52 (SKIN REBOOT PDRN MASK PACK) — point the gallery at the new set.
 *
 * The hero is the clean packshot with no campaign copy; the eight campaign
 * slides run problem -> proof -> actives -> format -> protocol -> shop.
 * The hero is deliberately absent from `images`: both web and mobile prepend
 * `product.image` themselves.
 */
import { prisma } from '../lib/prisma'

const MAIN = '/images/pdrn_mask_new/Main.jpeg'

const SLIDES = [
  '/images/pdrn_mask_new/S1.jpeg', // A stressed barrier. Back inside twenty minutes.
  '/images/pdrn_mask_new/S2.jpeg', // Barrier recovery. Measured. 34.969%
  '/images/pdrn_mask_new/S3.jpeg', // Two claims. Licensed in Korea.
  '/images/pdrn_mask_new/S4.jpeg', // 1,000 ppm salmon DNA.
  '/images/pdrn_mask_new/S5.jpeg', // Thin enough to read through.
  '/images/pdrn_mask_new/S6.jpeg', // 30 sheets. One tub.
  '/images/pdrn_mask_new/S7.jpeg', // 20 minutes. Then pat. Do not rinse.
  '/images/pdrn_mask_new/Closing.jpeg', // 30 resets. One tub.
]

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '52' } })
  if (!product) throw new Error('Product 52 not found')

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(SLIDES) },
  })

  console.log('image :', updated.image)
  console.log('images:', updated.images)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
