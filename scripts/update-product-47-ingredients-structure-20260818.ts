/**
 * Product 47, HR³ MATRIX MESOPECIA KIT — store the ingredients in the same shape as
 * every other product, and fix the two siblings whose INCI is invisible on the site.
 *
 * TWO PROBLEMS, ONE ROOT CAUSE.
 *
 * 1. Product 47's ingredients were written as one plain string holding both INCI lists.
 *    Every other product stores an array of { name, description } entries, and the
 *    layouts parse it as JSON. A plain string parses to nothing, so the kit's INCI —
 *    which had just been transcribed off the carton to fill an empty field — would have
 *    rendered nowhere.
 *
 * 2. Products 45 and 46 DO store the array, but their INCI entry is named "Full
 *    ingredient list (INCI)" while every bespoke layout looks up the exact string
 *    "Full INCI". Both pages went live yesterday with their full ingredient list
 *    silently missing. A catalogue-wide check found these two and no others: 47 other
 *    products use the exact key and render correctly.
 *
 * The kit carries two liquids, so it gets two INCI entries rather than one, named with
 * a "Full INCI — <product>" prefix that its page looks up by prefix and substring.
 *
 * Source for both lists is the registration artwork,
 * `Registration DOC/Artwork/[GENOSYS]HAIR MATRIX MESOPECIA KIT.pdf`, transcribed in the
 * order printed. Concentrations in the summary entries come from the audits of products
 * 46 and 45.
 *
 * Run: npx tsx --env-file=.env.local scripts/update-product-47-ingredients-structure-20260818.ts
 */

import { prisma } from '../lib/prisma'

const PEELING_INCI =
  'Aqua (Water), Alcohol Denat., Propylene Glycol, PEG-60 Hydrogenated Castor Oil, Copper Tripeptide-1, '
  + 'Serenoa Serrulata Fruit Extract, Camellia Sinensis Leaf Extract, Cnidium Officinale Root Extract, Menthol, '
  + 'Salicylic Acid, Glycine Max (Soybean) Seed Extract, Oryza Sativa (Rice) Extract, Angelica Gigas Extract, '
  + 'Rheum Palmatum Root Extract, Ribes Nigrum (Black Currant) Fruit Extract, Perilla Frutescens Extract, '
  + 'Rubus Fruticosus (Blackberry) Fruit Extract, Nigella Sativa Seed Extract, Hordeum Vulgare Extract, '
  + 'Lepidium Meyenii Root Extract, Allium Sativum (Garlic) Bulb Extract, Cucurbita Pepo (Pumpkin) Fruit Extract, '
  + 'Sesamum Indicum (Sesame) Seed Extract, Butylene Glycol, 1,2-Hexanediol, Menthyl Lactate, Phenoxyethanol, '
  + 'Chlorphenesin, Betaine, Disodium EDTA.'

const SOLUTION_INCI =
  'Water, Propylene Glycol, 1,2-Hexanediol, PEG-40 Hydrogenated Castor Oil, Copper Tripeptide-1, '
  + 'Brassica Oleracea Italica (Broccoli) Extract, Serenoa Serrulata Fruit Extract, sh-Polypeptide-7, '
  + 'sh-Oligopeptide-1, sh-Polypeptide-71, sh-Polypeptide-9, Panthenol, Biosaccharide Gum-4, Glycerin, Lecithin, '
  + 'Houttuynia Cordata Extract, Sesamum Indicum (Sesame) Seed Extract, Rubus Fruticosus (Blackberry) Fruit Extract, '
  + 'Ribes Nigrum (Black Currant) Fruit Extract, Oryza Sativa (Rice) Extract, Nigella Sativa Seed Extract, '
  + 'Lepidium Meyenii Root Extract, Hordeum Vulgare Extract, Glycine Soja (Soybean) Seed Extract, '
  + 'Glycine Max (Soybean) Seed Extract, Allium Sativum (Garlic) Bulb Extract, Niacinamide, Menthol, Carbomer, '
  + 'Butylene Glycol, Triethanolamine, Citric Acid, Polysorbate 60, Phenoxyethanol, Sodium Citrate, '
  + 'Dipropylene Glycol.'

