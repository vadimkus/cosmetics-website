/**
 * Product 50 (EyeCell EYE ZONE CARE KIT): the "Rested eyes." campaign.
 *
 * - Main image -> /images/eyekit_campaign/main.jpg, gallery -> s1.jpg ... s12.jpg. AR/RU
 *   slides swap in at render through lib/localizedProductImages.ts, so the record holds the
 *   EN paths. The member packshots stay in the page's contents list, not in the gallery.
 * - EN text fields move to the selling copy; descriptionRu / descriptionAr follow
 *   data/product50LocalizedCopy.ts.
 *
 * Run after the deploy carrying the files is live; it refuses to write otherwise.
 *   npx tsx --env-file=.env.local scripts/update-product-50-campaign-gallery.ts          (dry run)
 *   npx tsx --env-file=.env.local scripts/update-product-50-campaign-gallery.ts --apply
 */
import { PrismaClient } from '@prisma/client'

import { FULL_INCI as EYE_CREAM_FULL_INCI } from '../components/product/eyecream/eyecreamCopy'
import { FULL_INCI as EYE_PATCH_FULL_INCI } from '../components/product/eyepatch/eyepatchCopy'
import { FULL_INCI as EYE_SERUM_FULL_INCI } from '../components/product/eyeserum/eyeserumCopy'
import { PRODUCT_50_AR_TRANSLATION, PRODUCT_50_RU_TRANSLATION } from '../data/product50LocalizedCopy'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : { datasourceUrl: databaseUrl, log: ['error'] } as never,
)

const MAIN = '/images/eyekit_campaign/main.jpg'
const GALLERY = Array.from({ length: 12 }, (_, i) => `/images/eyekit_campaign/s${i + 1}.jpg`)
const LOCALIZED = ['ru', 'ar'].flatMap(l => GALLERY.map(p => p.replace('/eyekit_campaign/', `/eyekit_campaign/${l}/`)))

