/**
 * Third and final correction pass on product 5.
 *
 * The first pass wrote the page around microneedling: "skin that has just been
 * opened up by a microneedling pass", "during or straight after the
 * microneedling pass", "layers under any GENOSYS serum". None of that is in any
 * document we hold.
 *
 * What the sources actually say:
 *
 *   Carton, English panel   "GENOSYS POWER SOLUTION CVS is a highly
 *                           concentrated solution for skin nourishment. It
 *                           supplies nutrients to the skin, revitalizes and
 *                           hydrates the skin. Function: Skin nourishment."
 *   Carton, application     Four pictograms: cleanse the face, open the
 *                           solution, apply the solution, absorb the solution.
 *                           No roller, no needling, no layering instruction.
 *   Safety assessment       "The product is applied on the face and it is not
 *                           rinsed-off... studied toxicologically as a face
 *                           cream. Target Group for Use: Adults."
 *
 * So the documented use is a leave-on face product, applied from a single-use
 * vial after cleansing. "PROFESSIONAL" is printed on the vial and the range is
 * a clinic line, which supports the professional framing; the needling protocol
 * does not have a document behind it and comes out.
 *
 * The pairing with a GENOSYS roller survives in one place only, the FAQ on the
 * bespoke page, where it is answered as what GENOSYS designs around rather than
 * as an instruction from this carton. See powerSolutionCopy.ts.
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as any)

const APPLY = process.argv.includes('--apply')

const DESCRIPTION =
  'CVS stands for Concentrated Vitality Solution, and Korea registers its function in two words: ' +
  'skin nourishment. It is the ampoule of the six-strong professional Power Solution range that a ' +
  'practitioner reaches for when skin is tired and dry rather than pigmented, oily or lined. Nearly ' +
  'a quarter of the vial is humectant, carrying a soy ferment at 2.5%, panthenol at 0.5%, marine ' +
  'collagen and two callus culture extracts. Ten sealed glass vials, 5-Free and fragrance-free, ' +
  'made in Korea.'

const DESCRIPTION_RU =
  'CVS расшифровывается как Concentrated Vitality Solution, и Корея регистрирует её функцию одним ' +
  'словом: питание кожи. Это та ампула профессиональной линии Power Solution из шести позиций, к ' +
  'которой обращаются, когда кожа уставшая и сухая, а не пигментированная, жирная или с морщинами. ' +
  'Почти четверть флакона — увлажняющая база, которая несёт соевый фермент 2,5%, пантенол 0,5%, ' +
  'морской коллаген и два экстракта каллусной культуры. Десять запаянных стеклянных флаконов, ' +
  'формула 5-Free, без отдушки, произведено в Корее.'

const DESCRIPTION_AR =
  'يرمز CVS إلى Concentrated Vitality Solution، وتسجّل كوريا وظيفتها بكلمتين: تغذية البشرة. هي ' +
  'الأمبولة التي تلجأ إليها مجموعة Power Solution الاحترافية بمستحضراتها الستة حين تكون البشرة ' +
  'متعبة وجافة لا مصطبغة أو دهنية أو ذات تجاعيد. ما يقارب ربع محتوى القارورة قاعدة مرطِّبة تحمل ' +
  'خميرة الصويا بنسبة 2.5% والبانثينول بنسبة 0.5% والكولاجين البحري ومستخلصَي كالوس نباتي. عشر ' +
  'قوارير زجاجية مُحكمة الإغلاق، بتركيبة 5-Free وخالية من العطور، صُنعت في كوريا.'

/** Ordered exactly as the carton's four pictograms, plus the two things a
 *  single-use glass vial needs said about it. */
const HOW_TO_USE = [
  '1. Cleanse the face thoroughly and pat dry',
  '2. Snap open one vial — each 2 ml vial is a single use',
  '3. Apply the solution across the face',
  '4. Let it absorb; it is a leave-on product and is not rinsed off',
  '5. Follow with a moisturiser, or with whatever your practitioner has set',
  '6. Discard any solution left in an opened vial',
].join('\n')

const BENEFITS = [
  'Feeds tired, dull and dehydrated skin, which is the function Korea registers it under',
  'Leaves skin comfortable rather than tight, thanks to a 24% humectant base',
  'Panthenol and allantoin settle skin that has just been through a treatment',
  'Marine collagen and sodium hyaluronate hold water at the surface',
  'Fragrance-free and 5-Free, so there is less to react to on freshly treated skin',
  'A sealed single-use vial, so nothing oxidises between one face and the next',
]

const PRODUCT_DETAILS = {
  form: 'Concentrated leave-on solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Tired, dull and dehydrated skin',
  technology: 'A soy ferment and recombinant peptides carried in a 24% humectant base',
  keyBenefits: 'Nourishment, hydration, comfort after treatment',
  usage: 'Professional treatments and post-treatment care',
  skinType: 'All skin types',
  application: 'Cleanse, open one vial, apply across the face and let it absorb. Not rinsed off.',
  professionalUse: 'Licensed practitioners, or home use on a practitioner’s advice',
  packaging: 'Glass vial, rubber crimp cap, 10 vials to a carton',
  ph: '5.94 on lot L1036B, against a 6.00 ± 1.00 specification',
  fill: '2 ml declared; specific gravity 1.032 on the same lot',
  freeFrom: 'Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant',
  shelfLife: 'Three years from manufacture; lot L1036B runs to November 2027',
  origin: 'South Korea',
}

/** Card 3 previously said the base is "what lets a 2 ml dose stay comfortable
 *  on skin that has just been needled". Same point, without the protocol. */
const KEY_FEATURES = [
  {
    title: 'Concentrated Vitality Solution',
    description:
      'What the three letters on the vial actually stand for. CVS is the general-purpose ampoule of the six-strong Power Solution range: the one for skin that is tired and dehydrated rather than pigmented, oily or lined.',
  },
  {
    title: '5-Free',
    description:
      'No parabens, no ethanol, no artificial pigment, no artificial fragrance, no artificial surfactant. Printed on the box and readable straight off the ingredient list.',
  },
  {
    title: 'Nearly a quarter humectant',
    description:
      'Butylene glycol at 12.5% and glycerin at 11.5% make up the body of the vial, which is what lets a 2 ml dose stay comfortable on skin that has just been through a treatment.',
  },
  {
    title: 'Soothing ingredients at working doses',
    description:
      'Panthenol at 0.5%, allantoin at 0.1% and a soy ferment at 2.5% — real concentrations rather than a dusting for the label.',
  },
]

async function main() {
  const product =
    (await prisma.product.findFirst({ where: { productNumber: '5' } })) ||
    (await prisma.product.findUnique({ where: { id: '5' } }))
  if (!product) throw new Error('product 5 not found')

  const data = {
    description: DESCRIPTION,
    descriptionRu: DESCRIPTION_RU,
    descriptionAr: DESCRIPTION_AR,
    keyFeatures: JSON.stringify(KEY_FEATURES),
    benefits: JSON.stringify(BENEFITS),
    howToUse: HOW_TO_USE,
    productDetails: JSON.stringify(PRODUCT_DETAILS),
  }

  if (!APPLY) {
    console.log('DRY RUN - pass --apply to write\n')
    for (const [k, v] of Object.entries(data)) console.log(`--- ${k} ---\n${v}\n`)
    return
  }

  await prisma.product.update({ where: { id: product.id }, data })
  console.log(`updated product ${product.id} (${product.name})`)
}

main()
  .catch(e => {
    console.error(e.message ?? e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
