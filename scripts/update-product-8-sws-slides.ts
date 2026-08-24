/**
 * Points POWER SOLUTION SWS (product 8) at the sws_0 slide set.
 *
 * The gallery is the DB `images` field only. The legacy productConfig gallery
 * for this product is removed in the same change, so there is one source.
 * `image` is never repeated in `images`: web and mobile both prepend it.
 */
import { prisma } from '../lib/prisma'

const MAIN = '/images/sws_0/Main.jpeg'
// Narrative order, not filename order: concern, positioning, actives, format,
// exclusions, protocol, then the shop card and the peptide note. S1, the
// open-box shot, is deliberately not in the rail.
const GALLERY = [
  '/images/sws_0/S4.jpeg', // pigmentation, uneven tone
  '/images/sws_0/S2.jpeg', // the vial for pigment
  '/images/sws_0/S5.jpeg', // 2% arbutin
  '/images/sws_0/S6.jpeg', // 17.71% humectant base
  '/images/sws_0/S3.jpeg', // one vial, one treatment
  '/images/sws_0/S7.jpeg', // 5-Free
  '/images/sws_0/S8.jpeg', // cleanse, open, apply, absorb
  '/images/sws_0/Closing.jpeg', // POWER SOLUTION SWS shop card
  '/images/sws_0/S9.jpeg', // sh-Polypeptide-7
]

async function main() {
  const product =
    (await prisma.product.findFirst({ where: { productNumber: '8' } })) ??
    (await prisma.product.findFirst({ where: { id: '8' } }))

  if (!product) throw new Error('product 8 not found')

  console.log('before:', product.id, product.name, product.image, product.images)

  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })

  console.log('after :', updated.image, updated.images)
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
