/**
 * Fixes the claims on the Charming Look Beauty Box (#57) and on three of its five
 * member products, against the Intertek paperwork.
 *
 * Sources, all under
 * /Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek:
 *
 *   SKIN CARING BLEMISH BALM CUSHION/CARING BLEMISH BALM CUSHION #3_Camel/
 *     Artwork-[GENOSYS]SKIN CARING BLEMISH BALM CUSHION #03.pdf
 *       "NET WT. 15 g / 0.52 oz. x 2ea (1 CUSHION + 1 REFILL)", SPF50+ PA++++,
 *       and the Korean panel [자외선 차단, 미백, 주름개선 3중 기능성 화장품]:
 *       a triple-function licence for UV protection, brightening and wrinkle
 *       improvement, with 효능성분 titanium dioxide, ethylhexyl methoxycinnamate,
 *       ethylhexyl salicylate, niacinamide, octocrylene, zinc oxide, adenosine.
 *     Formula-GENOSYS SKIN CARING BLEMISH BALM CUSHION #03.pdf
 *       Niacinamide 2.000%, Adenosine 0.040%, Titanium Dioxide 9.002%,
 *       Ethylhexyl Methoxycinnamate 7.000%, Ethylhexyl Salicylate 4.500%,
 *       Octocrylene 2.000%, Zinc Oxide 2.000%, Glutathione 0.010%.
 *       The nine peptides total 0.0001%.
 *     COA ... #03 CAMEL(N03I08).pdf  pH 6.51 against a 6.5 +/- 1.0 spec.
 *
 *   GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK/
 *     Artwork-...pdf   "NET WT. 100 g / 3.52 oz." (the box copy said 100ml)
 *     GENOSYS SKIN RESCUE OVERNIGHT CREAM MASK.pptx
 *       slide 3: the oxygen capsule "contains Italian oxygenated water"
 *       slide 7 and 10: the growth factor complex, with the INCI mapping -
 *         sh-Oligopeptide-1 = EGF, sh-Polypeptide-1 = bFGF,
 *         sh-Polypeptide-11 = aFGF, sh-Polypeptide-16 = PlGF,
 *         sh-Oligopeptide-2 = IGF-1, plus sh-Polypeptide-4
 *       slide 4: special overnight care is "once or twice a week"
 *     COA ...(M30A15B).pdf  pH 5.71 against a 5.8 +/- 0.5 spec.
 *
 *   GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER/
 *     Artwork-...pdf   "NET WT. 200 ml", "DERMATOLOGICALLY TESTED" and nothing
 *       about ophthalmological testing, so that claim comes out.
 *     GENOSYS SKIN DEFENDER LIP & EYE MAKEUP REMOVER.pptx
 *       slides 2, 7 and 9: the manufacturer calls the vitamin blend
 *       "Vita 10 Complex" and lists it as B1, B3, B5, B6, B9, B12, C, E, F, H.
 *
 * What changes, and why:
 *
 *   1. #57  overnight mask given as 100ml         -> 100g, per the carton
 *   2. #57  cushion "key ingredients" were        -> the real ones from the
 *           "SPF 50+ PA++++ protection, natural      formula sheet
 *           coverage formula", neither of which
 *           is an ingredient
 *   3. #57  cushion listed as "(1pcs)"            -> 15g cushion + 15g refill,
 *                                                    which is what 300 AED buys
 *   4. #57  "PIGF"                                -> "PlGF", placental growth
 *                                                    factor. Capital I for a
 *                                                    lowercase L.
 *   5. #57  "10 Vitamin Complex"                  -> "Vita 10 Complex", the
 *                                                    manufacturer's own name
 *   6. #57  "clean make-up dirts and skin          -> grammar
 *           impurities"
 *   7. #11  "Dermatologically tested and          -> dermatological only. The
 *           ophthalmologically tested"               carton claims one, not two.
 *   8. #34  "2-3 times per week"                  -> once or twice a week, per
 *                                                    the deck
 *   9. #34  "Clinically proven to improve         -> removed. No study for this
 *           erythema and transepidermal              product is on file in
 *           water loss"                              Intertek or in the repo.
 *  10. #34  "Growth-Factor Peptide Blend", a      -> "Growth Factor Complex",
 *           hedge added by an earlier pass           the manufacturer's name,
 *                                                    with the documented mapping
 *  11. #41  "SPF 50 / PA++++"                     -> "SPF 50+ / PA++++"
 *
 * Run with --commit to write. Without it, prints the diff and exits.
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL required')
const prisma = new PrismaClient(
  url.includes('prisma.io') || url.includes('accelerate')
    ? { accelerateUrl: url, log: ['error'] }
    : ({ datasourceUrl: url, log: ['error'] } as never)
)

const COMMIT = process.argv.includes('--commit')

type Rule = [RegExp, string]

/* ---------------------------------------------------------------- box 57 */

