/**
 * Product 12 EPI TURNOVER BOOSTING PEELING GEL — selling-tone + Intertek rewrite.
 *
 * Replaces the miracle-tree / desert-complex / no-irritation pitch with copy
 * that matches the Quali-quanti formula + artwork + DTS MG deck. Cellulose 3%
 * is the peel. Papaya is 0.000150%. Moringa is 0.000020%.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for the
 * ingredient cards and the English description used in metadata.
 */
import { prisma } from '../lib/prisma'
import { FULL_INCI } from '../components/product/epi/epiCopy'

const DESCRIPTION =
  '100g. Enzyme + cellulose peeling gel. On clean, dry skin, massage for up to one minute; the dead cells clump and rinse away with tepid water. Cellulose 3% is the roll you feel. Once or twice a week. Dermatologically tested.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Rinse-off peeling gel',
  size: '100g',
  skinType: 'Dull or rough texture; weekly polish',
  technology: 'Enzyme + cellulose gommage',
  keyBenefits: 'Rolling peel, smoother surface, weekly polish',
  usage: 'Once or twice a week',
  origin: 'South Korea',
})

const BENEFITS = JSON.stringify([
  'Roll — cellulose 3% binds dead cells into clumps you can feel',
  'Rinse — up to one minute on dry skin, then tepid water',
  'Smooth — a weekly polish for dull, rough texture',
  'Enzyme + cellulose — both in the formula',
  'Face and body — knees, elbows and heels as well',
  '100g tube — once or twice a week',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Cellulose 3%',
    description:
      'Plant cellulose that binds dead cells so they clump and rinse away. This is the peel you feel.',
  },
  {
    name: 'Allantoin 0.1%',
    description:
      'The comfort agent at a level that belongs on a card. Softens while you massage, so the roll does not feel stripped.',
  },
  {
    name: 'Enzyme + cellulose',
    description:
      'Papaya fruit extract is the enzyme half. Cellulose is the half you feel. Both are in the formula. One of them is 3%.',
  },
  {
    name: 'Desert Complex 0.01%',
    description:
      'Five desert plants in a named complex: fig, date, two opuntias and baobab. They sit in the gel. They are not why the clumps form.',
  },
  {
    name: 'Fragrance',
    description:
      'Fragrance and Hexyl Cinnamal are in the gel. This is not a fragrance-free peel.',
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
      'Cleanse first, then pat the skin dry. The gel is for clean, dry skin, not a wet face.',
  },
  {
    step: 'Apply',
    instruction: 'A thin layer over the face. Keep it off the eyes and the mouth.',
  },
  {
    step: 'Massage',
    instruction:
      'Circular motions for up to one minute. You will feel the dead cells gather into clumps.',
  },
  {
    step: 'Rinse',
    instruction:
      'Tepid water takes the clumps. Then mist and cream. In the morning after a peel, finish with sun protection.',
  },
])

const DIRECTIONS =
  'Dermatologically tested. For external use only. Avoid the eyes and the mouth. If contact occurs, rinse with cool water. Stop and speak to a doctor if redness, swelling or irritation appears. Keep cool and dry. Use within six months of opening. Once or twice a week on clean, dry skin.'

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id: '12' }, { productNumber: '12' }, { name: { contains: 'EPI TURNOVER' } }],
    },
  })
  if (!product) throw new Error('product 12 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '12',
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