const COPY = {
  description:
    'Rested eyes in four steps. Eye Contour Serum 10 ml, the GENOSYS Eye Roller 0.25 mm, Eye Peptide Gel Patch 101 g / 60 pcs and Eye Contour Cream 20 g in one box: cleanse, serum and a gentle roll, cooling patches for 20-40 minutes, then cream. Arbutin 2% and adenosine 0.04% in the serum and the cream, niacinamide 2% and adenosine 0.04% in the patches, for dark circles, eye bags and crow\'s feet. The 0.25 mm eye roller, 60 fine needles made for the eye zone, comes only in this kit. Dermatologically tested. Made in Korea.',
  descriptionRu: PRODUCT_50_RU_TRANSLATION.description,
  descriptionAr: PRODUCT_50_AR_TRANSLATION.description,
  productDetails: JSON.stringify({
    form: 'Four-piece eye-zone care kit',
    contents: 'Eye Contour Serum 10 ml · GENOSYS Eye Roller 0.25 mm · Eye Peptide Gel Patch 101 g / 60 pcs · Eye Contour Cream 20 g',
    careFocus: 'Dark circles, eye bags, crow\'s feet, hydration and soothing care',
    functionalActives: 'Serum and cream: arbutin 2% + adenosine 0.04% · patches: niacinamide 2% + adenosine 0.04%',
    roller: 'One-body eye roller · 60 needles · 0.25 mm · stainless-steel needles',
    rollerCare: 'Reusable: soak 5 minutes in chlorhexidine solution before each reuse; for personal use only',
    protocol: 'Cleanse · serum and roller · patches 20-40 minutes · cream',
    frequency: 'Roller frequency is set individually',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Rested eyes in four steps', description: 'Serum, eye roller, 60 gel patches and cream in one routine for dark circles, eye bags and crow\'s feet.' },
    { title: 'Arbutin 2% + adenosine 0.04%', description: 'In the serum and the cream: brighter-looking under-eyes and smoother-looking lines.' },
    { title: 'Niacinamide 2% + adenosine 0.04%', description: 'Cooling hydrogel patches that stay on 20-40 minutes while you rest.' },
    { title: '0.25 mm eye roller, kit only', description: 'One body, 60 fine needles, made for the eye zone and reusable after disinfection.' },
  ]),
  benefits: JSON.stringify([
    'Four steps for the eye zone in one box',
    'Helps dark circles and uneven tone look less visible',
    'Cares for the look of fine lines and crow\'s feet',
    'Cools, hydrates and soothes during the 20-40 minute patch step',
    'Includes the 0.25 mm GENOSYS eye roller, only in this kit',
    'Finishes with a softening cream with squalane and jojoba oil',
  ]),
  ingredients: JSON.stringify([
    { name: 'Eye Contour Serum · 10 ml', description: 'Arbutin 2% and adenosine 0.04% for a brighter, smoother-looking contour. Leave-on, applied before the roller.' },
    { name: 'Eye Peptide Gel Patch · 101 g / 60 pcs', description: 'Niacinamide 2% and adenosine 0.04% in a cooling hydrogel. Lift off after 20-40 minutes.' },
    { name: 'Eye Contour Cream · 20 g', description: 'Arbutin 2% and adenosine 0.04% with squalane 2.5% and jojoba oil 2%. Contains peanut oil.' },
    { name: 'Serum full INCI', description: EYE_SERUM_FULL_INCI },
    { name: 'Patch full INCI', description: EYE_PATCH_FULL_INCI },
    { name: 'Cream full INCI', description: EYE_CREAM_FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Cleanse', instruction: 'Remove make-up, cleanse the eye contour gently and pat dry.' },
    { step: 'Apply the serum', instruction: 'Smooth Eye Contour Serum under the eyes and along the brow bones, away from the eyelid and the eye itself.' },
    { step: 'Roll', instruction: 'Roll the 0.25 mm eye roller over the serum for a few minutes, horizontally and vertically, with light pressure. Stop if it feels uncomfortable.' },
    { step: 'Patches, 20-40 minutes', instruction: 'Place the patches under the eyes and/or on the brow bones, lift off after 20-40 minutes and pat the leftover essence in.' },
    { step: 'Finish with cream', instruction: 'Pat a small amount of Eye Contour Cream in with the fingertips.' },
    { step: 'Care for the roller', instruction: 'Before each reuse, soak the roller in chlorhexidine solution for 5 minutes. Never share it.' },
  ]),
  directions:
    "For external use only. Avoid the kit during pregnancy and breastfeeding. The cream contains peanut oil: do not use the kit with a peanut allergy. Do not use the roller with a keloid tendency, a stainless-steel allergy or dermatitis, or on broken, infected or irritated skin. Keep the formulas and the roller away from the eyes and mucous membranes; if contact occurs, rinse thoroughly with cool water. Stop use and see a doctor if redness, swelling, itching or lasting irritation appears. Store in a cool, dry place away from direct sun and out of children's reach. Roller frequency is set individually.",
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { productNumber: '50' },
    select: { id: true, name: true, image: true, images: true },
  })
  if (!p) throw new Error('Product 50 not found')
  console.log('BEFORE:', JSON.stringify(p, null, 2))

  if (!process.argv.includes('--apply')) {
    console.log('DRY RUN - pass --apply to write')
    console.log('Would set image:', MAIN, 'and', GALLERY.length, 'slides')
    console.log('Would set fields:', Object.keys(COPY).join(', '))
    return
  }

  for (const path of [MAIN, ...GALLERY, ...LOCALIZED]) {
    const live = await fetch('https://genosys.ae' + path, { method: 'HEAD' })
    if (!live.ok) throw new Error(`${path} is not live yet (HTTP ${live.status})`)
  }

  await prisma.product.update({ where: { id: p.id }, data: { image: MAIN, images: JSON.stringify(GALLERY), ...COPY } })
  const after = await prisma.product.findFirst({
    where: { productNumber: '50' },
    select: { image: true, images: true, description: true },
  })
  console.log('AFTER:', JSON.stringify(after, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
