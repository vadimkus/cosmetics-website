/**
 * Corrects two factual errors on the five sibling Power Solution ampoules
 * (4 HES, 6 CTS, 7 PCS, 8 SWS, 9 AWS), found while auditing product 5.
 *
 * 1. sh-Polypeptide-7 is described as an "IGF-1-analog peptide" on 4, 7, 8 and
 *    9, and as a "human growth hormone-like peptide" on 6. Both are wrong.
 *    Per the safety assessments, sh-Polypeptide-7 is a single-chain recombinant
 *    human peptide carrying the 217-amino-acid somatotropin sequence, produced
 *    by microbial fermentation. The IGF-1 peptide in cosmetic use is a
 *    different INCI entirely, sh-Oligopeptide-2, and is not in any of these
 *    vials. COSING classifies sh-Polypeptide-7 as a skin protectant.
 *
 *    The same wording was corrected on product 5 and in the Arabic and Russian
 *    translation files earlier today, which left the English DB rows for these
 *    five as the only place the claim survived.
 *
 * 2. Product 9 (AWS) carries an ingredient card for "Arbutin 2%". There is no
 *    arbutin anywhere in the AWS INCI - the card is copied from product 8
 *    (SWS), where arbutin is real and is the second ingredient listed. A card
 *    for an ingredient the product does not contain is removed rather than
 *    rewritten; inventing a replacement would need the AWS dossier read in
 *    full, which is a separate audit.
 *
 * Deliberately NOT touched, and queued for the per-product audits: the
 * drug-register wording elsewhere on these five ("healing", "regeneration",
 * "reduces inflammation", "stimulates"), the microneedling-only usage copy, and
 * the "Licensed practitioners only" restriction. Those need each product's own
 * carton and safety assessment read, the same way product 5 was.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-power-solution-siblings-igf1-20260814.ts [--apply]
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as any)

const APPLY = process.argv.includes('--apply')

/** Kept to the length of the neighbouring cards on these pages. Product 5 has a
 *  longer version, because that page devotes a section to the peptide. */
const SH_POLYPEPTIDE_7 =
  'Recombinant human peptide carrying the 217-amino-acid somatotropin sequence, ' +
  'grown by fermentation so every batch arrives identical rather than varying the ' +
  'way a plant extract does. COSING lists it as a skin protectant.'

const SIBLINGS = ['4', '6', '7', '8', '9']

interface Card { name: string; description: string }
interface Feature { title: string; description: string }

async function main() {
  for (const number of SIBLINGS) {
    const product =
      (await prisma.product.findFirst({ where: { productNumber: number } })) ||
      (await prisma.product.findUnique({ where: { id: number } }))
    if (!product) throw new Error(`product ${number} not found`)

    const changes: string[] = []
    const data: Record<string, string> = {}

    const cards = JSON.parse(product.ingredients || '[]') as Card[]
    let cardsTouched = false

    const peptide = cards.findIndex(c => /sh-polypeptide-7/i.test(c.name))
    if (peptide === -1) throw new Error(`product ${number}: no sh-Polypeptide-7 card`)
    if (cards[peptide].description !== SH_POLYPEPTIDE_7) {
      changes.push(`  peptide card: "${cards[peptide].description}"\n            -> "${SH_POLYPEPTIDE_7}"`)
      cards[peptide] = { ...cards[peptide], description: SH_POLYPEPTIDE_7 }
      cardsTouched = true
    }

    // The false arbutin card, AWS only. Guarded on the INCI rather than on the
    // product number, so it cannot fire on SWS where arbutin is real.
    const inci = cards.find(c => /full inci/i.test(c.name))?.description ?? ''
    const arbutin = cards.findIndex(c => /arbutin/i.test(c.name))
    if (arbutin !== -1 && !/arbutin/i.test(inci)) {
      changes.push(`  removed card "${cards[arbutin].name}" - not in this product's INCI`)
      cards.splice(arbutin, 1)
      cardsTouched = true
    }

    if (cardsTouched) data.ingredients = JSON.stringify(cards)

    const features = JSON.parse(product.keyFeatures || '[]') as Feature[]
    const igf = features.findIndex(f => /IGF-1/i.test(f.description) || /IGF-1/i.test(f.title))
    if (igf !== -1) {
      const fixed = {
        title: 'Recombinant peptide',
        description:
          'Built on sh-Polypeptide-7, a human peptide grown by fermentation rather than extracted, ' +
          'so the dose is the same in every vial.',
      }
      changes.push(`  key feature: "${features[igf].title}: ${features[igf].description}"\n            -> "${fixed.title}: ${fixed.description}"`)
      features[igf] = fixed
      data.keyFeatures = JSON.stringify(features)
    }

    if (!changes.length) {
      console.log(`${number} ${product.name}: already correct`)
      continue
    }

    console.log(`\n${number} ${product.name} (id ${product.id})`)
    for (const c of changes) console.log(c)

    if (APPLY) {
      await prisma.product.update({ where: { id: product.id }, data })
      console.log('  written')
    }
  }

  if (!APPLY) console.log('\nDRY RUN - pass --apply to write')
}

main()
  .catch(e => {
    console.error(e.message ?? e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
