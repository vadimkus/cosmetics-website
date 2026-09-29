/**
 * Product 59 (DEEP MOISTURIZING BEAUTY BOX): "The refill." campaign, Beauty Box style v1.
 *
 * - Main image -> /images/bb_deep_campaign/main.jpg (the five singles in the kit case, top
 *   down), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths. A box with its own
 *   slides shows main + slides only (BeautyBoxProductPage, lib/beautyBoxGallery.ts).
 * - Descriptions move to the selling copy in all three languages: no hard-coded prices,
 *   no weekly mask frequency, the SNOW O₂ pregnancy warning kept on the page.
 *   RU/AR come from data/product59LocalizedCopy.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-59-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-59-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_59_AR_DESCRIPTION, PRODUCT_59_RU_DESCRIPTION } from '../data/product59LocalizedCopy'

const DIR = '/images/bb_deep_campaign'
const MAIN = `${DIR}/main.jpg`
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'The refill. Desert sun outside, air conditioning inside: skin gives its water away all day, and this box puts it back and keeps it there. SNOW O₂ Cleanser 180 ml goes on a dry face and foams up on its own. SNOW BOOSTER 200 ml is a fragrance-free toner with 3% betaine that gives skin its first drink after cleansing. Moisture Replenishing Hyaluron Serum 30 ml draws water in with 2,000 ppm hydrolyzed hyaluronic acid and PENTAVITIN 0.615%. Moisture Replenishing Hyaluron Cream 50 g holds it with high-weight sodium hyaluronate at 1,000.9 ppm and glycerin 9%: hydration up 82% straight after one use, and still higher 72 hours later. Three Soothing Bomb Sea Algae Masks 25 g for the evenings skin feels tight, 15 to 20 minutes after the toner. Cleanse, tone, serum, cream, morning and night, with sunscreen last in the morning. Made in Korea. Together for less than the five bought separately.'

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
    where: { productNumber: '59' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 59 not found')

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
      descriptionRu: PRODUCT_59_RU_DESCRIPTION,
      descriptionAr: PRODUCT_59_AR_DESCRIPTION,
    },
  })
  console.log('Updated product 59.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
