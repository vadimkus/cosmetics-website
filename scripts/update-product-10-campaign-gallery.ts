/**
 * Product 10 (SNOW O₂ CLEANSER): "It fizzes." campaign.
 *
 * - Main image -> /images/snowo2_campaign/main.jpg (180 ml and 500 ml pumps on white, no type),
 *   gallery -> s1.jpg ... s12.jpg. AR/RU slides swap in at render through
 *   lib/localizedProductImages.ts, so the record holds the EN paths.
 * - Descriptions move to the campaign voice in all three languages. RU/AR come from
 *   data/productLocalizedCopyAudit.ts so the record and the code never drift.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-10-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-10-campaign-gallery.ts --apply
 */
import { prisma } from '../lib/prisma'
import { AUDITED_PRODUCT_LOCALIZED_COPY } from '../data/productLocalizedCopyAudit'

const DIR = '/images/snowo2_campaign'
const MAIN = `${DIR}/main.jpg`
// s2b / s8b (1 Oct 2026): luxury stills replace the Dubai terrace and the sink splash.
const GALLERY = Array.from({ length: 12 }, (_, i) => `${DIR}/s${i + 1}${i === 1 || i === 7 ? 'b' : ''}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace(`${DIR}/`, `${DIR}/${l}/`)))

const DESCRIPTION =
  'It fizzes. 180 ml / 500 ml oxygen-bubble cleanser. Put it on a dry face, away from the eyes, and naturally generated oxygen bubbles rise on their own to lift make-up, dust and impurities. Massage in slow circles, then rinse with tepid water. The bubble maker, methyl perfluoroisobutyl ether, is 8% of the formula and second only to water; glycerin and butylene glycol keep skin soft after the rinse. Follow with SNOW BOOSTER. Morning and evening. Avoid during pregnancy and breastfeeding. Dermatologically tested. Made in Korea.'

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
    where: { OR: [{ productNumber: '10' }, { id: '10' }] },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!product) throw new Error('Product 10 not found')

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
      descriptionRu: AUDITED_PRODUCT_LOCALIZED_COPY.ru['10'].description,
      descriptionAr: AUDITED_PRODUCT_LOCALIZED_COPY.ar['10'].description,
    },
  })
  console.log('Updated product 10.')
}

main()
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
