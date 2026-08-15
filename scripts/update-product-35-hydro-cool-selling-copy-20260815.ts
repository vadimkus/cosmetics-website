/**
 * Product 35 HYDRO COOL MODELING MASK — selling-tone + Intertek rewrite.
 *
 * Replaces the HA / ceramide / collagen / pore / rub-then-rinse pitch with
 * copy that matches Formula_up + artwork. This is the clinic-kilo cooling
 * alginate. Diatomaceous earth 65% is the pouch. Mix 30g at 1 : 0.8.
 * Peel after 15-20 minutes. Wipe residue with toner.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/hydrocool/hydroCoolCopy'

const DESCRIPTION =
  '1kg. Professional cooling modeling mask. Mix 30g of powder with water at 1 : 0.8, leave 15-20 minutes, peel. Diatomaceous earth 65% is the pouch. Peppermint cool until it comes off. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Powder modeling mask (mixes with water)',
  size: '1kg / 35.2 oz',
  skinType: 'After a professional treatment; hydrating, soothing',
  technology: 'Diatomaceous earth 65% + algin set + peppermint',
  keyBenefits: 'Cools until you peel. Mix 30g at 1 : 0.8',
  usage: 'After a treatment. 15-20 minutes, then peel',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Diatomaceous earth 65%',
    description: 'Most of the pouch. That is the product.',
  },
  {
    title: 'Mix 30g at 1 : 0.8',
    description: 'Powder to water. Stir one to two minutes, then apply.',
  },
  {
    title: '15-20 minutes, then peel',
    description: 'Sets in 5-10 minutes. Wipe residue with toner.',
  },
  {
    title: 'Peppermint cool',
    description: 'Stays until the mask comes off. Not a fragrance-free mask.',
  },
])

const BENEFITS = JSON.stringify([
  'Diatomaceous earth 65% is the pouch',
  'Mix 30g with water at 1 : 0.8',
  '15-20 minutes, then peel in one piece',
  'Peppermint cool until the mask comes off',
  'After a professional treatment',
  'Dermatologically tested. Made in Korea by DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Diatomaceous Earth 65.165%',
    description:
      'Most of the pouch. Fine mineral powder that takes water, sits on the face, and comes off as a sheet.',
  },
  {
    name: 'Algin 9% + Calcium Sulfate 6%',
    description:
      'The set, with magnesium oxide 2%. Mix with water and it turns from cream to a peelable mask in five to ten minutes.',
  },
  {
    name: 'Glucose 12%',
    description:
      'The humectant in the powder. Enough to keep the mix workable. This is not the mask that holds water after you peel.',
  },
  {
    name: 'Peppermint 0.1% + Menthol 0.01%',
    description:
      'The cool you feel while it sits. Peppermint oil and a listed fragrance ride with them.',
  },
  {
    name: 'The 0.01% list',
    description:
      'Centella, Ceramide NP, Allantoin and Sodium Hyaluronate each sit at 0.01%. In the formula. Not the engine.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Mix',
    instruction:
      '30g of powder with water at 1 : 0.8 (powder to water). Stir one to two minutes to a smooth cream.',
  },
  {
    step: 'Apply',
    instruction: 'Spread evenly on clean skin, keeping it off the eyes and the eyebrows.',
  },
  {
    step: 'Wait',
    instruction: 'Leave 15-20 minutes. The mask coagulates in 5-10 minutes.',
  },
  {
    step: 'Peel',
    instruction: 'Lift off in one piece. Wipe any residue with toner.',
  },
  {
    step: 'Store',
    instruction: 'Close the pouch tightly. Powder left open takes on air.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid the eyes and eyebrows. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or irritation appears. Do not use on wounded skin. Water only. Do not mix with another brand.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '35' },
        { productNumber: '35' },
        { name: { contains: 'HYDRO COOL' } },
      ],
    },
  })
  if (!product) throw new Error('product 35 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '35',
      description: DESCRIPTION,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      images: JSON.stringify(['/images/Second/hmask_big.jpg']),
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
