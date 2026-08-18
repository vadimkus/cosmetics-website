/**
 * Product 47 — HR³ MATRIX MESOPECIA KIT: correct the record against the dossier.
 *
 * The kit is products 46 and 45 plus a stamp, and its record still carried every claim that was
 * removed from those two when they were audited:
 *
 *   - "5α-reductase inhibition to suppress DHT conversion"  → a drug mechanism
 *   - "promotes angiogenesis for new hair growth"            → a drug mechanism
 *   - "prevent hair loss and promote healthy hair regrowth"  → owner decision: no hair-loss claims
 *   - "HAIR SOLUTION (5ml x 6 vials)"                        → the vials are 4ml
 *
 * Source for every figure below is the registration artwork,
 * Registration DOC/Artwork/[GENOSYS]HAIR MATRIX MESOPECIA KIT.pdf, which carries the declared
 * functions, the full INCI for both liquids, the kit contents line and the application steps.
 * The declared functions there are "Scalp Refresher" for the peeling and "Nutrition Supply, Hair
 * Conditioning" for the solution — not hair-loss treatment.
 *
 * Concentrations come from the audits already done on products 45 and 46.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-47-mesopecia-kit-record-20260818.ts
 */
import { prisma } from '@/lib/prisma'

const DESCRIPTION = [
  'The professional microneedling set for the scalp: a 100 ml bottle of HR³ MATRIX SCALP PEELING α,',
  'six 4 ml vials of HR³ MATRIX HAIR SOLUTION α, and a 0.5 mm GENOSYS stamp. The peeling clears the',
  'scalp and cools it, the stamp opens the way, and the solution goes in behind it.',
  '',
  'Korea registers the peeling as a scalp refresher and the solution for nutrition supply and hair',
  'conditioning. Neither is registered as a hair-loss treatment, and nothing here is a substitute for',
  'seeing a doctor about hair loss.',
].join(' ')

const KEY_FEATURES = [
  {
    title: 'HR³ MATRIX SCALP PEELING α — 100 ml',
    description:
      'Denatured alcohol at 33.6% with 1.7% total cooling agents, of which 0.900% is menthol. It clears '
      + 'oil and loose flakes and leaves the scalp cold. Not a gentle peel and not a disinfectant — the '
      + 'salicylic acid sits at 99 ppm, far below a keratolytic dose.',
  },
  {
    title: 'HR³ MATRIX HAIR SOLUTION α — 4 ml × 6 vials',
    description:
      'Four growth factors totalling 1.2 ppm, copper tripeptide-1 at 5 ppm, plus panthenol and niacinamide '
      + 'in a propylene glycol carrier. Built to be driven in by the stamp rather than rubbed on. Use a vial '
      + 'immediately once opened.',
  },
  {
    title: 'GENOSYS STAMP — 0.5 mm',
    description:
      'The needle depth that makes the set a microneedling protocol rather than two topicals. Do not use it '
      + 'if you have a metal allergy, keloid-prone skin or any active dermatitis.',
  },
]

const BENEFITS = [
  'Three steps in one box — clear the scalp, open the way, apply the solution',
  'Six 4 ml vials, enough for a course of sessions rather than a single treatment',
  '0.5 mm stamp included, so the solution is delivered rather than left on the surface',
  'The same two liquids sold on their own as products 46 and 45, at the sizes the protocol uses',
  'Full INCI for both liquids printed on the carton and listed below',
]

const PRODUCT_DETAILS = {
  form: 'Three-part scalp microneedling set',
  size: 'Peeling 100 ml · Solution 4 ml × 6 vials · Stamp 0.5 mm',
  declaredFunction: 'Peeling: scalp refresher. Solution: nutrition supply, hair conditioning.',
  protocol:
    'Rub the peeling into the area with a swab, dry the scalp and hair, part the hair with a comb and '
    + 'stamp directly on the scalp, applying the solution from the dropper as you go, then massage gently.',
  keyFigures:
    'Peeling: 33.6% alcohol, 0.900% menthol, salicylic acid 99 ppm, copper tripeptide-1 5 ppb. '
    + 'Solution: growth factors 1.2 ppm total, copper tripeptide-1 5 ppm.',
  precautions:
    'External use only. Keep away from the eyes and mucous membranes; rinse with cool water on contact. '
    + 'Stop and see a doctor if redness, swelling or irritation appears. Do not use the stamp with a metal '
    + 'allergy, keloid-prone skin or any dermatitis. Use each vial immediately after opening. The peeling is '
    + 'alcohol-heavy and flammable — keep it away from flame. Keep out of reach of children.',
  origin: 'South Korea — DTS MG Co., Ltd.',
}