const BOX_RULES: Rule[] = [
  // 6. grammar in the cleanser paragraph
  [
    /Naturally generated oxygen bubbles clean make-up dirts and skin impurities/,
    'Naturally generated oxygen bubbles lift make-up, dirt and impurities off the skin',
  ],
  // 3 + 2. the cushion line and its ingredient list
  [
    /3\. Skin Caring Blemish Balm Cushion \(1pcs\) Ivory, Camel or Beige color = 300 AED/,
    '3. Skin Caring Blemish Balm Cushion [SPF 50+ PA++++] 15g + 15g refill (1 pcs) in Ivory, Camel or Beige = 300 AED',
  ],
  [
    /Key ingredients: SPF 50\+ PA\+\+\+\+ protection, natural coverage formula\./,
    'Key ingredients: Repairing Pep9 Complex (nine skin-conditioning peptides), Niacinamide 2%, Adenosine 0.04%, Glutathione, and five UV filters led by Titanium Dioxide and Zinc Oxide.',
  ],
  // 5. the manufacturer's name for the vitamin blend
  [/Key ingredients: 10 Vitamin Complex, Palmitoyl Tripeptide-5/, 'Key ingredients: Vita 10 Complex, Palmitoyl Tripeptide-5'],
  // 1. the overnight mask size
  [
    /5\. Skin Rescue Overnight Cream Mask 100ml \(1pcs\) = 340 AED/,
    '5. Skin Rescue Overnight Cream Mask 100g (1 pcs) = 340 AED',
  ],
  // 4. PIGF -> PlGF
  [/Growth Factor Complex \(EGF, aFGF, bFGF, PIGF, IGF\)/, 'Growth Factor Complex (EGF, aFGF, bFGF, PlGF, IGF-1)'],
]

/* ------------------------------------------------- member products 11, 34, 41 */

const REMOVER_RULES: Rule[] = [
  // 7. the carton claims dermatological testing only
  [/"testing":"Dermatologically tested and ophthalmologically tested"/, '"testing":"Dermatologically tested"'],
]

const OVERNIGHT_RULES: Rule[] = [
  // 8. frequency, per deck slide 4
  [/"usage":"Overnight treatment 2-3 times per week"/, '"usage":"Overnight treatment once or twice a week"'],
  // 9. no study on file for this product
  [/,"results":"Clinically proven to improve erythema and transepidermal water loss"/, ''],
  // 10. restore the manufacturer's name and the documented mapping
  [
    /"name":"Growth-Factor Peptide Blend","description":"A supporting blend of growth-factor peptides \(EGF, aFGF, bFGF, PlGF, IGF\) within the overnight renewal complex\."/,
    '"name":"Growth Factor Complex","description":"The manufacturer names six recombinant growth factors and maps each to its INCI: sh-Oligopeptide-1 (EGF), sh-Polypeptide-1 (bFGF), sh-Polypeptide-11 (aFGF), sh-Polypeptide-16 (PlGF), sh-Oligopeptide-2 (IGF-1) and sh-Polypeptide-4. All six are declared on the label."',
  ],
  [
    /"name":"Growth-Factor Peptide Blend","description":"A supporting blend of growth-factor peptides \(EGF, aFGF, bFGF, PIGF, IGF\) within the overnight renewal complex\."/,
    '"name":"Growth Factor Complex","description":"The manufacturer names six recombinant growth factors and maps each to its INCI: sh-Oligopeptide-1 (EGF), sh-Polypeptide-1 (bFGF), sh-Polypeptide-11 (aFGF), sh-Polypeptide-16 (PlGF), sh-Oligopeptide-2 (IGF-1) and sh-Polypeptide-4. All six are declared on the label."',
  ],
  [
    /"title":"Growth Factor Complex","description":"Advanced growth factor complex \(EGF, aFGF, bFGF, PIGF, IGF\) promotes skin renewal and healing\."/,
    '"title":"Growth Factor Complex","description":"Six recombinant growth factors, each declared on the label: EGF, bFGF, aFGF, PlGF, IGF-1 and sh-Polypeptide-4."',
  ],
]

