/**
 * Product 50 EyeCell EYE ZONE CARE KIT - selling-tone + Intertek rewrite.
 *
 * Replaces the peptide / Haloxyl / callus / patented-patch / collagen-
 * activation / all-skin-types pitch with the four-piece sequence on the
 * 2025 kit artwork. Serum + 0.25mm eye roller, patches 20-40 min, cream.
 * Functional pairs from the shipped 17 / 24 / 33 pages. The roller is
 * not product 1.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { prisma } from '../lib/prisma'

const DESCRIPTION =
  '1 box. Registered four-piece EyeCell kit: Eye Contour Serum 10ml, GENOSYS Eye Roller 0.25mm, Eye Peptide Gel Patch 101g / 60 ea, Eye Contour Cream 20g. Cleanse, serum then a gentle roll, patches 20-40 minutes, then cream. Arbutin 2% and adenosine 0.04% on the serum and the cream. Niacinamide 2% and adenosine 0.04% on the patches. The eye roller is kit-only, not the 450-needle face roller. Dermatologically tested.'

const DESCRIPTION_AR =
  'علبة واحدة. طقم EyeCell مسجّل من أربع قطع: سيروم محيط العين 10 مل، رولر العين GENOSYS 0.25 مم، لصقات هلام العين 101 غ / 60 قطعة، كريم محيط العين 20 غ. نظّفي، السيروم ثم تمرير لطيف، اللصقات من 20 إلى 40 دقيقة، ثم الكريم. أربوتين 2% وأدينوزين 0.04% في السيروم والكريم. نياسيناميد 2% وأدينوزين 0.04% في اللصقات. رولر العين في هذا الطقم فقط، وليس رولر الوجه 450 إبرة. مختبر جلدياً.'

const DESCRIPTION_RU =
  '1 коробка. Зарегистрированный набор EyeCell из четырёх частей: сыворотка для контура глаз 10 мл, роллер GENOSYS 0,25 мм, пептидные патчи 101 г / 60 шт, крем для контура глаз 20 г. Очистить, сыворотка и мягкий прокат, патчи 20-40 минут, затем крем. Арбутин 2% и аденозин 0,04% в сыворотке и креме. Ниацинамид 2% и аденозин 0,04% в патчах. Роллер для глаз только в этом наборе, это не лицевой роллер на 450 игл. Дерматологически протестировано.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Registered four-piece eye-zone kit',
  size: '1 box',
  target: 'Dehydration, dark circles, eye bags, crow\'s feet',
  technology: 'Serum and 0.25mm eye roller, then patches, then cream',
  keyBenefits: 'Two functional pairs, kit-only eye roller',
  usage: 'Carton sequence',
  application: 'Cleanse, serum and roll, patches 20-40 min, cream',
  kitContents: '4 pieces (serum, eye roller, patches, cream)',
  testing: 'Dermatologically tested',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Four-piece sequence',
    description:
      'Serum, the 0.25mm eye roller, patches, then cream. A registered Korean carton with its own barcode, not a box assembled here.',
  },
  {
    title: 'Arbutin 2% and adenosine 0.04%',
    description:
      'The Korean functional pair on the serum and on the cream. Peptides sit at cosmetic trace.',
  },
  {
    title: 'Niacinamide 2% on the patches',
    description:
      'With adenosine 0.04%. Twenty to forty minutes, then take them off. The peptide is 46.5 ppb.',
  },
  {
    title: 'Eye roller, kit only',
    description:
      'One-body, 0.25mm, 60 needles. This is not the 450-needle face roller.',
  },
])

const BENEFITS = JSON.stringify([
  'The eye-zone sequence in one carton',
  'Arbutin 2% and adenosine 0.04% on the serum and the cream',
  'Niacinamide 2% and adenosine 0.04% on the patches',
  'The 0.25mm eye roller ships only in this kit',
  'Dermatologically tested',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Arbutin 2% + adenosine 0.04%',
    description: 'The functional pair on the serum and on the cream.',
  },
  {
    name: 'Niacinamide 2% + adenosine 0.04%',
    description: 'The functional pair on the patches.',
  },
  {
    name: 'Eye roller 0.25mm',
    description: 'Sixty needles, one-body, made for the eye contour. Kit only.',
  },
  {
    name: 'Caution',
    description:
      'The cream contains peanut oil. The kit carton says avoid during pregnancy and lactation.',
  },
])

const HOW_TO_USE = JSON.stringify([
  {
    step: 'Cleanse',
    instruction: 'Cleanse the eye contour.',
  },
  {
    step: 'Serum and roll',
    instruction:
      'A thin layer of serum, then a gentle pass with the 0.25mm eye roller. Extra care, not too much pressure.',
  },
  {
    step: 'Patches',
    instruction:
      'Under the eyes or on the brow bones, 20-40 minutes, then remove.',
  },
  {
    step: 'Cream',
    instruction: 'Seal with Eye Contour Cream.',
  },
])

const DIRECTIONS =
  'For external use only. Keep off the eyes and mucous membranes; rinse with cool water if contact occurs. Avoid use during pregnancy and lactation. The cream contains peanut oil. Skip the roller if you have a keloid history, a stainless-steel allergy or dermatitis. Stop and speak to a doctor if redness, swelling or irritation appears. Keep cool and dry, out of reach of children.'

const GALLERY = JSON.stringify([
  '/images/eye_kit/contents.jpeg',
  '/images/eye_serum/main.jpeg',
  '/images/eye_cream/main.jpeg',
  '/images/patch/main.jpeg',
  '/images/eye_kit/roller.jpeg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '50' },
        { productNumber: '50' },
        { name: { contains: 'EYE ZONE CARE KIT' } },
      ],
    },
  })
  if (!product) throw new Error('product 50 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '50',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/eye_kit/main.jpeg',
      images: GALLERY,
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
