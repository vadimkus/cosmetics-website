/**
 * Correct the database record for product 45, HR³ MATRIX HAIR SOLUTION α.
 *
 * Sources: signed DTS MG formula (Registration DOC/Formula_up), safety assessment
 * EN09_01_01 E3 21 06 00597 Amendment II, COA lot WNL122, both registered artworks
 * (_Homecare and _Professional), and the DTS MG product deck.
 *
 * WHAT WAS WRONG
 *
 * 1. SIZE. The record said 5ml*8pcs. Both registered cartons say 4 ml × 8 vials, and
 *    the Russian panel states "Объем 4мл * 8 шт." independently. The DTS MG deck does
 *    say 5 ml, but a deck does not outrank registered artwork, and two artworks agree
 *    against it. Corrected to 4 ml × 8.
 *
 * 2. AN INGREDIENT THAT IS NOT IN THE FORMULA. The benefits list credited "Sophora
 *    Japonica" with antioxidant effects. Sophora japonica does not appear anywhere in
 *    this formula — it is in the HAIR TONIC. A copy-paste between two products in the
 *    same line.
 *
 * 3. THE INCI LIST OMITTED 1,2-HEXANEDIOL, which is the third ingredient at
 *    2.04246500% and appears in that position on both cartons. Replaced with the full
 *    list in carton order.
 *
 * 4. DRUG-MECHANISM CLAIMS THROUGHOUT. The description claimed the product works by
 *    "accelerating angiogenesis, inhibiting hair loss substances"; the benefits
 *    claimed "Prevents Hair Loss", "Promotes Hair Regrowth", "Enhances Blood
 *    Circulation"; saw palmetto was described as "documented botanical for
 *    DHT-related hair thinning" and "the formula's key anti-hair-loss botanical"
 *    while present at 10 ppm.
 *
 *    These trace back to the DTS MG deck, which states outright that the product
 *    "helps to inhibit the formation of 5α-reductases, the key enzyme which converts
 *    testosterone to dihydrotestosterone". That is the mechanism of finasteride, a
 *    prescription medicine. It is the same claim already logged on the hair tonic's
 *    Russian panel, so this line now has it in four separate places. None of it goes
 *    on our pages. Per the owner decision of 17 Aug we follow the English carton,
 *    whose function line reads "Nutrition supply and hair conditioning".
 *
 * 5. NO EFFICACY STUDY EXISTS. The old copy cited "research papers on the improvement
 *    of hair loss". The safety assessment records "Other Tests: None presented" and
 *    "Literature Data: Not Applicable". Removed.
 *
 * 6. NOTHING RECORDED THE THINGS THAT ACTUALLY MATTER TO A BUYER: that the carton
 *    says avoid during pregnancy and lactation, that a vial must be used immediately
 *    once opened, that it is one or two applications a week, or what any of the
 *    actives are dosed at.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-45-hair-solution-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION = [
  '4 ml × 8 single-use vials, for microneedling. This is the ampoule in the HR³ MATRIX range built to be rolled or stamped into the scalp rather than smoothed onto it, and the vehicle is most of the point: propylene glycol at 9.995%, PEG-40 hydrogenated castor oil at 1% and carbomer at 0.45% make a thin opaque gel that sits where it is placed on needled skin.',
  'At dose: menthol 0.200% for the cooling, niacinamide 0.100% and panthenol 0.100%. Copper tripeptide-1 sits at 0.0005%, which is 5 ppm — five times the concentration in the HR³ MATRIX Hair Tonic and the highest in the range. Broccoli extract at 100 ppm is the most substantial botanical.',
  'About the growth factors, since they lead the label: sh-Polypeptide-9, sh-Polypeptide-7, sh-Oligopeptide-1 and sh-Polypeptide-71 are all present, and together they come to 1.2 parts per million. They are real and they are premium raw materials, but that is the honest number.',
  'Registered as a leave-in hair conditioner. The carton function line reads nutrition supply and hair conditioning. Dermatologically tested. Use one or two times a week, and use a vial immediately once it is opened. The carton says to avoid during pregnancy and lactation.',
].join(' ')

const INGREDIENTS = JSON.stringify([
  {
    name: 'The vehicle: propylene glycol 9.995% with PEG-40 hydrogenated castor oil 1% and carbomer 0.45%',
    description:
      'Worth naming first, because on a microneedling ampoule the carrier is the product. Propylene glycol at nearly 10% is a humectant and a solvent that helps water-soluble ingredients move; the castor oil derivative keeps the peptides in solution; the carbomer gives just enough body that the liquid stays where you put it on a needled scalp instead of running off.',
  },
  {
    name: 'Menthol 0.200%',
    description:
      'The cooling, and the ingredient you will actually notice. Two thirds of the concentration in the hair tonic, which is appropriate on skin that has just been needled.',
  },
  {
    name: 'Niacinamide 0.100%',
    description: 'Vitamin B3 at a modest but real dose. Barrier support on scalp skin.',
  },
  {
    name: 'Panthenol 0.100%',
    description:
      'Vitamin B5, for moisture retention and hair elasticity. Half the dose in the hair tonic.',
  },
  {
    name: 'Copper Tripeptide-1 0.0005%',
    description:
      'Five parts per million. Modest in absolute terms, but the highest copper tripeptide concentration in the HR³ MATRIX range: five times the hair tonic and five hundred times the shampoo. If this is the ingredient you are shopping the line for, this is the product that carries it.',
  },
  {
    name: 'Brassica oleracea italica (broccoli) extract 0.010%',
    description:
      'At 100 ppm, the most substantial botanical in the formula by a factor of ten, and the one worth naming. An antioxidant extract carrying sulforaphane.',
  },
  {
    name: 'The four growth factors: 1.2 ppm in total',
    description:
      'sh-Polypeptide-9 at 0.5 ppm, sh-Polypeptide-7 at 0.5 ppm, sh-Oligopeptide-1 at 0.15 ppm and sh-Polypeptide-71 at 0.05 ppm. Three of them are sold as the HAIR RE³ GF complex and the fourth is listed separately. They are genuine recombinant peptides and they are expensive, and the total is one and a fifth parts per million. We are not going to build a mechanism on that.',
  },
  {
    name: 'Serenoa serrulata (saw palmetto) fruit extract 0.001%',
    description:
      'Ten parts per million. Saw palmetto has a reputation in hair products that this dose does not support, so it is listed and left at that.',
  },
  {
    name: 'Black Complex — nine extracts at 1 ppm each',
    description:
      'The manufacturer\u2019s name for rice, sesame, soybean, barley, blackberry, black currant, garlic, maca and nigella seed extracts, each present at 0.0001%. Nine named botanicals totalling about nine parts per million between them.',
  },
  {
    name: 'Full ingredient list (INCI)',
    description:
      'Aqua (Water), Propylene Glycol, 1,2-Hexanediol, PEG-40 Hydrogenated Castor Oil, Copper Tripeptide-1, Brassica Oleracea Italica (Broccoli) Extract, Serenoa Serrulata Fruit Extract, sh-Polypeptide-7, Sh-Oligopeptide-1, sh-Polypeptide-71, sh-Polypeptide-9, Panthenol, Biosaccharide Gum-4, Glycerin, Lecithin, Houttuynia Cordata Extract, Sesamum Indicum (Sesame) Seed Extract, Rubus Fruticosus (Blackberry) Fruit Extract, Ribes Nigrum (Black Currant) Fruit Extract, Oryza Sativa (Rice) Extract, Nigella Sativa Seed Extract, Lepidium Meyenii Root Extract, Hordeum Vulgare Extract, Glycine Soja (Soybean) Seed Extract, Glycine Max (Soybean) Seed Extract, Allium Sativum (Garlic) Bulb Extract, Niacinamide, Menthol, Carbomer, Butylene Glycol, Triethanolamine, Citric Acid, Polysorbate 60, Phenoxyethanol, Sodium Citrate, Dipropylene Glycol.',
  },
])

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Opaque liquid ampoule for microneedling, in single-use vials',
  size: '4 ml × 8 vials',
  registeredCategory: 'Leave-in hair conditioner',
  registeredFunction: 'Nutrition supply and hair conditioning',
  vehicle: 'Propylene glycol 9.995%, 1,2-hexanediol 2.042%, PEG-40 hydrogenated castor oil 1.000%, carbomer 0.450%',
  atDose: 'Menthol 0.200%, niacinamide 0.100%, panthenol 0.100%',
  copperPeptide: 'Copper tripeptide-1 0.0005% (5 ppm) — the highest in the HR³ MATRIX range',
  growthFactors:
    'sh-Polypeptide-9 0.5 ppm, sh-Polypeptide-7 0.5 ppm, sh-Oligopeptide-1 0.15 ppm, sh-Polypeptide-71 0.05 ppm. Total 1.2 ppm',
  botanicals:
    'Broccoli extract 100 ppm, saw palmetto 10 ppm, Black Complex (nine extracts) 1 ppm each, houttuynia 0.1 ppm',
  pH: '6.00–7.00 (6.65 on the batch tested)',
  viscosity: '800 against an 800–1,600 specification',
  purity: 'Under 10 cfu/ml against a permitted 100',
  shelfLife: 'Three years unopened, with the date on the carton',
  afterOpening: 'Use immediately. The vials carry no meaningful preservative system',
  testing:
    'Patch tested, non-irritant, by an independent laboratory. The assessor notes the number of volunteers is not statistically significant. No efficacy study exists for this product',
  professionalUse:
    'Part the hair with a comb, then roll or stamp with a 0.25–0.5 mm head for 10–15 minutes. Half a vial or a whole vial depending on the area; refrigerate any remainder until the next treatment. The manufacturer\u2019s Russian panel adds a spacing the English one omits: 1–2 cm between partings',
  homecareUse:
    'Fit the applicator to the opened vial and tap vertically with steady pressure. Rinse the applicator under running water afterwards, disinfect it in the jar with alcohol, dry and re-cap. One or two times a week',
  notFor:
    'Avoid during pregnancy and lactation, as printed on the carton. Not for use near the eyes. External use only',
  keyBenefits:
    'A cooling, conditioning ampoule built as a microneedling vehicle, with the range\u2019s highest copper tripeptide dose',
  system: 'Also supplied inside the HR³ MATRIX MESOPECIA KIT',
  origin: 'Made in Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'Built as a microneedling vehicle',
    description:
      'Propylene glycol at 9.995% with a solubiliser and carbomer at 0.450%: a thin opaque gel that stays where it is placed on needled scalp rather than running off.',
  },
  {
    title: 'The range\u2019s highest copper tripeptide dose',
    description:
      'Copper tripeptide-1 at 5 ppm — five times the HR³ MATRIX Hair Tonic and five hundred times the shampoo.',
  },
  {
    title: 'Menthol 0.200% for the cooling',
    description:
      'Lower than the tonic on purpose, which suits skin that has just been treated. Niacinamide and panthenol both at 0.100% behind it.',
  },
  {
    title: 'Growth factors stated honestly',
    description:
      'Four recombinant peptides, 1.2 parts per million between them. Real, premium and present — and that is the actual number.',
  },
  {
    title: 'Single-use 4 ml vials',
    description:
      'Use a vial immediately once opened. In clinic, half a vial can be refrigerated for the next session.',
  },
])

const BENEFITS = JSON.stringify([
  'Cools and comforts a scalp straight after needling, at menthol 0.200%',
  'Conditions with panthenol and niacinamide at 0.100% each',
  'Carries the highest copper tripeptide concentration in the HR³ MATRIX range',
  'Formulated to stay in place on treated scalp rather than run off',
  'Dermatologically tested and non-irritant on patch test',
  'Sterile-by-design single-use vials, in professional and homecare kits',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'HAIR SOLUTION' } },
  })
  if (!product) throw new Error('Product 45 (HAIR SOLUTION) not found')

  console.log(`Updating id=${product.id} — ${product.name}`)
  console.log(`  size: ${product.size} → 4ml*8pcs  (both registered cartons say 4 ml)`)

  await prisma.product.update({
    where: { id: product.id },
    data: {
      size: '4ml*8pcs',
      description: DESCRIPTION,
      ingredients: INGREDIENTS,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
    },
  })

  const after = await prisma.product.findUnique({ where: { id: product.id } })
  console.log('\nsize now:', after?.size)
  console.log('\nRemoved: the 5α-reductase / DHT and angiogenesis mechanism, "prevents hair loss",')
  console.log('"promotes regrowth", "enhances blood circulation", the unlocated research-paper')
  console.log('claim, saw palmetto as a DHT botanical, and Sophora japonica — which is not in')
  console.log('this formula at all, it is in the hair tonic.')
  console.log('Added: the real doses, the missing 1,2-hexanediol in the INCI, the 1.2 ppm growth')
  console.log('factor total, the pregnancy and lactation warning, use-immediately-once-opened,')
  console.log('and the professional and homecare techniques.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
