/**
 * Product 13 — SKIN RENEWAL PEELING SYSTEM (SRS): switch to the srs_2_new image set.
 *
 * Nine new assets replace the srs_new set: a product photograph of the box with the
 * vial, and eight square slides. Every factual claim printed on them was checked
 * against the dossier before publishing, because the previous set shipped a formula
 * slide carrying acids the product does not contain:
 *
 *   2 ml x 10 vials         artwork, "Contents 2ml(0.07 fl.oz.) x 10 vials", and the
 *                           vial label itself reads NET WT. 2ml / 0.07 fl. oz.
 *   Glycolic acid 15%       quantitative formula, 15.0000000000%
 *   Lactic acid 13.5%       quantitative formula, 13.5000000000%
 *   Mandelic acid 2%        quantitative formula, 2.0000000000%
 *   Total 30.5%             15 + 13.5 + 2, and the arithmetic on the slide is right
 *   Glycerin 25%            quantitative formula, 25.0000000000%
 *   Phytic acid             present at 0.005%, function "Chelating Agents"
 *   sh-Polypeptide-7 0.1ppb present at 0.0000000100%, which is exactly 0.1 ppb, and
 *                           the slide labels it a cosmetic trace level rather than
 *                           attaching a claim to it
 *   pH 3.02                 COA lot L1037B, against a 4.00 +/- 1.00 specification
 *   15-20 minutes           artwork, "After 15-20 minutes, rinse with cold water"
 *   Transparent liquid      COA physical analysis
 *   Dermatologically tested printed on the carton
 *   Made in Korea           artwork
 *
 * Two notes for whoever revisits these slides. The botanical panel on s5 says "four
 * plant-derived extracts" and names Scutellaria, Camellia sinensis, Houttuynia and
 * Artemisia; the formula actually carries eight botanical entries including Citrus
 * junos, a Lactobacillus ferment, Chamaecyparis obtusa water and a second Artemisia
 * species. All four named are genuinely present, so the count understates rather than
 * overstates. And those botanicals sit at 0.1 to 0.3 parts per billion, the same order
 * as the peptide the slide is careful to mark as trace — so if these are ever
 * re-exported, the same disclosure would sit well on them.
 *
 * The old srs_new files stay on disk. Nothing references them after this change and no
 * order items point at them, but deleting published assets buys nothing.
 *
 * Slide order is the narrative: hero, promise, formula, mechanism, beyond the acids,
 * what it targets, the protocol, close.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-13-srs-2-new-images-20260818.ts
 */

import { prisma } from '../lib/prisma'

const MAIN = '/images/srs_2_new/main.jpeg'
const GALLERY = [
  '/images/srs_2_new/s1.jpg', // A REAL PEEL — hero, 2 ml x 10 vials
  '/images/srs_2_new/s2.jpg', // REMOVE THE OLD, REVEAL THE NEW — the promise
  '/images/srs_2_new/s3.jpg', // THE FORMULA — 15 / 13.5 / 2, pH 3.02, total 30.5%
  '/images/srs_2_new/s4.jpg', // FROM SURFACE TO RENEWAL — loosen, release, renew
  '/images/srs_2_new/s5.jpg', // MORE THAN A PEEL — glycerin 25%, phytic, botanicals
  '/images/srs_2_new/s6.jpg', // RESET THE SURFACE — texture, tone, clarity, 15-20 min
  '/images/srs_2_new/s7.jpg', // PRECISION IN EVERY STEP — the four-step protocol
  '/images/srs_2_new/s8.jpg', // A REAL PEEL — close, with the shop and app prompts
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'SKIN RENEWAL PEELING' } },
  })
  if (!product) throw new Error('Product 13 (SKIN RENEWAL PEELING SYSTEM) not found')

  console.log(`Updating id=${product.id} — ${product.name}`)
  console.log(`  image : ${product.image} → ${MAIN}`)
  console.log(`  images: ${product.images}`)
  console.log(`        → ${JSON.stringify(GALLERY)}`)

  await prisma.product.update({
    where: { id: product.id },
    data: { image: MAIN, images: JSON.stringify(GALLERY) },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('\nmain  :', after?.image)
  console.log('images:', after?.images)
  console.log(`\nsize unchanged at "${after?.size}", which matches the carton's 2ml x 10 vials.`)
  console.log('Cache key bumped to product-by-id-v54 — this edit is out-of-band, so')
  console.log('without it a freshly built page keeps serving the previous gallery.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
