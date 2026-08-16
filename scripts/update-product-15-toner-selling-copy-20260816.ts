/**
 * Product 15 INTENSIVE PROBLEM CONTROL TONER - selling-tone +
 * Intertek rewrite.
 *
 * Replaces the patented Anti Sebum P / BHA-as-engine / copper peptide
 * / all-skin-types pitch with copy that matches the DTS MG formula,
 * the English carton, the COA, and the DTS MG deck. Function is oil
 * control. Zinc PCA 0.5%. Apply or spray AM/PM. 200 ml is 360°.
 * Salicylic acid is 0.001%. Copper peptide is not in the INCI.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { PrismaClient } from '@prisma/client'
import { PCT_TONER_FULL_INCI } from '../components/product/pcttoner/pctTonerCopy'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const DESCRIPTION =
  '200ml / 500ml. Oil-control toner for blemish-prone skin. Apply or spray morning and evening. Takes excess oil and sebum, then puts water back. Zinc PCA 0.5% is the named active. The 200 ml bottle turns upside down for the back. Salicylic acid is 0.001%. Copper peptide is not in the formula. Dermatologically tested.'

const DESCRIPTION_AR =
  '200 مل / 500 مل. تونر للتحكم بالدهون للبشرة المعرّضة للعيوب. ضعي أو رشي صباحاً ومساءً. يزيل الزيت والزهم الزائد ثم يعيد الماء. زنك PCA 0.5% هو المكوّن المسمّى. زجاجة 200 مل تنقلب للظهر. حمض الساليسيليك 0.001%. ببتيد النحاس ليس في التركيبة. مختبر جلدياً.'

const DESCRIPTION_RU =
  '200 мл / 500 мл. Тоник для контроля жира для кожи, склонной к высыпаниям. Нанеси или распыли утром и вечером. Снимает лишний жир и себум, затем возвращает воду. Zinc PCA 0,5% - названный актив. Флакон 200 мл переворачивается для спины. Салициловая кислота 0,001%. Медного пептида в формуле нет. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on oil-control toner',
  size: '200ml / 500ml',
  target: 'Oil control, blemish-prone skin',
  technology: 'Zinc PCA 0.5%',
  keyBenefits: 'Apply or spray AM/PM, 200 ml 360°',
  usage: 'Morning and evening',
  application: 'Apply or spray sufficiently',
  ph: '4.81, inside a 4.30 to 5.50 specification',
  appearance: 'Transparent liquid, light yellow',
  pao: '12 months after opening',
  shelfLife: 'Three years unopened, expiry printed on the bottle',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Apply or spray',
    description:
      'Morning and evening, after the cleanse. Enough to cover the face. The carton stops here.',
  },
  {
    title: 'Zinc PCA 0.5%',
    description:
      'The named active at a real dose. This is the oil-control toner, not a water toner.',
  },
  {
    title: '200 ml 360°',
    description:
      'Turns upside down for the back and the neck. 500 ml is the clinic bottle, same formula.',
  },
  {
    title: 'Not a BHA toner',
    description:
      'Salicylic acid is 0.001%. Copper peptide is not in the registered INCI.',
  },
])

const BENEFITS = JSON.stringify([
  'Oil-control toner for blemish-prone skin',
  'Apply or spray morning and evening',
  'Zinc PCA 0.5%',
  'Quick hydration from the humectant stack, not hyaluronate',
  '200 ml turns upside down for the back',
  'Dermatologically tested. Made in Korea, DTS MG',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Zinc PCA 0.5%',
    description:
      'The named active at a real dose. That is why this is an oil-control toner, not a water toner.',
  },
  {
    name: 'The water that follows',
    description:
      'Butylene glycol 5.4%, glycerin 5% and dipropylene glycol 3%. Quick hydration is this stack, not sodium hyaluronate at 0.0005%.',
  },
  {
    name: 'Anti Sebum P and BHA',
    description:
      'Named because leftover copy treated them as the reason to buy. The four Anti Sebum P extracts sit at 0.005% together. Salicylic acid is 0.001%. They are in the formula. They are not why you pick this bottle.',
  },
  {
    name: 'Copper peptide is not here',
    description:
      'The DTS MG deck shows Copper Tripeptide-1. The registered INCI does not.',
  },
  {
    name: 'Full INCI',
    description: PCT_TONER_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Apply or spray',
    instruction: 'After cleansing, enough to cover the face. Morning and evening.',
  },
  {
    step: 'Cotton pad',
    instruction: 'Wipe along the texture if you want a clean pass.',
  },
  {
    step: 'The back',
    instruction: 'The 200 ml bottle sprays 360°. Turn it upside down for the back and the neck.',
  },
  {
    step: 'Optional pads',
    instruction: 'Soak cotton pads and leave them on for 5 to 10 minutes when you want a longer sit. Then the serum.',
  },
])

const DIRECTIONS =
  'For external use only. Avoid the eyes and mucous membranes; rinse with cool water if contact occurs. Stop if irritation appears. Keep cool and dry, out of reach of children. An opened bottle is a 12-month toner.'

const GALLERY = JSON.stringify([
  '/images/problem/bottle-200.jpeg',
  '/images/problem/bottle-500.jpeg',
  '/images/problem/bottle-500-front.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '15' },
        { productNumber: '15' },
        { name: { contains: 'INTENSIVE PROBLEM CONTROL TONER' } },
      ],
    },
  })
  if (!product) throw new Error('product 15 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '15',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/problem/Main.jpg',
      images: GALLERY,
      size: '200ml',
      videoUrl: '/videos/problem.mp4',
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
