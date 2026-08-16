/**
 * Product 6 POWER SOLUTION CTS - selling-tone + Intertek rewrite.
 *
 * Replaces the microneedling / collagen-as-co-lead / healing pitch with copy
 * that matches Formula_up + the English carton. CTS is Cytokine Concentrate
 * Solution. The function is improvement of skin texture. Cleanse, open,
 * apply, absorb. The roller is not on this carton. Not a Korean functional
 * cosmetic - there is no principal ingredient to name.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { prisma } from '../lib/prisma'
import { CTS_FULL_INCI } from '../components/product/powersolution/ctsCopy'

const DESCRIPTION =
  'CTS is Cytokine Concentrate Solution. The carton function is improvement of skin texture: it helps the skin retain its natural elasticity and increases the strength of skin. 2 ml × 10 sealed glass vials. 5-Free. Dermatologically tested. Made in Korea by DTS MG.'

const DESCRIPTION_AR =
  'يرمز CTS إلى Cytokine Concentrate Solution. وظيفة العلبة هي تحسين ملمس البشرة: يساعد البشرة على الاحتفاظ بمرونتها الطبيعية ويزيد قوتها. عشر قوارير زجاجية مُحكمة سعة 2 مل، بتركيبة 5-Free، صُنعت في كوريا.'

const DESCRIPTION_RU =
  'CTS расшифровывается как Cytokine Concentrate Solution. Функция на коробке - улучшение текстуры кожи: помогает сохранять естественную эластичность и повышает прочность кожи. Десять запаянных стеклянных флаконов 2 мл, формула 5-Free, произведено в Корее.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Texture, slackness and loss of elasticity',
  technology: 'Texture function over a 28.06% humectant base',
  keyBenefits: 'Improve texture, retain elasticity, increase strength of skin',
  usage: 'Professional treatments and the days after',
  application: 'Cleanse, open one vial, apply, absorb. Leave-on. Keep off the eyes.',
  professionalUse: 'Licensed practitioners, or home use on a practitioner’s advice',
  packaging: 'Glass vial, rubber crimp cap, 10 vials to a carton',
  ph: '7.61, inside a 7.00 ± 1.00 specification',
  fill: '2 ml per vial; specific gravity 1.041',
  freeFrom: 'Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant',
  shelfLife: 'Three years from manufacture, expiry printed on the box',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Cytokine Concentrate Solution',
    description:
      'What the three letters on the vial stand for. CTS is the texture ampoule of the six-strong Power Solution range.',
  },
  {
    title: 'Improvement of skin texture',
    description:
      'The function printed on the carton. The English sentence beside it is elasticity and strength. There is no Korean principal-ingredient licence on this vial.',
  },
  {
    title: '5-Free',
    description:
      'No parabens, no ethanol, no artificial pigment, no artificial fragrance, no artificial surfactant. Printed on the box.',
  },
  {
    title: '28.06% humectant',
    description:
      'Glycerin 14.580% and butylene glycol 13.485%, the largest comfort base of the six, which is what lets a full 2 ml stay comfortable on treated skin.',
  },
])

const BENEFITS = JSON.stringify([
  'Helps the skin retain its natural elasticity and increases the strength of skin - the carton sentence',
  'Improvement of skin texture, the function printed on the box',
  'A 28.06% humectant base, so the face stays comfortable rather than tight',
  '5-Free, and the five exclusions are named on the box',
  'A sealed single-use vial, so nothing oxidises between one face and the next',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'The carton function: texture',
    description:
      'The reason this vial exists. The English carton registers the function as improvement of skin texture. There is no Korean principal ingredient to name.',
  },
  {
    name: 'Soy ferment filtrate 2.5%',
    description:
      'The largest active by weight. It conditions the surface. It is not the job printed on the carton.',
  },
  {
    name: 'Copper Tripeptide-1 0.0212%',
    description:
      '212 ppm, the largest peptide dose in the six-vial range. COSING classifies it as a skin-conditioning ingredient.',
  },
  {
    name: 'Sodium Hyaluronate 0.1% and hydrolyzed collagen 0.1%',
    description:
      'Water-holding and a hydrolyzed fish collagen. Avoid the vial if you are allergic to fish.',
  },
  {
    name: 'sh-Polypeptide-7 1 ppm',
    description:
      'The signature peptide of the range. A recombinant human peptide grown by fermentation from a synthesised copy of the human somatotropin gene. COSING classifies it as a skin protectant.',
  },
  {
    name: 'Full INCI',
    description: CTS_FULL_INCI,
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
  'Dermatologically tested. For professional use, or at home only on the advice of your practitioner. External use only. Avoid contact with the eyes and mucous membranes, and rinse with cool water if contact occurs. Avoid use during pregnancy and while breastfeeding. Contains hydrolyzed fish collagen: avoid if you are allergic to fish. Stop use and speak to a doctor if redness, swelling, small bumps or irritation occurs. Store in a cool, dry place out of direct sunlight and out of reach of children.'

const GALLERY = JSON.stringify([
  '/images/Second/cts_big.jpg',
  '/images/Second/cts_big2.jpg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '6' },
        { productNumber: '6' },
        { name: { contains: 'POWER SOLUTION CTS' } },
      ],
    },
  })
  if (!product) throw new Error('product 6 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '6',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/cts-hero.jpg',
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
