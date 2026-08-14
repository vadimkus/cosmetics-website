/**
 * Claims fix for POWER SOLUTION CVS (product 5), 14 Aug 2026.
 *
 * Audited against the Intertek dossier:
 *
 *   Registration DOC/SA/SA-GENOSYS POWER SOLUTION CVS.pdf
 *       QACS Athens, amendment I, Jan 2021. Full quantitative composition with
 *       raw-material breakdown. This is the current formula.
 *   Registration DOC/Formula/Formula-GENOSYS POWER SOLUTION CVS.pdf
 *       Qualitative INCI, signed Narae Han, R&D manager.
 *   Registration DOC/Artwork/[GENOSYS]POWER SOLUTION CVS.pdf
 *       Carton text in EN/KR/RU/AR/TR/FR/DE.
 *   Registration DOC/COA/COA-GENOSYS POWER SOLUTION CVS(L1036B).pdf
 *       Lot L1036B, tested 2 Dec 2024.
 *
 * The 2011 quali-quanti sheet in Intertek_folder is a SUPERSEDED formula - it
 * has beta-glucan at 2.5% and no ethylhexylglycerin, lysine, artemisia princeps
 * or lactobacillus ferment lysate filtrate. Every figure below comes from the
 * 2021 safety assessment, which matches the current INCI line for line.
 *
 * WHAT WAS WRONG
 *
 * 1. sh-Polypeptide-7 was described as an "IGF-1-analog peptide". It is not.
 *    Both the safety assessment and the carton describe it as a recombinant
 *    human peptide built to the structure of somatotropin, produced by
 *    microbial fermentation. COSING lists it as a skin protectant. The IGF-1
 *    attribution is simply a different ingredient (sh-Oligopeptide-2).
 *    The carton's own framing - "the same structure and function as human
 *    growth hormone ... to stimulate tissue repair" - is not repeated either.
 *    It is drug-register for a cosmetic sold here, and it alarms more shoppers
 *    than it convinces.
 *
 * 2. 1,2-Hexanediol was missing from the full INCI, at 2.119% the fifth largest
 *    thing in the vial. The carton lists it. Restored in position.
 *
 * 3. Drug-register claims throughout: "promote optimal healing and skin
 *    regeneration", "accelerates skin recovery and regeneration processes",
 *    "promotes healthy cell turnover", "promotes cell renewal", "enhanced skin
 *    regeneration and protection". All reworded to what a cosmetic may say.
 *
 * 4. The carton's own precaution - "Avoid use during pregnancy/lactation" - was
 *    nowhere on the site. The safety assessment explains why: the artemisia
 *    extracts may carry eucalyptol and thujone. Added to `directions`.
 *
 * 5. "Hyaluronic Acid" was listed as an ingredient name. The INCI is Sodium
 *    Hyaluronate, which is what the carton prints.
 *
 * WHAT WAS MISSING, AND IS NOW SOLD
 *
 *   CVS = Concentrated Vitality Solution. Printed on the carton and on every
 *   vial. The site never said what the three letters stood for.
 *
 *   5-Free. Printed on the box front: paraben, ethanol, artificial pigment,
 *   artificial fragrance, artificial surfactant. All five verified against the
 *   INCI, and the safety assessment states "No parfum present in the formula".
 *
 *   The real doses. Butylene glycol 12.485% and glycerin 11.48% - nearly a
 *   quarter of the vial is humectant. Soy ferment 2.5%. Panthenol 0.5%.
 *   Sodium hyaluronate, hydrolyzed collagen and allantoin at 0.1% each.
 *
 *   Marine collagen. The hydrolyzed collagen is fish-derived.
 *
 *   The vial. Glass with a rubber crimp cap, filled to 2.05 ml against a 2 ml
 *   declaration, pH 5.94 on lot L1036B, and four named organisms not detected.
 *
 * Run:  npx tsx --env-file=.env.local scripts/fix-power-solution-cvs-5-claims-20260814.ts [--apply]
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma')
    ? ({ accelerateUrl: url } as any)
    : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--apply')

/** Exactly as the carton prints it, with 1,2-Hexanediol restored to position 5. */
const FULL_INCI =
  'Aqua (Water), Butylene Glycol, Glycerin, Lactobacillus/Soymilk Ferment Filtrate, ' +
  '1,2-Hexanediol, sh-Polypeptide-7, Palmitoyl Tripeptide-1, Panthenol, Sodium Hyaluronate, ' +
  'Hydrolyzed Collagen, Allantoin, Vitis Vinifera (Grape) Callus Culture Extract, Rosa ' +
  'Damascena Callus Culture Extract, Beta-Glucan, Lecithin, Sodium Phosphate, Sodium Chloride, ' +
  'Scutellaria Baicalensis Root Extract, Citrus Junos Fruit Extract, Camellia Sinensis Leaf ' +
  'Extract, Houttuynia Cordata Extract, Glycine, Ethylhexylglycerin, Disodium EDTA, Artemisia ' +
  'Vulgaris Extract, Artemisia Princeps Extract, Lysine, Lactobacillus Ferment Lysate Filtrate, ' +
  'Chamaecyparis Obtusa Water.'

