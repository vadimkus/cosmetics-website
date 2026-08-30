/**
 * Collapses the routine audit to unique strings.
 *
 * 235 steps across 54 routines are built from a much smaller set of shared
 * fragments, so the per-product report over-counts badly. This lists each
 * distinct description once, with all three locales side by side, so the
 * divergence between them is visible in one pass.
 *
 * Read-only. Run: npx tsx scripts/audit-routine-copy.ts [--all]
 */
import { PRODUCT_ROUTINES } from '../lib/productRoutines'
import enMessages from '../messages/en.json'
import arMessages from '../messages/ar.json'
import ruMessages from '../messages/ru.json'

type Loc = 'en' | 'ru' | 'ar'
const MSG: Record<Loc, Record<string, string>> = {
  en: (enMessages as any).product,
  ru: (ruMessages as any).product,
  ar: (arMessages as any).product,
}

const PERCENT = /\d+[.,]?\d*\s?%/g
const PPM = /\bppm\b|جزء في المليون/i
const INCI =
  /\b(Sodium Cocoyl Glutamate|Cocamidopropyl Betaine|Decyl Glucoside|PENTAVITIN|Butylene Glycol|Tocopheryl|Dimethicone|Sodium Hyaluronate|Niacinamide|Adenosine|Panthenol|Allantoin|Glycerin|Squalane|Ceramide NP|Centella|Madecassoside|Bakuchiol|Retinal)\b/i

const digitsOf = (s: string): string[] => {
  const norm = s.replace(/(\d)[  ](?=\d)/g, '$1').replace(/(\d),(?=\d{3}\b)/g, '$1')
  return (norm.match(/\d+[.,]?\d*/g) || []).map((d) => d.replace(',', '.'))
}

// Unique desc keys, with the products that use them.
const users = new Map<string, string[]>()
for (const [product, routine] of Object.entries(PRODUCT_ROUTINES)) {
  for (const s of routine.steps) {
    if (!users.has(s.descKey)) users.set(s.descKey, [])
    users.get(s.descKey)!.push(product)
  }
}

const showAll = process.argv.includes('--all')
let flagged = 0

const rows = [...users.entries()].sort((a, b) => b[1].length - a[1].length)

for (const [key, products] of rows) {
  const en = MSG.en[key] || ''
  const ru = MSG.ru[key] || ''
  const ar = MSG.ar[key] || ''

  const problems: string[] = []
  const enD = new Set(digitsOf(en))
  for (const [loc, txt] of [['ru', ru], ['ar', ar]] as const) {
    const d = new Set(digitsOf(txt))
    const extra = [...d].filter((x) => !enD.has(x))
    const missing = [...enD].filter((x) => !d.has(x))
    if (extra.length) problems.push(`${loc} adds figures ${JSON.stringify(extra)}`)
    if (missing.length) problems.push(`${loc} drops figures ${JSON.stringify(missing)}`)
  }
  for (const [loc, txt] of [['en', en], ['ru', ru], ['ar', ar]] as const) {
    if (INCI.test(txt)) problems.push(`${loc} names ${txt.match(INCI)![0]}`)
    if (PPM.test(txt)) problems.push(`${loc} uses ppm`)
    const p = txt.match(PERCENT) || []
    if (p.length >= 2) problems.push(`${loc} stacks ${p.length} percentages`)
  }

  if (!problems.length && !showAll) continue
  flagged++
  console.log(`\n━━ ${key}   (${products.length} product${products.length > 1 ? 's' : ''}: ${products.slice(0, 8).join(', ')}${products.length > 8 ? '…' : ''})`)
  for (const p of [...new Set(problems)]) console.log(`   ! ${p}`)
  console.log(`   EN  ${en}`)
  console.log(`   RU  ${ru}`)
  console.log(`   AR  ${ar}`)
}

console.log(`\n${flagged} of ${rows.length} unique routine descriptions flagged`)
