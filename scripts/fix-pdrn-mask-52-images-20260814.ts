/**
 * Product 52 image hotfix.
 *
 * Three of the four images on the PDRN mask page are AI-generated renders with
 * mangled pack text. Two of them render "PDRN" as "PORN":
 *
 *   pdrn_mask/s1.jpeg   the inset tub reads "SKIN REDOOT PORN IWASK PACK"
 *   pdrn_mask/s2.jpeg   the anti-ageing icon reads "PORN / Collagen / Elastin",
 *                       and it also misreports the clinical study - the 44.8%
 *                       figure is a per-subject barrier reading, not the TEWL
 *                       result, which was 34.969%
 *   pdrn_mask/main.jpeg "DERMATOLOGIGAELY TESTED" on the body and
 *                       "DERMATOLODICALLY TESTED" on the lid, plus "Ultrs-Slim"
 *                       and "Planthenol"
 *
 * Second/pdrnnn.jpg is the real pack shot, already in the repo and unused, with
 * every line spelled correctly. It becomes the main image. The gallery keeps the
 * two photographs that survive inspection.
 *
 * Files are left on disk rather than deleted: main.jpeg is referenced by past
 * order items and the order emails resolve against the stored path.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma') ? ({ accelerateUrl: url } as any) : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--commit')

const MAIN = '/images/Second/pdrnnn.jpg'
const GALLERY = ['/images/Second/pdrn_big2.jpg', '/images/Second/pdrn22.jpg']

async function main() {
  const product = await prisma.product.findFirst({
    where: { productNumber: '52' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('product 52 not found')

  console.log('current image  ', product.image)
  console.log('current gallery', product.images)
  console.log('')
  console.log('new image      ', MAIN)
  console.log('new gallery    ', JSON.stringify(GALLERY))

  if (!APPLY) {
    console.log('\ndry run, pass --commit to write')
    return
  }
  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })
  console.log('\nupdated', product.name)
}

main().finally(() => prisma.$disconnect())
