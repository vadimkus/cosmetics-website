/**
 * Product 38 EZ CO₂ MASK KIT — selling-tone + Intertek rewrite.
 *
 * Replaces the 15-20 minute / peptide-mask / lactic-as-gel / clinic-at-home
 * pitch with copy that matches the Quali-quanti sheets + artwork + SA.
 * The reaction is the product: acidic gel + sodium bicarbonate 9% in the
 * sheet, ten minutes, rinse.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/ezco2/ezco2Copy'

const DESCRIPTION =
  'Gel 20g ×5, mask 12g ×5, spatula ×1. An acidic gel and a bicarbonate sheet meet on dry skin. CO₂ forms, you wait ten minutes, you rinse. Five treatments. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Two-part carboxy kit, gel + sheet',
  size: 'Gel 20g ×5, mask 12g ×5, spatula ×1',
  skinType: 'Dull or tired-looking skin; weekly carboxy step',
  technology: 'Acidic gel + sodium bicarbonate 9% sheet',
  keyBenefits: 'Ten-minute carboxy look, firming and brightening',
  usage: 'Once a week, or twice intensive',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Meet — gel first, then the sheet, coated side up',
  'Activate — sodium bicarbonate 9% in the mask is the reaction partner',
  'Rinse — ten minutes, then cleanse gently',
  'Five treatments — gel 20g ×5, mask 12g ×5, spatula ×1',
  'Once a week, or twice on the intensive programme',
  'Dermatologically tested — made in Korea by DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Sodium bicarbonate 9%',
    description:
      'The reaction partner in the sheet. Without it there is no CO₂. This is the figure that belongs on a card.',
  },
  {
    name: 'The gel that starts it',
    description:
      'Carbomer 3.94% makes the cushion. The gel sits at pH 2.2, inside a 2.0 to 3.0 specification. The sheet sits alkaline. That gap is the chemistry.',
  },
  {
    name: 'Lactic acid 0.33%',
    description:
      'In the mask, not the gel. A skin-conditioning acid at a level that belongs on a card. It is not why the bubbles form.',
  },
  {
    name: 'Botanical calm',
    description:
      'Chamomile at 0.3% in the gel, portulaca in both, licorice in both. They sit in the formulas. They are not the engine.',
  },
  {
    name: 'Grapefruit extract',
    description:
      'Citrus Paradisi fruit extract is in both the gel and the sheet. There is no Parfum. This is still not a fragrance-free kit.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Dry',
    instruction:
      'Cleanse, then dry the face thoroughly. The gel is for dry skin, not a wet face.',
  },
  {
    step: 'Gel',
    instruction: 'One 20g tube, spread evenly with the spatula.',
  },
  {
    step: 'Sheet',
    instruction: 'Open the pouch and lay the mask close to the face, coated side upward.',
  },
  {
    step: 'Wait',
    instruction: 'Ten minutes. Sparkling for 20 to 30 seconds at the start is normal.',
  },
  {
    step: 'Rinse',
    instruction:
      'Remove the sheet and cleanse gently. Then mist and cream. Keep strong sun off the skin afterwards.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid the eyes, scars and broken skin. If contact occurs, rinse with cool water. Stop and speak to a doctor if swelling appears. Use each opened tube and pouch at once. Do not refrigerate. Keep cool and dry. Once a week, or twice intensive, on clean dry skin. Ten minutes, then rinse.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: '38' }, { productNumber: '38' }, { name: { contains: 'EZ CO' } }],
    },
  })
  if (!product) throw new Error('product 38 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '38',
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
