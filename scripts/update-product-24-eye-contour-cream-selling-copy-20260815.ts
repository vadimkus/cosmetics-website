/**
 * Product 24 EyeCell EYE CONTOUR CREAM — selling-tone + Intertek rewrite.
 *
 * Replaces the peptide-complex / Haloxyl-as-treatment / callus-regeneration
 * pitch with copy that matches Formula_up + artwork + SA. The Korean
 * functional pair is the product: Arbutin 2% and Adenosine 0.04%.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/eyecream/eyecreamCopy'

const DESCRIPTION =
  '20g. Daily all-in-one eye cream for wrinkles, dark circles and puffiness. Arbutin 2% and Adenosine 0.04% are the Korean functional pair. Morning and evening, tap and leave on. Dermatologically tested. Avoid during pregnancy and lactation. Contains peanut oil.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Daily leave-on eye cream',
  size: '20g',
  skinType: 'Eye contour; wrinkles, dark circles, puffiness',
  technology: 'Arbutin 2% and Adenosine 0.04%',
  keyBenefits: 'Firmer, brighter, more defined look',
  usage: 'Morning and evening',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Arbutin 2% for a brighter under-eye look',
  'Adenosine 0.04% is the wrinkle-care functional pair',
  'Daily cream for wrinkles, dark circles and puffiness',
  'Firmer, brighter, more defined',
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
    name: 'Squalane and jojoba',
    description:
      'Squalane 2.5% and jojoba seed oil 2% sit at real levels. Hydrolyzed collagen is 0.05%. They make the cream feel like a cream.',
  },
  {
    name: 'Peptides and Haloxyl',
    description:
      'Acetyl Hexapeptide-8 is 0.0025% finished. Copper Tripeptide-1 is 0.001%. Palmitoyl Hexapeptide-12 is 0.0003%. Haloxyl is the manufacturer\'s name for the dark-circle support stack, a 0.05% premix. They are in the formula. They are not the engine.',
  },
  {
    name: 'Peanut oil and retinyl palmitate',
    description:
      'Arachis Hypogaea (Peanut) Oil is in the registered formula. Retinyl palmitate at 0.08325% explains the pregnancy line. Avoid during pregnancy and lactation.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Cleanse',
    instruction: 'Clean the eye contour. The cream goes on settled skin.',
  },
  {
    step: 'Serum',
    instruction: 'Eye Contour Serum first when you use the pair. The cream is the seal.',
  },
  {
    step: 'Cream',
    instruction: 'A small amount. Tap and massage from the inner corner out until it settles.',
  },
  {
    step: 'Leave on',
    instruction: 'Morning and evening. Do not rinse. Do not rub the contour.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid use during pregnancy and lactation. Contains peanut oil. Keep out of the eye. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or itching appears. Morning and evening on a clean contour, after the serum.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '24' },
        { productNumber: '24' },
        { name: { contains: 'EYE CONTOUR CREAM' } },
      ],
    },
  })
  if (!product) throw new Error('product 24 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '24',
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
