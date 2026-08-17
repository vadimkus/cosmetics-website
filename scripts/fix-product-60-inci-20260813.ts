/**
 * Product 60 (BIO-MESO PDRN EXPERT AMPOULE 60000) - correct the Full INCI.
 *
 * The stored list was missing 1,2-Hexanediol entirely and dropped the ppm
 * annotation the carton prints against Sodium DNA. An omission in a published
 * ingredient list is a compliance problem rather than a wording preference, so
 * this brings the record back in line with the Intertek artwork.
 *
 * Verified with scripts/_diff-p60-inci.ts: every other item matches the carton
 * and the order is already correct, so this is a two-token repair, not a
 * rewrite.
 *
 * Arabic and Russian inherit the corrected string through the shared Full INCI
 * fallback in lib/localizedIngredients.ts, so no translation edit is needed.
 *
 * Dry run by default. Pass --apply to write.
 *   npx tsx --env-file=.env.local scripts/fix-product-60-inci-20260813.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-60-inci-20260813.ts --apply
 */

import { writeFileSync } from 'fs'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

interface Ingredient {
  name: string
  description: string
}

async function main() {
  const product = await prisma.product.findFirst({ where: { productNumber: '60' } })
  if (!product) throw new Error('product 60 not found')

  const list = JSON.parse(product.ingredients as string) as Ingredient[]
  const entry = list.find(i => i.name === 'Full INCI')
  if (!entry) throw new Error('no Full INCI entry on product 60')

  const before = entry.description
  let after = before

  if (!after.includes('1,2-Hexanediol')) {
    after = after.replace('Niacinamide, ', 'Niacinamide, 1,2-Hexanediol, ')
  }
  if (!after.includes('Sodium DNA (1120ppm)')) {
    after = after.replace(/Sodium DNA(?! \()/, 'Sodium DNA (1120ppm)')
  }

  if (after === before) {
    console.log('Already correct, nothing to do.')
    return
  }

  // Guard against a bad replace silently mangling the list.
  const count = (s: string) => s.replace(/\.$/, '').split(',').length
  console.log(`comma-separated tokens: ${count(before)} -> ${count(after)}`)
  console.log(`\n- ${before.slice(0, 200)}…`)
  console.log(`\n+ ${after.slice(0, 200)}…`)

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write.')
    return
  }

  const backup = `/tmp/product-60-ingredients-backup-${Date.now()}.json`
  writeFileSync(backup, product.ingredients as string)
  console.log(`\nBackup written to ${backup}`)

  entry.description = after
  await prisma.product.update({
    where: { id: product.id },
    data: { ingredients: JSON.stringify(list) },
  })
  console.log('Updated product 60 Full INCI.')
}

main()
  .catch(e => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