const DESCRIPTION =
  'CVS stands for Concentrated Vitality Solution, and it is the ampoule the GENOSYS ' +
  'professional range reaches for when skin needs feeding rather than correcting. Nearly a ' +
  'quarter of the vial is humectant, carrying a soy ferment at 2.5%, panthenol at 0.5%, marine ' +
  'collagen and two callus culture extracts into skin that has just been opened up by a ' +
  'microneedling pass. Ten sealed glass vials, 5-Free and fragrance-free, made in Korea.'

const DESCRIPTION_RU =
  'CVS расшифровывается как Concentrated Vitality Solution — концентрированный раствор ' +
  'жизненной силы. Это та ампула профессиональной линии GENOSYS, к которой обращаются, когда ' +
  'коже нужно питание, а не коррекция. Почти четверть флакона — увлажняющая база, которая ' +
  'вносит соевый фермент 2,5%, пантенол 0,5%, морской коллаген и два экстракта каллусной ' +
  'культуры в кожу сразу после микронидлинга. Десять запаянных стеклянных флаконов, формула ' +
  '5-Free, без отдушки, произведено в Корее.'

const DESCRIPTION_AR =
  'يرمز CVS إلى Concentrated Vitality Solution، وهي الأمبولة التي تلجأ إليها مجموعة GENOSYS ' +
  'الاحترافية حين تحتاج البشرة إلى تغذية لا إلى تصحيح. ما يقارب ربع محتوى القارورة قاعدة ' +
  'مرطِّبة تحمل خميرة الصويا بنسبة 2.5% والبانثينول بنسبة 0.5% والكولاجين البحري ومستخلصَي ' +
  'كالوس نباتي إلى بشرة فتحتها للتو جلسة الوخز الدقيق. عشر قوارير زجاجية مُحكمة الإغلاق، ' +
  'بتركيبة 5-Free وخالية من العطور، صُنعت في كوريا.'

/** Four cards. Every figure is from the 2021 safety assessment. */
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
      'Butylene glycol at 12.5% and glycerin at 11.5% make up the body of the vial, which is what lets a 2 ml dose stay comfortable on skin that has just been needled.',
  },
  {
    title: 'Soothing ingredients at working doses',
    description:
      'Panthenol at 0.5%, allantoin at 0.1% and a soy ferment at 2.5% — real concentrations rather than a dusting for the label.',
  },
]

const BENEFITS = [
  'Feeds tired, dehydrated skin during and after a microneedling pass',
  'Leaves skin comfortable rather than tight, thanks to a 24% humectant base',
  'Panthenol and allantoin settle skin that has just been through a treatment',
  'Marine collagen and sodium hyaluronate hold water at the surface',
  'Fragrance-free and 5-Free, so there is less to react to on freshly treated skin',
  'Layers under any GENOSYS serum, or works on its own',
]

/** sh-Polypeptide-7 rewritten from the safety assessment. Palmitoyl
 *  Tripeptide-1 added: it was in the INCI but never explained. */
