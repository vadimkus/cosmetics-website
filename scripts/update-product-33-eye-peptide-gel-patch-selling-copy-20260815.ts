/**
 * Product 33 EyeCell EYE PEPTIDE GEL PATCH — selling-tone + Intertek rewrite.
 *
 * Replaces the peptide-hero / Made White / Multi 12 / patented-transdermal
 * pitch with copy that matches Formula_up + artwork + SA. The Korean
 * functional pair is the product: Niacinamide 2% and Adenosine 0.04%.
 * This is a take-off hydrogel mask. 20 to 40 minutes, then remove.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/eyepatch/eyepatchCopy'

const DESCRIPTION =
  '101g (60 patches / 30 applications). Take-off hydrogel eye mask for calming and moisturizing the contour. Niacinamide 2% and Adenosine 0.04% are the Korean functional pair. Under the eyes and/or eyebrow bones for 20 to 40 minutes, then remove. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Take-off hydrogel eye mask',
  size: '101g / 60 patches / 30 applications',
  skinType: 'Eye contour; calming and moisturizing',
  technology: 'Niacinamide 2% and Adenosine 0.04%',
  keyBenefits: 'Take-off mask. Serum and cream stay on after',
  usage: '20 to 40 minutes, then remove',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Niacinamide 2% for a brighter under-eye look',
  'Adenosine 0.04% is the wrinkle-care functional pair',
  'Take-off hydrogel mask for calming and moisturizing the contour',
  'Under the eyes and/or eyebrow bones',
  '20 to 40 minutes, then remove',
  'Dermatologically tested. Made in Korea by DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Niacinamide 2%',
    description:
      'The brightening functional. This is the figure that belongs on a card. The latest batch came back inside the 2% specification.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The wrinkle-care functional pair. Same class of claim as the Korean licence: help the look of lines, not a muscle-relaxant story.',
  },
  {
    name: 'The hydrogel',
    description:
      'Chondrus crispus extract 1.54%, glycerin near 10%, carob gum and cellulose gum. Body heat makes the gel more fluid. Moisture displaces heat, so the contour feels cooler.',
  },
  {
    name: 'The peptide at 46.5 ppb',
    description:
      'Acetyl Hexapeptide-8 is 46.5 ppb finished. Made White is the manufacturer\'s name for a 0.009% premix. Finished madecassoside is 0.000093%. They are in the formula. They are not the engine.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Cleanse',
    instruction: 'Clean the eye contour. The patches go on settled skin.',
  },
  {
    step: 'Place',
    instruction: 'Use the spoon. Two patches under the eyes. A second pair on the brow bones if you want that placement. Seal the lid.',
  },
  {
    step: 'Sit',
    instruction: 'Twenty to forty minutes. Not fifteen. Not a minute.',
  },
  {
    step: 'Remove',
    instruction: 'Take the patches off. Pat any residue in. Then the serum, then the cream.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. If you react to bandages or compresses, do not use. Keep out of the eye. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or itching appears. Under the eyes and/or eyebrow bones for 20 to 40 minutes, then remove.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '33' },
        { productNumber: '33' },
        { name: { contains: 'EYE PEPTIDE GEL PATCH' } },
      ],
    },
  })
  if (!product) throw new Error('product 33 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '33',
      description: DESCRIPTION,
      productDetails: PRODUCT_DETAILS,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
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
