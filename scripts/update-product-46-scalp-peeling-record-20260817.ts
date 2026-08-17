/**
 * Correct the database record for product 46, HR³ MATRIX SCALP PEELING α.
 *
 * Sources: signed DTS MG formula, safety assessment QACS 22 06 00966 (study period
 * July 2022), the older assessment under the CSP CLINICAL SCALP PEELING name, COA lot
 * WNL088, and the DTS MG deck. The registered artwork PDF has no text layer, so panel
 * wording could not be read from it; nothing here is attributed to the carton.
 *
 * WHAT WAS WRONG
 *
 * 1. THE WORD "GENTLE", THREE TIMES. The record called this "a gentle scalp peeling
 *    solution" with "gentle exfoliating" and "Gentle Scalp Exfoliation". A solution
 *    that is 33.60% denatured alcohol with 1.70% combined cooling agents is not
 *    gentle, and telling someone it is before they rub it into their scalp with a swab
 *    is the wrong way round.
 *
 * 2. NOTHING DISCLOSED THE ALCOHOL. Alcohol denat. at 33.600% is the second
 *    ingredient and a third of the bottle. It appeared nowhere in our copy.
 *
 * 3. SALICYLIC ACID WAS PRESENTED AS THE LEAD EXFOLIANT. It is at 0.00990%, which is
 *    99 ppm — about a twenty-fifth of the hair tonic's 0.250% and far below any
 *    keratolytic dose. The cleansing here is done by the alcohol and the propylene
 *    glycol at 11.994%, not by the acid.
 *
 * 4. COPPER TRIPEPTIDE-1 WAS LISTED AS A KEY INGREDIENT at 0.0000005%, which is five
 *    parts per BILLION — the lowest concentration of anything in the entire HR³
 *    MATRIX range. Green tea was listed too, at 0.5 ppm.
 *
 * 5. "DISINFECTING PROPERTIES". The DTS MG deck claims the product "disinfects the
 *    treatment area". Alcohol generally needs around 60-70% to work as an antiseptic;
 *    this is 33.6%. Removed rather than repeated.
 *
 * 6. "ENHANCED BLOOD CIRCULATION - Stimulates blood flow to hair follicles" and
 *    "Anti-Inflammatory Action". Physiological and therapeutic claims, traceable to
 *    the deck's camellia and Black Complex slides. Removed.
 *
 * 7. THE INCI LIST OMITTED 1,2-HEXANEDIOL, which sits between butylene glycol and
 *    menthyl lactate in the formula. Same class of omission as product 45.
 *
 * The deck also repeats the 5α-reductase / DHT, angiogenesis, anagen-follicle and
 * dermal-papilla claims on its copper tripeptide and saw palmetto slides — for
 * ingredients present here at 5 ppb and 0.1 ppm respectively. That makes six
 * documents in this line asserting a prescription-drug mechanism.
 *
 * WHAT THIS PRODUCT ACTUALLY IS, and how the record now reads: a scalp prep solution.
 * It strips oil, sweat and product build-up off the scalp with alcohol and glycol so
 * that whatever comes next meets clean skin — in practice the Hair Solution ampoule,
 * needled in. It is applied on a cotton swab and rubbed in firmly, section by
 * section, and it is not rinsed off. That is a real and useful product. It is not a
 * gentle exfoliating treatment.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-46-scalp-peeling-record-20260817.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION = [
  '100 ml scalp prep solution. A third of the bottle is denatured alcohol — 33.600% — with propylene glycol at 11.994% and a castor oil solubiliser at 2%. That combination is what does the work: it cuts through scalp oil, sweat and product build-up so that whatever goes on next meets clean skin. In the HR³ MATRIX system, what goes on next is the Hair Solution ampoule, needled in.',
  'Then the cooling, which is the most of any GENOSYS product by total: menthol at 0.900% with menthyl lactate at 0.800%, 1.7% between them. On a scalp that has just been degreased, that is a strong sensation.',
  'Applied on a cotton swab and rubbed in firmly, section by section, and not rinsed off. Transparent liquid, batch pH 4.31, and it passes stability at 50 °C.',
  'Two things worth being straight about, because the label leads on both. The salicylic acid is at 0.00990%, which is 99 parts per million — roughly a twenty-fifth of the dose in the HR³ MATRIX Hair Tonic, and not enough to exfoliate anything; the alcohol is doing that. And the copper tripeptide-1 is at 0.0000005%, five parts per billion, the lowest concentration of anything in the range.',
].join(' ')

const INGREDIENTS = JSON.stringify([
  {
    name: 'Alcohol denat. 33.600%',
    description:
      'A third of the bottle, and the reason the product works. It dissolves sebum and product residue on contact and flashes off in seconds, which is exactly what you want before needling but is also the reason this is not a gentle formula. It carries a bittering agent, denatonium benzoate, so the denatured alcohol cannot be drunk.',
  },
  {
    name: 'Propylene glycol 11.994%',
    description:
      'Nearly a eighth of the bottle. It works with the alcohol to lift oil-soluble build-up, and it slows the evaporation just enough that the solution stays wet long enough to be rubbed across a section.',
  },
  {
    name: 'Menthol 0.900% with menthyl lactate 0.800%',
    description:
      '1.7% of combined cooling agents, which is the highest total in any GENOSYS product. The hair tonic runs 0.380% and the shampoo 1.200%. Expect it to be cold, and expect it to be noticeable on freshly degreased scalp.',
  },
  {
    name: 'PEG-60 hydrogenated castor oil 2.000%',
    description:
      'The solubiliser, and what keeps a formula that is a third alcohol and a third water from separating.',
  },
  {
    name: 'Betaine 0.100%',
    description:
      'The only humectant in the formula, and a small counterweight to 33.6% alcohol. Present, but do not expect it to make this a hydrating step.',
  },
  {
    name: 'Salicylic acid 0.00990%',
    description:
      'Ninety-nine parts per million. Salicylic acid is a genuine keratolytic at working concentrations, and this is not one — the HR³ MATRIX Hair Tonic carries it at 0.250%, twenty-five times more. It is on the label; it is not what exfoliates your scalp here.',
  },
  {
    name: 'Camellia sinensis (green tea) leaf extract 0.00005%',
    description: 'Half a part per million. Named on the label, present at trace.',
  },
  {
    name: 'Copper tripeptide-1 0.0000005%',
    description:
      'Five parts per billion — the lowest concentration of any ingredient anywhere in the HR³ MATRIX range. For scale, the Hair Solution ampoule in the same line carries it at a thousand times this. It appears high on the ingredient list because of the manufacturer\u2019s sequence, not because of how much is in the bottle.',
  },
  {
    name: 'Sixteen botanicals at 0.1 ppm each',
    description:
      'Saw palmetto, cnidium, angelica, rheum, perilla, pumpkin and the nine so-called Black Complex extracts — rice, sesame, soybean, barley, blackberry, black currant, garlic, maca and nigella. All at 0.00001%. Named for completeness rather than as active ingredients.',
  },
  {
    name: 'Preservation: phenoxyethanol 0.200% with chlorphenesin 0.150%',
    description:
      'Backed by the alcohol itself. Note this replaces an older version of the formula that used methylparaben and iodopropynyl butylcarbamate — the current formula contains neither.',
  },
  {
    name: 'Full ingredient list (INCI)',
    description:
      'Aqua (Water), Alcohol Denat., Propylene Glycol, PEG-60 Hydrogenated Castor Oil, Copper Tripeptide-1, Serenoa Serrulata Fruit Extract, Camellia Sinensis Leaf Extract, Cnidium Officinale Root Extract, Menthol, Salicylic Acid, Glycine Max (Soybean) Seed Extract, Oryza Sativa (Rice) Extract, Angelica Gigas Extract, Rheum Palmatum Root Extract, Ribes Nigrum (Black Currant) Fruit Extract, Perilla Frutescens Extract, Rubus Fruticosus (Blackberry) Fruit Extract, Nigella Sativa Seed Extract, Hordeum Vulgare Extract, Lepidium Meyenii Root Extract, Allium Sativum (Garlic) Bulb Extract, Cucurbita Pepo (Pumpkin) Fruit Extract, Sesamum Indicum (Sesame) Seed Extract, Butylene Glycol, 1,2-Hexanediol, Menthyl Lactate, Phenoxyethanol, Chlorphenesin, Betaine, Disodium EDTA, t-Butyl Alcohol, Dipropylene Glycol, Denatonium Benzoate.',
  },
])

const PRODUCT_DETAILS = JSON.stringify({
  form: 'Transparent liquid scalp prep solution, applied on a swab and not rinsed off',
  size: '100 ml',
  registeredCategory: 'Hair care',
  whatItIsFor:
    'Degreasing and preparing the scalp before a microneedling treatment, so the ampoule that follows meets clean skin',
  alcohol: 'Alcohol denat. 33.600% — a third of the bottle. Flammable; let it dry before heat or styling tools',
  solvents: 'Propylene glycol 11.994%, PEG-60 hydrogenated castor oil 2.000%',
  cooling:
    'Menthol 0.900% with menthyl lactate 0.800% — 1.7% combined, the highest total of any GENOSYS product',
  humectant: 'Betaine 0.100%',
  salicylicAcid:
    '0.00990% (99 ppm). Not a keratolytic dose — for comparison the HR³ MATRIX Hair Tonic runs 0.250%',
  atTrace:
    'Green tea 0.5 ppm, sixteen botanicals at 0.1 ppm each, copper tripeptide-1 0.0000005% (5 ppb, the lowest in the range)',
  preservation: 'Phenoxyethanol 0.200%, chlorphenesin 0.150%, plus the alcohol',
  bittering: 'Denatonium benzoate, so the denatured alcohol cannot be consumed',
  pH: '4.00–5.00 (4.31 on the batch tested)',
  purity: 'Under 10 cfu/ml for bacteria and under 10 cfu/ml for moulds and yeasts, against 100 permitted for each',
  stability: 'Passes at 50 °C',
  fill: '100.33 ml against a 100 ml declaration',
  shelfLife: 'Three years unopened',
  testing:
    'Patch tested, non-irritant, by an independent laboratory — the assessor notes the volunteer numbers are not statistically significant. A use test on a panel of 20 subjects was also performed; no results for it are recorded in the documents we hold',
  usage:
    'Decant about 5 ml, dip a cotton swab, and rub firmly over the section being treated. Work section by section. Do not rinse',
  notFor:
    'Broken, sunburned or inflamed scalp. Keep away from the eyes. Not a disinfectant — 33.6% alcohol is below the concentration at which alcohol works as an antiseptic',
  keyBenefits:
    'Strips oil and build-up fast so a microneedling treatment starts on clean scalp, with a strong cooling finish',
  system: 'Also supplied inside the HR³ MATRIX Mesopecia Kit, before the Hair Solution ampoule',
  origin: 'Made in Korea',
})

const KEY_FEATURES = JSON.stringify([
  {
    title: 'A third of the bottle is alcohol',
    description:
      'Alcohol denat. at 33.600% with propylene glycol at 11.994%. That is what cuts scalp oil and product build-up in seconds. Effective, and not gentle.',
  },
  {
    title: 'The most cooling agent of any GENOSYS product',
    description:
      'Menthol 0.900% plus menthyl lactate 0.800% — 1.7% combined, against 1.200% in the scalp shampoo and 0.380% in the hair tonic.',
  },
  {
    title: 'A prep step, not a treatment',
    description:
      'Applied on a swab, rubbed in firmly section by section, and not rinsed. Its job is to leave clean scalp for the ampoule that follows.',
  },
  {
    title: 'Batch pH 4.31, passes 50 °C stability',
    description:
      'Transparent liquid, filled at 100.33 ml, under 10 cfu/ml for both bacteria and moulds, three-year unopened life.',
  },
])

const BENEFITS = JSON.stringify([
  'Removes scalp oil, sweat and product build-up quickly',
  'Leaves clean scalp for a microneedling treatment to follow',
  'A strong cooling finish, the highest total cooling agent in the range',
  'Dries in seconds and leaves no film',
  'Patch tested and non-irritant on an independent laboratory test',
])

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: { contains: 'SCALP PEELING' } },
  })
  if (!product) throw new Error('Product 46 (SCALP PEELING) not found')

  console.log(`Updating id=${product.id} — ${product.name}`)

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: DESCRIPTION,
      ingredients: INGREDIENTS,
      productDetails: PRODUCT_DETAILS,
      keyFeatures: KEY_FEATURES,
      benefits: BENEFITS,
    },
  })

  console.log('\nRemoved: "gentle" (three times), "disinfecting properties", "anti-inflammatory')
  console.log('action", "enhanced blood circulation", salicylic acid as the lead exfoliant, and')
  console.log('copper tripeptide-1 and green tea as key ingredients.')
  console.log('Added: alcohol denat. 33.600%, the 1.7% cooling total, salicylic acid at 99 ppm')
  console.log('with the comparison to the tonic, copper tripeptide-1 at 5 ppb, the swab')
  console.log('technique, not-rinsed-off, pH 4.31, the 20-subject use test, the denatonium')
  console.log('bittering agent, flammability, and the missing 1,2-hexanediol in the INCI.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
