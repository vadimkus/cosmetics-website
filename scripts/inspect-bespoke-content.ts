/**
 * What the app would receive for every bespoke product.
 *
 * Reports payload size and block coverage per product so we can see nothing is
 * silently dropped and no payload is too heavy for a phone.
 *
 * Read-only. Run: npx tsx scripts/inspect-bespoke-content.ts [productNumber]
 */

import { BESPOKE_COPY_GETTERS } from '../lib/bespokeCopyRegistry'
import { getBespokeContent } from '../lib/bespokeContent'

const only = process.argv[2]
const numbers = Object.keys(BESPOKE_COPY_GETTERS).sort((a, b) => Number(a) - Number(b))

if (only) {
  for (const locale of ['en', 'ru', 'ar']) {
    const content = getBespokeContent(only, locale)
    console.log(`\n===== product ${only} · ${locale} =====`)
    console.log(JSON.stringify(content, null, 2).slice(0, 4000))
  }
  process.exit(0)
}

let totalBytes = 0
let heaviest = { number: '', bytes: 0 }
const blockKeys = new Map<string, number>()
const empty: string[] = []

console.log('product  blocks  entries  rows  q&a  bullets   KB')
for (const number of numbers) {
  const content = getBespokeContent(number, 'en')
  if (!content) {
    empty.push(number)
    continue
  }
  const bytes = Buffer.byteLength(JSON.stringify(content), 'utf8')
  totalBytes += bytes
  if (bytes > heaviest.bytes) heaviest = { number, bytes }

  let entries = 0
  let rows = 0
  let qa = 0
  let bullets = 0
  for (const block of content.blocks) {
    blockKeys.set(block.key, (blockKeys.get(block.key) || 0) + 1)
    entries += block.entries?.length || 0
    rows += block.rows?.length || 0
    qa += block.questions?.length || 0
    bullets += block.bullets?.length || 0
  }
  console.log(
    `  ${number.padEnd(6)} ${String(content.blocks.length).padEnd(7)} ${String(entries).padEnd(8)} ` +
      `${String(rows).padEnd(5)} ${String(qa).padEnd(4)} ${String(bullets).padEnd(9)} ${(bytes / 1024).toFixed(1)}`
  )
}

console.log(`\nproducts: ${numbers.length}, none-produced: ${empty.length} ${empty.join(' ')}`)
console.log(`average payload: ${(totalBytes / numbers.length / 1024).toFixed(1)} KB`)
console.log(`heaviest: product ${heaviest.number} at ${(heaviest.bytes / 1024).toFixed(1)} KB`)

console.log('\nblock keys produced:')
for (const [key, count] of [...blockKeys.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${key.padEnd(18)} ${count}`)
}

// Every locale must produce the same structure, or a Russian shopper silently
// loses a section an English one sees.
const mismatches: string[] = []
for (const number of numbers) {
  const en = getBespokeContent(number, 'en')
  for (const locale of ['ru', 'ar']) {
    const other = getBespokeContent(number, locale)
    const a = en?.blocks.map((b) => b.key).join(',')
    const b = other?.blocks.map((x) => x.key).join(',')
    if (a !== b) mismatches.push(`product ${number} ${locale}: ${b} vs en ${a}`)
  }
}
console.log(`\nlocale structure mismatches: ${mismatches.length}`)
mismatches.slice(0, 12).forEach((m) => console.log('  ' + m))
