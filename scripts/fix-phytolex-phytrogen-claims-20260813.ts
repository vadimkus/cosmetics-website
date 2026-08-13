/**
 * Remove two ingredient names, and one mechanism claim, that no GENOSYS
 * registration document supports.
 *
 * WHAT IS WRONG
 *
 * "Phytolex SC" and "MultiEx Phytrogen" are listed on this site as if they were
 * declared ingredients of the Snow O₂ Cleanser, the Snow Booster and the
 * Intensive Hydro Soothing Cream, each with a description written to match. I
 * extracted the text of every document we hold for those three products - the
 * quali-quanti ingredient lists, the older ingredient lists, the signed
 * formulas, and the printed 180ml and 200ml labels - and searched all of it.
 * Neither name occurs once. The same extraction finds Aqua, Glycerin and Water
 * in every file, so the documents are readable and the absence is real.
 *
 * They are not invented complexes. They are supplier trade names for clusters
 * that ARE declared, and the label names the members:
 *
 *   Phytolex          Phaseolus Radiatus Extract, Betula Platyphylla Japonica
 *                     Bark Extract, Rumex Crispus Root Extract. Declared in all
 *                     three products; 0.1% each in the Booster, 0.008% and
 *                     below in the Cream, 0.0005% and below in the Cleanser.
 *   MultiEx Phytrogen Soy Isoflavones, Pueraria Lobata Root, Pueraria Mirifica
 *                     Root, Polygonum Cuspidatum Root, Cimicifuga Racemosa
 *                     Root, Angelica Polymorpha Sinensis Root, Punica Granatum
 *                     Fruit and Trifolium Pratense (Clover) Flower Extracts.
 *                     Declared in the Cleanser at 0.001 to 0.003%.
 *
 * So the fix is to name what the label names. That also stops trace botanicals
 * being presented as the product's headline actives, which at 0.000003% for
 * Rumex Crispus in the Cleanser is what was happening.
 *
 * The second claim is "oxygen therapy". No Snow O₂ document uses the phrase.
 * The label says the opposite kind of thing - modest and physical: "Naturally
 * generated oxygen bubbles clean make-up dirts and skin impurities without
 * irritation to skin." The site turned that into a therapy mechanism, and in
 * one place into circulation: "Oxygen Therapy - Provides skin with oxygen for
 * improved circulation and nourishment" is a physiological claim about a rinse
 * off cleanser, sourced to nothing. Everywhere the phrase sits in a sentence
 * this script is already rewriting for the ingredient names, it goes too.
 *
 * Deliberately NOT touched: #26 EGF Repair OxyMask Cream (hidden), #34 Skin
 * Rescue Overnight Cream Mask and #38 EZ CO₂ Mask Kit also say "oxygen
 * therapy", but those products have oxygenated-water capsules and a CO₂ system,
 * so for them it may well be the manufacturer's own concept. That needs its own
 * document check rather than a blanket find-and-replace.
 *
 * A THIRD THING, FOUND ON THE WAY
 *
 * #10's `productDetails.application` reads "Apply to wet skin, massage gently,
 * rinse thoroughly". The label reads "Apply the product on dry face, avoiding
 * eyes. When oxygen bubbles occur, give a circular massage and rinse off with
 * tepid water." Applying this cleanser to wet skin defeats the one thing it
 * does, so that is corrected here as well.
 *
 * SOURCES
 *
 *   Intertek/Intertek_folder/Quali-quanti Ingredients/GENOSYS SNOW O2.pdf
 *   Intertek/Ingredient lists_old/GENOSYS SNOW O2.pdf
 *   Intertek/Ingredient lists_old/GENOSYS SNOW BOOSTER.pdf
 *   Intertek/Label/[GENOSYS]SNOW O2 180ml.pdf
 *   Intertek/Label/[GENOSYS]SNOW BOOSTER 200ml.pdf
 *   Intertek/INTENSIVE HYDRO SOOTHING CREAM/Formula-GENOSYS INTENSIVE HYDRO
 *     SOOTHING CREAM.pdf
 *
 * STILL OUTSTANDING AFTER THIS SCRIPT
 *
 *   /images/cleanser/S3.jpg          prints "PHYTOLEX SC" and "MULTIEX PHYTROGEN"
 *   /images/hyaluron/s1,s4,s6.jpeg   print "11 HA types", where both DTS MG decks
 *                                    list 8 hyaluronate INCI names
 *
 * Those need the artwork re-exported under new filenames, since /images/* is
 * cached immutably for a year.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-phytolex-phytrogen-claims-20260813.ts
 *   npx tsx --env-file=.env.local scripts/fix-phytolex-phytrogen-claims-20260813.ts --commit
 */

