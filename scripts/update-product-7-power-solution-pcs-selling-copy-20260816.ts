/**
 * Product 7 POWER SOLUTION PCS - selling-tone + Intertek rewrite.
 *
 * Replaces the microneedling / anti-acne / witch-hazel-as-engine pitch with
 * copy that matches Formula_up + the English carton. PCS is Problem Control
 * Solution. The function is oil and sebum control. Cleanse, open, apply,
 * absorb. The roller is not on this carton. Not a Korean functional
 * cosmetic - there is no principal ingredient to name.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { prisma } from '../lib/prisma'
import { PCS_FULL_INCI } from '../components/product/powersolution/pcsCopy'

const DESCRIPTION =
  'PCS is Problem Control Solution. The carton function is oil and sebum control: it controls excessive oil production and helps reduce the appearance of blemishes. 2 ml × 10 sealed glass vials. 5-Free. Dermatologically tested. Made in Korea by DTS MG.'

const DESCRIPTION_AR =
  'يرمز PCS إلى Problem Control Solution. وظيفة العلبة هي التحكم في الزيت والزهم: يتحكم في الإنتاج المفرط للزيت ويساعد على تقليل مظهر العيوب. عشر قوارير زجاجية مُحكمة سعة 2 مل، بتركيبة 5-Free، صُنعت في كوريا.'

const DESCRIPTION_RU =
  'PCS расшифровывается как Problem Control Solution. Функция на коробке - контроль масла и кожного сала: контролирует избыточную выработку масла и помогает уменьшить видимость несовершенств. Десять запаянных стеклянных флаконов 2 мл, формула 5-Free, произведено в Корее.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Excess oil and the appearance of blemishes',
  technology: 'Oil and sebum function over a 22.98% humectant base',
  keyBenefits: 'Control oil and sebum, reduce the appearance of blemishes',
  usage: 'Professional treatments and the days after',
  application: 'Cleanse, open one vial, apply, absorb. Leave-on. Keep off the eyes.',
  professionalUse: 'Licensed practitioners, or home use on a practitioner’s advice',
  packaging: 'Glass vial, rubber crimp cap, 10 vials to a carton',
  ph: '7.98, inside a 7.70 ± 1.00 specification',
  fill: '2 ml per vial; specific gravity 1.031',
  freeFrom: 'Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant',
  shelfLife: 'Three years from manufacture, expiry printed on the box',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Problem Control Solution',
    description:
      'What the three letters on the vial stand for. PCS is the oil-and-sebum ampoule of the six-strong Power Solution range.',
  },
  {
    title: 'Oil and sebum control',
    description:
      'The function printed on the carton. The English sentence beside it is excessive oil and the appearance of blemishes. There is no Korean principal-ingredient licence on this vial.',
  },
  {
    title: '5-Free',
    description:
      'No parabens, no ethanol, no artificial pigment, no artificial fragrance, no artificial surfactant. Printed on the box.',
  },
  {
    title: '22.98% humectant',
    description:
      'Butylene glycol 12.994% and glycerin 9.986%, which is what lets a full 2 ml stay comfortable on treated skin.',
  },
])

const BENEFITS = JSON.stringify([
  'Controls excessive oil production and helps reduce the appearance of blemishes - the carton sentence',
  'Oil and sebum control, the function printed on the box',
  'A 22.98% humectant base, so the face stays comfortable rather than tight',
  '5-Free, and the five exclusions are named on the box',
  'A sealed single-use vial, so nothing oxidises between one face and the next',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'The carton function: oil and sebum',
    description:
      'The reason this vial exists. The English carton registers the function as oil and sebum control. There is no Korean principal ingredient to name.',
  },
  {
    name: 'Soy ferment filtrate 1.5%',
    description:
      'The largest active by weight. It conditions the surface. It is not the job printed on the carton.',
  },
  {
    name: 'Panthenol 0.5%',
    description: 'A working cosmetic dose of the classic comfort agent.',
  },
  {
    name: 'Witch hazel leaf extract 0.045%',
    description: 'In the formula. Not the engine.',
  },
  {
    name: 'sh-Polypeptide-7 5 ppm',
    description:
      'The signature peptide of the range. A recombinant human peptide grown by fermentation from a synthesised copy of the human somatotropin gene. COSING classifies it as a skin protectant.',
  },
  {
    name: 'Full INCI',
    description: PCS_FULL_INCI,
  },
])

const HOW_TO_USE = JSON.stringify([
  { step: 'Cleanse', instruction: 'Wash the face thoroughly and pat it dry.' },
  { step: 'Open', instruction: 'Snap one vial. Each 2 ml vial is a single use.' },
  { step: 'Apply', instruction: 'Work the solution across the face.' },
  { step: 'Absorb', instruction: 'Leave-on. It is not rinsed off.' },
  { step: 'Follow', instruction: 'A moisturiser, or whatever your practitioner has set. Keep it off the eyes.' },
  { step: 'Discard', instruction: 'An opened vial does not reseal.' },
])

const DIRECTIONS =
  'Dermatologically tested. For professional use, or at home only on the advice of your practitioner. External use only. Avoid contact with the eyes and mucous membranes, and rinse with cool water if contact occurs. Avoid use during pregnancy and while breastfeeding. Stop use and speak to a doctor if redness, swelling, small bumps or irritation occurs. Store in a cool, dry place out of direct sunlight and out of reach of children.'

const GALLERY = JSON.stringify([
  '/images/Second/pcs_big1.jpg',
  '/images/Second/pcs_big2.jpg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '7' },
        { productNumber: '7' },
        { name: { contains: 'POWER SOLUTION PCS' } },
      ],
    },
  })
  if (!product) throw new Error('product 7 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '7',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/pcs-hero.jpg',
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
