/**
 * Survey of the bespoke PDP copy objects.
 *
 * Reads every registered product's copy for one locale and reports the shape of
 * each top-level section, so we can tell which section names and inner shapes
 * are common enough to normalise into a single API contract.
 *
 * Read-only. Run: npx tsx scripts/inspect-bespoke-copy-shapes.ts
 */

import { BESPOKE_COPY_GETTERS } from '../lib/bespokeCopyRegistry'

type Shape =
  | 'string'
  | 'string[]'
  | 'section'
  | 'objects[]'
  | 'other'

function shapeOf(value: unknown): Shape {
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) {
    if (value.every((v) => typeof v === 'string')) return 'string[]'
    if (value.every((v) => v && typeof v === 'object')) return 'objects[]'
    return 'other'
  }
  if (value && typeof value === 'object') return 'section'
  return 'other'
}

const keyShapes = new Map<string, { count: number; shapes: Set<Shape> }>()
const innerKeys = new Map<string, Map<string, number>>()

const numbers = Object.keys(BESPOKE_COPY_GETTERS)
for (const num of numbers) {
  const copy = BESPOKE_COPY_GETTERS[num]('en') as Record<string, unknown>
  for (const [key, value] of Object.entries(copy)) {
    const shape = shapeOf(value)
    const entry = keyShapes.get(key) || { count: 0, shapes: new Set<Shape>() }
    entry.count += 1
    entry.shapes.add(shape)
    keyShapes.set(key, entry)

    if (shape === 'section') {
      const inner = innerKeys.get(key) || new Map<string, number>()
      for (const [ik, iv] of Object.entries(value as Record<string, unknown>)) {
        inner.set(`${ik}:${shapeOf(iv)}`, (inner.get(`${ik}:${shapeOf(iv)}`) || 0) + 1)
      }
      innerKeys.set(key, inner)
    }
  }
}

const sorted = [...keyShapes.entries()].sort((a, b) => b[1].count - a[1].count)
console.log(`products surveyed: ${numbers.length}\n`)
console.log('key                        products  shapes')
for (const [key, { count, shapes }] of sorted) {
  if (count < 5) continue
  console.log(`  ${key.padEnd(24)} ${String(count).padEnd(9)} ${[...shapes].join(', ')}`)
}

console.log(`\nkeys on fewer than 5 products: ${sorted.filter(([, v]) => v.count < 5).length}`)

console.log('\ninner shape of the sections that carry content:')
for (const [key, { count, shapes }] of sorted) {
  if (count < 8 || !shapes.has('section')) continue
  const inner = innerKeys.get(key)
  if (!inner) continue
  const top = [...inner.entries()].sort((a, b) => b[1] - a[1]).slice(0, 9)
  console.log(`  ${key} (${count})`)
  console.log(`      ${top.map(([k, n]) => `${k}×${n}`).join('  ')}`)
}
