/**
 * Product 57 (CHARMING LOOK BEAUTY BOX): "Curtain up." campaign, Beauty Box style v1.
 *
 * - Main image -> /images/bb_charming_campaign/main.jpg (the five products in the kit case, top
 *   down, one closed cushion compact), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render
 *   through lib/localizedProductImages.ts, so the record holds the EN paths. A box with its own
 *   slides shows main + slides only (BeautyBoxProductPage, lib/beautyBoxGallery.ts).
 * - Descriptions move to the selling copy in all three languages: no hard-coded prices, the SPF
 *   credited to the cushion alone, fragrance by product. RU/AR come from
 *   data/product57LocalizedCopy.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-57-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-57-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_57_AR_DESCRIPTION, PRODUCT_57_RU_DESCRIPTION } from '../data/product57LocalizedCopy'

const DIR = '/images/bb_charming_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Curtain up. Office light, phone cameras, Dubai sun: your skin is on stage from morning to night, and this box gets it ready and takes it all off again. SNOW O₂ Cleanser 180 ml goes on a dry face and foams up by itself. SNOW BOOSTER 200 ml is the toner with 3% betaine and no added fragrance, light enough to mist over make-up at midday. At the centre, the Skin Caring Blemish Balm Cushion, 15 g plus a 15 g refill in #01 Ivory, #02 Beige or #03 Camel: Korea licenses it for three jobs at once, SPF50+ PA++++ from five filters, brightening with niacinamide 2% and wrinkle care with adenosine 0.04%. Outdoors, reapply at least every two hours. At night, the Skin Defender Lip & Eye Makeup Remover 200 ml, half oil and half essence, takes eye and lip make-up off first, and the Skin Rescue Overnight Cream Mask 100 g goes on last once or twice a week and stays until morning. Only the toner has no added fragrance; each fragrance ingredient is named on its product page. Made in Korea. Together for less than the five bought separately.'

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
    where: { productNumber: '57' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 57 not found')

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
      descriptionRu: PRODUCT_57_RU_DESCRIPTION,
      descriptionAr: PRODUCT_57_AR_DESCRIPTION,
    },
  })
  console.log('Updated product 57.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