const KIT_INGREDIENTS = JSON.stringify([
  {
    name: 'Scalp Peeling α — alcohol denat. 33.600%',
    description:
      'A third of the 100 ml bottle, working with propylene glycol at 11.994% to cut scalp oil and product '
      + 'build-up in seconds. This is what leaves clean skin for the stamp, and it is also why the peeling is '
      + 'not a gentle product. Flammable at this concentration.',
  },
  {
    name: 'Scalp Peeling α — menthol 0.900% with menthyl lactate 0.800%',
    description:
      '1.7% of cooling agents between them, the highest total in any GENOSYS product, going onto a scalp that '
      + 'has just had its oil stripped off. Expect it to be cold.',
  },
  {
    name: 'Scalp Peeling α — salicylic acid 99 ppm',
    description:
      'On the label, and nowhere near a keratolytic dose — the HR³ MATRIX Hair Tonic carries it at 0.250%, '
      + 'twenty-five times more. The alcohol and the glycol do the cleaning here.',
  },
  {
    name: 'Hair Solution α — four growth factors, 1.2 ppm in total',
    description:
      'sh-Polypeptide-7 and sh-Polypeptide-9 at 0.5 ppm each, sh-Oligopeptide-1 at 0.15 ppm and '
      + 'sh-Polypeptide-71 at 0.05 ppm. Named individually on the carton, so the total is worth stating: a '
      + 'customer cannot add them up from the label.',
  },
  {
    name: 'Hair Solution α — copper tripeptide-1 5 ppm',
    description:
      'The one measure on which this liquid leads the range: five parts per million against 1 ppm in the hair '
      + 'tonic and 5 parts per billion in the peeling packed beside it.',
  },
  {
    name: 'Hair Solution α — the carrier: propylene glycol 9.995% with carbomer 0.450%',
    description:
      'On a liquid meant to be needled in, the carrier is the product. Nearly 10% propylene glycol with a '
      + 'solubiliser carries it, and 0.450% of carbomer thickens it just enough to stay on the parting rather '
      + 'than running off the scalp.',
  },
  {
    name: 'Hair Solution α — niacinamide 0.100% and panthenol 0.100%',
    description: 'The two conditioning ingredients present at a working concentration rather than at trace.',
  },
  {
    name: 'Full INCI — Scalp Peeling α',
    description: PEELING_INCI,
  },
  {
    name: 'Full INCI — Hair Solution α',
    description: SOLUTION_INCI,
  },
])

async function main() {
  const kit = await prisma.product.findUnique({ where: { id: '47' } })
  if (!kit) throw new Error('product 47 not found')

  await prisma.product.update({
    where: { id: '47' },
    data: { ingredients: KIT_INGREDIENTS },
  })

  // The sibling fix: rename the INCI entry so the accordion the two pages already
  // render actually finds it.
  const renamed: string[] = []
  for (const id of ['45', '46']) {
    const p = await prisma.product.findUnique({ where: { id } })
    if (!p?.ingredients) continue
    const list = JSON.parse(p.ingredients) as Array<{ name?: string; description?: string }>
    if (!list.some(i => i?.name === 'Full ingredient list (INCI)')) continue

    const fixed = list.map(i =>
      i?.name === 'Full ingredient list (INCI)' ? { ...i, name: 'Full INCI' } : i
    )
    await prisma.product.update({ where: { id }, data: { ingredients: JSON.stringify(fixed) } })
    renamed.push(`${id} ${p.name}`)
  }

  const after = await prisma.product.findUnique({ where: { id: '47' } })
  const names = (JSON.parse(after?.ingredients || '[]') as Array<{ name?: string }>).map(i => i.name)
  console.log('47 ingredient entries:', names.length)
  console.log('47 INCI entries      :', names.filter(n => n?.startsWith('Full INCI')))
  console.log('renamed to "Full INCI":', renamed.length ? renamed : 'none needed')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
