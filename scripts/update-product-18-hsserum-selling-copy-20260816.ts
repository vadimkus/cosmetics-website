/**
 * Product 18 MOISTURE REPLENISHING HYALURON SERUM - selling-tone +
 * Intertek rewrite.
 *
 * Replaces the 4-step electrolyte / +52% / 78% coconut-water pitch with
 * copy that matches the DTS MG formula, the English carton, the COA and
 * the DTS MG deck. Function is moisturizing. Hydrolyzed HA 2,000 ppm.
 * Apply and pat AM/PM. Coconut water is 0.80%. PENTAVITIN is 0.615%.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { PrismaClient } from '@prisma/client'
import { HSSERUM_FULL_INCI } from '../components/product/hsserum/hsserumCopy'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const DESCRIPTION =
  '30ml. Moisturizing serum. Hydrolyzed hyaluronic acid 2,000 ppm. Apply on the face and gently pat, morning and evening. Coconut-water serum with an HA complex and mushrooms. Coconut water is 0.80%. PENTAVITIN is 0.615%. Not the cream. Not a 4-step electrolyte story. Dermatologically tested.'

const DESCRIPTION_AR =
  '30 مل. سيروم ترطيب. حمض هيالورونيك متحلّل 2,000 جزء في المليون. ضعي على الوجه وربّتي بلطف، صباحاً ومساءً. سيروم بماء جوز الهند مع مركّب هيالورونيك وفطر. ماء جوز الهند 0.80%. PENTAVITIN 0.615%. ليس الكريم. ليست قصة إلكتروليت من 4 خطوات. مختبر جلدياً.'

const DESCRIPTION_RU =
  '30 мл. Увлажняющая сыворотка. Гидролизованная гиалуроновая кислота 2 000 ppm. Нанеси на лицо и мягко похлопай, утром и вечером. Сыворотка на кокосовой воде с комплексом ГК и грибами. Кокосовая вода 0,80%. PENTAVITIN 0,615%. Не крем. Не история про электролиты из 4 ступеней. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on moisturizing serum',
  size: '30ml',
  target: 'Moisture, dry or dehydrated skin',
  technology: 'Hydrolyzed HA 2,000 ppm',
  keyBenefits: 'Apply and pat AM/PM',
  usage: 'Morning and evening',
  application: 'Apply on the face and gently pat',
  ph: '5.08, inside a 5.3±0.5 specification',
  appearance: 'Sky-blue serum, no pigment added',
  pao: '12 months after opening',
  shelfLife: 'Three years unopened, expiry printed on the bottle',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Apply and pat',
    description: 'On the face, morning and evening. The carton stops here.',
  },
  {
    title: '2,000 ppm',
    description: 'Hydrolyzed HA, the named dose. This is the moisturizing serum, not the cream.',
  },
  {
    title: 'Hyaluronan 11',
    description: 'Brand name. Eight hyaluronate INCIs. One of them is the 2,000 ppm.',
  },
  {
    title: 'Not +52%',
    description: 'Inner hydration moved after one use. The leftover 52% was a misread of 52.238.',
  },
])

const BENEFITS = JSON.stringify([
  'Moisturizing serum, 30 ml',
  'Hydrolyzed hyaluronic acid 2,000 ppm',
  'Apply on the face and pat, morning and evening',
  'PENTAVITIN / saccharide isomerate 0.615%',
  'Coconut water 0.80%, not 78%',
  'Dermatologically tested. Made in Korea, DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Hydrolyzed HA 2,000 ppm',
    description:
      'The named dose. That is why the serum feels like water going in, not a film you wait on.',
  },
  {
    name: 'Hyaluronan 11 Multi-Complex',
    description:
      'The brand name. Eight hyaluronate INCIs. One of them is the 2,000 ppm. The others finish in parts per million.',
  },
  {
    name: 'PENTAVITIN 0.615%',
    description:
      'Saccharide isomerate at a real dose. The deck calls it a moisture magnet.',
  },
  {
    name: 'Coconut water 0.80%',
    description:
      'The carton calls this a coconut-water serum. Aqua is still the water. Leftover copy sold 78% coconut water instead of purified water.',
  },
  {
    name: 'Mushrooms and glyceryl glucoside',
    description:
      'Each mushroom extract is 0.000017%. Glyceryl glucoside is 0.0005%. In the formula. Not the engine.',
  },
  {
    name: 'Full INCI',
    description: HSSERUM_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'After the toner',
    instruction: 'The face is clean. This is the serum that goes on next.',
  },
  {
    step: 'On the face',
    instruction: 'Apply the product on the face. Enough to cover.',
  },
  {
    step: 'Pat',
    instruction: 'Gently pat with fingers, morning and evening.',
  },
  {
    step: 'Then the cream',
    instruction: 'Hyaluron cream follows when you pair them. This bottle is the serum.',
  },
])

const DIRECTIONS =
  'For external use only. Avoid the eyes and mucous membranes; rinse with cool water if contact occurs. Do not use near the eyes. Keep cool and dry, out of reach of children. Stop if redness, swelling or irritation appears. An opened bottle is a 12-month serum.'

const GALLERY = JSON.stringify([
  '/images/hsserum/bottle-box.jpeg',
  '/images/hsserum/carton-back.jpeg',
  '/images/hsserum/carton-panels.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '18' },
        { productNumber: '18' },
        { name: { contains: 'HYALURON SERUM' } },
      ],
    },
  })
  if (!product) throw new Error('product 18 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '18',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/hyaluron_serum/main.jpeg',
      images: GALLERY,
      size: '30ml',
      videoUrl: '/videos/hs_cream_serum.mp4',
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