// Both lists transcribed from the carton artwork, in declared order.
const INGREDIENTS = [
  'SCALP PEELING α: Aqua (Water), Alcohol Denat., Propylene Glycol, PEG-60 Hydrogenated Castor Oil, '
  + 'Copper Tripeptide-1, Serenoa Serrulata Fruit Extract, Camellia Sinensis Leaf Extract, Cnidium Officinale '
  + 'Root Extract, Menthol, Salicylic Acid, Glycine Max (Soybean) Seed Extract, Oryza Sativa (Rice) Extract, '
  + 'Angelica Gigas Extract, Rheum Palmatum Root Extract, Ribes Nigrum (Black Currant) Fruit Extract, Perilla '
  + 'Frutescens Extract, Rubus Fruticosus (Blackberry) Fruit Extract, Nigella Sativa Seed Extract, Hordeum '
  + 'Vulgare Extract, Lepidium Meyenii Root Extract, Allium Sativum (Garlic) Bulb Extract, Cucurbita Pepo '
  + '(Pumpkin) Fruit Extract, Sesamum Indicum (Sesame) Seed Extract, Butylene Glycol, 1,2-Hexanediol, Menthyl '
  + 'Lactate, Phenoxyethanol, Chlorphenesin, Betaine, Disodium EDTA.',
  '',
  'HAIR SOLUTION α: Water, Propylene Glycol, 1,2-Hexanediol, PEG-40 Hydrogenated Castor Oil, Copper '
  + 'Tripeptide-1, Brassica Oleracea Italica (Broccoli) Extract, Serenoa Serrulata Fruit Extract, '
  + 'sh-Polypeptide-7, sh-Oligopeptide-1, sh-Polypeptide-71, sh-Polypeptide-9, Panthenol, Biosaccharide '
  + 'Gum-4, Glycerin, Lecithin, Houttuynia Cordata Extract, Sesamum Indicum (Sesame) Seed Extract, Rubus '
  + 'Fruticosus (Blackberry) Fruit Extract, Ribes Nigrum (Black Currant) Fruit Extract, Oryza Sativa (Rice) '
  + 'Extract, Nigella Sativa Seed Extract, Lepidium Meyenii Root Extract, Hordeum Vulgare Extract, Glycine '
  + 'Soja (Soybean) Seed Extract, Glycine Max (Soybean) Seed Extract, Allium Sativum (Garlic) Bulb Extract, '
  + 'Niacinamide, Menthol, Carbomer, Butylene Glycol, Triethanolamine, Citric Acid, Polysorbate 60, '
  + 'Phenoxyethanol, Sodium Citrate, Dipropylene Glycol.',
].join('\n')

async function main() {
  const before = await prisma.product.findUnique({ where: { id: '47' } })
  if (!before) throw new Error('product 47 not found')

  await prisma.product.update({
    where: { id: '47' },
    data: {
      size: 'Peeling 100ml · Solution 4ml x 6 · Stamp 0.5mm',
      description: DESCRIPTION,
      benefits: JSON.stringify(BENEFITS),
      keyFeatures: JSON.stringify(KEY_FEATURES),
      productDetails: JSON.stringify(PRODUCT_DETAILS),
      ingredients: INGREDIENTS,
    },
  })

  const after = await prisma.product.findUnique({ where: { id: '47' } })
  const banned = ['5α-reductase', 'DHT', 'angiogenesis', 'regrowth', 'prevent hair loss', '5ml']
  const blob = [after?.description, after?.benefits, after?.keyFeatures, after?.productDetails, after?.size]
    .join(' ')
    .toLowerCase()
  const stillThere = banned.filter(t => blob.includes(t.toLowerCase()))

  console.log('size:        ', after?.size)
  console.log('ingredients: ', after?.ingredients ? `${after.ingredients.length} chars` : 'EMPTY')
  console.log('claims that should be gone:', stillThere.length ? stillThere : 'none')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
