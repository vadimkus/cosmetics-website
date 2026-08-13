/**
 * Restores the manufacturer's own ingredient nomenclature, alongside the
 * constituent extracts, on the records touched earlier today.
 *
 * Background. `fix-phytolex-phytrogen-claims-20260813.ts` removed "Phytolex SC"
 * and "MultiEx Phytrogen" on the premise that neither name appears in any
 * GENOSYS document. That premise was wrong. Both are raw-material trade names
 * recorded in the Safety Assessment Reports with supplier and percentage:
 *
 *   Phytolex SC        ACT Co., Ltd.      0.2% in Snow O₂, 0.5% in Snow Booster
 *                                         and in Intensive Hydro Soothing Cream
 *   MultiEX™ Phytrogen BioSpectrum, Inc.  0.01% in Snow O₂
 *
 * The GENOSYS catalogue also uses "Phytolex SC" as a key-ingredient heading
 * across the range, and the Snow Booster carton prints it.
 *
 * Product 29 is the same class of error: "11 types of hyaluronic acid" is the
 * manufacturer's branded figure for the "Hyaluronan 11 Multi-Complex", stated
 * in the DTS MG deck on the page that lists eight hyaluronate INCI names. It
 * counts the three molecular-weight grades separately, exactly as the "7 Herb
 * Complex" on product 63 does.
 *
 * The trade name goes in the ingredient title and the declared extracts and
 * dose go in the body, so a shopper gets the manufacturer's name and what is
 * actually behind it. The oxygen-therapy removals and the dry-face application
 * correction from this morning are deliberately left in place; both stand on
 * their own evidence.
 *
 *   npx tsx --env-file=.env.local scripts/restore-manufacturer-ingredient-names-20260813.ts
 *   npx tsx --env-file=.env.local scripts/restore-manufacturer-ingredient-names-20260813.ts --commit
 */
import { PrismaClient } from '@prisma/client'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : ({ datasourceUrl: databaseUrl, log: ['error'] } as never)
)

const COMMIT = process.argv.includes('--commit')

const TRIO_NAME = 'Phaseolus Radiatus, Betula Platyphylla Japonica Bark and Rumex Crispus Root Extracts'
const CLUSTER_NAME = 'Soy isoflavones with root and flower extracts'

/** Phytolex SC body copy, per product, since the dose differs. */
const PHYTOLEX: Record<string, string> = {
  '10': "The manufacturer's name for a complex of Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus root extracts, supplied by ACT Co. The safety assessment puts it at 0.2% of this formula, where it is there to calm rather than to lead.",
  '16': "The manufacturer's name for a complex of Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus root extracts, supplied by ACT Co., at 0.5% of this formula. The carton names it directly as the complex behind the soothing claim.",
  '28': "The manufacturer's name for a complex of Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus root extracts, supplied by ACT Co., at 0.5% of this formula. It relieves irritation and redness.",
}

const PHYTROGEN =
  "The manufacturer's phytoestrogen complex, supplied by BioSpectrum: soy isoflavones with Pueraria Lobata, Pueraria Mirifica, Polygonum Cuspidatum, Cimicifuga Racemosa and Angelica Polymorpha Sinensis root extracts, pomegranate fruit and clover flower. All declared on the label, at 0.01% of the formula in total."

type Target = { key: string; by: 'id' | 'productNumber'; label: string }

const TARGETS: Target[] = [
  { key: '10', by: 'id', label: 'SNOW O₂ CLEANSER' },
  { key: '16', by: 'id', label: 'SNOW BOOSTER' },
  { key: '28', by: 'id', label: 'INTENSIVE HYDRO SOOTHING CREAM' },
  { key: '29', by: 'id', label: 'MOISTURE REPLENISHING HYALURON CREAM' },
  { key: '54', by: 'productNumber', label: 'Holiday Kit' },
  { key: '55', by: 'productNumber', label: 'PROBLEM SKIN CARE BEAUTY BOX' },
  { key: '56', by: 'productNumber', label: 'SKIN BRIGHTENING BEAUTY BOX' },
  { key: '57', by: 'productNumber', label: 'CHARMING LOOK BEAUTY BOX' },
  { key: '58', by: 'productNumber', label: 'ANTI-AGING BEAUTY BOX' },
  { key: '62', by: 'productNumber', label: 'SENSITIVE SKIN BEAUTY BOX' },
]

