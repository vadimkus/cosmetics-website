/**
 * Product 37 PEPTIDE GEL MASK — selling-tone + Intertek rewrite.
 *
 * Replaces the patented / transdermal / peptide-hero / HA / collagen /
 * 15-20 minute pitch with copy that matches Formula_up + artwork.
 * This is a face hydrogel sheet. Glycerin 20% is the pouch. Sit 20-40
 * minutes, take the sheet off, massage the leftover in. The peptide
 * sits at 0.05 ppm.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * the ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/peptidegel/peptideGelCopy'

const DESCRIPTION =
  '38g × 5. Face hydrogel sheet. After a dermatological procedure, sit 20-40 minutes, take the sheet off, massage the leftover in. Glycerin 20% is the pouch. The peptide sits at 0.05 ppm. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Hydrogel face sheet (mesh included)',
  size: '38g / 1.34 oz × 5 sheets',
  skinType: 'After a dermatological procedure; moisturizing, soothing',
  technology: 'Glycerin 20% + carob / Chondrus gel',
  keyBenefits: '20-40 minutes, then remove. Massage the leftover in',
  usage: 'After a procedure. 20-40 minutes, then remove',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Glycerin 20%',
    description: 'The humectant. This is the figure that belongs on a card.',
  },
  {
    title: '20-40 minutes, then remove',
    description: 'Take the sheet off and massage the remaining essence in.',
  },
  {
    title: 'After a dermatological procedure',
    description: 'Moisturizing, soothing. Not a lift and not a Botox story.',
  },
  {
    title: 'The peptide sits at 0.05 ppm',
    description: 'Acetyl Hexapeptide-8 is in the formula. It is not the engine.',
  },
])

const BENEFITS = JSON.stringify([
  'Glycerin 20% is the pouch',
  '20 to 40 minutes, then take the sheet off',
  'Massage the remaining essence until absorbed',
  'After a dermatological procedure. Moisturizing, soothing',
  '38g including mesh × 5 sheets',
  'Dermatologically tested. Made in Korea by DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Glycerin 19.921%',
    description:
      'The humectant. Almost a fifth of the pouch. This is the figure that belongs on a card.',
  },
  {
    name: 'Carob gum 2.2% + Chondrus 0.8%',
    description:
      'The gel. Body heat makes it sit closer. Moisture displaces heat, so the face feels cooler.',
  },
  {
    name: 'Dipotassium Glycyrrhizate 0.10%',
    description:
      'The licorice salt at a dose that still deserves a line. Soothing support. Not a repair claim.',
  },
  {
    name: 'Acetyl Hexapeptide-8 0.05 ppm',
    description:
      '0.0000054% finished. The name says peptide. That is not the engine.',
  },
  {
    name: 'The trace list',
    description:
      'Sodium Hyaluronate 0.0005%. Hydrolyzed collagen 0.002%. In the formula. Not the engine.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Cleanse + toner',
    instruction: 'After cleansing, prepare the skin with toner.',
  },
  {
    step: 'Open',
    instruction: 'Remove the transparent film from both sides of the sheet. Use it at once.',
  },
  {
    step: 'Apply',
    instruction: 'Press it close to the face. Keep it off the eyes.',
  },
  {
    step: 'Sit',
    instruction: '20 to 40 minutes. Not fifteen. Not twenty only.',
  },
  {
    step: 'Remove',
    instruction: 'Take the sheet off and massage the leftover in until absorbed.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid the eyes and mucous membranes. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or irritation appears. If you react to bandages or compresses, use with caution. Use each sheet as soon as you open the pouch.'

const GALLERY = JSON.stringify([
  '/images/peptide_mask/s1c.jpeg',
  '/images/peptide_mask/s2c.jpeg',
  '/images/peptide_mask/s3c.jpeg',
  '/images/peptide_mask/s4c.jpeg',
  '/images/peptide_mask/s5c.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '37' },
        { productNumber: '37' },
        { name: { contains: 'PEPTIDE GEL MASK' } },
      ],
    },
  })
  if (!product) throw new Error('product 37 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '37',
      description: DESCRIPTION,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      images: GALLERY,
      videoUrl: '/videos/peptide.mp4',
    },
  })

  console.log('updated', product.id, product.productNumber, product.name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
