/**
 * Proposes a productNumber -> EAN-13 mapping by matching website product names
 * against the two manufacturer sources we hold.
 *
 * Sources, in order of trust:
 *   1. docs/Montaji_Product_Registration_Letter_normalized.csv - the names Dubai
 *      Municipality registered, so closest to how we name things on the site.
 *   2. docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv - the factory
 *      order form, the only source covering devices, which are not cosmetics
 *      and so never appear in the Montaji register.
 *
 * MoySklad is deliberately NOT a source. Its barcodes are internally generated
 * 2000000xxxxxx in-store codes, not the Korean 880 EAN-13 printed on the box.
 *
 * Output is a proposal for human review, not something to apply blind. A wrong
 * barcode is a false statement about a physical object, so anything below the
 * confident threshold is left unmatched on purpose.
 */
import fs from 'fs'
import { prisma } from '../lib/prisma'

interface Candidate {
  barcode: string
  name: string
  source: 'montaji' | 'orderform'
  extra?: string
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++ } else quoted = false
      } else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = '' }
    else if (c !== '\r') cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows
}

const STOP = new Set([
  'genosys', 'the', 'and', 'for', 'with', 'box', 'pcs', 'pc', 'ml', 'g', 'kit',
  'homecare', 'professional', 'new', 'set', 'x',
])

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(t => t && !STOP.has(t))
}

function score(a: string, b: string): number {
  const ta = tokens(a)
  const tb = tokens(b)
  if (!ta.length || !tb.length) return 0
  const sa = new Set(ta)
  const sb = new Set(tb)
  let hit = 0
  for (const t of sa) if (sb.has(t)) hit++
  // Dice coefficient, so a short name is not punished for matching a long one.
  return (2 * hit) / (sa.size + sb.size)
}

async function main() {
  const candidates: Candidate[] = []

  for (const r of parseCsv(fs.readFileSync('docs/Montaji_Product_Registration_Letter_normalized.csv', 'utf8')).slice(1)) {
    if (r.length < 3 || !/^\d{13}$/.test(r[2] ?? '')) continue
    candidates.push({ barcode: r[2]!, name: r[1]!, source: 'montaji', extra: r[0] })
  }
  for (const r of parseCsv(fs.readFileSync('docs/GENOSYS_Export_Orderform_Codes_2026_normalized.csv', 'utf8')).slice(1)) {
    if (r.length < 8 || !/^\d{13}$/.test(r[3] ?? '')) continue
    const name = [r[6], r[7]].filter(Boolean).join(' ')
    candidates.push({ barcode: r[3]!, name, source: 'orderform', extra: r[2] })
  }

  const products = await prisma.product.findMany({
    select: { id: true, productNumber: true, name: true, size: true },
  })
  products.sort((a, b) => Number(a.productNumber ?? a.id) - Number(b.productNumber ?? b.id))

  console.log(`candidates: ${candidates.length} | products: ${products.length}\n`)

  for (const p of products) {
    const num = p.productNumber ?? p.id
    const ranked = candidates
      .map(c => ({ c, s: score(p.name, c.name) }))
      .sort((x, y) => y.s - x.s)
      .slice(0, 3)
    const best = ranked[0]
    const flag = !best || best.s < 0.5 ? 'REVIEW' : best.s < 0.7 ? 'check ' : 'ok    '
    console.log(`${flag} #${String(num).padEnd(3)} ${p.name.slice(0, 46).padEnd(48)} ${(p.size ?? '').slice(0, 14)}`)
    for (const { c, s } of ranked) {
      if (s < 0.25) continue
      console.log(`         ${s.toFixed(2)} ${c.barcode} [${c.source.padEnd(9)}] ${c.name.slice(0, 62)}`)
    }
  }

  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
