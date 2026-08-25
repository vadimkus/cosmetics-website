/**
 * Regenerates lib/bespokeCopyRegistry.ts.
 *
 * Walks BESPOKE_PDP_LAYOUTS in components/product/bespokePdp.tsx, follows each
 * product's page component to the module its copy comes from, and writes an
 * index of product number to copy getter. Two products in ten reach their copy
 * indirectly, through a `*_VARIANT` descriptor that carries `getCopy`, so both
 * routes are followed.
 *
 * Run after adding a bespoke page: node scripts/generate-bespoke-copy-registry.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const resolveModule = (p) => ['.tsx', '.ts'].map((e) => p + e).find((f) => fs.existsSync(f))

/** A copy import can be relative to the importing file or an @/ alias. */
function toAlias(specifier, importerFile) {
  if (specifier.startsWith('@/')) return specifier
  const abs = path.normalize(path.join(path.dirname(importerFile), specifier))
  return '@/' + path.relative(ROOT, abs)
}

function resolveSpecifier(specifier, importerFile) {
  const abs = specifier.startsWith('@/')
    ? path.join(ROOT, specifier.slice(2))
    : path.join(path.dirname(importerFile), specifier)
  return resolveModule(abs)
}

const bespokePath = path.join(ROOT, 'components/product/bespokePdp.tsx')
const src = fs.readFileSync(bespokePath, 'utf8')

const componentPaths = {}
for (const m of src.matchAll(/^import\s+(\w+)\s+from\s+'@\/(.+)'/gm)) {
  componentPaths[m[1]] = path.join(ROOT, m[2])
}

const layoutBody = src.match(/export const BESPOKE_PDP_LAYOUTS = \{([\s\S]*?)\n\}/)[1]
const layouts = [...layoutBody.matchAll(/'(\d+)':\s*(\w+)/g)].map((m) => [m[1], m[2]])

const beautyBoxSource = fs.readFileSync(
  path.join(ROOT, 'components/product/beautybox/beautyBoxes.ts'),
  'utf8'
)
const BEAUTY_BOX_NUMBERS = new Set(
  [...beautyBoxSource.matchAll(/'(\d+)':\s*\{\s*copy:/g)].map((m) => m[1])
)

const registry = {}
const unresolved = []

for (const [number, componentName] of layouts) {
  const componentFile = resolveModule(componentPaths[componentName] || '')
  if (!componentFile) {
    unresolved.push(`${number} ${componentName} (component not found)`)
    continue
  }
  const body = fs.readFileSync(componentFile, 'utf8')

  // Every box shares one layout and differs only by its copy, which the layout
  // looks up by catalogue number rather than importing.
  if (BEAUTY_BOX_NUMBERS.has(number)) {
    registry[number] = { beautyBox: true }
    continue
  }

  // A page may import another product's copy for a part it borrows — the box
  // layout pulls in the cushion's shade names, for one — so a copy module from
  // the page's own folder wins over any other. Taking the first import found
  // gave all six beauty boxes the BB cushion's page.
  const imports = [...body.matchAll(/import\s*\{[^}]*\b(get\w*Copy)\b[^}]*\}\s*from\s*'([^']+)'/g)]
  const local = imports.find(([, , specifier]) => specifier.startsWith('.'))
  const direct = local || imports[0]
  if (direct) {
    registry[number] = { symbol: direct[1], alias: toAlias(direct[2], componentFile) }
    continue
  }

  const variant = body.match(/import\s*\{\s*(\w*_VARIANT)\s*\}\s*from\s*'([^']+)'/)
  if (variant) {
    const variantFile = resolveSpecifier(variant[2], componentFile)
    if (variantFile) {
      const getter = fs
        .readFileSync(variantFile, 'utf8')
        .match(new RegExp(`${variant[1]}[\\s\\S]{0,400}?getCopy:\\s*(get\\w+)`))
      if (getter) {
        registry[number] = { symbol: getter[1], alias: toAlias(variant[2], componentFile) }
        continue
      }
    }
  }

  unresolved.push(`${number} ${componentName} -> ${path.basename(componentFile)}`)
}

if (unresolved.length) {
  console.error('Could not find a copy getter for:')
  unresolved.forEach((u) => console.error('  ' + u))
  process.exit(1)
}

const byModule = new Map()
for (const { symbol, alias, beautyBox } of Object.values(registry)) {
  if (beautyBox) continue
  if (!byModule.has(alias)) byModule.set(alias, new Set())
  byModule.get(alias).add(symbol)
}
if ([...Object.values(registry)].some((entry) => entry.beautyBox)) {
  byModule.set('@/components/product/beautybox/beautyBoxes', new Set(['BEAUTY_BOXES']))
  byModule.set('@/components/product/beautybox/beautyBoxCopy', new Set(['pickBeautyBoxLocale']))
}

const importLines = [...byModule.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([module, symbols]) => `import { ${[...symbols].sort().join(', ')} } from '${module}'`)
  .join('\n')

const entryLines = Object.entries(registry)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([number, { symbol, beautyBox }]) =>
    beautyBox
      ? `  '${number}': (locale: string) => pickBeautyBoxLocale(BEAUTY_BOXES['${number}'].copy, locale),`
      : `  '${number}': ${symbol},`
  )
  .join('\n')

const output = `/**
 * Which copy module speaks for which product.
 *
 * The bespoke product pages hold the catalogue's best writing — the claims
 * checked against the Intertek dossier, the ingredient reconciliations, the
 * clinical figures — and it existed only inside React components, so the mobile
 * app showed a far thinner product than the website did.
 *
 * Rather than copy that text into the database and then have to keep two
 * versions honest, the mobile API imports the same modules the pages render
 * from. One source, no sync.
 *
 * Generated by scripts/generate-bespoke-copy-registry.js. Regenerate it when a
 * product gains a bespoke page; do not hand-edit.
 */

${importLines}

/**
 * Each copy module returns its own interface, and those interfaces carry no
 * index signature, so the registry is typed by what it is used for — an object
 * to be read by name — rather than by any one product's shape.
 */
export type BespokeCopyGetter = (locale: string) => object

export const BESPOKE_COPY_GETTERS: Record<string, BespokeCopyGetter> = {
${entryLines}
}

export function getBespokeCopy(
  productNumber: string | number | null | undefined,
  locale: string
): Record<string, unknown> | null {
  const getter = BESPOKE_COPY_GETTERS[String(productNumber ?? '')]
  return getter ? (getter(locale) as Record<string, unknown>) : null
}
`

fs.writeFileSync(path.join(ROOT, 'lib/bespokeCopyRegistry.ts'), output)
console.log(
  `lib/bespokeCopyRegistry.ts: ${Object.keys(registry).length} products across ${byModule.size} modules`
)
