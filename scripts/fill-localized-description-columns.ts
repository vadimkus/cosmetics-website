/**
 * Fills the empty Product.descriptionAr / descriptionRu columns.
 *
 * The PDP reads body copy from data/productTranslations*.ts, but these columns
 * are what the mobile API falls back to and what feeds product search, the
 * Product schema markup, the LLM text endpoints and the Google Merchant feed.
 * Leaving them null means those surfaces served English to Arabic and Russian
 * users even where a translation already existed.
 *
 * Values are copied from the translation files so there is a single wording.
 *
 * Usage: npx tsx --env-file=.env.local scripts/fill-localized-description-columns.ts [--apply]
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const APPLY = process.argv.includes('--apply')
const TARGETS = ['2', '64', '66']

async function main() {
  const backup: Record<string, unknown> = {}
  let changes = 0

  for (const key of TARGETS) {
    const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: key }, { id: key }] } })
    if (!p) {
      console.log(`${key}: NOT FOUND`)
      continue
    }
    const row = p as unknown as Record<string, unknown>
    backup[key] = { id: p.id, descriptionAr: row.descriptionAr, descriptionRu: row.descriptionRu }

    const ar = productTranslations[key]?.description
    const ru = productTranslationsRu[key]?.description
    const data: Record<string, string> = {}

    if (!String(row.descriptionAr ?? '').trim() && ar?.trim()) data.descriptionAr = ar
    if (!String(row.descriptionRu ?? '').trim() && ru?.trim()) data.descriptionRu = ru

    if (!Object.keys(data).length) {
      console.log(`${key}: already populated, nothing to do`)
      continue
    }

    console.log(`${key} (${p.name}): setting ${Object.keys(data).join(', ')}`)
    for (const [col, val] of Object.entries(data)) console.log(`    ${col}: ${val.slice(0, 80)}...`)

    if (APPLY) {
      await prisma.product.update({ where: { id: p.id }, data })
      changes++
    }
  }

  const dir = join(process.cwd(), 'docs', 'backups')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'localized-description-columns-before-2026-08-12.json')
  writeFileSync(file, JSON.stringify(backup, null, 2))
  console.log(`\nbackup written to ${file}`)
  console.log(APPLY ? `applied ${changes} update(s)` : 'DRY RUN — pass --apply to write')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
