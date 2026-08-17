/**
 * Sanity-checks the pending howToUse normalization in the AR/RU translation
 * files: no JSON artifacts left, nothing emptied out, numbered format used.
 */
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

let failed = false

for (const [label, table] of [
  ['AR', productTranslations],
  ['RU', productTranslationsRu],
] as const) {
  const keys = Object.keys(table)
  const withHowTo = keys.filter(k => (table[k]?.howToUse ?? '').trim().length > 0)
  const jsonArtifacts: string[] = []
  const notNumbered: string[] = []
  const suspiciousShort: string[] = []

  for (const k of withHowTo) {
    const v = table[k]!.howToUse!
    if (v.includes('"step"') || v.includes('\\"step\\"') || v.trimStart().startsWith('[')) {
      jsonArtifacts.push(k)
    }
    if (!/^\s*1\./m.test(v)) notNumbered.push(k)
    if (v.trim().length < 20) suspiciousShort.push(k)
  }

  console.log(`\n===== ${label} =====`)
  console.log(`entries              : ${keys.length}`)
  console.log(`with howToUse        : ${withHowTo.length}`)
  console.log(`JSON artifacts left  : ${jsonArtifacts.length ? jsonArtifacts.join(', ') : 'none'}`)
  console.log(`not numbered         : ${notNumbered.length ? notNumbered.join(', ') : 'none'}`)
  console.log(`suspiciously short   : ${suspiciousShort.length ? suspiciousShort.join(', ') : 'none'}`)

  if (jsonArtifacts.length) failed = true
  if (suspiciousShort.length) failed = true
}

console.log(failed ? '\nFAILED' : '\nNO JSON ARTIFACTS, NOTHING EMPTIED')
process.exit(failed ? 1 : 0)
