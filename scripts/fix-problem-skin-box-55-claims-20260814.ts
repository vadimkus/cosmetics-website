/**
 * Problem Skin Care Beauty Box (#55) — claim corrections, 14 Aug 2026
 *
 * Verified against:
 *   GENOSYS FACIAL TREATMENT_Professional_2025.pptx  slides 25-34 (toner), 91-98 (mask),
 *                                                    16-20 (Snow O₂)
 *   GENOSYS FACIAL TREATMENT_Homecare_2025.pdf       Problem Control Serum + Intensive
 *                                                    Problem Control Cream sections
 *   Formula / COA / Artwork-GENOSYS INTENSIVE PROBLEM CONTROL TONER (200ml)
 *   Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf
 *   Ingredient lists_old/GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf
 *
 * What was CONFIRMED CORRECT and must not be stripped out
 *   "Anti Sebum P" and "SNOW ICE" are genuine DTS MG trade names, not invented copy.
 *   Professional deck slide 29 defines Anti Sebum P as a patented complex of Ulmus
 *   Davidiana root, Pueraria Lobata root, Oenothera Biennis flower and Pinus Palustris
 *   leaf — all four sit consecutively in the toner INCI. Slide 32 defines SNOW ICE as
 *   menthyl lactate, ethyl menthane carboxamide, methyl diisopropyl propionamide and
 *   caprylic/capric triglyceride, all likewise in the INCI. Both stay.
 *
 * What was wrong
 *   1. The cream is sold in a 50 g tube. Both the homecare deck ("Homecare - NET WT.
 *      50g", stated twice) and the product's own record say 50 g; only the box
 *      description said 50 ml.
 *   2. The box called the toner "Problem Control Toner". Every other source — the
 *      carton, the deck and the product record — calls it INTENSIVE PROBLEM CONTROL
 *      TONER. The routine label had lost "Intensive" the same way.
 *   3. "Snow O2" should carry the subscript used everywhere else in the catalogue.
 *   4. Product #30's copy claimed "powerful anti-microbial and anti-inflammatory
 *      properties" for the finished cream. Those are the documented actions of single
 *      ingredients (zinc PCA, the radish root ferment), not a tested property of the
 *      product, and antimicrobial reads as a drug claim on a cosmetic. Reworded to the
 *      manufacturer's own concept line, which is what the carton says.
 *   5. Product #36's ingredient card said "Witch Hazel Extract" where the INCI and the
 *      deck both say Hamamelis Virginiana (Witch Hazel) LEAF Extract. Same slip fixed
 *      in the box descriptions during the #56 pass; the card itself was missed.
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const accel = /^prisma(\+postgres)?:\/\//.test(url)
const prisma = new PrismaClient(accel ? { accelerateUrl: url } : ({ datasourceUrl: url } as never))

type Rule = { from: string; to: string; count: number }

const BOX_55: Rule[] = [
  {
    from: '4. Intensive problem control cream 50ml (1 pcs) = 290 AED',
    to: '4. Intensive Problem Control Cream 50g (1 pcs) = 290 AED',
    count: 1,
  },
  {
    from: '2. Problem Control Toner 200ml (1 pcs) = 260 AED',
    to: '2. Intensive Problem Control Toner 200ml (1 pcs) = 260 AED',
    count: 1,
  },
  { from: '1. Snow O2 180ml', to: '1. Snow O₂ 180ml', count: 1 },
  { from: '3. Problem control serum 30ml', to: '3. Problem Control Serum 30ml', count: 1 },
]

const CREAM_30: Rule[] = [
  {
    from:
      'INTENSIVE PROBLEM CONTROL CREAM is a specialized cream designed to address various skin concerns with powerful anti-microbial and anti-inflammatory properties. This advanced formula helps control sebum production while providing soothing relief for problematic skin.',
    to:
      'INTENSIVE PROBLEM CONTROL CREAM rebalances oily skin and helps prevent breakouts while keeping the skin hydrated. Zinc PCA holds sebum down, xylitol and panthenol hold moisture in, and allantoin and beta-glucan keep the whole thing calm enough for daily use on skin that is already irritated.',
    count: 1,
  },
]

const MASK_36: Rule[] = [
  { from: '"name":"Witch Hazel Extract"', to: '"name":"Witch Hazel Leaf Extract"', count: 1 },
]

function apply(field: string, value: string, rules: Rule[], label: string) {
  let out = value
  for (const r of rules) {
    const n = out.split(r.from).length - 1
    if (n !== r.count) {
      throw new Error(`${label}.${field}: expected ${r.count} of ${JSON.stringify(r.from.slice(0, 70))}, found ${n}`)
    }
    out = out.split(r.from).join(r.to)
  }
  return out
}

async function patch(lookup: string, rules: Rule[], fields: ('description' | 'ingredients' | 'benefits')[]) {
  const all = await prisma.product.findMany()
  const p = all.find(x => x.productNumber === lookup || x.id === lookup)
  if (!p) throw new Error(`product ${lookup} not found`)
  const data: Record<string, string> = {}
  for (const f of fields) {
    const before = (p[f] as string) || ''
    const after = apply(f, before, rules, `#${lookup}`)
    if (after !== before) data[f] = after
  }
  if (!Object.keys(data).length) {
    console.log(`#${lookup} ${p.name}: nothing to change`)
    return
  }
  await prisma.product.update({ where: { id: p.id }, data })
  console.log(`#${lookup} ${p.name}: updated ${Object.keys(data).join(', ')}`)
}

async function main() {
  await patch('55', BOX_55, ['description'])
  await patch('30', CREAM_30, ['description'])
  await patch('36', MASK_36, ['ingredients'])

  // #30 also carried the antimicrobial line as a standalone benefit bullet.
  const all = await prisma.product.findMany()
  const cream = all.find(x => x.productNumber === '30' || x.id === '30')
  if (cream?.benefits) {
    const list = JSON.parse(cream.benefits as string) as string[]
    const next = list.map(b =>
      b.startsWith('Anti-microbial')
        ? 'Clearer Skin - Helps prevent breakouts and rebalances oily areas'
        : b.startsWith('Anti-inflammatory')
          ? 'Calming - Soothes redness and comforts irritated skin'
          : b,
    )
    if (JSON.stringify(next) !== JSON.stringify(list)) {
      await prisma.product.update({ where: { id: cream.id }, data: { benefits: JSON.stringify(next) } })
      console.log('#30 benefits: updated')
    }
  }
}

main()
  .catch(e => {
    console.error(e.message)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
