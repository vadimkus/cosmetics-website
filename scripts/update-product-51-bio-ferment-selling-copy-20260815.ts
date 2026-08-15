/**
 * Product 51 BIO-FERMENT AGE DEFYING POWDER MASK — selling-tone + Intertek rewrite.
 *
 * Sets productNumber to '51' (legacy row stored it only on id) and replaces
 * the invented EN fields (fermented rice / soy / ginseng / green tea / HA,
 * "preferred liquid") with copy that matches the Formula PDF + DTS MG deck.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/bioferment/bioFermentCopy'

const DESCRIPTION =
  '300g. Professional modeling mask. Mix 40g of powder with water at 1 : 1.5, leave 15–20 minutes, peel. Diatomaceous earth base that holds moisture instead of drying out. Hydration rose 218% in the DTS MG clinical trial. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Powder modeling mask (mixes with water)',
  size: '300g',
  skinType: 'All skin types, especially dry, dull or heat-stressed skin',
  technology: 'Diatomaceous earth + algin + calcium sulfate set',
  keyBenefits: 'Hydration, cooling, peel-off modeling mask',
  usage: 'Once or twice a week',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Hydrate — 218% lift in the DTS MG clinical trial',
  'Cool — about 10 to 11°C down on heated skin in the published cases',
  'Peel — algin and calcium sulfate set, then lift off in one piece',
  'Does not dry out — diatomaceous earth holds moisture for the full wear',
  'Mix fresh — powder 1 to water 1.5, 40g per treatment',
  '300g jar — about seven treatments, scoop in the pack',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Diatomaceous Earth 41.79%',
    description:
      'The moisture-locking base. Fine mineral powder that holds water against the skin for the full wear, which is why this mask does not dry out.',
  },
  {
    name: 'Algin 15% + Calcium Sulfate 6%',
    description:
      'The set. Algin thickens with water; calcium sulfate turns that cream into a peelable sheet in five to ten minutes.',
  },
  {
    name: 'Glucose 35%',
    description:
      'The humectant in the powder. Pulls water into the mix so the cream stays workable, then sits on the skin as moisture.',
  },
  {
    name: 'Hydrolyzed Collagen 0.2%',
    description:
      'A skin-conditioning protein in the set. Leaves the surface smoother to the touch after you peel.',
  },
  {
    name: 'Allantoin 0.1%',
    description:
      'The classic comfort agent. Softens while the mask sits, so the wear stays easy for fifteen to twenty minutes.',
  },
  {
    name: 'Four ferments',
    description:
      'Pomegranate lactobacillus, soybean bacillus, galactomyces filtrate and bifida lysate. They sit in the formula with the earth-and-algin set.',
  },
  {
    name: 'Menthol + Cypress Water',
    description:
      'The cool feel while the mask is on. Cypress water is a fragrance ingredient, which is why this is not a fragrance-free mask.',
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
      'Three scoops of powder (40g) with four and a half scoops of water, using the cup in the pack (powder 1 : water 1.5). Stir to a smooth cream.',
  },
  {
    step: 'Apply',
    instruction: 'Spread evenly on clean skin, keeping it off the eyes and the eyebrows.',
  },
  {
    step: 'Wait',
    instruction: 'Leave 15–20 minutes. The mask sets in 5–10 minutes; the extra time is the treatment.',
  },
  {
    step: 'Peel',
    instruction: 'Lift off in one piece. Wipe any residue with toner, then continue with serum and cream.',
  },
  {
    step: 'Store',
    instruction: 'Close the jar tightly. Powder left open takes on air and light and will not set the same way next time.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid the eyes and eyebrows. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or irritation appears. Keep cool, dry, and tightly sealed. Use within six months of opening. Mix with water only.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: '51' }, { productNumber: '51' }, { name: { contains: 'BIO-FERMENT' } }],
    },
  })
  if (!product) throw new Error('product 51 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '51',
      description: DESCRIPTION,
      productDetails: PRODUCT_DETAILS,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
    },
  })

  console.log('updated', product.id, product.name)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
