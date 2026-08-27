/**
 * Sweep em and en dashes out of the copy that lives in the database rather than in a file.
 *
 * The code sweep cannot reach these: product descriptions, benefits and blog posts are
 * rows, not source.
 *
 *   npx tsx --env-file=.env.local scripts/count-db-dashes.ts            report only
 *   npx tsx --env-file=.env.local scripts/count-db-dashes.ts --apply    write
 *
 * `--apply` writes every field it is about to change to a timestamped JSON file first.
 * There is no `git checkout` for a database, and this is live selling copy.
 */
import { writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'

const apply = process.argv.includes('--apply')
const DASH = /[\u2014\u2013]/

/**
 * The same three shapes the code sweep uses: a range keeps its tightness, an already
 * spaced dash keeps its spaces, and an unspaced one between words gains them rather than
 * welding the words together.
 */
function swap(text: string): string {
  return text
    .replace(/(\d)\s*[\u2014\u2013]\s*(\d)/g, '$1-$2')
    .replace(/ [\u2014\u2013] /g, ' - ')
    .replace(/([^\s])[\u2014\u2013]([^\s])/g, '$1 - $2')
    .replace(/[\u2014\u2013]/g, '-')
}

const PRODUCT_FIELDS = [
  'name',
  'description',
  'nameRu',
  'descriptionRu',
  'nameAr',
  'descriptionAr',
  'benefits',
  'howToUse',
  'ingredients',
] as const

const POST_FIELDS = ['title', 'excerpt', 'content'] as const

async function main() {
  const snapshot: Record<string, Record<string, string>> = {}
  const fieldCounts = new Map<string, number>()

  const products = await prisma.product.findMany({
    select: { id: true, productNumber: true, ...Object.fromEntries(PRODUCT_FIELDS.map(f => [f, true])) },
  })

  let productsHit = 0
  for (const p of products as Array<Record<string, unknown>>) {
    const data: Record<string, string> = {}
    const before: Record<string, string> = {}
    for (const field of PRODUCT_FIELDS) {
      const value = p[field]
      if (typeof value !== 'string' || !DASH.test(value)) continue
      before[field] = value
      data[field] = swap(value)
      fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1)
    }
    if (!Object.keys(data).length) continue
    productsHit += 1
    snapshot[`product:${p.productNumber}`] = before
    if (apply) await prisma.product.update({ where: { id: p.id as string }, data })
  }

  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, ...Object.fromEntries(POST_FIELDS.map(f => [f, true])) },
  })

  let postsHit = 0
  for (const post of posts as Array<Record<string, unknown>>) {
    const data: Record<string, string> = {}
    const before: Record<string, string> = {}
    for (const field of POST_FIELDS) {
      const value = post[field]
      if (typeof value !== 'string' || !DASH.test(value)) continue
      before[field] = value
      data[field] = swap(value)
      fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1)
    }
    if (!Object.keys(data).length) continue
    postsHit += 1
    snapshot[`post:${post.slug}`] = before
    if (apply) await prisma.blogPost.update({ where: { id: post.id as string }, data })
  }

  if (apply) {
    const file = join(process.env.HOME || '.', `db-dashes-before-${Date.now()}.json`)
    writeFileSync(file, JSON.stringify(snapshot, null, 2))
    console.log(`snapshot of the original text: ${file}\n`)
  }

  console.log(`products scanned ${products.length}, changed ${productsHit}`)
  console.log(`blog posts scanned ${posts.length}, changed ${postsHit}`)
  console.log('\nfields touched:')
  for (const [field, count] of [...fieldCounts].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${String(count).padStart(4)}  ${field}`)
  }
  console.log(apply ? '\nwritten.' : '\nreport only. Pass --apply to write.')

  await prisma.$disconnect()
}

main().catch(async e => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