import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

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
const CLUSTER_BODY =
  'Soy isoflavones with Pueraria Lobata, Pueraria Mirifica, Polygonum Cuspidatum, Cimicifuga Racemosa and Angelica Polymorpha Sinensis root extracts, pomegranate fruit and clover flower. All declared on the label, at 0.001 to 0.003% of the formula.'

/** Legacy records are keyed by `id`; the boxes are keyed by `productNumber`. */
type Target = { key: string; by: 'id' | 'productNumber'; label: string }

const TARGETS: Target[] = [
  { key: '10', by: 'id', label: 'SNOW O₂ CLEANSER' },
  { key: '16', by: 'id', label: 'SNOW BOOSTER' },
  { key: '28', by: 'id', label: 'INTENSIVE HYDRO SOOTHING CREAM' },
  { key: '54', by: 'productNumber', label: 'Holiday Kit' },
  { key: '55', by: 'productNumber', label: 'PROBLEM SKIN CARE BEAUTY BOX' },
  { key: '56', by: 'productNumber', label: 'SKIN BRIGHTENING BEAUTY BOX' },
  { key: '57', by: 'productNumber', label: 'CHARMING LOOK BEAUTY BOX' },
  { key: '58', by: 'productNumber', label: 'ANTI-AGING BEAUTY BOX' },
  { key: '62', by: 'productNumber', label: 'SENSITIVE SKIN BEAUTY BOX' },
]

/**
 * Applied to any plain-text field. Ordered: the trade names are removed from
 * lists before the lists themselves are rewritten.
 */
const TEXT_RULES: [RegExp, string][] = [
  // The therapy sentence in every box that contains the cleanser.
  [/\s*Features oxygen therapy mechanism for deep cleansing and (?:nutrifying|nourishment)\.(?=\s|$)/g, ''],
  // Cleanser key-ingredient line, in the boxes and on the product.
  [
    /Key (I|i)ngredients: Phytolex SC, MultiEx Phytrogen, Methyl Perfluoroisobutyl Ether\./g,
    'Key $1ngredients: Methyl Perfluoroisobutyl Ether, soy isoflavones, Pueraria and clover flower extracts.',
  ],
  // Toner key-ingredient line, two spellings.
  [
    /Key ingredients: Phytolex SC, Nelumbo Nucifera Flower Extract, Lactobacillus\/Pumpkin Ferment Extract, Betaine\./g,
    'Key ingredients: Betaine, Lactobacillus/Pumpkin Ferment Extract, Nelumbo Nucifera Flower Extract, Beta-Glucan.',
  ],
  [
    /Key Ingredients: Phytolex SC, Lotus Flower Extract, Fermented Pumpkin Extract, Betaine\./g,
    'Key Ingredients: Betaine, Fermented Pumpkin Extract, Lotus Flower Extract, Beta-Glucan.',
  ],
  // Problem Control serum and cream lists, where it sits mid-sentence.
  [/, Phytolex SC,/g, ','],
  // #10 and #54 opening line. Replaced whole rather than in part: the sentence
  // after it already says the bubbles are naturally generated and what they do,
  // so a swap in place would say it twice.
  [
    /is a revolutionary oxygen bubble cleanser that combines gentle cleansing with oxygen therapy for deep skin nourishment\./g,
    'is an oxygen bubble cleanser that cleans without scrubbing.',
  ],
]

/** JSON-valued fields, edited as structures rather than as text. */
function fixIngredients(json: string, productKey: string): string {
  const list = JSON.parse(json) as { name: string; description: string }[]
  const trioBody =
    productKey === '16'
      ? 'Three botanical extracts declared at 0.1% each in the formula, listed as skin-conditioning agents.'
      : 'Three botanical extracts declared on the label as skin-conditioning agents. They sit at trace level, so they belong to the base rather than doing the work.'

  return JSON.stringify(
    list.map(entry => {
      if (entry.name === 'Phytolex SC') return { name: TRIO_NAME, description: trioBody }
      if (entry.name === 'MultiEx Phytrogen') return { name: CLUSTER_NAME, description: CLUSTER_BODY }
      if (entry.name === 'Methyl Perfluoroisobutyl Ether') {
        return {
          name: entry.name,
          description:
            "Second only to water in the ingredient list. The label describes oxygen bubbles forming on contact with a dry face, which is why this cleanser is not used on wet skin.",
        }
      }
      return entry
    })
  )
}

