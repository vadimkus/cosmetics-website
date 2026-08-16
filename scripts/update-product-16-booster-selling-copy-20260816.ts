/**
 * Product 16 SNOW BOOSTER - selling-tone + Intertek rewrite.
 *
 * Replaces the Phytolex-as-0.5%-engine / brightening / cotton-pad-mask
 * pitch with copy that matches Formula_up, the English carton, the SA
 * and the COA. Function is toner. Daily, all skin types. Betaine 3%.
 * Apply or spray AM/PM. Can go over makeup. Phytolex is a 0.5% premix.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { PrismaClient } from '@prisma/client'
import { BOOSTER_FULL_INCI } from '../components/product/booster/boosterCopy'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const DESCRIPTION =
  '200ml / 1000ml. Daily toner for all skin types. Apply or spray morning and evening to give moisture. Can go over makeup. Moisturizes and soothes, then refines after the cleanse. Betaine 3% is the named active. Phytolex is a 0.5% premix. Not the oil-control toner. Dermatologically tested.'

const DESCRIPTION_AR =
  '200 مل / 1000 مل. تونر يومي لكل أنواع البشرة. ضعي أو رشي صباحاً ومساءً لإعطاء رطوبة. يمكن فوق المكياج. يرطّب ويهدّئ ثم ينقّي بعد التنظيف. البيتين 3% هو المكوّن المسمّى. Phytolex خلطة 0.5%. ليس تونر التحكم بالدهون. مختبر جلدياً.'

const DESCRIPTION_RU =
  '200 мл / 1000 мл. Ежедневный тоник для всех типов кожи. Нанеси или распыли утром и вечером, чтобы дать влагу. Можно поверх макияжа. Увлажняет и успокаивает, затем выравнивает после умывания. Бетаин 3% - названный актив. Phytolex - премикс 0,5%. Не тоник для контроля жира. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on daily toner',
  size: '200ml / 1000ml',
  target: 'Moisture, all skin types',
  technology: 'Betaine 3%',
  keyBenefits: 'Apply or spray AM/PM, over makeup',
  usage: 'Morning and evening',
  application: 'Apply or spray sufficiently',
  ph: '6.14, inside a 5.00 to 7.00 specification',
  appearance: 'Translucent liquid',
  pao: '6 months after opening',
  shelfLife: 'Three years unopened, expiry printed on the bottle',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Apply or spray',
    description: 'Morning and evening, enough to give moisture. Can go over makeup.',
  },
  {
    title: 'Betaine 3%',
    description: 'The named active at a real dose. This is the daily moisture toner, not a peel.',
  },
  {
    title: 'All skin types',
    description: 'The line printed on the carton. Moisturizes and soothes, then refines after the cleanse.',
  },
  {
    title: 'Not the oil-control toner',
    description: 'That is Problem Control. Phytolex is a 0.5% premix, not the engine.',
  },
])

const BENEFITS = JSON.stringify([
  'Daily toner for all skin types',
  'Apply or spray morning and evening',
  'Can go over makeup',
  'Betaine 3%',
  'Phytolex is a 0.5% premix; finished botanicals 0.00765%',
  'Dermatologically tested. Made in Korea, DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Betaine 3%',
    description:
      'The named active at a real dose. That is why the toner feels like water going back in, not a peel.',
  },
  {
    name: 'The water around it',
    description:
      'Glycerin 5.8%, butylene glycol 4.6% and dipropylene glycol 4%. With betaine they sit at about 18%. That is the moisture the carton promises.',
  },
  {
    name: 'Phytolex SC',
    description:
      'Named because leftover copy sold it as a 0.5% finished soothing engine. It is a 0.5% premix. The three botanicals finish at 0.00765%. They are in the formula. They are not why you pick this bottle.',
  },
  {
    name: 'Lotus and pumpkin ferment',
    description:
      'Nelumbo flower is 0.0475%. Lactobacillus/pumpkin ferment is 0.1%. Traces under the water, not a brightener or a probiotic engine.',
  },
  {
    name: 'Full INCI',
    description: BOOSTER_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'After the cleanse',
    instruction: 'The face is clean. This is the water that goes on next.',
  },
  {
    step: 'Apply or spray',
    instruction: 'Enough to give moisture, morning and evening.',
  },
  {
    step: 'Over makeup',
    instruction: 'It can go over make-up. Before makeup it is the moisture pass.',
  },
  {
    step: 'Then the rest',
    instruction: 'Serum and cream follow. This is a toner, not a cotton-pad mask.',
  },
])

const DIRECTIONS =
  'For external use only. Avoid the eyes and mucous membranes; rinse with cool water if contact occurs. Stop if irritation appears. Keep cool and dry, out of reach of children. An opened bottle is a 6-month toner.'

const GALLERY = JSON.stringify([
  '/images/booster/bottle-200.jpeg',
  '/images/booster/bottles-both.jpeg',
  '/images/booster/carton-back.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '16' },
        { productNumber: '16' },
        { name: { contains: 'SNOW BOOSTER' } },
      ],
    },
  })
  if (!product) throw new Error('product 16 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '16',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/Second/main_booster.jpg',
      images: GALLERY,
      size: '200ml',
      videoUrl: '/videos/booster.mp4',
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
