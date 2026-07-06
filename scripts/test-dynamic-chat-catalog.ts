/**
 * One-shot verification of the dynamic chat catalog generator.
 * Prints the generated section and runs sanity checks against the
 * static prompt splice. Run: npx tsx scripts/test-dynamic-chat-catalog.ts
 */
import { getDynamicCatalogSection, spliceCatalogSection, CATALOG_SECTION_START, CATALOG_SECTION_END } from '../lib/chatbot/productCatalog'
import { SYSTEM_PROMPT } from '../lib/chatbot/config'

async function main() {
  const section = await getDynamicCatalogSection()
  if (!section) throw new Error('Dynamic catalog returned null')

  const lines = section.split('\n').filter((l) => l.startsWith('- ['))
  console.log(`products in dynamic catalog: ${lines.length}`)

  // Sanity: key products present, dead product absent
  const mustContain = ['CERABARRIER', 'Bio-Meso PDRN Homecare', 'SNOW O₂ CLEANSER', 'BEAUTY BOX']
  for (const needle of mustContain) {
    if (!section.includes(needle)) throw new Error(`Missing expected product: ${needle}`)
  }
  if (section.includes('Needle Pen-K')) throw new Error('Dead product Needle Pen-K present!')

  // Sanity: every product line carries a parseable {{id:...}} tag
  const linesWithTags = lines.filter((l) => /\{\{id:[A-Za-z0-9]+\}\}/.test(l))
  console.log(`product lines with id tags: ${linesWithTags.length}/${lines.length}`)
  if (linesWithTags.length !== lines.length) throw new Error('Every product line must carry an id tag')

  // Splice check
  const spliced = spliceCatalogSection(SYSTEM_PROMPT, section)
  if (!spliced.includes('CERABARRIER')) throw new Error('Splice failed: dynamic content missing')
  if (spliced.indexOf(CATALOG_SECTION_START) === -1) throw new Error('Splice lost section header')
  if (spliced.indexOf(CATALOG_SECTION_END) === -1) throw new Error('Splice lost PDF section')
  const staticOnlyMarker = 'Automatic microneedling pen device' // old Needle Pen-K descriptor
  if (spliced.includes(staticOnlyMarker)) throw new Error('Static catalog still present after splice')
  console.log('splice OK; prompt length static vs spliced:', SYSTEM_PROMPT.length, '→', spliced.length)

  console.log('\n--- first 40 lines of generated section ---')
  console.log(section.split('\n').slice(0, 40).join('\n'))
}

main().then(() => { console.log('\nALL CHECKS PASSED'); process.exit(0) }).catch((e) => { console.error(e); process.exit(1) })
