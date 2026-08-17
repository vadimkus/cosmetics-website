import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const JSON_FIELDS = ['productDetails', 'benefits', 'ingredients'] as const

let failed = false

for (const [label, table] of [
  ['AR', productTranslations],
  ['RU', productTranslationsRu],
] as const) {
  const entry = table['64']
  if (!entry) {
    console.error(`${label}: key '64' MISSING`)
    failed = true
    continue
  }
  console.log(`\n===== ${label} product 64 =====`)
  for (const field of JSON_FIELDS) {
    const raw = entry[field]
    if (!raw) {
      console.log(`  ${field}: (absent)`)
      continue
    }
    try {
      const parsed = JSON.parse(raw)
      const shape = Array.isArray(parsed) ? `array(${parsed.length})` : `object(${Object.keys(parsed).length} keys)`
      console.log(`  ${field}: valid JSON ${shape}`)
    } catch (e) {
      console.error(`  ${field}: INVALID JSON — ${(e as Error).message}`)
      failed = true
    }
  }
  console.log(`  description: ${entry.description?.length ?? 0} chars`)
  console.log(`  howToUse   : ${entry.howToUse?.length ?? 0} chars`)
  console.log(`  directions : ${entry.directions?.length ?? 0} chars`)

  // The 52-needle figure must be present and 140 must never appear.
  const all = JSON.stringify(entry)
  if (!all.includes('52')) {
    console.error(`  ${label}: expected the 52-needle figure, not found`)
    failed = true
  }
  if (all.includes('140')) {
    console.error(`  ${label}: stale 140-needle claim present`)
    failed = true
  }
  // howToUse must use the numbered convention.
  if (!/^1\./m.test(entry.howToUse ?? '')) {
    console.error(`  ${label}: howToUse is not in numbered format`)
    failed = true
  }
}

console.log(`\nAR entries: ${Object.keys(productTranslations).length}`)
console.log(`RU entries: ${Object.keys(productTranslationsRu).length}`)
console.log(failed ? '\nFAILED' : '\nALL CHECKS PASSED')
process.exit(failed ? 1 : 0)
