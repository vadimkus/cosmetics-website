/**
 * Product 56 (SKIN BRIGHTENING BEAUTY BOX): "Let the light in." campaign, Beauty Box style v1.
 *
 * - Main image -> /images/bb_bright_campaign/main.jpg (the six singles in the kit case, top
 *   down), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths. A box with its own
 *   slides shows main + slides only (BeautyBoxProductPage, lib/beautyBoxGallery.ts).
 * - Descriptions move to the selling copy in all three languages: no hard-coded prices and
 *   no price list. RU/AR come from data/product56LocalizedCopy.ts so the record and the code
 *   never drift. The old main (bbbox_brightening/main3.jpeg) stays on disk for past orders.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-56-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-56-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_56_AR_DESCRIPTION, PRODUCT_56_RU_DESCRIPTION } from '../data/product56LocalizedCopy'

const DIR = '/images/bb_bright_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Let the light in. Six GENOSYS singles for dull skin and uneven tone, in the order you use them. SNOW O₂ Cleanser 180 ml goes on a dry face and bubbles up on its own. SNOW BOOSTER 200 ml is a fragrance-free toner that hydrates with betaine and readies skin for the serum. Multi Vita Radiance Serum 30 ml and Multi Vita Radiance Cream 50 g are both registered in Korea as brightening cosmetics, with a full 2% niacinamide in each; in two weeks, surface melanin came down 28% on the serum and almost 30% on the cream. The serum adds stable vitamin C and patented MELAZERO®. EPI Turnover Boosting Peeling Gel 100 g clears dead skin once or twice a week with papaya enzymes and plant cellulose, and a Soothing Bomb Sea Algae Mask 25 g is there for the evening skin wants a rest. Cleanse, tone, serum, cream, morning and night, with sunscreen last in the morning. Made in Korea. Together for less than the six bought separately.'

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
    where: { productNumber: '56' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 56 not found')

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
      descriptionRu: PRODUCT_56_RU_DESCRIPTION,
      descriptionAr: PRODUCT_56_AR_DESCRIPTION,
    },
  })
  console.log('Updated product 56.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
