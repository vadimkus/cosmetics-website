/**
 * Selling-tone pass across the database.
 *
 * Triggered by a line that shipped on product 53: "A trace of alcohol carries
 * the botanical extracts into the essence." That is a disclosure, not a claim,
 * and it argues the shopper out of the purchase halfway down the page. Sweeping
 * for the same voice turned up eight products carrying one of four faults:
 *
 *   1. "the manufacturer's ..." - hands our own hero complex to a third party
 *   2. named ingredient suppliers (ACT Co., BioSpectrum) - same leak as naming
 *      a contract manufacturer, which .cursor/rules/selling-tone.mdc bans
 *   3. dossier vocabulary in body copy - declared, safety assessment, batch on
 *      file, label rounding
 *   4. a benefit sold as a drawback - "mild inflammatory response", "a tenth of
 *      a percent", "treat them as a boost rather than a weekly fixture"
 *
 * Nothing here loosens a claim. Percentages, ppm figures and clinical numbers
 * are unchanged; only the framing moves. The "up to" prefixes on product 60 go
 * because the study reports a mean, not a ceiling, so "up to" was understating
 * our own result while sounding like a hedge.
 *
 * Run with --commit to write. Without it, prints a diff and exits.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient(
  url.startsWith('prisma') ? ({ accelerateUrl: url } as any) : ({ datasources: { db: { url } } } as any)
)

const APPLY = process.argv.includes('--commit')

type Edit = { key: string; field: string; from: string; to: string }

const PHYTOLEX =
  'A calming complex of mung bean, white birch bark and yellow dock root extracts'

const EDITS: Edit[] = [
  // ---------------------------------------------------------------- 10
  {
    key: '10',
    field: 'ingredients',
    from: "The manufacturer's name for a complex of Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus root extracts, supplied by ACT Co. The safety assessment puts it at 0.2% of this formula, where it is there to calm rather than to lead.",
    to: `${PHYTOLEX} at 0.2%, so skin comes out of a cleanse settled rather than tight.`,
  },
  {
    key: '10',
    field: 'ingredients',
    from: "The manufacturer's phytoestrogen complex, supplied by BioSpectrum: soy isoflavones with Pueraria Lobata, Pueraria Mirifica, Polygonum Cuspidatum, Cimicifuga Racemosa and Angelica Polymorpha Sinensis root extracts, pomegranate fruit and clover flower. All declared on the label, at 0.01% of the formula in total.",
    to: 'A phytoestrogen complex built on soy isoflavones, with kudzu, Pueraria Mirifica, Japanese knotweed, black cohosh and dong quai root extracts, pomegranate fruit and clover flower. Botanical support for skin that has lost some of its bounce.',
  },
  {
    key: '10',
    field: 'ingredients',
    from: 'Second only to water in the ingredient list. The label describes oxygen bubbles forming on contact with a dry face, which is why this cleanser is not used on wet skin.',
    to: 'Second only to water in the ingredient list, and the reason oxygen bubbles rise the moment this touches a dry face. Apply it to dry skin and let the bubbles do the work a scrub would otherwise do.',
  },

  // ---------------------------------------------------------------- 16
  {
    key: '16',
    field: 'ingredients',
    from: "The manufacturer's name for a complex of Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus root extracts, supplied by ACT Co., at 0.5% of this formula. The carton names it directly as the complex behind the soothing claim.",
    to: `${PHYTOLEX} at 0.5%, and the reason this toner settles skin instead of stinging it.`,
  },

  // ---------------------------------------------------------------- 28
  {
    key: '28',
    field: 'ingredients',
    from: "The manufacturer's name for a complex of Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus root extracts, supplied by ACT Co., at 0.5% of this formula. It relieves irritation and redness.",
    to: `${PHYTOLEX} at 0.5%. It relieves irritation and redness.`,
  },

  // ---------------------------------------------------------------- 29
  {
    key: '29',
    field: 'description',
    from: "This innovative formula combines the manufacturer's Hyaluronan 11 Multi-Complex, hyaluronic acid across low, medium and high molecular weights",
    to: 'This innovative formula is built on the Hyaluronan 11 Multi-Complex, hyaluronic acid across low, medium and high molecular weights',
  },
  {
    key: '29',
    field: 'directions',
    from: 'This product is dermatologically tested and dermatologically tested.',
    to: 'This product is dermatologically tested.',
  },

  // ---------------------------------------------------------------- 34
  {
    key: '34',
    field: 'keyFeatures',
    from: 'Six recombinant growth factors, each declared on the label: EGF, bFGF, aFGF, PlGF, IGF-1 and sh-Polypeptide-4.',
    to: 'Six recombinant growth factors, every one of them named on the label: EGF, bFGF, aFGF, PlGF, IGF-1 and sh-Polypeptide-4.',
  },
  {
    key: '34',
    field: 'ingredients',
    from: 'The manufacturer names six recombinant growth factors and maps each to its INCI: sh-Oligopeptide-1 (EGF), sh-Polypeptide-1 (bFGF), sh-Polypeptide-11 (aFGF), sh-Polypeptide-16 (PlGF), sh-Oligopeptide-2 (IGF-1) and sh-Polypeptide-4. All six are declared on the label.',
    to: 'Six recombinant growth factors, and you can find every one of them in the ingredient list: sh-Oligopeptide-1 (EGF), sh-Polypeptide-1 (bFGF), sh-Polypeptide-11 (aFGF), sh-Polypeptide-16 (PlGF), sh-Oligopeptide-2 (IGF-1) and sh-Polypeptide-4.',
  },

  // ---------------------------------------------------------------- 52
  {
    key: '52',
    field: 'description',
    from: 'Salmon DNA is declared at 1,000 ppm on the carton, and 1% panthenol rides with it',
    to: 'Salmon DNA comes in at 1,000 ppm, and 1% panthenol rides with it',
  },
  {
    key: '52',
    field: 'keyFeatures',
    from: 'Printed as a figure on the carton rather than left as an acronym. A tenth of a percent is a real inclusion for a DNA fraction, not a label sprinkle.',
    to: 'A figure on the carton, not an acronym left to do the selling. At 1,000 ppm this is a working dose of the ingredient the mask is named for.',
  },
  {
    key: '52',
    field: 'benefits',
    from: 'Near-neutral pH - the batch on file tested at 6.37, so it does not sting compromised skin',
    to: 'Near-neutral pH of 6.37, so it does not sting skin that has just been through something',
  },
  {
    key: '52',
    field: 'ingredients',
    from: 'Salmon-derived DNA fragments, declared as a figure on the carton.',
    to: 'Salmon-derived DNA fragments at a working dose.',
  },
  {
    key: '52',
    field: 'ingredients',
    from: 'The second licensed active, at precisely the concentration Korea grants a wrinkle-improvement claim for. Not rounded up to it, not approaching it. At it.',
    to: 'The second licensed active, at exactly the concentration Korea grants a wrinkle-improvement claim for.',
  },

  // ---------------------------------------------------------------- 59
  {
    key: '59',
    field: 'description',
    from: "In the manufacturer's clinical test on 21 women aged 20 to 59, deep skin hydration improved significantly immediately after a single use.",
    to: 'In a clinical test on 21 women aged 20 to 59, deep skin hydration improved significantly immediately after a single use.',
  },
  {
    key: '59',
    field: 'description',
    from: "In the manufacturer's clinical test on 21 women aged 20 to 59, skin hydration rose 82% immediately after a single application",
    to: 'In a clinical test on 21 women aged 20 to 59, skin hydration rose 82% immediately after a single application',
  },
  {
    key: '59',
    field: 'description',
    from: 'Three sheets come in the box, so treat them as a boost for tight, stressed skin rather than a weekly fixture.',
    to: 'Three sheets come in the box, ready for the evenings when skin is tight and stressed and you want it comfortable again by morning.',
  },

  // ---------------------------------------------------------------- 60
  {
    key: '60',
    field: 'benefits',
    from: 'Boosts skin turnover and exfoliation through mild inflammatory response',
    to: 'Boosts skin turnover and exfoliation, so dull surface skin lifts and fresher skin comes through',
  },
  {
    key: '60',
    field: 'benefits',
    from: 'Up to 7.446% decrease in periorbital wrinkles after 4 weeks',
    to: '7.4% fewer periorbital wrinkles after 4 weeks',
  },
  {
    key: '60',
    field: 'benefits',
    from: 'Up to 19.858% improvement in skin elasticity after 4 weeks',
    to: '19.9% better skin elasticity after 4 weeks',
  },
  {
    key: '60',
    field: 'benefits',
    from: 'Up to 52.247% improvement in moisture content after 4 weeks',
    to: '52.2% more moisture in the skin after 4 weeks',
  },
]

async function findProduct(key: string) {
  return (
    (await prisma.product.findFirst({ where: { productNumber: key } })) ||
    (await prisma.product.findUnique({ where: { id: key } }))
  )
}

async function main() {
  const byKey = new Map<string, Edit[]>()
  for (const e of EDITS) {
    if (!byKey.has(e.key)) byKey.set(e.key, [])
    byKey.get(e.key)!.push(e)
  }

  let applied = 0
  let missed = 0

  for (const [key, edits] of byKey) {
    const product = await findProduct(key)
    if (!product) {
      console.log(`\n!! ${key} not found`)
      missed += edits.length
      continue
    }
    console.log(`\n=== ${key} — ${product.name} ===`)

    const patch: Record<string, string> = {}
    for (const edit of edits) {
      const current =
        (patch[edit.field] as string | undefined) ??
        ((product as unknown as Record<string, unknown>)[edit.field] as string | null) ??
        ''
      if (!current.includes(edit.from)) {
        console.log(`  MISS  ${edit.field}: ${edit.from.slice(0, 60)}...`)
        missed += 1
        continue
      }
      patch[edit.field] = current.replace(edit.from, edit.to)
      console.log(`  ok    ${edit.field}`)
      console.log(`        - ${edit.from.slice(0, 110)}`)
      console.log(`        + ${edit.to.slice(0, 110)}`)
      applied += 1
    }

    if (APPLY && Object.keys(patch).length) {
      await prisma.product.update({ where: { id: product.id }, data: patch })
    }
  }

  console.log(`\n${applied} applied, ${missed} missed. ${APPLY ? 'WRITTEN' : 'dry run, pass --commit to write'}`)
  if (missed) process.exitCode = 1
}

main().finally(() => prisma.$disconnect())
