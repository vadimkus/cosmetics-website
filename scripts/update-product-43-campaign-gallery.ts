/**
 * Product 43 (HR³ MATRIX HAIR TONIC α): "Forecast: cool up top." art set.
 *
 * - Main image -> /images/tonic_campaign/main.jpg (the spray bottle on white, no type).
 * - Gallery -> /images/tonic_art/s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - Descriptions move to the campaign voice in all three languages. RU/AR come from
 *   data/product43LocalizedCopy.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-43-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-43-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_43_AR_TRANSLATION, PRODUCT_43_RU_TRANSLATION } from '../data/product43LocalizedCopy'

const DIR = '/images/tonic_art'
const MAIN = '/images/tonic_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Keep a cool head. 70 ml leave-on scalp tonic for scalp nourishing and hair conditioning. Menthol 0.3% with menthyl lactate and a second cooling agent gives an instant chill, salicylic acid 0.25% keeps the scalp feeling clean and panthenol 0.2% conditions; every batch is tested for all three. Spray onto the scalp, massage in circles and leave on at least 3-4 hours, morning and evening. Do not use with salicylate sensitivity, diabetes, circulatory disorders, renal impairment, an infected or reddened scalp, or during menstruation or pregnancy. Use within 3 months of opening. Made in Korea.'

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
    where: { OR: [{ productNumber: '43' }, { id: '43' }] },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 43 not found')

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
      descriptionRu: PRODUCT_43_RU_TRANSLATION.description,
      descriptionAr: PRODUCT_43_AR_TRANSLATION.description,
    },
  })
  console.log('Updated product 43.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