/**
 * Plain-text fields. The compact "Key ingredients:" lines carry the trade names
 * only; the constituent extracts are one click away in the ingredient list, and
 * spelling them out inline turns a scannable line into a paragraph.
 */
const TEXT_RULES: [RegExp, string][] = [
  [
    /Key (I|i)ngredients: Methyl Perfluoroisobutyl Ether, soy isoflavones, Pueraria and clover flower extracts\./g,
    'Key $1ngredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether.',
  ],
  [
    /Key ingredients: Betaine, Lactobacillus\/Pumpkin Ferment Extract, Nelumbo Nucifera Flower Extract, Beta-Glucan\./g,
    'Key ingredients: Phytolex SC, Nelumbo Nucifera Flower Extract, Lactobacillus/Pumpkin Ferment Extract, Betaine.',
  ],
  [
    /Key Ingredients: Betaine, Fermented Pumpkin Extract, Lotus Flower Extract, Beta-Glucan\./g,
    'Key Ingredients: Phytolex SC, Lotus Flower Extract, Fermented Pumpkin Extract, Betaine.',
  ],
  // Product 29. Restores the manufacturer's branded figure and keeps the one
  // dose that does the work, which the deck leads with too.
  [
    /combines multiple molecular weights of hyaluronic acid \(8 HA forms\) with mushroom extracts/g,
    "combines the manufacturer's Hyaluronan 11 Multi-Complex, hyaluronic acid across low, medium and high molecular weights with high-molecular-weight hyaluronate at 1,000 ppm, with mushroom extracts",
  ],
]

function fixIngredients(json: string, key: string): string {
  const list = JSON.parse(json) as { name: string; description: string }[]
  return JSON.stringify(
    list.map(entry => {
      if (entry.name === TRIO_NAME) {
        return { name: 'Phytolex SC', description: PHYTOLEX[key] ?? PHYTOLEX['10'] }
      }
      if (entry.name === CLUSTER_NAME) {
        return { name: 'MultiEx Phytrogen', description: PHYTROGEN }
      }
      return entry
    })
  )
}

async function main() {
  console.log(COMMIT ? 'COMMIT\n' : 'DRY RUN (pass --commit to write)\n')

  for (const t of TARGETS) {
    const product = await prisma.product.findFirst({
      where: t.by === 'id' ? { id: t.key } : { productNumber: t.key },
    })
    if (!product) {
      console.log(`#${t.key} ${t.label}: NOT FOUND`)
      continue
    }

    const data: Record<string, string> = {}

    for (const field of ['description', 'benefits', 'keyFeatures', 'productDetails'] as const) {
      const before = product[field]
      if (!before) continue
      let after = before
      for (const [re, to] of TEXT_RULES) after = after.replace(re, to)
      if (after !== before) data[field] = after
    }

    if (product.ingredients) {
      try {
        const after = fixIngredients(product.ingredients, t.key)
        if (after !== product.ingredients) data.ingredients = after
      } catch {
        console.log(`  ! #${t.key} ingredients is not valid JSON, skipped`)
      }
    }

    const changed = Object.keys(data)
    if (!changed.length) {
      console.log(`#${t.key} ${t.label}: no change`)
      continue
    }

    console.log(`#${t.key} ${t.label}: ${changed.join(', ')}`)
    if (COMMIT) {
      await prisma.product.update({ where: { id: product.id }, data })
      console.log('  written')
    }
  }
}

main().finally(() => prisma.$disconnect())
