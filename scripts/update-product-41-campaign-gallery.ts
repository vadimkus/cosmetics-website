/**
 * Product 41 (SKIN CARING BLEMISH BALM CUSHION): "Shade to go." campaign.
 *
 * - Main image -> /images/cushion_campaign/main.jpg (carton and open compact on white, no type),
 *   gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - Descriptions move to the campaign voice in all three languages. RU/AR come from
 *   data/product41LocalizedCopy.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-41-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-41-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_41_AR_DESCRIPTION, PRODUCT_41_RU_DESCRIPTION } from '../data/product41LocalizedCopy'

const DIR = '/images/cushion_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Shade to go. The Dubai sun finds you all day: the office window, the car, the terrace. This cushion goes with you. One press gives even, buildable coverage that still looks like skin, SPF50+ PA++++ from five filters, two mineral and three chemical, and niacinamide 2% with adenosine 0.04% working underneath all day: Korea licenses it for sun protection, tone and wrinkle care at once. The waterdrop puff reaches beside the nose and the inner eye, and its waterproof layer keeps the formula on your skin rather than in the sponge. The mirror is in the lid, and a sealed 15 g refill with its own puff is in the box. Three shades, #01 Ivory, #02 Beige and #03 Camel, with the same filters and actives in each. Outdoors, top up every two hours and after water, sweat or towelling; for long hours in direct sun, wear a sunscreen underneath. Dermatologically tested. Made in Korea.'

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
      return res.ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '41' }, { id: '41' }] },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 41 not found')

  console.log(product.name, product.id)
  console.log('  image  :', product.image, '->', MAIN)
  console.log('  images :', product.images ?? 'null', '->', `${GALLERY.length} campaign slides`)

  const missing: string[] = []
  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    if (!(await live(path))) missing.push(path)
  }
  if (missing.length) {
    console.error(`Not live yet (${missing.length}):`, missing.slice(0, 6).join(', '))
    process.exitCode = 1
    return
  }
  console.log(`  all ${1 + GALLERY.length + LOCALIZED.length} files return 200`)

  if (!apply) {
    console.log('Dry run - pass --apply to write.')
    return
  }
  await prisma.product.update({
    where: { id: product.id },
    data: {
      image: MAIN,
      images: JSON.stringify(GALLERY),
      description: DESCRIPTION,
      descriptionRu: PRODUCT_41_RU_DESCRIPTION,
      descriptionAr: PRODUCT_41_AR_DESCRIPTION,
    },
  })
  console.log('Updated product 41.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