function fixKeyFeatures(json: string): string {
  const list = JSON.parse(json) as { title: string; description: string }[]
  return JSON.stringify(
    list.map(f =>
      f.title === 'Oxygen Therapy Mechanism'
        ? {
            // The list already has a "Natural Oxygen Bubbles" entry, so this one
            // carries the part shoppers get wrong instead: it goes on dry.
            title: 'Used on a Dry Face',
            description:
              'Unlike a foaming cleanser this is applied to dry skin. The bubbles form on contact, then a circular massage and tepid water finish the job.',
          }
        : f
    )
  )
}

function fixBenefits(json: string): string {
  const list = JSON.parse(json) as string[]
  return JSON.stringify(
    list.map(b =>
      b.startsWith('Oxygen Therapy -')
        ? 'Oxygen Bubbles - Naturally generated bubbles lift make-up and impurities without scrubbing'
        : b
    )
  )
}

function fixProductDetails(json: string): string {
  const d = JSON.parse(json) as Record<string, string>
  if (d.technology === 'Oxygen therapy mechanism with natural bubble generation') {
    d.technology = 'Oxygen bubbles generated on application'
  }
  if (d.keyBenefits === 'Gentle cleansing, oxygen therapy, makeup removal, skin nourishment') {
    d.keyBenefits = 'Gentle cleansing, oxygen bubbles, makeup removal'
  }
  if (d.application === 'Apply to wet skin, massage gently, rinse thoroughly') {
    // Per the printed label, which is the opposite of what this said.
    d.application = 'Apply to a dry face avoiding the eyes; when bubbles form, massage in circles and rinse with tepid water'
  }
  return JSON.stringify(d)
}

const LEFTOVER = /phytolex|phytrogen|oxygen therapy/i

async function main() {
  const backup: Record<string, unknown> = {}
  const updates: { where: { id: string }; data: Record<string, string>; label: string }[] = []

  for (const target of TARGETS) {
    const product = await prisma.product.findFirst({
      where: target.by === 'id' ? { id: target.key } : { productNumber: target.key },
      select: {
        id: true,
        productNumber: true,
        name: true,
        description: true,
        ingredients: true,
        keyFeatures: true,
        benefits: true,
        productDetails: true,
      },
    })
    if (!product) throw new Error(`Not found: ${target.label} (${target.by}=${target.key})`)
    backup[target.key] = product

    const data: Record<string, string> = {}

    if (product.description) {
      let next = product.description
      for (const [re, to] of TEXT_RULES) next = next.replace(re, to)
      if (next !== product.description) data.description = next
    }
    if (product.ingredients?.includes('Phytolex SC') || product.ingredients?.includes('MultiEx Phytrogen')) {
      data.ingredients = fixIngredients(product.ingredients, target.key)
    }
    if (product.keyFeatures?.includes('Oxygen Therapy Mechanism')) {
      data.keyFeatures = fixKeyFeatures(product.keyFeatures)
    }
    if (product.benefits?.includes('Oxygen Therapy -')) {
      data.benefits = fixBenefits(product.benefits)
    }
    if (product.productDetails?.includes('oxygen therapy') || product.productDetails?.includes('Apply to wet skin')) {
      data.productDetails = fixProductDetails(product.productDetails)
    }

    console.log(`\n=== ${target.label} (${target.by}=${target.key})`)
    if (!Object.keys(data).length) {
      console.log('   nothing to change')
      continue
    }
    for (const [field, value] of Object.entries(data)) {
      const before = (product as unknown as Record<string, string>)[field] ?? ''
      console.log(`   ${field}: ${before.length} -> ${value.length} chars`)
      if (LEFTOVER.test(value)) console.log(`   !! still matches: ${value.match(LEFTOVER)}`)
    }
    updates.push({ where: { id: product.id }, data, label: target.label })
  }

  const stamp = new Date().toISOString().slice(0, 10)
  const path = `/tmp/phytolex-backup-${stamp}.json`
  writeFileSync(path, JSON.stringify(backup, null, 2))
  console.log(`\nBackup of all ${TARGETS.length} records: ${path}`)

  if (!COMMIT) {
    console.log(`\nDry run. ${updates.length} record(s) would be written. Re-run with --commit.`)
    await prisma.$disconnect()
    return
  }

  for (const u of updates) {
    await prisma.product.update({ where: u.where, data: u.data })
    console.log(`written: ${u.label}`)
  }
  await prisma.$disconnect()
}

main()
