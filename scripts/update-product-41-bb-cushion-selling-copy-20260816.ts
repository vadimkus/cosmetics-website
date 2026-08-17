/**
 * Product 41 — SKIN CARING BLEMISH BALM CUSHION.
 *
 * Brings the stored record in line with the dossier audit and the rebuilt
 * bespoke page. Three fixes, all of them claims the audit ruled out:
 *
 *   1. productDetails.technology said "60% moisture essence with 40% peptide
 *      complex". The named ingredients in the formula sum to ~73.6%, which
 *      puts water at about a quarter, and the nine peptides run 640 ppb down
 *      to 10 ppb. Neither half of that sentence survives the formula sheet.
 *   2. The Glutathione entry credited it with blocking tyrosinase and helping
 *      cystic acne. It is present at 100 ppm. Niacinamide 2% is the registered
 *      tone active and now carries that line instead.
 *   3. Adenosine 0.04% — the registered wrinkle active — was missing from the
 *      actives list entirely, so the page could not show it.
 *
 * The three descriptions are also rewritten to lead with what the cushion does
 * for the buyer rather than with the Korean licence, per the selling-tone rule.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-41-bb-cushion-selling-copy-20260816.ts
 */

import { prisma } from '../lib/prisma'

const DESCRIPTION_EN =
  'One press covers you, shields you and treats you. Even coverage that still reads as skin, ' +
  'SPF50+ PA++++ from five filters, niacinamide at a full 2% for tone and adenosine at 0.04% for ' +
  'fine lines — Korea licenses this cushion for all three at once. A second 15 g refill is already ' +
  'in the box, and the waterdrop puff carries a fourth waterproof layer so the formula stays in the ' +
  'cushion rather than in the sponge. Three shades — #01 Ivory, #02 Beige, #03 Camel — identical ' +
  'apart from the pigment.'

const DESCRIPTION_RU =
  'Одно нажатие: покрытие, защита и уход. Ровное покрытие, которое выглядит как кожа, SPF50+ PA++++ ' +
  'на пяти фильтрах, ниацинамид на полных 2% для тона и аденозин 0,04% для мелких морщин — Корея ' +
  'лицензирует этот кушон сразу для всех трёх задач. Сменный блок 15 г уже в коробке, а спонж-капля ' +
  'несёт четвёртый водонепроницаемый слой, поэтому формула остаётся в кушоне, а не в губке. Три ' +
  'оттенка — #01 Ivory, #02 Beige, #03 Camel — одинаковые во всём, кроме пигмента.'

const DESCRIPTION_AR =
  'ضغطة واحدة تغطّي وتحمي وتعتني. تغطية متجانسة تبدو كالبشرة، وحماية SPF50+ PA++++ بخمسة فلاتر، ' +
  'ونياسيناميد بنسبة 2% كاملة للون، وأدينوزين 0.04% للخطوط الدقيقة — وترخّص كوريا هذا الكوشن للثلاثة ' +
  'معاً. وتأتي عبوة احتياطية 15 غ داخل العلبة، وتحمل الإسفنجة على شكل قطرة الماء طبقة رابعة مقاومة ' +
  'للماء تُبقي التركيبة في الكوشن لا في الإسفنجة. ثلاث درجات — ٠١ آيفوري و٠٢ بيج و٠٣ كاميل — ' +
  'متطابقة باستثناء الصبغة.'

/** Every ingredient statement here traces to the Intertek formula sheets. */
const ACTIVES = [
  {
    name: 'Niacinamide 2%',
    description:
      'The registered tone active, at a full 2% — the same dose as the Multi Vita serum and cream. ' +
      'It evens tone and supports the barrier for as long as the cushion is on.',
  },
  {
    name: 'Adenosine 0.04%',
    description:
      'The registered wrinkle active, at the dose Korea licenses wrinkle-improvement claims on across ' +
      'the range. Real treatment under the coverage, not just colour.',
  },
  {
    name: 'Five UV filters',
    description:
      'Titanium dioxide 9% and zinc oxide 2% scatter the light; ethylhexyl methoxycinnamate 7%, ' +
      'ethylhexyl salicylate 4.5% and octocrylene 2% absorb it. Together they carry SPF50+ PA++++.',
  },
  {
    name: 'Three fixing polymers',
    description:
      'Trimethylsiloxysilicate, an acrylates/stearyl acrylate/dimethicone methacrylate copolymer and an ' +
      'acrylates/polytrimethylsiloxymethacrylate copolymer set a flexible film, which is what keeps the ' +
      'finish from moving in heat and humidity.',
  },
  {
    name: 'Repairing Pep9 Complex',
    description:
      'Nine peptides, the count Korea prints on the carton: Hexapeptide-9, Copper Tripeptide-1, ' +
      'Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-1, Hexapeptide-11, Tripeptide-1, ' +
      'Alanine/Histidine/Lysine Polypeptide Copper HCl, Acetyl Hexapeptide-8 and Nonapeptide-1. ' +
      'They are skin-conditioning ingredients at trace level; the registered actives are niacinamide ' +
      'and adenosine above.',
    subList: [
      'Hexapeptide-9',
      'Copper Tripeptide-1',
      'Palmitoyl Pentapeptide-4',
      'Palmitoyl Tripeptide-1',
      'Hexapeptide-11',
      'Tripeptide-1',
      'Alanine/Histidine/Lysine Polypeptide Copper HCl',
      'Acetyl Hexapeptide-8',
      'Nonapeptide-1',
    ],
  },
  {
    name: 'Glutathione',
    description:
      'An antioxidant, present at trace level alongside the peptides. The tone work in this formula is ' +
      'done by niacinamide at 2%.',
  },
]

async function main() {
  const product = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '41' }, { id: '41' }] },
  })
  if (!product) throw new Error('product 41 not found')

  const existing = JSON.parse(product.ingredients || '[]') as Array<{ name?: string; description?: string }>
  const fullInci = existing.find(i => i?.name === 'Full INCI')
  if (!fullInci) throw new Error('Full INCI entry missing — refusing to overwrite the ingredient list')

  const productDetails = JSON.parse(product.productDetails || '{}') as Record<string, string>
  productDetails.technology =
    'Five hybrid UV filters carrying SPF50+ PA++++, with niacinamide 2% and adenosine 0.04%'
  productDetails.size = '15 g cushion plus a 15 g refill (30 g in total)'
  productDetails.availableColors = '#01 Ivory, #02 Beige, #03 Camel'
  productDetails.colorNote =
    'Only the pigment changes between the three. The sun protection and the skincare are identical.'

  await prisma.product.update({
    where: { id: product.id },
    data: {
      description: DESCRIPTION_EN,
      descriptionRu: DESCRIPTION_RU,
      descriptionAr: DESCRIPTION_AR,
      productDetails: JSON.stringify(productDetails),
      ingredients: JSON.stringify([...ACTIVES, fullInci]),
    },
  })

  console.log('Product 41 updated:')
  console.log('  description  ->', DESCRIPTION_EN.slice(0, 70), '…')
  console.log('  technology   ->', productDetails.technology)
  console.log('  actives      ->', ACTIVES.map(a => a.name).join(', '))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
