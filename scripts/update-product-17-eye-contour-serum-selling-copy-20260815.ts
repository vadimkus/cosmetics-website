/**
 * Product 17 EyeCell EYE CONTOUR SERUM — selling-tone + Intertek rewrite.
 *
 * Replaces the peptide-complex / Haloxyl-as-treatment / callus-regeneration
 * pitch with copy that matches Formula_up + artwork + SA. The Korean
 * functional pair is the product: Arbutin 2% and Adenosine 0.04%. This
 * is the first-layer serum. The cream seals.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/eyeserum/eyeserumCopy'

const DESCRIPTION =
  '10ml. Intensive all-in-one eye serum for deep wrinkles, dark circles and eye puffs. Arbutin 2% and Adenosine 0.04% are the Korean functional pair. Morning and evening, pat and leave on. Dermatologically tested. Avoid during pregnancy and lactation.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Intensive leave-on eye serum',
  size: '10ml',
  skinType: 'Eye contour; deep wrinkles, dark circles, eye puffs',
  technology: 'Arbutin 2% and Adenosine 0.04%',
  keyBenefits: 'First-layer serum. Cream seals after',
  usage: 'Morning and evening',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Arbutin 2% for a brighter under-eye look',
  'Adenosine 0.04% is the wrinkle-care functional pair',
  'Intensive serum for deep wrinkles, dark circles and eye puffs',
  'First layer. Cream seals after',
  'Morning and evening, leave on',
  'Dermatologically tested. Made in Korea by DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Arbutin 2%',
    description:
      'The brightening functional. This is the figure that belongs on a card. The latest batch came back inside the 2% specification.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The wrinkle-care functional pair. Same class of claim as the Korean licence: help the look of lines, not a muscle-relaxant story.',
  },
  {
    name: 'Sodium hyaluronate, panthenol, allantoin',
    description:
      'Sodium hyaluronate 0.20%, panthenol 0.15% and allantoin 0.15% sit at real levels. They make the serum feel like a serum.',
  },
  {
    name: 'Peptides and Haloxyl',
    description:
      'Acetyl Hexapeptide-8 is 0.0025% finished. Copper Tripeptide-1 is 0.001%. Palmitoyl Hexapeptide-12 is 0.0003%. Haloxyl is the manufacturer\'s name for the dark-circle support stack, a 0.10% premix. They are in the formula. They are not the engine.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Cleanse',
    instruction: 'Clean the eye contour. The serum goes on settled skin.',
  },
  {
    step: 'Serum',
    instruction: 'A small amount. Gently pat from the inner corner out until it settles.',
  },
  {
    step: 'Cream',
    instruction: 'Eye Contour Cream after when you use the pair. The serum is the first layer.',
  },
  {
    step: 'Leave on',
    instruction: 'Morning and evening. Do not rinse. Do not rub the contour.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid use during pregnancy and lactation. Keep out of the eye. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or itching appears. Morning and evening on a clean contour, then the cream.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '17' },
        { productNumber: '17' },
        { name: { contains: 'EYE CONTOUR SERUM' } },
      ],
    },
  })
  if (!product) throw new Error('product 17 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '17',
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
