/**
 * One-shot codemod: point the 51 bespoke product pages at PageBreadcrumb instead
 * of each hand-rolling the same trail.
 *
 * PageBreadcrumb's own docstring calls it "the one breadcrumb on the site", but
 * the bespoke pages were never migrated onto it, so a change to the trail meant
 * 51 near-identical edits. Kept in the repo as the record of how the migration
 * was done; it is idempotent and a no-op once applied.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', 'components', 'product')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) return walk(full)
    return e.name.endsWith('.tsx') ? [full] : []
  })
}

/** Drop a named import if nothing outside the import statements still uses it. */
function dropDeadImport(src, name) {
  const body = src.replace(/^import[\s\S]*?from '[^']+'\n/gm, '')
  if (new RegExp(`\\b${name}\\b`).test(body)) return src

  // default import on its own line
  const asDefault = new RegExp(`^import ${name} from '[^']+'\\n`, 'm')
  if (asDefault.test(src)) return src.replace(asDefault, '')

  // named member inside a braced list
  return src.replace(/import \{([^}]*)\} from '([^']+)'/g, (all, names, mod) => {
    const kept = names.split(',').map(s => s.trim()).filter(Boolean).filter(n => n !== name)
    if (kept.length === names.split(',').map(s => s.trim()).filter(Boolean).length) return all
    if (!kept.length) return ''
    const multiline = all.includes('\n')
    return multiline
      ? `import {\n  ${kept.join(',\n  ')},\n} from '${mod}'`
      : `import { ${kept.join(', ')} } from '${mod}'`
  })
}

let changed = 0
const files = walk(ROOT).filter(f => fs.readFileSync(f, 'utf8').includes('aria-label="Breadcrumb"'))

for (const file of files) {
  let src = fs.readFileSync(file, 'utf8')

  const navStart = src.lastIndexOf('<nav', src.indexOf('aria-label="Breadcrumb"'))
  const navEnd = src.indexOf('</nav>', navStart) + '</nav>'.length
  const block = src.slice(navStart, navEnd)

  // The one page that shows a computed name rather than the raw record value.
  const current = /\{displayName\}<\/span>/.test(block) ? 'displayName' : 'product.name'

  const indent = src.slice(src.lastIndexOf('\n', navStart) + 1, navStart)
  const replacement =
    `<PageBreadcrumb\n` +
    `${indent}  bare\n` +
    `${indent}  items={[\n` +
    `${indent}    { name: t('common.home'), href: getLocalizedPath('/', locale) },\n` +
    `${indent}    { name: copy.backToProducts, href: getLocalizedPath('/products', locale) },\n` +
    `${indent}    { name: ${current} },\n` +
    `${indent}  ]}\n` +
    `${indent}/>`

  src = src.slice(0, navStart) + replacement + src.slice(navEnd)

  // The chevron only ever separated breadcrumb crumbs; PageBreadcrumb owns that now.
  src = src.replace(/^[ \t]*const Chevron = isRtl \? ChevronLeft : ChevronRight\n/m, '')

  if (!src.includes("from '@/components/PageBreadcrumb'")) {
    src = src.replace(
      /^(import .*\n)/m,
      `$1import PageBreadcrumb from '@/components/PageBreadcrumb'\n`
    )
  }

  for (const name of ['ChevronLeft', 'ChevronRight', 'Link']) src = dropDeadImport(src, name)
  src = src.replace(/\n{3,}/g, '\n\n')

  fs.writeFileSync(file, src)
  changed++
}

console.log(`migrated ${changed}/${files.length} bespoke pages onto PageBreadcrumb`)
