/**
 * Skin Brightening Beauty Box (#56) — claim corrections, 14 Aug 2026
 *
 * Verified against:
 *   Formula-GENOSYS MULTI VITA RADIANCE SERUM.pdf            (DTS MG, signed)
 *   COA-GENOSYS MULTI VITA RADIANCE SERUM 30ml.pdf           (Hankook, lots M06I09 / N12J16)
 *   Ingredient list-GENOSYS MULTI VITA RADIANCE CREAM.pdf    (Winnova)
 *   COA-GENOSYS MULTI VITA RADIANCE CREAM(WJD028).pdf        (niacinamide assay 2.04%)
 *   SA-GENOSYS MULTI VITA RADIANCE CREAM.pdf                 (QACS — VITA12SOME trade name)
 *   SA-GENOSYS EPI TURNOVER BOOSTING PEELING GEL.pdf         (QACS — IndiMultiEx Desert Complex)
 *   Ingredient_Report_GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf
 *   GENOSYS FACIAL TREATMENT_Homecare_2025.pdf pp. 35-50, 95-105
 *
 * What was wrong
 *   1. The cream paragraph was a verbatim copy of the serum paragraph. The cream contains
 *      no MELAZERO, no 3-O-ethyl ascorbic acid and no glutathione, and its panthenol is
 *      0.1 ppm against the serum's 1%, so "panthenol-rich" is false for it. The Russian and
 *      Arabic records were already corrected; only English still carried the copy.
 *   2. Cream size given as 50ml. Every document says 50g by weight.
 *   3. Peeling gel size given as 100ml. Carton and COA both say 100g.
 *   4. Peeling gel: "Hyaluronic Acid" — the formula has Sodium Hyaluronate.
 *   5. Peeling gel: "Moringa Pterygosperma" is the deck's botanical synonym. The label INCI,
 *      the formula and the safety assessment all say Moringa Oleifera.
 *   6. Sea algae mask: "Custanea Crenata" is a typo that originates in the DTS MG training
 *      manual, which contradicts its own INCI list eight lines earlier. Correct spelling is
 *      Castanea Crenata (Chestnut) Shell Extract. Same manual also drops "Leaf" from
 *      Hamamelis Virginiana (Witch Hazel) Leaf Extract.
 *   7. "Anti-inflammatory Herb Complex" is a description, not the supplier name. The deck
 *      names it U-active(R)P10, six herbal extracts plus four isolated actives.
 *
 * Boxes 55 and 56 both carry the sea algae paragraph, so both get items 6.
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const accel = /^prisma(\+postgres)?:\/\//.test(url)
const prisma = new PrismaClient(accel ? { accelerateUrl: url } : ({ datasourceUrl: url } as never))

type Rule = { from: string; to: string; count: number }

const BOX_56: Rule[] = [
  // 2 + 1: cream size and the wholesale rewrite of the cream paragraph
  {
    from: `4. Multi Vita Radiance Cream 50ml (1pcs) = 290 AED
Skin brightening cream with multi vitamins and patented melanin care complex, MELAZERO®. It helps even skin tone, revive skin's natural brightness and radiance with multi vitamins and patented melanin care complex, MELAZERO®. It gives skin a natural glow by forming a moisturizing barrier thanks to panthenol-rich formula. Key ingredients: 3-O-Ethyl Ascorbic Acid (derivative of pure vitamin C), VITA 12 Complex, MELAZERO®, Panthenol, Niacinamide, Glutathione, Gluconolactone (PHA), Anti-inflammatory Herb Complex.`,
    to: `4. Multi Vita Radiance Cream 50g (1pcs) = 290 AED
Multi-vitamin brightening cream with astaxanthin and the VITA 12 Complex. It helps even skin tone and revive skin's natural brightness while it nourishes and hydrates deeply, and it seals that work in behind a ceramide-supported barrier. Key ingredients: Astaxanthin, Ascorbic Acid, VITA 12 Complex, Niacinamide, Gluconolactone (PHA), Licorice, Ceramide NP, Squalane, Panthenol.`,
    count: 1,
  },
  // 7: supplier name for the herb complex, on the serum line
  {
    from: `Gluconolactone (PHA), Anti-inflammatory Herb Complex.`,
    to: `Gluconolactone (PHA), U-active®P10 anti-inflammatory herb complex.`,
    count: 1,
  },
  // 3, 4, 5: peeling gel
  { from: `5. EPI Turnover Boosting Peeling Gel 100ml (1pcs) = 250 AED`, to: `5. EPI Turnover Boosting Peeling Gel 100g (1pcs) = 250 AED`, count: 1 },
  { from: `Moringa Pterygosperma Seed Extract, Hyaluronic Acid,`, to: `Moringa Oleifera Seed Extract, Sodium Hyaluronate,`, count: 1 },
  // sheet count and weight on the mask line
  { from: `6. Soothing Bomb Sea Algae Mask (1pcs) = 36 AED`, to: `6. Soothing Bomb Sea Algae Mask 25g (1pcs) = 36 AED`, count: 1 },
]

// 6: the training-manual typos, present in both boxes that stock this mask
const SEA_ALGAE: Rule[] = [
  { from: `Hamamelis Virginiana (Witch Hazel) Extract, Custanea Crenata Shell Extract`, to: `Hamamelis Virginiana (Witch Hazel) Leaf Extract, Castanea Crenata (Chestnut) Shell Extract`, count: 1 },
]

function apply(text: string, rules: Rule[], label: string): string {
  let out = text
  for (const r of rules) {
    const n = out.split(r.from).length - 1
    if (n !== r.count) {
      throw new Error(`${label}: expected ${r.count} match(es) for ${JSON.stringify(r.from.slice(0, 70))}, found ${n}`)
    }
    out = out.split(r.from).join(r.to)
  }
  return out
}

async function main() {
  const apply56 = process.argv.includes('--apply')

  for (const [num, rules] of [
    ['56', [...BOX_56, ...SEA_ALGAE]],
    ['55', SEA_ALGAE],
  ] as [string, Rule[]][]) {
    const p = await prisma.product.findFirst({ where: { productNumber: num } })
    if (!p?.description) throw new Error(`#${num} has no description`)
    const next = apply(p.description, rules, `#${num}`)
    if (next === p.description) {
      console.log(`#${num}: already clean`)
      continue
    }
    console.log(`#${num}: ${rules.length} rule(s) matched, ${p.description.length} -> ${next.length} chars`)
    if (apply56) {
      await prisma.product.update({ where: { id: p.id }, data: { description: next } })
      console.log(`#${num}: written`)
    }
  }

  if (!apply56) console.log('\nDry run. Re-run with --apply to write.')
}

main()
  .catch(e => { console.error(e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
