/**
 * Product 58 (ANTI-AGING BEAUTY BOX): "Time, well kept" campaign, Beauty Box style v1.
 *
 * - Main image -> /images/bb_age_campaign/main.jpg (the five singles in the kit case, top
 *   down), gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths. A box with its own
 *   slides shows main + slides only (BeautyBoxProductPage, lib/beautyBoxGallery.ts).
 * - Descriptions move to the selling copy in all three languages: no hard-coded prices,
 *   no "clinically proven", firmness or elasticity claims, no "the pack does not say" lines.
 *   RU/AR come from data/product58LocalizedCopy.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-58-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-58-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { PRODUCT_58_AR_DESCRIPTION, PRODUCT_58_RU_DESCRIPTION } from '../data/product58LocalizedCopy'

const DIR = '/images/bb_age_campaign'
const MAIN = `${DIR}/main.jpg`
// slide 4 ships as s4b: the toner re-shot without its clear overcap (/images/* is cached immutable)
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}${i === 3 ? 'b' : ''}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'Time, well kept. Five GENOSYS singles for fine lines and uneven tone, in the order you use them. SNOW O₂ Cleanser 180 ml goes on a dry face and bubbles up on its own. SNOW BOOSTER 200 ml is a fragrance-free toner that hydrates with betaine and pumpkin ferment and brings skin back into balance. Multi Functional Anti-Wrinkle Serum 30 ml and Anti-Wrinkle Cream 50 g are licensed in Korea for two jobs at once, wrinkle improvement and brightening: a full 2% niacinamide and 0.04% adenosine in both, tested on every batch, with bakuchiol 0.1%, the retinol alternative you can wear by day. Five Intensive Repair Collagen Masks 23 g for two or three evenings a week. Cleanse, tone, serum, cream, morning and night, with sunscreen last in the morning. Made in Korea. Together for less than the five bought separately.'

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
    where: { productNumber: '58' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 58 not found')

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
      descriptionRu: PRODUCT_58_RU_DESCRIPTION,
      descriptionAr: PRODUCT_58_AR_DESCRIPTION,
    },
  })
  console.log('Updated product 58.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
