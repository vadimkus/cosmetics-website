/**
 * Product 34 SKIN RESCUE OVERNIGHT CREAM MASK — selling-tone + Intertek rewrite.
 *
 * Replaces the oxygen-therapy / growth-factor / all-skin-types pitch with
 * copy that matches the signed formula sheet + artwork + DTS MG deck.
 * The Korean functional pair is the product: Niacinamide 2% and
 * Adenosine 0.04%. This is a leave-on overnight cream mask. Last step.
 * Do not wash off. Oxygen and the named growth factors print at 0%.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/overnight/overnightCopy'

const DESCRIPTION =
  '100g. Leave-on overnight cream mask for soothing and revitalizing tired-looking skin. Niacinamide 2% and Adenosine 0.04% are the Korean functional pair. Last step of the evening. Do not wash off. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on overnight cream mask',
  size: '100g / 3.52 oz',
  skinType: 'Tired-looking skin; soothing and revitalizing',
  technology: 'Niacinamide 2% and Adenosine 0.04%',
  keyBenefits: 'Leave-on mask. Last step. Do not wash off',
  usage: 'Once or twice a week. Leave on overnight',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Niacinamide 2%',
    description: 'The Korean brightening functional. This is the figure that belongs on a card.',
  },
  {
    title: 'Adenosine 0.04%',
    description: 'The wrinkle-care functional pair in the same mask.',
  },
  {
    title: 'Leave on overnight',
    description: 'Last step of the evening. Do not wash off. The capsules melt into the cream.',
  },
  {
    title: 'Once or twice a week',
    description: 'Special overnight care when the skin wants the richer night.',
  },
])

const BENEFITS = JSON.stringify([
  'Niacinamide 2% for a brighter look by morning',
  'Adenosine 0.04% is the wrinkle-care functional pair',
  'Leave-on cream mask for soothing and revitalizing tired-looking skin',
  'Last step of the evening. Do not wash off',
  'Once or twice a week when the skin wants the richer night',
  'Dermatologically tested. Made in Korea by DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Niacinamide 2%',
    description:
      'The brightening functional. This is the figure that belongs on a card. The Korean carton names it as an efficacy ingredient.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The wrinkle-care functional pair. Same class of claim as the Korean licence: help the look of lines, not a muscle-relaxant story.',
  },
  {
    name: 'The cream you leave on',
    description:
      'Glycerin 6%, Methyl Trimethicone 6%, Trehalose 2%. Last step. Do not wash off. The capsules burst as you massage, then melt into the pink cream. That is the feel, not an oxygen treatment.',
  },
  {
    name: 'The list that prints at 0%',
    description:
      'Oxygen is 0%. EGF, aFGF, bFGF, PlGF, IGF and sh-Polypeptide-4 each print at 0%. Ceramide NP is 0.000005%. They are on the carton. They are not the engine.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Cleanse',
    instruction: 'Start with a clean face. The mask is the last step, not a rinse-off treatment.',
  },
  {
    step: 'Apply',
    instruction: 'A sufficient amount on the face. Keep it away from the eyes.',
  },
  {
    step: 'Smooth in',
    instruction: 'Massage until the capsules melt into the cream. That is the dual texture, not a therapy.',
  },
  {
    step: 'Leave on',
    instruction: 'Do not wash off. Sleep. In the morning, cleanse as usual.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Do not use near eyes. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or irritation appears. Last step of the evening. Do not wash off. Keep out of children\'s reach. Store cool and dry.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '34' },
        { productNumber: '34' },
        { name: { contains: 'SKIN RESCUE OVERNIGHT' } },
      ],
    },
  })
  if (!product) throw new Error('product 34 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '34',
      description: DESCRIPTION,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
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