const INGREDIENTS = [
  {
    name: 'sh-Polypeptide-7',
    description:
      'A recombinant human peptide grown by microbial fermentation rather than extracted. COSING classifies it as a skin protectant, and it is the ingredient the Power Solution range is built around.',
  },
  {
    name: 'Palmitoyl Tripeptide-1',
    description:
      'A short signal peptide anchored to a fatty acid so it stays where it is put. One of the most studied peptides in cosmetic use.',
  },
  {
    name: 'Lactobacillus/Soymilk Ferment Filtrate (2.5%)',
    description:
      'Soymilk fermented with lactobacillus and filtered. At 2.5% it is the largest active in the vial and conditions the skin surface.',
  },
  {
    name: 'Panthenol (0.5%)',
    description:
      'Provitamin B5 at a full working dose. It holds water and settles skin that has just been treated.',
  },
  {
    name: 'Allantoin (0.1%)',
    description:
      'A classic comforting ingredient for skin that feels rough or reactive after a procedure.',
  },
  {
    name: 'Sodium Hyaluronate (0.1%)',
    description:
      'Holds many times its own weight in water at the skin surface, which is what keeps a treated face looking plump rather than drawn.',
  },
  {
    name: 'Hydrolyzed Collagen (0.1%)',
    description:
      'Marine collagen, broken down small enough to sit on the skin as a humectant film.',
  },
  {
    name: 'Grape and Rose Callus Culture Extracts',
    description:
      'Plant callus cultures from Vitis vinifera and Rosa damascena, grown in a lab rather than harvested. Both are antioxidant conditioning agents.',
  },
  {
    name: 'Green tea, yuzu, mugwort, houttuynia and baicalensis',
    description:
      'The Korean botanical tail of the formula. Present in small amounts and named in full on the carton.',
  },
  {
    name: 'Full INCI',
    description: FULL_INCI,
  },
]

/** The four steps illustrated on the carton, plus the two things a
 *  practitioner actually needs to know about a single-use glass vial. */
const HOW_TO_USE = [
  '1. Cleanse the face thoroughly and pat dry',
  '2. Snap open one vial — each 2 ml vial is a single use',
  '3. Apply the solution across the treatment area, during or straight after the microneedling pass',
  '4. Let it absorb, then follow with a post-treatment cream',
  '5. Use alone or layered under any GENOSYS serum',
  '6. Discard any solution left in an opened vial',
].join('\n')

const DIRECTIONS =
  'Dermatologically tested. For professional use, or at home only on the advice of your ' +
  'practitioner. External use only. Avoid contact with the eyes and mucous membranes, and rinse ' +
  'with cool water if contact occurs. Avoid use during pregnancy and while breastfeeding. ' +
  'Contains marine collagen, so avoid it if you are allergic to fish. Stop use and speak to a ' +
  'doctor if redness, swelling or irritation occurs. Store in a cool, dry place out of direct ' +
  'sunlight and out of reach of children.'

const PRODUCT_DETAILS = {
  form: 'Concentrated solution in a sealed 2 ml glass vial',
  size: '2ml x 10ea',
  target: 'Tired, dull and dehydrated skin, during and after microneedling',
  technology: 'Recombinant peptides and a soy ferment carried in a 24% humectant base',
  keyBenefits: 'Nourishment, hydration, comfort after treatment',
  usage: 'Professional microneedling treatments and post-treatment care',
  skinType: 'All skin types',
  application: 'Apply during or immediately after the microneedling pass; layers under any GENOSYS serum',
  professionalUse: 'Licensed practitioners, or home use on a practitioner’s advice',
  packaging: 'Glass vial, rubber crimp cap, 10 vials to a carton',
  ph: '5.94 on lot L1036B, against a 6.00 ± 1.00 specification',
  fill: '2.05 ml measured against a 2 ml declaration',
  freeFrom: 'Parabens, ethanol, artificial pigment, artificial fragrance, artificial surfactant',
  origin: 'South Korea',
}

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
    ingredients: JSON.stringify(INGREDIENTS),
    howToUse: HOW_TO_USE,
    directions: DIRECTIONS,
    productDetails: JSON.stringify(PRODUCT_DETAILS),
  }

  if (!APPLY) {
    console.log('DRY RUN — pass --apply to write\n')
    for (const [k, v] of Object.entries(data)) {
      console.log(`--- ${k} ---`)
      console.log(v)
      console.log()
    }
    return
  }

  await prisma.product.update({ where: { id: product.id }, data })
  console.log(`updated product ${product.id} (${product.name})`)
}

main()
  .catch(e => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