const CUSHION_RULES: Rule[] = [
  // 11. the carton says SPF50+, not SPF 50
  [/"spfRating":"SPF 50 \/ PA\+\+\+\+"/, '"spfRating":"SPF 50+ / PA++++"'],
  [
    /"size":"15g \(includes replacement refill\)"/,
    '"size":"15g cushion plus a 15g refill (30g in total)"',
  ],
]

const TARGETS: { key: string; label: string; fields: string[]; rules: Rule[] }[] = [
  { key: '57', label: 'Charming Look Beauty Box', fields: ['description'], rules: BOX_RULES },
  { key: '11', label: 'Skin Defender remover', fields: ['productDetails'], rules: REMOVER_RULES },
  {
    key: '34',
    label: 'Skin Rescue Overnight Cream Mask',
    fields: ['productDetails', 'ingredients', 'keyFeatures'],
    rules: OVERNIGHT_RULES,
  },
  { key: '41', label: 'Skin Caring BB Cushion', fields: ['productDetails'], rules: CUSHION_RULES },
]

/* Nothing here may survive the run: each is either a wrong figure or a claim
   with no document behind it. */
const MUST_BE_GONE: [string, string][] = [
  ['57', 'Overnight Cream Mask 100ml'],
  ['57', 'SPF 50+ PA++++ protection, natural coverage formula'],
  ['57', 'PIGF'],
  ['57', 'make-up dirts'],
  ['57', '10 Vitamin Complex'],
  ['11', 'ophthalmologically tested'],
  ['34', 'Clinically proven'],
  ['34', '2-3 times per week'],
  ['34', 'Growth-Factor Peptide Blend'],
  ['41', '"spfRating":"SPF 50 /'],
]

async function main() {
  const changed: Record<string, Record<string, string>> = {}

  for (const t of TARGETS) {
    const row = (await prisma.product.findFirst({
      where: { OR: [{ id: t.key }, { productNumber: t.key }] },
    })) as any
    if (!row) {
      console.log(`!! ${t.key} (${t.label}) NOT FOUND`)
      continue
    }

    console.log(`\n=== ${t.key}  ${t.label}  (id=${row.id})`)
    for (const field of t.fields) {
      const before = String(row[field] ?? '')
      let after = before
      for (const [re, to] of t.rules) after = after.replace(re, to)
      if (after === before) {
        console.log(`  ${field}: no change`)
        continue
      }
      changed[t.key] = { ...(changed[t.key] ?? {}), [field]: after }
      // show only what moved
      for (const [re, to] of t.rules) {
        const hit = before.match(re)
        if (hit) console.log(`  ${field}\n    - ${hit[0].slice(0, 150)}\n    + ${to.slice(0, 150) || '(deleted)'}`)
      }
    }
  }

  // verification against the post-change text
  let failed = false
  for (const [key, bad] of MUST_BE_GONE) {
    const row = (await prisma.product.findFirst({
      where: { OR: [{ id: key }, { productNumber: key }] },
    })) as any
    const merged = ['description', 'productDetails', 'ingredients', 'keyFeatures', 'benefits']
      .map(f => (changed[key]?.[f] ?? String(row?.[f] ?? '')))
      .join('\n')
    if (merged.includes(bad)) {
      console.log(`\nFAIL  ${key}: still present -> ${bad}`)
      failed = true
    }
  }
  if (failed) throw new Error('verification failed, nothing written')

  if (!COMMIT) {
    console.log('\nDry run. Re-run with --commit to write.')
    return
  }

  for (const [key, fields] of Object.entries(changed)) {
    const row = (await prisma.product.findFirst({
      where: { OR: [{ id: key }, { productNumber: key }] },
    })) as any
    await prisma.product.update({ where: { id: row.id }, data: fields as any })
    console.log(`written: ${key} -> ${Object.keys(fields).join(', ')}`)
  }
}

main().finally(() => prisma.$disconnect())
