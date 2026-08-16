/**
 * Product 9 POWER SOLUTION AWS - selling-tone + Intertek rewrite.
 *
 * Replaces the microneedling / ceramide-as-co-lead / all-skin-types pitch with
 * copy that matches Formula_up + the English carton. Adenosine 0.04% is the
 * vial. Korea registers it as a wrinkle-improving functional cosmetic.
 * Cleanse, open, apply, absorb. The roller is not on this carton.
 *
 * Shared Neon DB = production. The bespoke page reads these fields for
 * metadata and leftover generic PDP cards.
 */
import { prisma } from '../lib/prisma'
import { AWS_FULL_INCI } from '../components/product/powersolution/awsCopy'

const DESCRIPTION =
  'AWS is Anti-Wrinkle Solution. Korea registers it as a wrinkle-improving functional cosmetic with adenosine 0.04% as the principal ingredient. Reduces the appearance of wrinkles and improves skin firmness. 2 ml × 10 sealed glass vials. 5-Free. Dermatologically tested. Made in Korea by DTS MG.'

const DESCRIPTION_AR =
  'يرمز AWS إلى Anti-Wrinkle Solution، وتسجّله كوريا مستحضراً وظيفياً لتحسين التجاعيد ومكوّنه الرئيسي الأدينوزين بنسبة 0.04%. يقلّل مظهر التجاعيد ويحسّن شدّ البشرة. عشر قوارير زجاجية مُحكمة سعة 2 مل، بتركيبة 5-Free، صُنعت في كوريا.'

const DESCRIPTION_RU =
  'AWS расшифровывается как Anti-Wrinkle Solution, и Корея регистрирует его как функциональную косметику для улучшения морщин с аденозином 0,04% как основным компонентом. Уменьшает видимость морщин и повышает упругость кожи. Десять запаянных стеклянных флаконов 2 мл, формула 5-Free, произведено в Корее.'

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Leave-on solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Lines and loss of firmness',
  technology: 'Adenosine 0.04% over a 21.60% humectant base',
  keyBenefits: 'Reduce the appearance of wrinkles, improve firmness',
  usage: 'Professional treatments and the days after',
  application: 'Cleanse, open one vial, apply, absorb. Leave-on. Keep off the eyes.',
  professionalUse: 'Licensed practitioners, or home use on a practitioner’s advice',
  packaging: 'Glass vial, rubber crimp cap, 10 vials to a carton',
  ph: '4.93, inside a 4.80 ± 1.00 specification',
  fill: '2 ml per vial; specific gravity 1.028',
  freeFrom: 'Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant',
  shelfLife: 'Three years from manufacture, expiry printed on the box',
  origin: 'South Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Anti-Wrinkle Solution',
    description:
      'What the three letters on the vial stand for. AWS is the wrinkle ampoule of the six-strong Power Solution range.',
  },
  {
    title: 'Adenosine 0.04%',
    description:
      'The principal ingredient Korea registers for a wrinkle-improving functional cosmetic. A working Korean cosmetic dose, and every batch is tested against that declaration.',
  },
  {
    title: '5-Free',
    description:
      'No parabens, no ethanol, no artificial pigment, no artificial fragrance, no artificial surfactant. Printed on the box.',
  },
  {
    title: '21.60% humectant',
    description:
      'Butylene glycol 12.515% and glycerin 9.086%, which is what lets a full 2 ml stay comfortable on treated skin.',
  },
])

const BENEFITS = JSON.stringify([
  'Reduces the appearance of wrinkles and improves firmness - the carton sentence',
  'Adenosine 0.04%, the principal ingredient Korea registers',
  'A 21.60% humectant base, so the face stays comfortable rather than tight',
  '5-Free, and the five exclusions are named on the box',
  'A sealed single-use vial, so nothing oxidises between one face and the next',
])

const INGREDIENTS = JSON.stringify([
  {
    name: 'Adenosine 0.04%',
    description:
      'The reason this vial exists. Korea registers the product as a wrinkle-improving functional cosmetic and names adenosine as the principal ingredient.',
  },
  {
    name: 'Soy ferment filtrate 2.5%',
    description:
      'The largest active by weight. It conditions the surface. It is not the ingredient Korea names for the wrinkle licence.',
  },
  {
    name: 'Sodium Hyaluronate 0.1%',
    description: 'Holds water at the skin surface while the adenosine does its job.',
  },
  {
    name: 'sh-Polypeptide-7 6.6 ppm',
    description:
      'The signature peptide of the range. A recombinant human peptide grown by fermentation from a synthesised copy of the human somatotropin gene. COSING classifies it as a skin protectant.',
  },
  {
    name: 'Copper Tripeptide-1 10 ppm',
    description: 'The largest peptide in this vial, still a parts-per-million dose.',
  },
  {
    name: 'Full INCI',
    description: AWS_FULL_INCI,
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
  '/images/Second/aws1.jpg',
  '/images/Second/aws2.jpg',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: '9' },
        { productNumber: '9' },
        { name: { contains: 'POWER SOLUTION AWS' } },
      ],
    },
  })
  if (!product) throw new Error('product 9 not found')

  await prisma.product.update({
    where: { id: product.id },
    data: {
      productNumber: '9',
      description: DESCRIPTION,
      descriptionAr: DESCRIPTION_AR,
      descriptionRu: DESCRIPTION_RU,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
      ingredients: INGREDIENTS,
      howToUse: HOW_TO_USE,
      directions: DIRECTIONS,
      image: '/images/aws-hero.jpg',
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
