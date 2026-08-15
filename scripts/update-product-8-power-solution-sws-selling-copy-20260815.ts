/**
 * Product 8 POWER SOLUTION SWS - selling-tone + Intertek rewrite.
 *
 * Replaces the microneedling / kojic-as-co-lead / all-skin-types pitch with
 * copy that matches Formula_up + the English carton. Arbutin 2% is the vial.
 * Korea registers it as a whitening functional cosmetic. Cleanse, open, apply,
 * absorb. The roller is not on this carton.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { prisma } from '../lib/prisma'
import { SWS_FULL_INCI } from '../components/product/powersolution/swsCopy'

const DESCRIPTION =
  'SWS is Skin Depigmenting & Whitening Solution. Korea registers it as a whitening functional cosmetic with arbutin 2% as the principal ingredient. Helps improve pigmentation, even skin tone and brighten the skin surface. 2 ml × 10 sealed glass vials. 5-Free. Dermatologically tested. Made in Korea by DTS MG.'

const DESCRIPTION_AR =
  'يرمز SWS إلى Skin Depigmenting & Whitening Solution، وتسجّله كوريا مستحضراً وظيفياً للتفتيح ومكوّنه الرئيسي الأربوتين بنسبة 2%. يساعد على تحسين التصبّغ وتوحيد لون البشرة وتفتيح سطحها. عشر قوارير زجاجية مُحكمة سعة 2 مل، بتركيبة 5-Free، صُنعت في كوريا.'

const DESCRIPTION_RU =
  'SWS расшифровывается как Skin Depigmenting & Whitening Solution, и Корея регистрирует его как функциональную осветляющую косметику с арбутином 2% как основным компонентом. Помогает улучшить пигментацию, выровнять тон и осветлить поверхность кожи. Десять запаянных стеклянных флаконов 2 мл, формула 5-Free, произведено в Корее.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Pigmentation and uneven tone',
  technology: 'Arbutin 2% over a 17.71% humectant base',
  keyBenefits: 'Improve pigmentation, even tone, brighten the surface',
  usage: 'Professional treatments and the days after',
  application: 'Cleanse, open one vial, apply, absorb. Leave-on. Keep off the eyes.',
  professionalUse: 'Licensed practitioners, or home use on a practitioner’s advice',
  packaging: 'Glass vial, rubber crimp cap, 10 vials to a carton',
  ph: '7.72, inside an 8.00 ± 1.00 specification',
  fill: '2 ml per vial; specific gravity 1.032',
  freeFrom: 'Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant',
  shelfLife: 'Three years from manufacture, expiry printed on the box',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Skin Depigmenting & Whitening Solution',
    description:
      'What the three letters on the vial stand for. SWS is the pigment ampoule of the six-strong Power Solution range.',
  },
  {
    title: 'Arbutin 2%',
    description:
      'The principal ingredient Korea registers for a whitening functional cosmetic. A full working dose, and every batch is tested against that declaration.',
  },
  {
    title: '5-Free',
    description:
      'No parabens, no ethanol, no artificial pigment, no artificial fragrance, no artificial surfactant. Printed on the box.',
  },
  {
    title: '17.71% humectant',
    description:
      'Butylene glycol 10.224% and glycerin 7.486%, which is what lets a full 2 ml stay comfortable on treated skin.',
  },
])

const BENEFITS = JSON.stringify([
  'Helps improve pigmentation, even skin tone and brighten the surface - the carton sentence',
  'Arbutin 2%, the principal ingredient Korea registers',
  'A 17.71% humectant base, so the face stays comfortable rather than tight',
  '5-Free, and the five exclusions are named on the box',
  'A sealed single-use vial, so nothing oxidises between one face and the next',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Arbutin 2%',
    description:
      'The reason this vial exists. Korea registers the product as a whitening functional cosmetic and names arbutin as the principal ingredient.',
  },
  {
    name: 'Sodium Hyaluronate 0.2%',
    description: 'Holds water at the skin surface while the arbutin does its job.',
  },
  {
    name: 'Safflower Flower Extract 0.15%',
    description:
      'The next largest botanical after the humectant base. A conditioning extract, not a second brightener.',
  },
  {
    name: 'Kojic Acid 0.05%',
    description:
      'In the formula, at one fortieth of the arbutin dose. Named because it is on the carton, not because it is the engine.',
  },
  {
    name: 'sh-Polypeptide-7 6.6 ppm',
    description:
      'The signature peptide of the range. A recombinant human peptide grown by fermentation from a synthesised copy of the human somatotropin gene. COSING classifies it as a skin protectant.',
  },
  {
    name: 'Palmitoyl Tripeptide-1 0.5 ppm',
    description: 'Three amino acids anchored to a fatty acid so the peptide stays where it is put.',
  },
  {
    name: 'Full INCI',
    description: SWS_FULL_INCI,
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
  '/images/Second/sws_big1.jpg',
  '/images/Second/sws_big2.jpg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '8' },
        { productNumber: '8' },
        { name: { contains: 'POWER SOLUTION SWS' } },
      ],
    },
  })
  if (!product) throw new Error('product 8 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '8',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/sws-hero.jpg',
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
